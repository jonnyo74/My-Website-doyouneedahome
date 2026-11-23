// Run with: npm test
//
// Fixture: scripts/fixtures/colony-ylopo-2026-11-23.json is a trimmed copy of
// the live Ylopo answer for the Colony scope on 2026-11-23, plus five nearby
// 33469 listings that are NOT in the town. Tests never touch the network.

import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import fixture from '../../scripts/fixtures/colony-ylopo-2026-11-23.json' with { type: 'json' }
import {
  ABACOA_SCOPES,
  classifyProbe,
  inScope,
  scopeFullSearchUrl,
  scopeProbeUrl,
  scopeSearch,
  selectCards,
  type ProviderListing,
} from './abacoaScopes.ts'
import { COLONY_SCOPE, GREATER_JUPITER_SEARCH_URL } from './colonyScope.ts'
import { salesSummary } from './colonyGuide.ts'

const colony = fixture.colony as unknown as ProviderListing[]
const nearby = fixture.nearby33469 as unknown as ProviderListing[]
const street = (l: ProviderListing) => (l.address as { fullStreetAddress?: string }).fullStreetAddress

describe('Colony scope', () => {
  it('keeps every Colony listing, whichever mailing city the MLS used', () => {
    assert.equal(colony.length, 3)
    for (const l of colony) assert.ok(inScope(l, COLONY_SCOPE), `${street(l)} should be in scope`)
    const shelter = colony.find((l) => street(l) === '187 Shelter Lane')
    assert.equal(shelter?.address?.city, 'Jupiter', 'the fixture must include a Jupiter-mailing-city Colony home')
    assert.ok(colony.some((l) => l.address?.city === 'Jupiter Inlet Colony'))
  })

  it('keeps nearby out-of-town homes out', () => {
    assert.ok(nearby.length >= 3)
    for (const l of nearby) assert.equal(inScope(l, COLONY_SCOPE), false, `${street(l)} is not in the Colony`)
  })

  it('rejects a Colony plat name on a Tequesta mailing city', () => {
    const odd: ProviderListing = {
      address: { city: 'Tequesta' },
      listingAttribute: { subdivisionInfo: ['JUPITER INLET BEACH COLONY'] },
    }
    assert.equal(inScope(odd, COLONY_SCOPE), false)
  })

  it('accepts the bare municipality entry, and not a bare Jupiter one', () => {
    const cityOnly: ProviderListing = {
      address: { city: 'Jupiter Inlet Colony' },
      listingAttribute: { subdivisionInfo: ['SOME NEW PLAT'] },
    }
    assert.equal(inScope(cityOnly, COLONY_SCOPE), true)
    const jupiterOnly: ProviderListing = {
      address: { city: 'Jupiter' },
      listingAttribute: { subdivisionInfo: ['SOME NEW PLAT'] },
    }
    assert.equal(inScope(jupiterOnly, COLONY_SCOPE), false)
  })

  it('classifies results, a true empty and a feed failure differently', () => {
    const ok = classifyProbe(colony, COLONY_SCOPE)
    assert.equal(ok.state, 'results')
    assert.equal(ok.state === 'results' && ok.active, 3)
    assert.deepEqual(classifyProbe([], COLONY_SCOPE), { state: 'empty' })
    assert.deepEqual(classifyProbe(null, COLONY_SCOPE, 'timeout'), { state: 'unavailable', reason: 'timeout' })
    assert.deepEqual(classifyProbe(null, COLONY_SCOPE, 'error'), { state: 'unavailable', reason: 'error' })
    assert.deepEqual(classifyProbe({ oops: true }, COLONY_SCOPE), { state: 'unavailable', reason: 'malformed' })
    assert.deepEqual(classifyProbe([...colony, nearby[0]], COLONY_SCOPE), {
      state: 'unavailable',
      reason: 'out-of-scope',
    })
  })

  it('selects all three as cards and drops the nearby rows', () => {
    assert.equal(selectCards([...colony, ...nearby], COLONY_SCOPE).length, 3)
  })

  it('uses one search for the widget, the probe and the full-search link, with no price floor', () => {
    const search = scopeSearch(COLONY_SCOPE)
    assert.equal('minPrice' in search, false)
    assert.deepEqual(search.locations, COLONY_SCOPE.locations)
    const probe = decodeURIComponent(scopeProbeUrl(COLONY_SCOPE, 'cb'))
    assert.ok(probe.includes(JSON.stringify(search)))
    const full = decodeURIComponent(scopeFullSearchUrl(COLONY_SCOPE))
    assert.ok(full.includes('area=Jupiter Inlet Colony'))
    assert.ok(full.includes('s[locations][0][subdivision]=Jupiter Inlet Beach Colony'))
    assert.ok(full.includes('s[locations][5][city]=Jupiter Inlet Colony'))
    assert.equal(/minPrice|maxPrice|amenities|propertyTypes/.test(full), false)
    // No Colony location is a bare Jupiter city search.
    for (const l of COLONY_SCOPE.locations) {
      assert.ok(l.subdivision || l.community || l.city === 'Jupiter Inlet Colony')
    }
  })

  it('keeps the Jupiter-wide link separate from the Colony scope', () => {
    assert.notEqual(GREATER_JUPITER_SEARCH_URL, scopeFullSearchUrl(COLONY_SCOPE))
    assert.equal(/Colony/.test(decodeURIComponent(GREATER_JUPITER_SEARCH_URL)), false)
  })
})

describe('Abacoa scopes are unchanged by the shared edits', () => {
  it('still default to Jupiter only', () => {
    const scope = ABACOA_SCOPES['mallory-creek']
    assert.equal(scope.cities, undefined)
    assert.ok(scopeFullSearchUrl(scope).includes('area=Jupiter&'))
    const at = (city: string, sub: string): ProviderListing => ({
      address: { city },
      listingAttribute: { subdivisionInfo: [sub] },
    })
    assert.equal(inScope(at('Jupiter Inlet Colony', 'Mallory Creek'), scope), false)
    assert.equal(inScope(at('Jupiter', 'Mallory Creek'), scope), true)
    assert.equal(inScope(at('Jupiter', 'Elsewhere'), scope), false)
  })
})

describe('Colony recorded sales', () => {
  it('summarizes a list and refuses to summarize too few', () => {
    const s = salesSummary([
      { date: '2026-01-01', street: 'Ocean Drive', price: 9_000_000 },
      { date: '2026-02-01', street: 'Beacon Lane', price: 3_000_000 },
      { date: '2026-03-01', street: 'Colony Road', price: 4_000_000 },
    ])
    assert.equal(s?.median, 4_000_000)
    assert.equal(s?.low, 3_000_000)
    assert.equal(s?.high, 9_000_000)
    assert.equal(salesSummary([{ date: '2026-01-01', street: 'Ocean Drive', price: 9_000_000 }]), null)
  })
})
