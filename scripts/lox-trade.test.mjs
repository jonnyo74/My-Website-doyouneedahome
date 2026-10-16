// Run:  npm test
// Guards the wording of the Loxahatchee "What You Get / What You Trade" module: four complete pairs, and no
// land-use, utility, association, document, commute or price language.
import test from 'node:test'
import assert from 'node:assert/strict'
import { TRADE_PAIRS, TRADE_INTRO, TRADE_HEADING } from '../src/lib/loxTrade.ts'

test('four complete pairs with the agreed first row', () => {
  assert.equal(TRADE_PAIRS.length, 4)
  for (const p of TRADE_PAIRS) for (const f of ['gives', 'asks', 'note']) assert.ok(p[f].trim().length > 20, f)
  assert.equal(TRADE_PAIRS[0].gives, 'More room to make home life your own')
  assert.equal(TRADE_PAIRS[0].asks, 'More intention around errands and daily routines')
})

test('lifestyle copy only', () => {
  const blob = JSON.stringify([TRADE_PAIRS, TRADE_INTRO, TRADE_HEADING])
  assert.ok(!/\b(hoa|association|condo|estoppel|zoning|septic|permit|utilit|drainage|insurance|taxes?|minutes|budget|reserves?)\b/i.test(blob))
  assert.ok(!/\$\s?\d/.test(blob) && !/\b\d+\s*(min|mile)/i.test(blob))
})
