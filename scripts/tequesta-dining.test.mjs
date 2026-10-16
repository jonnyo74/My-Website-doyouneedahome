// Run:  npm test
// Integrity checks for the Tequesta dining data: every venue is labelled by area, the four
// featured venues are present, Jupiter places are never labelled Tequesta, and no prices,
// ratings or coordinates appear.
import test from 'node:test'
import assert from 'node:assert/strict'
import { DINING_AREA_LABEL, DINING_TAGS, VENUES, diningDirectionsUrl } from '../src/lib/tequestaDining.ts'

test('every venue is complete with valid tags and an https source', () => {
  const ids = new Set()
  for (const v of VENUES) {
    assert.ok(!ids.has(v.id))
    ids.add(v.id)
    for (const k of ['name', 'address', 'mapQuery', 'experience', 'special', 'suits', 'highlights', 'seating', 'reservations', 'tip', 'sourceLabel', 'confirm']) {
      assert.ok(typeof v[k] === 'string' && v[k].trim().length > 3, `${v.id}.${k}`)
    }
    assert.ok(v.area in DINING_AREA_LABEL)
    assert.ok(v.tags.length > 0 && v.tags.every((t) => DINING_TAGS.some((d) => d.key === t)))
    assert.match(v.sourceUrl, /^https:\/\//)
    if (v.websiteUrl) assert.match(v.websiteUrl, /^https:\/\//)
  }
})

test('the four priority venues are featured and the count is in range', () => {
  const featured = VENUES.filter((v) => v.featured).map((v) => v.id).sort()
  assert.deepEqual(featured, ['blue-pointe', 'hog-snappers', 'papichulo', 'tiki-52'])
  assert.ok(VENUES.length >= 14 && VENUES.length <= 18)
})

test('Jupiter venues carry the Jupiter tag and area, and nothing else does', () => {
  for (const v of VENUES) {
    assert.equal(v.area === 'jupiter', v.tags.includes('jupiter'), `${v.id} jupiter tag mismatch`)
  }
  assert.equal(VENUES.find((v) => v.id === 'leftovers').area, 'jupiter')
})

test('Blue Pointe and Tiki 52 are not labelled as inside the Village', () => {
  for (const id of ['blue-pointe', 'tiki-52']) {
    const v = VENUES.find((x) => x.id === id)
    assert.equal(v.area, 'martin-mailing')
    assert.match(v.confirm, /Martin County/)
  }
})

test('no prices, ratings, drive times or coordinates are stored', () => {
  for (const v of VENUES) {
    const blob = JSON.stringify(v)
    assert.ok(!/\$\s?\d/.test(blob), `${v.id} has a dollar figure`)
    assert.ok(!/\b\d(\.\d)?\s*(stars?|\/5)\b/i.test(blob), `${v.id} has a rating`)
    assert.ok(!/\b\d+\s*(minutes?|mins?)\b/i.test(v.address + v.special + v.tip), `${v.id} has a drive time`)
    assert.ok(!/-?\d{1,3}\.\d{4,}\s*,\s*-?\d{1,3}\.\d{4,}/.test(blob), `${v.id} has coordinates`)
    assert.ok(decodeURIComponent(diningDirectionsUrl(v)).includes(v.mapQuery))
  }
})
