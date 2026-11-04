// Run with: npm test   (node's built-in runner; no extra dependencies)

import assert from 'node:assert/strict'
import dns from 'node:dns'
import { afterEach, beforeEach, describe, it, mock } from 'node:test'
import { validateLead } from './validate.ts'

function dnsError(code: string) {
  return Object.assign(new Error(code), { code })
}

/** Stub resolveMx: domains in `withMx` resolve, `failWith` throws that code, others are NXDOMAIN. */
function stubDns(withMx: string[], failWith?: string) {
  mock.method(dns.promises, 'resolveMx', async (domain: string) => {
    if (failWith) throw dnsError(failWith)
    if (withMx.includes(domain)) return [{ exchange: `mx.${domain}`, priority: 10 }]
    throw dnsError('ENOTFOUND')
  })
}

const base = { form: 'test', phone: '(561) 867-4412' }

describe('validateLead', () => {
  beforeEach(() => {
    mock.method(console, 'log', () => {})
  })
  afterEach(() => mock.restoreAll())

  it('accepts a valid gmail address and normalizes it', async () => {
    stubDns(['gmail.com'])
    const r = await validateLead({ ...base, email: '  Jane.Doe@Gmail.com ' })
    assert.deepEqual(r, { ok: true, email: 'jane.doe@gmail.com', phone: '5618674412', flags: [] })
  })

  it('rejects a domain with no MX records', async () => {
    stubDns([])
    const r = await validateLead({ ...base, email: 'johson@johnson.com' })
    assert.ok(!r.ok && r.kind === 'invalid')
    assert.equal(r.field, 'email')
    assert.equal(r.reason, 'no_mx')
    assert.equal(r.message, 'Please double-check your email address')
  })

  it('fails open, with a flag, when DNS times out', async () => {
    stubDns([], 'ETIMEOUT')
    const r = await validateLead({ ...base, email: 'someone@slow-dns.example' })
    assert.ok(r.ok)
    assert.deepEqual(r.flags, ['mx_lookup_failed_open'])
  })

  it('rejects a disposable domain without a DNS lookup', async () => {
    stubDns(['mailinator.com'])
    const r = await validateLead({ ...base, email: 'x@mailinator.com' })
    assert.ok(!r.ok && r.kind === 'invalid')
    assert.equal(r.reason, 'disposable_domain')
  })

  it('rejects a typo domain and suggests the fix', async () => {
    stubDns(['gmial.com'])
    const r = await validateLead({ ...base, email: 'sam@gmial.com' })
    assert.ok(!r.ok && r.kind === 'invalid')
    assert.match(r.message, /sam@gmail\.com/)
  })

  it('rejects the exact fake phone from the bounced lead', async () => {
    stubDns(['johnson.com'])
    const r = await validateLead({ form: 'test', email: 'johson@johnson.com', phone: '(561) 222-1212' })
    assert.ok(!r.ok && r.kind === 'invalid')
    assert.equal(r.field, 'phone')
    assert.equal(r.message, 'Please enter a valid mobile number')
  })

  it('accepts a real 561 number, with or without the leading 1', async () => {
    stubDns(['gmail.com'])
    for (const phone of ['561-867-4412', '+1 (561) 867-4412']) {
      const r = await validateLead({ form: 'test', email: 'a@gmail.com', phone })
      assert.ok(r.ok, phone)
      assert.equal(r.phone, '5618674412')
    }
  })

  it('rejects 555 exchanges, repeats, sequences and bad prefixes', async () => {
    stubDns(['gmail.com'])
    for (const phone of ['561-555-0134', '5555555555', '1234567890', '0987654321', '561-867-5309', '061-234-5678', '561-034-5678', '56178']) {
      const r = await validateLead({ form: 'test', email: 'a@gmail.com', phone })
      assert.ok(!r.ok && r.kind === 'invalid' && r.field === 'phone', phone)
    }
  })

  it('treats a blank phone as optional unless required', async () => {
    stubDns(['gmail.com'])
    assert.ok((await validateLead({ form: 'test', email: 'a@gmail.com', phone: '' })).ok)
    const r = await validateLead({ form: 'test', email: 'a@gmail.com', phone: '', phoneRequired: true })
    assert.ok(!r.ok && r.kind === 'invalid' && r.field === 'phone')
  })

  it('flags a filled honeypot before doing any other work', async () => {
    stubDns([])
    const r = await validateLead({ ...base, email: 'a@gmail.com', honeypot: 'Acme Inc' })
    assert.deepEqual(r, { ok: false, kind: 'honeypot' })
  })
})
