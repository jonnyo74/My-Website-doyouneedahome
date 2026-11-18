// Run with: npm test   (node's built-in runner; no extra dependencies)
//
// Fixtures: scripts/fixtures/abacoa-ylopo-2026-11-18.json is a trimmed copy of
// live Ylopo answers for each scope on 2026-11-18. Inventory changes daily, so
// these tests pin behavior against that snapshot and never touch the network.
// The authorized live QA pass is scripts/abacoa-live-qa.mjs.

import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import fixture from '../../scripts/fixtures/abacoa-ylopo-2026-11-18.json' with { type: 'json' }
import {
  ABACOA_SCOPES,
  CARD_LIMIT,
  classifyProbe,
  getAbacoaScope,
  inScope,
  isEligibleType,
  isStrictActive,
  scopeFullSearchUrl,
  scopeProbeUrl,
  scopeSearch,
  selectCards,
  type ProviderListing,
} from './abacoaScopes.ts'

const VILLAGES = Object.keys(ABACOA_SCOPES).filter((s) => s !== 'abacoa')
const rows = (slug: string) => (fixture as Record<string, ProviderListing[]>)[slug]
const scope = (slug: string) => {
  const s = getAbacoaScope(slug)
  assert.ok(s, `no scope for ${slug}`)
  return s
}

function listing(over: {
  mls?: string
  city?: string
  sub?: string
  comm?: string
  nb?: string
  status?: string
  type?: string
}): ProviderListing {
  return {
    mlsNumber: over.mls ?? 'X1',
    address: { city: over.city ?? 'Jupiter', stateOrProvince: 'FL' },
    addressStandard: { neighborhoodName: over.nb ?? '', communityName: over.comm ?? '' },
    listingAttribute: { subdivisionInfo: over.sub ? [over.sub] : [] },
    listingStatus: { displayStatus: over.status ?? 'Active', ylopoStatus: 'ACTIVE' },
    listingPropertyType: { displayPropertyType: over.type ?? 'Residential' },
  }
}

describe('scope definitions', () => {
  it('has the hub, ten villages, and no Dakota scope', () => {
    assert.equal(VILLAGES.length, 10)
    assert.ok(getAbacoaScope('abacoa'))
    assert.equal(getAbacoaScope('dakota'), undefined)
  })

  it('pins every location to Jupiter, FL', () => {
    for (const s of Object.values(ABACOA_SCOPES)) {
      for (const l of s.locations) {
        assert.equal(l.city, 'Jupiter', `${s.slug} ${JSON.stringify(l)}`)
        assert.equal(l.state, 'FL')
      }
    }
  })

  it('never uses a bare common name as a community or neighborhood', () => {
    const risky = ['Tuscany', 'Valencia']
    for (const slug of ['tuscany', 'valencia']) {
      for (const l of scope(slug).locations) {
        for (const name of risky) {
          assert.notEqual(l.community, name)
          assert.notEqual(l.neighborhood, name)
        }
      }
    }
  })

  it('makes the hub cover every village subdivision and every village listing', () => {
    const key = (l: object) => JSON.stringify(l)
    const hub = new Set(scope('abacoa').locations.map(key))
    for (const v of VILLAGES) {
      for (const l of scope(v).locations.filter((x) => x.subdivision)) assert.ok(hub.has(key(l)), `${v}: ${key(l)}`)
      for (const r of rows(v)) assert.ok(inScope(r, scope('abacoa')), `${v}: ${r.mlsNumber}`)
    }
  })

  it('keeps the hub search URL well under the 8 KB many servers enforce', () => {
    assert.ok(scopeFullSearchUrl(scope('abacoa')).length < 6000)
  })

  it('reaches every village home through a subdivision entry, not a bare community or neighborhood name', () => {
    for (const v of VILLAGES) {
      const subOnly = { ...scope(v), locations: scope(v).locations.filter((l) => l.subdivision) }
      for (const r of rows(v)) assert.ok(inScope(r, subOnly), `${v}: ${r.mlsNumber} only matches a community/neighborhood entry`)
    }
  })
})

