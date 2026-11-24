// Run with: npm test
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { DEFAULT_FILES, scan } from './editorial-lint.mjs'

describe('editorial lint', () => {
  it('catches report-voice phrases and clichés', () => {
    const r = scan('According to public records, this hidden gem boasts a marina. Furthermore, it is worth noting the dock.')
    for (const p of ['according to public records', 'hidden gem', 'boasts', 'furthermore', 'worth noting']) {
      assert.ok(r.banned.includes(p), `should flag "${p}"`)
    }
  })

  it('leaves plain statements alone', () => {
    assert.equal(scan('Development of Admirals Cove began in 1986. The marina takes vessels up to 165 feet.').banned.length, 0)
  })

  it('finds no banned phrase in the Admirals Cove page copy', () => {
    for (const f of DEFAULT_FILES) {
      const r = scan(readFileSync(f, 'utf8'))
      assert.deepEqual(r.banned, [], `${f}: ${r.banned.join(', ')}`)
    }
  })

  it('keeps em dashes out of the Admirals Cove copy', () => {
    for (const f of DEFAULT_FILES) assert.equal(scan(readFileSync(f, 'utf8')).emDashes, 0, f)
  })
})
