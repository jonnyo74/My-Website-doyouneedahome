// Run:  npm test
// Guards the comparison modules: five places in the agreed order, three questions, anchors that match the
// article's section headings, and no price, tax, commute, utility, association or ranking language.
import test from 'node:test'
import assert from 'node:assert/strict'
import { LIVES, QUESTIONS, LIVES_INTRO, QUESTIONS_INTRO } from '../src/lib/loxCompare.ts'

test('five places in the agreed order and three questions', () => {
  assert.deepEqual(LIVES.map((l) => l.place), ['Loxahatchee', 'Wellington', 'Royal Palm Beach', 'Westlake', 'Jupiter Farms'])
  assert.equal(QUESTIONS.length, 3)
})

test('every anchor is a heading id of a section with that place name', () => {
  for (const l of LIVES) {
    assert.ok(l.anchor.startsWith(l.place.toLowerCase().replace(/\s+/g, '-')))
  }
  for (const q of QUESTIONS) for (const o of q.options) for (const p of o.look) assert.ok(LIVES.some((l) => l.anchor === p.anchor))
})

test('no figures, ranking or off-limits topics', () => {
  const blob = JSON.stringify([LIVES, QUESTIONS, LIVES_INTRO, QUESTIONS_INTRO])
  assert.ok(!/\$\s?\d|\d\s?%|\d+\s*(min|mile|acre)/i.test(blob))
  assert.ok(!/\b(hoa|association|cdd|fees?|zoning|septic|well water|commute|school|cheaper|cheapest|best value|better than|winner|ranking)\b/i.test(blob))
})