describe('provider request', () => {
  it('has no price floor and no property-type filter', () => {
    for (const s of Object.values(ABACOA_SCOPES)) {
      const search = scopeSearch(s)
      assert.equal('minPrice' in search, false)
      assert.equal('propertyTypes' in search, false)
      assert.equal(search.limit, CARD_LIMIT)
      assert.ok(!scopeFullSearchUrl(s).includes('minPrice'))
    }
  })

  it('sends the same locations to the widget, the full search and the probe', () => {
    for (const s of Object.values(ABACOA_SCOPES)) {
      const url = scopeFullSearchUrl(s)
      const fromUrl: Record<number, Record<string, string>> = {}
      for (const m of url.matchAll(/s\[locations\]\[(\d+)\]\[(\w+)\]=([^&]*)/g)) {
        ;(fromUrl[Number(m[1])] ??= {})[m[2]] = decodeURIComponent(m[3])
      }
      assert.deepEqual(Object.values(fromUrl), s.locations)
      const probe = new URL(scopeProbeUrl(s, 'cb'))
      assert.equal(probe.searchParams.get('s'), JSON.stringify(scopeSearch(s)), 'probe must be byte-identical to the widget search')
      assert.deepEqual(JSON.parse(probe.searchParams.get('s')!).locations, s.locations)
      assert.deepEqual(scopeSearch(s).locations, s.locations)
    }
  })

  it('returns a fresh object each call so one route cannot mutate another', () => {
    const a = scopeSearch(scope('martinique'))
    ;(a as { limit: number }).limit = 99
    assert.equal(scopeSearch(scope('martinique')).limit, CARD_LIMIT)
    assert.notDeepEqual(scopeSearch(scope('martinique')).locations, scopeSearch(scope('windsor-park')).locations)
    assert.notEqual(scopeProbeUrl(scope('martinique'), 'cb'), scopeProbeUrl(scope('windsor-park'), 'cb'))
  })
})

describe('membership against the 2026-11-18 provider snapshot', () => {
  for (const slug of Object.keys(ABACOA_SCOPES)) {
    it(`${slug}: every returned listing is in scope`, () => {
      for (const r of rows(slug)) assert.ok(inScope(r, scope(slug)), `${r.mlsNumber}`)
    })
  }

  it('finds the homes the old widget missed', () => {
    const active = (slug: string) => selectCards(rows(slug), scope(slug), 50).map((r) => r.mlsNumber)
    assert.deepEqual(active('martinique'), ['B26094270']) // zero before
    assert.equal(active('windsor-park').length, 3) // zero before
    assert.ok(active('newhaven').includes('B26093973')) // 7B Ph 1, never asked for
  })

  it('puts no listing under two villages', () => {
    const seen = new Map<string, string>()
    for (const v of VILLAGES) {
      for (const r of rows(v)) {
        const prior = seen.get(r.mlsNumber!)
        assert.equal(prior, undefined, `${r.mlsNumber} in ${prior} and ${v}`)
        seen.set(r.mlsNumber!, v)
      }
    }
  })

  it('keeps sibling villages out of each other', () => {
    for (const a of VILLAGES) {
      for (const b of VILLAGES) {
        if (a === b) continue
        for (const r of rows(a)) assert.equal(inScope(r, scope(b)), false, `${r.mlsNumber} (${a}) leaked into ${b}`)
      }
    }
  })

  it('lists every village home in the hub, which the plain name could not', () => {
    const hub = new Set(rows('abacoa').map((r) => r.mlsNumber))
    for (const v of VILLAGES) for (const r of rows(v)) assert.ok(hub.has(r.mlsNumber), `${r.mlsNumber} missing from hub`)
    assert.ok(rows('abacoa').length > 25, 'hub must exceed the 25 the name-only query returned')
  })

  it('keeps 599 Dakota Drive in Canterbury Place only, and Killarney Court with it', () => {
    const ids = selectCards(rows('canterbury-place'), scope('canterbury-place'), 50).map((r) => r.mlsNumber)
    assert.ok(ids.includes('B26074504')) // 599 Dakota Drive
    assert.ok(ids.includes('B26082297')) // 143 Killarney Court
    for (const v of VILLAGES.filter((x) => x !== 'canterbury-place')) {
      assert.ok(!selectCards(rows(v), scope(v), 50).some((r) => r.mlsNumber === 'B26074504'))
    }
  })
})

