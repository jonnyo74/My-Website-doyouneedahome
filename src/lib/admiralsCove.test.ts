// Run with: npm test
//
// Fixture: scripts/fixtures/admirals-cove-ylopo-2026-11-24.json is a trimmed
// copy of the live Ylopo answer for the Admirals Cove names on 2026-11-24, plus
// twelve ZIP 33477 listings that are NOT in Admirals Cove. No network.

import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import fixture from '../../scripts/fixtures/admirals-cove-ylopo-2026-11-24.json' with { type: 'json' }
import { classifyProbe, inScope, scopeSearch, selectCards, type ProviderListing } from './abacoaScopes.ts'
import {
  ADMIRALS_COVE_SCOPE,
  EAST_SIDE_SCOPE,
  GOLF_VILLAGE_SCOPE,
  PRICE_BANDS,
  admiralsSearchUrl,
} from './admiralsCoveScope.ts'
import * as guide from './admiralsCove.ts'
import { CLUB_FEES, publishableFees, type ClubFeeRecord } from './clubFees.ts'
import { CLUB_INQUIRY_TYPES, inquiryClassification, isClubInquiryType } from './clubInquiry.ts'

type Row = ProviderListing & { price: number; address: { fullStreetAddress: string; city: string; postalCode: string } }
const homes = fixture.admiralsCove as unknown as Row[]
const nearby = fixture.nearby33477 as unknown as Row[]
const street = (l: Row) => l.address.fullStreetAddress
const isGolfVillageStreet = (l: Row) => /Village Way|Golf Village|Village Clubhouse/.test(street(l))

describe('Admirals Cove listing scopes', () => {
  it('keeps every Admirals Cove listing and no nearby one', () => {
    assert.ok(homes.length >= 20)
    for (const l of homes) assert.ok(inScope(l, ADMIRALS_COVE_SCOPE), `${street(l)} should be in scope`)
    for (const l of nearby) assert.equal(inScope(l, ADMIRALS_COVE_SCOPE), false, `${street(l)} is not Admirals Cove`)
  })

  it('splits East Side from Golf Village by street with no overlap', () => {
    const gv = homes.filter((l) => inScope(l, GOLF_VILLAGE_SCOPE))
    assert.ok(gv.length >= 3)
    for (const l of gv) assert.ok(isGolfVillageStreet(l), `${street(l)} is not a Golf Village street`)
    for (const l of homes.filter((l) => inScope(l, EAST_SIDE_SCOPE))) {
      assert.equal(isGolfVillageStreet(l), false, `${street(l)} is a Golf Village street in the East Side scope`)
    }
    // Every Golf Village street is found by the Golf Village scope.
    for (const l of homes.filter(isGolfVillageStreet)) assert.ok(inScope(l, GOLF_VILLAGE_SCOPE), street(l))
  })

  it('finds every distinct East Side address through the East Side scope', () => {
    const eastAddresses = new Set(homes.filter((l) => !isGolfVillageStreet(l)).map((l) => street(l).replace(/ \d+$/, '')))
    const found = new Set(homes.filter((l) => inScope(l, EAST_SIDE_SCOPE)).map((l) => street(l).replace(/ \d+$/, '')))
    for (const a of eastAddresses) assert.ok(found.has(a), `${a} is missing from the East Side scope`)
  })

  it('classifies results, a true empty and an out-of-scope answer differently', () => {
    assert.equal(classifyProbe(homes.slice(0, 6), ADMIRALS_COVE_SCOPE).state, 'results')
    assert.deepEqual(classifyProbe([], ADMIRALS_COVE_SCOPE), { state: 'empty' })
    assert.deepEqual(classifyProbe([homes[0], nearby[0]], ADMIRALS_COVE_SCOPE), { state: 'unavailable', reason: 'out-of-scope' })
    assert.equal(selectCards([...nearby, ...homes], ADMIRALS_COVE_SCOPE).length, 6)
  })

  it('builds search links with only filters the provider honors', () => {
    const all = decodeURIComponent(admiralsSearchUrl())
    assert.equal(/minPrice|maxPrice|amenities|propertyTypes/.test(all), false)
    assert.equal('minPrice' in scopeSearch(ADMIRALS_COVE_SCOPE), false)
    for (const l of ADMIRALS_COVE_SCOPE.locations) assert.equal(l.city, 'Jupiter')
    const condo = decodeURIComponent(admiralsSearchUrl(ADMIRALS_COVE_SCOPE, { propertyTypes: ['condo'] }))
    assert.ok(condo.endsWith('s[propertyTypes][0]=condo'))
    for (const b of PRICE_BANDS) {
      const url = decodeURIComponent(admiralsSearchUrl(ADMIRALS_COVE_SCOPE, b.filter))
      assert.equal(/amenities/.test(url), false, 'no waterfront, dock or golf amenity key is linked')
      assert.ok(/s\[(min|max)Price\]=\d+/.test(url))
    }
    // Bands tile the whole range with no gap.
    for (let i = 1; i < PRICE_BANDS.length; i++) assert.equal(PRICE_BANDS[i].filter.minPrice, PRICE_BANDS[i - 1].filter.maxPrice)
  })
})

