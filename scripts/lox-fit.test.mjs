// Run:  npm test
// Guards the wording of the Loxahatchee fit card: five choices and a closing line, with no land-use,
// utility, commute, association or document claims.
import test from 'node:test'
import assert from 'node:assert/strict'
import { FIT_ROWS, FIT_CLOSING, FIT_LEAD } from '../src/lib/loxFit.ts'

test('five complete choices and the closing question', () => {
  assert.equal(FIT_ROWS.length, 5)
  for (const r of FIT_ROWS) assert.ok(r.choose.trim().length > 3 && r.over.trim().length > 8)
  assert.match(FIT_CLOSING, /^The question is not whether Loxahatchee is convenient enough\./)
})

test('lifestyle copy only', () => {
  const blob = JSON.stringify([FIT_ROWS, FIT_CLOSING, FIT_LEAD])
  assert.ok(!/\b(hoa|association|condo|estoppel|zoning|septic|well|permit|minutes|\d+\s*(min|mile))\b/i.test(blob))
  assert.ok(!/\$\s?\d/.test(blob))
})