describe('similar names and the same city', () => {
  it('rejects Martinique in another city and Windsor Park in North Palm Beach', () => {
    assert.equal(inScope(listing({ city: 'Coconut Creek', comm: 'Martinique', sub: 'Martinique Village II F Condo' }), scope('martinique')), false)
    assert.equal(inScope(listing({ city: 'North Palm Beach', comm: 'Windsor Park', sub: 'Windsor Park North Condominiums' }), scope('windsor-park')), false)
  })

  it('rejects look-alike Jupiter subdivisions that are not the Abacoa village', () => {
    assert.equal(inScope(listing({ sub: 'Tuscany Isles', comm: 'Tuscany' }), scope('tuscany')), false)
    assert.equal(inScope(listing({ sub: 'Valencia Lakes', comm: 'Valencia' }), scope('valencia')), false)
    assert.equal(inScope(listing({ sub: 'Newhaven Estates' }), scope('newhaven')), false)
  })

  it('rejects other Jupiter homes with a matching street or ZIP only', () => {
    assert.equal(inScope(listing({ sub: 'Some Other Jupiter Plat', nb: 'Jupiter Farms' }), scope('abacoa')), false)
  })
})

describe('phases and aliases', () => {
  it('accepts every provider spelling of one village', () => {
    const mallory = ['Mallory Creek At Abacoa 01', 'MALLORY CREEK AT ABACOA 2', 'Mallory Creek At Abacoa 2 1', 'mallory creek at abacoa 1']
    for (const sub of mallory) assert.ok(inScope(listing({ sub }), scope('mallory-creek')), sub)
    for (const sub of ['Windsor Park At Abacoa Pl', 'WINDSOR PARK AT ABACOA PL NO 3']) assert.ok(inScope(listing({ sub }), scope('windsor-park')), sub)
    for (const sub of ['Newhaven 7a', 'NEWHAVEN 7B PH 2', 'Newhaven 07b Ph 01 At Abacoa', 'NEW HAVEN']) assert.ok(inScope(listing({ sub }), scope('newhaven')), sub)
    for (const sub of ['Martinique At Abacoa 1', 'Martinique At Abacoa 2']) assert.ok(inScope(listing({ sub }), scope('martinique')), sub)
  })

  it('treats punctuation and case as the same name', () => {
    assert.ok(inScope(listing({ sub: 'greenwich residential , abacoa' }), scope('abacoa')))
  })

  it('returns one row per MLS number when aliases overlap', () => {
    const dup = [
      listing({ mls: 'D1', sub: 'Tuscany At Abacoa' }),
      listing({ mls: 'D1', sub: 'Tuscany At Abacoa', comm: 'Tuscany At Abacoa' }),
      listing({ mls: 'D2', sub: 'Tuscany At Abacoa 2' }),
    ]
    assert.deepEqual(selectCards(dup, scope('tuscany')).map((r) => r.mlsNumber), ['D1', 'D2'])
  })
})

describe('property types and price', () => {
  it('includes condos and homes under $400K', () => {
    const condo = listing({ mls: 'C1', sub: 'Somerset At Abacoa Condo', type: 'Condominium' })
    ;(condo as { price?: string }).price = '280000.00'
    assert.deepEqual(selectCards([condo], scope('abacoa')).map((r) => r.mlsNumber), ['C1'])
    const fixtureCondo = rows('abacoa').filter((r) => (r.listingAttribute?.subdivisionInfo ?? []).join().includes('SOMERSET'))
    assert.ok(selectCards(fixtureCondo, scope('abacoa'), 50).length >= 3)
  })

  it('includes townhomes classed as Residential', () => {
    assert.ok(selectCards(rows('antigua'), scope('antigua')).length >= 3)
  })
})

