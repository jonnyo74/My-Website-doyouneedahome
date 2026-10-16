// Run:  npm test
// Integrity checks for the "Choose Your Loxahatchee" module: four complete paths,
// valid internal links, and no prices, rankings, universal permissions or document asks.
import test from 'node:test'
import assert from 'node:assert/strict'
import { LOX_PATHS } from '../src/lib/loxChooser.ts'

test('four complete, uniquely keyed paths', () => {
  assert.equal(LOX_PATHS.length, 4)
  const keys = new Set()
  for (const p of LOX_PATHS) {
    assert.ok(!keys.has(p.key))
    keys.add(p.key)
    for (const f of ['title', 'tagline', 'feels', 'fitsIf', 'keepInMind']) assert.ok(p[f].trim().length > 15, `${p.key}.${f}`)
    assert.ok(p.read.length >= 1)
    for (const r of p.read) assert.match(r.href, /^\/(blog|communities)\/[a-z-]+$/)
  }
})

test('copy is fit-based: no prices, rankings, universal permissions or document asks', () => {
  for (const p of LOX_PATHS) {
    const blob = `${p.title} ${p.tagline} ${p.feels} ${p.fitsIf} ${p.keepInMind}`
    assert.ok(!/\$\s?\d/.test(blob), `${p.key} has a price`)
    assert.ok(!/\b(best|top|#1|cheapest|quietest|most affordable)\b/i.test(blob), `${p.key} ranks`)
    assert.ok(!/\b(hoa|association|condo|estoppel|budget|reserves?|minutes|insurance)\b/i.test(blob), `${p.key} mentions documents`)
    assert.ok(!/\b(always|every parcel|all parcels|guaranteed)\b/i.test(blob), `${p.key} makes a universal claim`)
  }
})
