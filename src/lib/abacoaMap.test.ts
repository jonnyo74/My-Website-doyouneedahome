// Run with: npm test
//
// Guards the Abacoa map dataset (built by scripts/build-abacoa-map-data.py from
// Palm Beach County GIS): every village is accounted for, shapes are valid and
// inside Abacoa, pin-only villages say so, and each map view frames what it
// should. Offline: it reads the committed JSON, never the county service.

import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  DAKOTA_DRIVE,
  DAKOTA_RENTAL,
  DAKOTA_VILLAGES,
  MAP_HEADINGS,
  MAP_LANDMARKS,
  MAP_ROADS,
  MAP_VILLAGES,
  getMapVillage,
  mapDescription,
  viewBounds,
  type LngLat,
} from './abacoaMap.ts'

const GUIDES = ['antigua', 'canterbury-place', 'charleston-court', 'mallory-creek', 'martinique', 'newhaven', 'osceola-woods', 'tuscany', 'valencia', 'windsor-park']
const OUTLINED = GUIDES.filter((s) => s !== 'antigua' && s !== 'newhaven')
// A frame around Abacoa; anything outside it is a data error.
const inAbacoa = ([lng, lat]: LngLat) => lng > -80.14 && lng < -80.07 && lat > 26.865 && lat < 26.925

function rings(geom: { type: string; coordinates: unknown }): LngLat[][] {
  const polys = geom.type === 'Polygon' ? [geom.coordinates] : (geom.coordinates as unknown[])
  return (polys as LngLat[][][]).flatMap((p) => p)
}

describe('villages', () => {
  it('has a map entry and a guide for every one of the ten guide pages', () => {
    for (const slug of GUIDES) {
      const v = getMapVillage(slug)
      assert.ok(v, slug)
      assert.equal(v.guide, true, slug)
      assert.ok(v.sources.length >= 2, `${slug} sources`)
      assert.ok(v.sources.every((s) => s.url.startsWith('https://')), slug)
    }
  })

  it('outlines eight villages from county plats and pins Antigua and Newhaven', () => {
    for (const slug of OUTLINED) assert.ok(getMapVillage(slug)?.outline, `${slug} should have an outline`)
    for (const slug of ['antigua', 'newhaven']) {
      const v = getMapVillage(slug)!
      assert.equal(v.outline, undefined, `${slug} must not invent an outline`)
      assert.match(v.pinNote ?? '', /Pin only/)
    }
  })

  it('draws only closed, in-Abacoa rings', () => {
    for (const v of MAP_VILLAGES.filter((x) => x.outline)) {
      for (const ring of rings(v.outline!)) {
        assert.ok(ring.length >= 4, `${v.slug} ring too short`)
        assert.deepEqual(ring[0], ring[ring.length - 1], `${v.slug} ring not closed`)
        assert.ok(ring.every(inAbacoa), `${v.slug} has a point outside Abacoa`)
      }
    }
  })

  it('puts every label inside Abacoa and marks villages without a guide as unlinked', () => {
    for (const v of MAP_VILLAGES) assert.ok(inAbacoa(v.position), v.slug)
    const unlinked = MAP_VILLAGES.filter((v) => !v.guide).map((v) => v.slug).sort()
    assert.deepEqual(unlinked, ['cambridge', 'somerset', 'the-island', 'village-at-abacoa'])
  })

  it('never outlines two villages on top of each other', () => {
    const bbox = (v: (typeof MAP_VILLAGES)[number]) => {
      const pts = rings(v.outline!).flat()
      return [Math.min(...pts.map((p) => p[0])), Math.min(...pts.map((p) => p[1])), Math.max(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[1]))]
    }
    for (const v of MAP_VILLAGES.filter((x) => x.outline)) {
      const [w, s, e, n] = bbox(v)
      // The label sits inside the village's own box.
      assert.ok(v.position[0] >= w && v.position[0] <= e && v.position[1] >= s && v.position[1] <= n, `${v.slug} label outside its outline`)
    }
  })
})

describe('landmarks, roads and Dakota Drive', () => {
  it('has the three required landmarks and the rental pin', () => {
    assert.deepEqual(MAP_LANDMARKS.map((l) => l.id).sort(), ['abacoa-golf-club', 'roger-dean-stadium', 'town-center'])
    for (const l of MAP_LANDMARKS) assert.ok(inAbacoa(l.position), l.id)
    assert.equal(DAKOTA_RENTAL.kind, 'rental')
    assert.ok(inAbacoa(DAKOTA_RENTAL.position))
  })

  it('has road lines for orientation and the Dakota Drive alignment', () => {
    assert.ok(MAP_ROADS.length >= 6)
    for (const r of MAP_ROADS) assert.ok(r.lines.length > 0, r.id)
    assert.ok(DAKOTA_DRIVE.lines.length > 5)
  })

  it('names only villages with a guide as Dakota Drive villages', () => {
    assert.deepEqual([...DAKOTA_VILLAGES].sort(), ['canterbury-place', 'mallory-creek', 'martinique', 'windsor-park'])
    for (const slug of DAKOTA_VILLAGES) assert.equal(getMapVillage(slug)?.guide, true)
  })
})

describe('views', () => {
  it('opens each village map with that village and Town Center in frame', () => {
    const town = MAP_LANDMARKS.find((l) => l.id === 'town-center')!.position
    for (const slug of GUIDES) {
      const [[s, w], [n, e]] = viewBounds({ view: 'village', slug })
      const v = getMapVillage(slug)!
      assert.ok(v.position[1] >= s && v.position[1] <= n && v.position[0] >= w && v.position[0] <= e, `${slug} not in its own frame`)
      assert.ok(town[1] >= s && town[1] <= n && town[0] >= w && town[0] <= e, `${slug} frame misses Town Center`)
    }
  })

  it('frames every labelled village and landmark on the hub map', () => {
    const [[s, w], [n, e]] = viewBounds({ view: 'hub' })
    for (const p of [...MAP_VILLAGES.map((v) => v.position), ...MAP_LANDMARKS.map((l) => l.position)]) {
      assert.ok(p[1] >= s && p[1] <= n && p[0] >= w && p[0] <= e)
    }
  })

  it('frames the whole Dakota Drive alignment', () => {
    const [[s, w], [n, e]] = viewBounds({ view: 'dakota' })
    for (const line of DAKOTA_DRIVE.lines) for (const [lng, lat] of line) assert.ok(lat >= s && lat <= n && lng >= w && lng <= e)
  })

  it('uses the headings the pages promise', () => {
    assert.equal(MAP_HEADINGS.hub, 'Explore the Abacoa villages on the map')
    assert.equal(MAP_HEADINGS.dakota, 'Which Abacoa villages are along Dakota Drive?')
    assert.equal(MAP_HEADINGS.village('Newhaven'), 'Where is Newhaven in Abacoa?')
    assert.match(mapDescription({ view: 'village', slug: 'newhaven' }), /Newhaven highlighted/)
  })
})
