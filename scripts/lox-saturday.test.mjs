// Run:  npm test
// Integrity checks for the "Pick Your Kind of Saturday" chooser: five complete routes, official
// https links, and none of the access claims or document asks the page must not make.
import test from 'node:test'
import assert from 'node:assert/strict'
import { SATURDAY_ROUTES } from '../src/lib/loxSaturday.ts'

test('five complete, uniquely keyed routes', () => {
  assert.equal(SATURDAY_ROUTES.length, 5)
  const keys = new Set()
  for (const r of SATURDAY_ROUTES) {
    assert.ok(!keys.has(r.key))
    keys.add(r.key)
    for (const f of ['title', 'vibe', 'where', 'good', 'section']) assert.ok(r[f].trim().length > 8, `${r.key}.${f}`)
    if (r.official) assert.match(r.official.href, /^https:\/\/(discover\.pbc\.gov|www\.fws\.gov)\//)
  }
})

test('no coordinates, prices, airboats, off-road or document language', () => {
  for (const r of SATURDAY_ROUTES) {
    const blob = JSON.stringify(r)
    assert.ok(!/-?\d{1,3}\.\d{4,}\s*,\s*-?\d{1,3}\.\d{4,}/.test(blob), `${r.key} has coordinates`)
    assert.ok(!/\$\s?\d/.test(blob), `${r.key} has a price`)
    assert.ok(!/\b(airboat|swamp buggy|atv|off-road|alligator)\b/i.test(blob), `${r.key} invites a prohibited activity`)
    assert.ok(!/\b(hoa|association|condo|estoppel|reserves?|minutes|budget)\b/i.test(blob), `${r.key} mentions documents`)
  }
})
