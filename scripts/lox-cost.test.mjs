// Run:  npm test
// Guards the wording of the Loxahatchee cost modules: four lenses and three value cards, no dollar
// figures or percentages, and no universal utility, tax, insurance, land-use or association language.
import test from 'node:test'
import assert from 'node:assert/strict'
import { EQUATION_LENSES, EQUATION_INTRO, VALUE_CARDS, VALUE_INTRO } from '../src/lib/loxCost.ts'

test('four lenses with the agreed wording and three value cards', () => {
  assert.equal(EQUATION_LENSES.length, 4)
  assert.deepEqual(EQUATION_LENSES.map((l) => l.lens), ['Home purchase', 'Monthly ownership', 'Daily life', 'Lifestyle spending'])
  assert.deepEqual(VALUE_CARDS.map((c) => c.title), ['Room to use', 'Room to breathe', 'Room to choose'])
})

test('no figures and no universal claims', () => {
  const blob = JSON.stringify([EQUATION_LENSES, EQUATION_INTRO, VALUE_CARDS, VALUE_INTRO])
  assert.ok(!/\$\s?\d|\d\s?%|\d+\s*(min|mile|acre)/i.test(blob))
  assert.ok(!/\b(hoa|association|condo|estoppel|zoning|septic|well water|permit|transit|always|every|all homes|never)\b/i.test(blob))
})
