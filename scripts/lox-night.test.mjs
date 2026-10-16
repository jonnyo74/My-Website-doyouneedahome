// Run:  npm test
// Guards the "Pick Your Loxahatchee Night" chooser: four routes with the agreed titles, and no hours,
// prices, rankings, delivery or association language.
import test from 'node:test'
import assert from 'node:assert/strict'
import { NIGHT_ROUTES, NIGHT_INTRO } from '../src/lib/loxNight.ts'

test('four agreed routes', () => {
  assert.equal(NIGHT_ROUTES.length, 4)
  assert.deepEqual(NIGHT_ROUTES.map((r) => r.title), [
    'Pizza and an easy weeknight',
    'Live music, karaoke, or a social night out',
    'Dinner and drinks without leaving the area',
    'A bigger dinner night nearby',
  ])
})

test('plain, unranked copy', () => {
  const blob = JSON.stringify([NIGHT_ROUTES, NIGHT_INTRO])
  assert.ok(!/\$\s?\d|\b\d{1,2}\s?(am|pm)\b|\d\s?%/i.test(blob))
  assert.ok(!/\b(best|cheap|iconic|beloved|hidden|delivery|hoa|association|ranking)\b/i.test(blob))
})

import { REGULARS } from '../src/lib/loxNight.ts'

test('three verified regulars with https official links and no hours or prices', () => {
  assert.equal(REGULARS.length, 3)
  for (const r of REGULARS) for (const l of r.links) assert.match(l.href, /^https:\/\/(www\.)?(jabrewskispizzaco|booniesfl|rayshideawayfl)\.com\//)
  const blob = JSON.stringify(REGULARS)
  assert.ok(!/\$\s?\d|\b\d{1,2}\s?(am|pm)\b/i.test(blob))
})