describe('Club fee policy', () => {
  const base: ClubFeeRecord = {
    community: 'x', category: 'Golf', initiationFee: 1, annualDues: 1,
    effectiveFrom: '2026-11-01', effectiveTo: '2027-10-31', source: 'club', verifiedOn: '2026-11-24', status: 'verified',
  }
  const on = (d: string) => new Date(`${d}T12:00:00Z`)

  it('publishes nothing today', () => {
    assert.deepEqual(publishableFees('admirals-cove'), [])
    assert.equal(CLUB_FEES.filter((r) => r.status === 'verified').length, 0)
  })

  it('shows a verified record only inside its dates', () => {
    assert.equal(publishableFees('x', on('2027-01-15'), [base]).length, 1)
    assert.equal(publishableFees('x', on('2026-10-31'), [base]).length, 0, 'not before it starts')
    assert.equal(publishableFees('x', on('2027-11-01'), [base]).length, 0, 'not after it expires')
    assert.equal(publishableFees('y', on('2027-01-15'), [base]).length, 0, 'not for another community')
  })

  it('never shows an internal, superseded or open-ended record', () => {
    assert.equal(publishableFees('x', on('2027-01-15'), [{ ...base, status: 'internal' }]).length, 0)
    assert.equal(publishableFees('x', on('2027-01-15'), [{ ...base, status: 'superseded' }]).length, 0)
    assert.equal(publishableFees('x', on('2027-01-15'), [{ ...base, effectiveTo: '' }]).length, 0)
  })

  it('keeps dollar fee figures out of the evergreen copy', () => {
    // Recorded sale prices are data, not copy, and are formatted elsewhere.
    const copy = JSON.stringify([
      guide.QUICK_FACTS, guide.SIDES.filter((r) => !r.row.startsWith('Recorded sales')), guide.ENCLAVES, guide.MEMBERSHIP_STRUCTURE,
      guide.MEMBERSHIP_QUESTIONS, guide.COSTS, guide.DOCK_RULES, guide.BOAT_CHECKLIST, guide.AMENITIES,
      guide.DUE_DILIGENCE, guide.PROJECTS, guide.COMPARE, guide.FAQS, guide.NOT_VERIFIED,
    ])
    assert.equal(/\$\s?\d/.test(copy), false, 'a dollar figure is hard-coded in the copy')
  })
})

