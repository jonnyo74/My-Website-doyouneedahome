// Run:  npm test
// Integrity checks for the Tequesta hidden-gems data: every place is labelled by area,
// has a real source, and none carries a coordinate pair we did not verify.
import test from 'node:test'
import assert from 'node:assert/strict'
import { AREA_LABEL, CATEGORY_LABEL, GEMS, directionsUrl } from '../src/lib/tequestaGems.ts'

test('every gem is complete and uniquely identified', () => {
  const ids = new Set()
  for (const g of GEMS) {
    assert.ok(!ids.has(g.id), `duplicate id ${g.id}`)
    ids.add(g.id)
    for (const k of ['name', 'where', 'mapQuery', 'special', 'when', 'access', 'tip', 'sourceLabel', 'confirm']) {
      assert.ok(typeof g[k] === 'string' && g[k].trim().length > 5, `${g.id}.${k} is empty`)
    }
    assert.ok(g.area in AREA_LABEL, `${g.id} has an unknown area`)
    assert.ok(g.category in CATEGORY_LABEL, `${g.id} has an unknown category`)
    assert.match(g.sourceUrl, /^https:\/\//, `${g.id} needs an https source`)
  }
  assert.ok(GEMS.length >= 15)
})

test('no coordinates are stored, and directions come from name and address text', () => {
  for (const g of GEMS) {
    const blob = JSON.stringify(g)
    assert.ok(!/-?\d{1,3}\.\d{4,}\s*,\s*-?\d{1,3}\.\d{4,}/.test(blob), `${g.id} looks like it holds coordinates`)
    assert.ok(!('lat' in g) && !('lng' in g) && !('lon' in g))
    const url = directionsUrl(g)
    assert.ok(url.startsWith('https://www.google.com/maps/dir/?api=1&destination='))
    assert.ok(decodeURIComponent(url).includes(g.mapQuery))
  }
})

test('places outside the incorporated Village are never labelled as Village', () => {
  for (const g of GEMS) {
    if (g.area !== 'village') assert.notEqual(AREA_LABEL[g.area], AREA_LABEL.village)
  }
  const outside = GEMS.filter((g) => g.category === 'nearby')
  assert.ok(outside.every((g) => g.area !== 'village'))
})