describe('status and type exclusion', () => {
  const scoped = (over: Parameters<typeof listing>[0]) => listing({ sub: 'Tuscany At Abacoa', ...over })

  it('keeps only strictly Active listings', () => {
    for (const status of ['Coming Soon', 'Pending', 'Active Under Contract', 'Contingent', 'Sold', 'Withdrawn', 'Expired']) {
      assert.equal(isStrictActive(scoped({ status })), false, status)
      assert.deepEqual(selectCards([scoped({ status })], scope('tuscany')), [])
    }
    assert.equal(isStrictActive(scoped({ status: 'Active' })), true)
  })

  it('excludes rentals, land and commercial', () => {
    for (const type of ['Residential Rental', 'Residential Lease', 'Land', 'Vacant Land', 'Commercial Sale']) {
      assert.equal(isEligibleType(scoped({ type })), false, type)
    }
    assert.equal(isEligibleType(scoped({ type: 'Residential' })), true)
    assert.equal(isEligibleType(scoped({ type: 'Condominium' })), true)
  })

  it('shows no card for the Coming Soon-only Valencia snapshot', () => {
    assert.equal(rows('valencia').length, 1)
    assert.deepEqual(selectCards(rows('valencia'), scope('valencia')), [])
  })
})

describe('card limit', () => {
  it('cuts to six only after filtering, so excluded rows never use a slot', () => {
    const noise = [
      listing({ mls: 'N1', sub: 'Tuscany At Abacoa', status: 'Pending' }),
      listing({ mls: 'N2', sub: 'Tuscany At Abacoa', status: 'Coming Soon' }),
      listing({ mls: 'N3', sub: 'Mallory Creek At Abacoa 2' }), // sibling
      listing({ mls: 'N4', city: 'Boca Raton', sub: 'Tuscany At Abacoa' }),
      listing({ mls: 'N5', sub: 'Tuscany At Abacoa', type: 'Residential Rental' }),
    ]
    const good = Array.from({ length: 8 }, (_, i) => listing({ mls: `G${i}`, sub: 'Tuscany At Abacoa 2' }))
    const out = selectCards([...noise, ...good], scope('tuscany'))
    assert.equal(out.length, CARD_LIMIT)
    assert.deepEqual(out.map((r) => r.mlsNumber), ['G0', 'G1', 'G2', 'G3', 'G4', 'G5'])
  })
})

describe('probe outcomes', () => {
  const s = () => scope('martinique')

  it('reads a successful zero as a verified empty', () => {
    assert.deepEqual(classifyProbe([], s()), { state: 'empty' })
  })

  it('never claims empty on a timeout, network error or malformed answer', () => {
    assert.deepEqual(classifyProbe(null, s(), 'timeout'), { state: 'unavailable', reason: 'timeout' })
    assert.deepEqual(classifyProbe(null, s(), 'error'), { state: 'unavailable', reason: 'error' })
    assert.deepEqual(classifyProbe({ error: 'nope' }, s()), { state: 'unavailable', reason: 'malformed' })
    assert.deepEqual(classifyProbe(undefined, s()), { state: 'unavailable', reason: 'malformed' })
  })

  it('refuses to vouch for a provider that falls back to out-of-scope rows', () => {
    const out = classifyProbe([listing({ sub: 'Mallory Creek At Abacoa 2' })], s())
    assert.deepEqual(out, { state: 'unavailable', reason: 'out-of-scope' })
  })

  it('counts active and Coming Soon rows separately', () => {
    const out = classifyProbe(
      [listing({ mls: 'A', sub: 'Martinique At Abacoa 1' }), listing({ mls: 'B', sub: 'Martinique At Abacoa 2', status: 'Coming Soon' })],
      s(),
    )
    assert.deepEqual(out, { state: 'results', total: 2, active: 1, comingSoon: 1 })
  })

  it('classifies the Valencia snapshot as results with zero active', () => {
    assert.deepEqual(classifyProbe(rows('valencia'), scope('valencia')), { state: 'results', total: 1, active: 0, comingSoon: 1 })
  })
})

describe('alert scope', () => {
  it('names the exact community and has a scope for every alert surface', () => {
    for (const s of Object.values(ABACOA_SCOPES)) {
      assert.ok(s.name.length > 0)
      assert.ok(s.locations.length > 0)
      assert.ok(scopeFullSearchUrl(s).includes(encodeURIComponent(s.locations[0].community ?? s.locations[0].neighborhood ?? s.locations[0].subdivision ?? '')))
    }
  })
})
