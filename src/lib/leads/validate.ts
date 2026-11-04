// Server-side gate for every form that creates a Follow Up Boss contact.
// Rejects obvious fakes before FUB sees them. No third-party services: the only
// network call is a DNS MX lookup, and it fails open.
//
// Relative imports carry a .ts extension so `node --test` can run this file
// without a bundler; Next resolves them the same way.

import dns from 'node:dns'
import { DISPOSABLE_DOMAINS, TYPO_DOMAINS } from './disposable-domains.ts'

export const EMAIL_ERROR = 'Please double-check your email address'
export const PHONE_ERROR = 'Please enter a valid mobile number'

const MX_TIMEOUT_MS = 3000
const EMAIL_RE = /^[a-z0-9._%+'-]+@(?:[a-z0-9-]+\.)+[a-z][a-z0-9-]+$/

// ── Phone patterns ───────────────────────────────────────────────────────────
// Matched against the 7-digit subscriber number (exchange + line). Extend freely.
const FAKE_SUBSCRIBER_NUMBERS = new Set([
  '2221212', // (xxx) 222-1212
  '8675309', // Jenny
  '5551212', // directory assistance
  '1231234',
  '1234567',
])
const SEQUENTIAL_10 = new Set(['1234567890', '0987654321', '9876543210', '0123456789'])

export type LeadField = 'email' | 'phone'

export type LeadCheck =
  | { ok: true; email: string; phone: string | undefined; flags: string[] }
  | { ok: false; kind: 'honeypot' }
  | { ok: false; kind: 'invalid'; field: LeadField; reason: string; message: string }

export function normalizeEmail(raw: unknown): string {
  return typeof raw === 'string' ? raw.trim().toLowerCase() : ''
}

/** Digits only, leading country code 1 stripped when 11 digits. */
export function normalizePhone(raw: unknown): string {
  const digits = typeof raw === 'string' ? raw.replace(/\D/g, '') : ''
  return digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits
}

/** null = looks real, otherwise the reason it was rejected. */
export function phoneProblem(digits: string): string | null {
  if (!/^\d{10}$/.test(digits)) return 'not_10_digits'
  if (/[01]/.test(digits[0])) return 'bad_area_code'
  if (/[01]/.test(digits[3])) return 'bad_exchange'
  if (digits.slice(3, 6) === '555') return 'exchange_555'
  if (/^(\d)\1{9}$/.test(digits)) return 'all_same_digit'
  if (SEQUENTIAL_10.has(digits)) return 'sequential'
  if (FAKE_SUBSCRIBER_NUMBERS.has(digits.slice(3))) return 'known_fake_number'
  return null
}

type MxOutcome = 'ok' | 'no_mx' | 'unknown'

async function lookupMx(domain: string): Promise<MxOutcome> {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    const records = await Promise.race([
      dns.promises.resolveMx(domain),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(Object.assign(new Error('MX timeout'), { code: 'ETIMEOUT' })), MX_TIMEOUT_MS)
      }),
    ])
    return records.length > 0 ? 'ok' : 'no_mx'
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code
    // The domain definitively has no mail exchanger. Anything else (timeout,
    // SERVFAIL, resolver down) says nothing about the address — let it through.
    return code === 'ENOTFOUND' || code === 'ENODATA' ? 'no_mx' : 'unknown'
  } finally {
    if (timer) clearTimeout(timer)
  }
}

interface EmailResult {
  problem: { reason: string; message: string } | null
  flags: string[]
}

export async function checkEmail(email: string): Promise<EmailResult> {
  const invalid = (reason: string, message = EMAIL_ERROR): EmailResult => ({
    problem: { reason, message },
    flags: [],
  })
  if (email.length > 254 || !EMAIL_RE.test(email)) return invalid('bad_syntax')

  const domain = email.slice(email.lastIndexOf('@') + 1)
  const suggestion = TYPO_DOMAINS[domain]
  if (suggestion) {
    return invalid(
      `typo_domain:${domain}->${suggestion}`,
      `Did you mean ${email.slice(0, email.lastIndexOf('@'))}@${suggestion}? Please double-check your email address`,
    )
  }
  if (DISPOSABLE_DOMAINS.has(domain)) return invalid('disposable_domain')

  const mx = await lookupMx(domain)
  if (mx === 'no_mx') return invalid('no_mx')
  return { problem: null, flags: mx === 'unknown' ? ['mx_lookup_failed_open'] : [] }
}

function log(event: string, form: string, fields: Record<string, unknown>) {
  console.log(JSON.stringify({ event, form, ...fields }))
}

export interface LeadInput {
  /** Which form this came from — appears in the rejection log. */
  form: string
  email?: unknown
  phone?: unknown
  /** Value of the hidden bot-trap field. Anything non-blank trips it. */
  honeypot?: unknown
  /** Reject a blank phone instead of treating it as "not provided". */
  phoneRequired?: boolean
}

export async function validateLead(input: LeadInput): Promise<LeadCheck> {
  const email = normalizeEmail(input.email)
  const phone = normalizePhone(input.phone)

  if (typeof input.honeypot === 'string' && input.honeypot.trim()) {
    log('lead_rejected', input.form, { reason: 'honeypot', email, phone })
    return { ok: false, kind: 'honeypot' }
  }

  const emailResult = await checkEmail(email)
  if (emailResult.problem) {
    log('lead_rejected', input.form, { reason: emailResult.problem.reason, email, phone })
    return { ok: false, kind: 'invalid', field: 'email', ...emailResult.problem }
  }

  if (phone || input.phoneRequired) {
    const reason = phone ? phoneProblem(phone) : 'missing'
    if (reason) {
      log('lead_rejected', input.form, { reason: `phone_${reason}`, email, phone })
      return { ok: false, kind: 'invalid', field: 'phone', reason, message: PHONE_ERROR }
    }
  }

  if (emailResult.flags.length) {
    log('lead_flagged', input.form, { flags: emailResult.flags, email, phone })
  }
  return { ok: true, email, phone: phone || undefined, flags: emailResult.flags }
}
