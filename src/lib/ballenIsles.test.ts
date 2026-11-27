// Run with: npm test
//
// Fixture: scripts/fixtures/ballenisles-ylopo-2026-11-27.json is a trimmed copy
// of the live Ylopo answer for the BallenIsles scope on 2026-11-27 (12 active,
// 25 sold) plus ZIP 33418 listings next to the gates that are NOT BallenIsles
// (PGA National, Gardenia Isles, Old Palm, Steeplechase, Garden Lakes). No network.

import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import fixture from '../../scripts/fixtures/ballenisles-ylopo-2026-11-27.json' with { type: 'json' }
import { classifyProbe, inScope, scopeSearch, type ProviderListing } from './abacoaScopes.ts'
import {
  BALLENISLES_SCOPE,
  PRICE_BANDS,
  TYPE_SEARCHES,
  ballenIslesSearchUrl,
  ballenIslesSoldSearch,
  ballenIslesSoldSearchUrl,
} from './ballenIslesScope.ts'
import * as guide from './ballenIsles.ts'
import { publishableFees } from './clubFees.ts'
import { CLUB_INQUIRY_TYPES, inquiryClassification, isClubInquiryType } from './clubInquiry.ts'

type Row = ProviderListing & { address: { fullStreetAddress: string; city: string } }
const active = fixture.active as unknown as Row[]
const sold = fixture.sold as unknown as Row[]
const nearby = fixture.nearby33418 as unknown as Row[]
const street = (l: Row) => l.address.fullStreetAddress

describe('BallenIsles listing scope', () => {
  it('keeps every BallenIsles listing, active and sold, and no nearby one', () => {
    assert.ok(active.length >= 10)
    for (const l of [...active, ...sold]) assert.ok(inScope(l, BALLENISLES_SCOPE), `${street(l)} should be in scope`)
    assert.ok(nearby.some((l) => /Gardenia/i.test(street(l))), 'the fixture covers Gardenia Isles')
    for (const l of nearby) assert.equal(inScope(l, BALLENISLES_SCOPE), false, `${street(l)} is not BallenIsles`)
  })

  it('classifies results, a true empty and an out-of-scope answer differently', () => {
    assert.equal(classifyProbe(active, BALLENISLES_SCOPE).state, 'results')
    assert.deepEqual(classifyProbe([], BALLENISLES_SCOPE), { state: 'empty' })
    assert.deepEqual(classifyProbe([active[0], nearby[0]], BALLENISLES_SCOPE), { state: 'unavailable', reason: 'out-of-scope' })
  })

  it('pins every location to Palm Beach Gardens and asks for no price floor', () => {
    for (const l of BALLENISLES_SCOPE.locations) assert.equal(l.city, 'Palm Beach Gardens')
    assert.deepEqual(BALLENISLES_SCOPE.cities, ['PALM BEACH GARDENS'])
    assert.equal('minPrice' in scopeSearch(BALLENISLES_SCOPE), false)
    assert.equal(/minPrice|maxPrice|propertyTypes|amenities/.test(decodeURIComponent(ballenIslesSearchUrl())), false)
  })

  it('links only filters the provider honors, and price bands with no gap', () => {
    for (const t of TYPE_SEARCHES) assert.ok(/s\[propertyTypes\]\[0\]=(house|condo)$/.test(decodeURIComponent(ballenIslesSearchUrl(t.filter))))
    for (const b of PRICE_BANDS) assert.ok(/s\[(min|max)Price\]=\d+/.test(ballenIslesSearchUrl(b.filter)))
    for (let i = 1; i < PRICE_BANDS.length; i++) assert.equal(PRICE_BANDS[i].filter.minPrice, PRICE_BANDS[i - 1].filter.maxPrice)
    assert.ok(ballenIslesSearchUrl().length < 8000, 'search URL stays under the provider limit')
  })

  it('shows sold homes across the whole scope, newest first', () => {
    const s = ballenIslesSoldSearch()
    assert.equal(s.soldOnly, true)
    assert.deepEqual(s.locations, BALLENISLES_SCOPE.locations)
    const url = decodeURIComponent(ballenIslesSoldSearchUrl())
    assert.ok(url.includes('s[soldOnly]=true') && url.includes('s[orderBy]=soldDate,desc'))
  })
})

describe('BallenIsles copy rules', () => {
  const copy = JSON.stringify([
    guide.QUICK_FACTS, guide.CATEGORIES, guide.MEMBERSHIP_TABLE, guide.MEMBERSHIP_ANSWER, guide.CLUB_CHARGES,
    guide.NEIGHBORHOODS, guide.HOME_TYPES, guide.COSTS, guide.BEFORE_OFFER, guide.COMPARE, guide.FAQS, guide.NOT_VERIFIED,
  ])

  it('keeps dollar figures out of the copy, and publishes no fee record', () => {
    assert.equal(/\$\s?\d/.test(copy), false, 'a dollar figure is hard-coded in the copy')
    assert.deepEqual(publishableFees('ballen-isles'), [])
  })

  it('makes no appreciation or resale-demand claim', () => {
    assert.equal(/hold(s)? (their|its) value|apprecia|sought-after|in demand|strong resale/i.test(copy), false)
  })

  it('lists the four published categories and all 33 neighborhoods once each', () => {
    assert.deepEqual(guide.CATEGORIES.map((c) => c.name), ['Full Golf', 'Sports', 'Racquets', 'Social/Fitness'])
    assert.equal(guide.NEIGHBORHOODS.length, 33)
    assert.equal(new Set(guide.NEIGHBORHOODS.map((n) => n.name)).size, 33)
    for (const h of guide.HOME_TYPES) assert.ok(guide.NEIGHBORHOODS.some((n) => n.type === h.type), h.type)
  })

  it('fills every cell of the membership table', () => {
    for (const r of guide.MEMBERSHIP_TABLE) for (const c of guide.CATEGORIES) assert.ok(r.cells[c.key].length > 0, `${r.row} / ${c.name}`)
  })

  it('answers the buyer questions the brief names, with no duplicate', () => {
    for (const q of ['mandatory', 'full golf', 'association', 'neighborhoods', 'showing']) {
      assert.ok(guide.FAQS.some((f) => f.q.toLowerCase().includes(q)), `no FAQ about ${q}`)
    }
    assert.equal(new Set(guide.FAQS.map((f) => f.q)).size, guide.FAQS.length)
  })

  it('links Mirasol and PGA National for comparison', () => {
    assert.deepEqual(guide.COMPARE.map((c) => c.href).sort(), ['/communities/mirasol', '/communities/pga-national'])
  })
})

describe('BallenIsles inquiry topics', () => {
  it('registers the address-specific membership check', () => {
    assert.ok(isClubInquiryType('membership-check'))
    assert.equal(CLUB_INQUIRY_TYPES['membership-check'].label, 'Check Membership for a Specific Home')
    assert.match(CLUB_INQUIRY_TYPES['membership-check'].placeholder, /address or listing link/)
    assert.equal(inquiryClassification('BallenIsles', 'membership-fees'), 'BallenIsles — Membership Information')
  })
})
