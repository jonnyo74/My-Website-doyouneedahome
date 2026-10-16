// Run:  npm test
// Guards the hidden-gems modules: the three-part test wording, a sourced Acreage Pines card, and none
// of the access, night-sky, informal-advice or association language the page must not carry.
import test from 'node:test'
import assert from 'node:assert/strict'
import { GEM_TEST_ITEMS, GEM_TEST_INTRO, GLANCE_ROWS, GLANCE_SOURCE } from '../src/lib/loxGems.ts'

test('three agreed gem types and a sourced glance card', () => {
  assert.equal(GEM_TEST_ITEMS.length, 3)
  assert.equal(GEM_TEST_ITEMS[0].title, 'A small place with a big sense of space')
  assert.ok(GLANCE_ROWS.length >= 5)
  assert.match(GLANCE_SOURCE.href, /^https:\/\/discover\.pbc\.gov\/erm\/NaturalAreas\/Acreage-Pines\.aspx$/)
})

test('no prohibited access, night-sky, advice or document language', () => {
  const blob = JSON.stringify([GEM_TEST_ITEMS, GEM_TEST_INTRO, GLANCE_ROWS])
  assert.ok(!/\b(canal|fishing|paddl|airboat|off-road|milky way|night|feed store|neighbor|contractor|locals know|burn)\w*/i.test(blob))
  assert.ok(!/\b(hoa|association|condo|estoppel|reserves?|minutes|budget)\b/i.test(blob))
})