describe('Club inquiry types', () => {
  it('accepts only registered keys', () => {
    assert.ok(isClubInquiryType('membership-fees'))
    for (const bad of ['', 'Membership', '<script>', 'constructor', 'toString', null, undefined, 3]) {
      assert.equal(isClubInquiryType(bad), false, String(bad))
    }
  })

  it('classifies a membership request by community', () => {
    assert.equal(inquiryClassification('Admirals Cove', 'membership-fees'), 'Admirals Cove — Membership Information')
    assert.equal(CLUB_INQUIRY_TYPES['membership-fees'].tag, 'Membership Fee Request')
    assert.equal(CLUB_INQUIRY_TYPES['membership-fees'].label, 'Request Current Membership Fees')
  })
})

describe('Admirals Cove county figures and copy', () => {
  it('reads plausible counts from the generated file', () => {
    assert.equal(guide.COUNTS.residences, guide.COUNTS.east + guide.COUNTS.golfVillage)
    assert.ok(guide.COUNTS.residences > 800 && guide.COUNTS.residences < 950)
    assert.equal(guide.COUNTS.condos.reduce((s, c) => s + c.units, 0), guide.COUNTS.eastCondos)
    assert.equal(guide.COUNTS.waterLots.golfVillage, 0, 'the copy says Golf Village has no navigable water')
    assert.equal(guide.FLOOD.gvOther, 0, 'the copy says every Golf Village parcel is zone X or unmapped')
    assert.ok(guide.COUNTS.waterLots.eastHouses < guide.COUNTS.waterLots.eastHousesTotal)
  })

  it('uses the official spelling everywhere except where it explains the legal names', () => {
    const copy = JSON.stringify([guide.QUICK_FACTS, guide.SIDES, guide.MEMBERSHIP_STRUCTURE, guide.COSTS, guide.AMENITIES, guide.DUE_DILIGENCE, guide.COMPARE, guide.NOT_VERIFIED])
    assert.equal(/Admiral['’]s Cove/.test(copy), false)
    assert.equal(guide.FAQS.filter((f) => /Admiral’s Cove/.test(f.a)).length, 1)
  })

  it('answers at least the twenty-two buyer questions, with no duplicate', () => {
    assert.ok(guide.FAQS.length >= 22)
    assert.equal(new Set(guide.FAQS.map((f) => f.q)).size, guide.FAQS.length)
  })

  it('summarizes sales by segment and withholds a median from a thin one', () => {
    const mk = (price: number, area: 'east' | 'golf-village', type: 'house' | 'condo', water: boolean | null) =>
      ({ date: '2026-03-01', address: `${price} Test Lane`, price, area, type, water })
    const rows = [
      mk(9_000_000, 'east', 'house', true), mk(7_000_000, 'east', 'house', true), mk(3_000_000, 'east', 'condo', null),
      mk(4_000_000, 'golf-village', 'house', false), mk(5_000_000, 'east', 'house', false),
    ]
    const s = guide.salesSummary(rows, new Date(`${guide.REVIEWED.recordsIso}T12:00:00Z`))!
    assert.equal(s.all.count, 5)
    assert.equal(s.all.median, 5_000_000)
    assert.equal(s.east.count, 4)
    assert.equal(s.east.median, undefined, 'four sales is too few for a median')
    assert.equal(s.golfVillage.low, 4_000_000)
    assert.equal(s.stale, false)
    assert.equal(guide.salesSummary(rows.slice(0, 2)), null)
  })

  it('labels the sales historical once the records are old', () => {
    const later = new Date(new Date(`${guide.REVIEWED.recordsIso}T12:00:00Z`).getTime() + (guide.STALE_AFTER_DAYS + 1) * 86_400_000)
    assert.equal(guide.salesSummary(guide.SALES, later)?.stale, true)
  })

  it('keeps every recorded sale inside the stated window, priced and classified', () => {
    for (const s of guide.SALES) {
      assert.ok(s.price > 100_000)
      assert.ok(['east', 'golf-village'].includes(s.area))
      if (s.area === 'golf-village') assert.notEqual(s.water, true, `${s.address}: Golf Village has no navigable water`)
    }
  })
})
