// Every listing scope and search link for /communities/ballen-isles. The
// widget, the "open the full search" links, the type and price searches and
// the sold cards all read from here, so they cannot disagree about what
// "BallenIsles listings" means.
//
// HOW THIS WAS BUILT (2026-11-27, against portal.ylopo.com):
//  * The autocomplete knows only "Ballenisles" (community and subdivision) and
//    "Laguna At Ballenisles". Agents file BallenIsles homes under many other
//    names: community "Ballenisles Country Club", neighborhood names such as
//    "Sunset Bay" or "Victoria Bay" with subdivision "BALLENISLES", or a plat
//    name alone ("Palm Bay Club Condominium At Ballenisles", "Coral Cay",
//    "Hansen-JDM 1" for the Estates of St. James and St. George). Every name
//    below was read off a live or sold listing and run alone first.
//  * Community "Ballenisles" alone returned 8 of the 12 active listings. It
//    missed Palm Bay Club and The Palms (coach homes) and Sabal Pointe.
//  * Completeness: every active (337) and sold (2,789) listing in ZIP 33418 was
//    paged through and matched by street. The union below returned 12 active
//    and 197 sold (closed 2023-12-08 to 2026-11-20). Only two BallenIsles sales
//    were outside it (108 San Marita Way, 114 Palm Point Circle B): the provider
//    files them under names it will not match on a search. Every row the union
//    returned is on a BallenIsles street.
//  * Excluded on purpose, though inside the same ZIP and next to the gates:
//    Gardenia Isles, PGA National (Golf Club Estates, Glengary, Ironwood,
//    Barclay Club), Old Palm, Steeplechase, Cypress Hollow, Garden Lakes,
//    Midtown, Tamberlane, Longwood, Woodland Lakes and Hampton Cay. None of
//    their names is in the scope, and none of their listings came back.
//
// FILTERS, TESTED THE SAME DAY:
//  * propertyTypes 'house' returned the single-family homes only; 'condo'
//    returned the Palm Bay Club and The Palms coach homes. Price floors and
//    ceilings are honored and inclusive.
//  * There is no reliable golf-view, lake-view or "patio home" filter in the
//    feed, so the page offers none. Those are matched by hand from the
//    neighborhood, not by a search link.

import type { AbacoaScope, ScopeLocation } from './abacoaScopes'

const VERIFIED_ON = '2026-11-27'
const P = { city: 'Palm Beach Gardens', state: 'FL' }
const comm = (community: string): ScopeLocation => ({ community, ...P })
const sub = (subdivision: string): ScopeLocation => ({ subdivision, ...P })

export const BALLENISLES_SLUG = 'ballen-isles'

/** Everything inside the gates: every property type, any price. */
export const BALLENISLES_SCOPE: AbacoaScope = {
  slug: BALLENISLES_SLUG,
  name: 'BallenIsles',
  kind: 'hub',
  status: 'verified',
  cities: ['PALM BEACH GARDENS'],
  area: 'Palm Beach Gardens',
  // The provider matches "Ballenisles" by prefix, so pod plats ("BALLENISLES POD 8B")
  // and "BallenIsles - Coral Cay" come back; the page's own check must accept them.
  prefixes: ['BALLENISLES'],
  locations: [
    comm('Ballenisles'),
    comm('Ballenisles Country Club'),
    comm('Laguna At Ballenisles'),
    comm('Palm Bay Club North'),
    sub('Ballenisles'),
    sub('Ballenisles Country Club'),
    sub('Palms At Ballenisles Condo'),
    sub('Palm Bay Club Condo'),
    sub('Palm Bay Club Condominium'),
    sub('Palm Bay Club Condominium At Ballenisles'),
    sub('Sabal Pointe At Ballenisles'),
    sub('Crystal Bay'),
    sub('Coral Cay'),
    sub('Emerald Key'),
    sub('Sunset Bay'),
    sub('Windward Cove'),
    sub('Hansen-Jdm 1'),
  ],
  evidence: [
    `${VERIFIED_ON}: 12 active and 197 sold rows, every one on a BallenIsles street. ZIP 33418 sweep found two sales the provider will not match by name (108 San Marita Way, 114 Palm Point Circle B) and no active listing missing.`,
    'Open: a listing entered under a new plat or neighborhood name will be missed until its name is added here.',
  ],
}

// ── Search links ─────────────────────────────────────────────────────────

const SEARCH = 'https://search.doyouneedahome.com/search'

export interface SearchFilter {
  minPrice?: number
  maxPrice?: number
  propertyTypes?: ('house' | 'condo')[]
}

/** The full search site for BallenIsles, with only filters the provider was shown to honor. */
export function ballenIslesSearchUrl(filter: SearchFilter = {}): string {
  let url = `${SEARCH}?area=${encodeURIComponent('Palm Beach Gardens')}&hvl=3&s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1`
  BALLENISLES_SCOPE.locations.forEach((loc, i) => {
    for (const [k, v] of Object.entries(loc)) url += `&s[locations][${i}][${k}]=${encodeURIComponent(String(v))}`
  })
  if (filter.minPrice) url += `&s[minPrice]=${filter.minPrice}`
  if (filter.maxPrice) url += `&s[maxPrice]=${filter.maxPrice}`
  filter.propertyTypes?.forEach((t, i) => (url += `&s[propertyTypes][${i}]=${t}`))
  return url
}

/**
 * Home-type searches. 'condo' is how the MLS files the coach-home
 * condominiums (Palm Bay Club, The Palms); 'house' is everything detached,
 * patio homes included.
 */
export const TYPE_SEARCHES: { label: string; note: string; filter: SearchFilter }[] = [
  { label: 'Single-family and patio homes', note: 'Detached homes in every neighborhood but the two coach-home condominiums.', filter: { propertyTypes: ['house'] } },
  { label: 'Coach homes (condominiums)', note: 'Palm Bay Club and The Palms, the two coach-home neighborhoods.', filter: { propertyTypes: ['condo'] } },
]

/** Price bands, set from the spread of the 197 sales the scope returned on the build date (roughly $0.6M to $5.6M). */
export const PRICE_BANDS: { label: string; filter: SearchFilter }[] = [
  { label: 'Under $1 million', filter: { maxPrice: 1_000_000 } },
  { label: '$1 million to $2 million', filter: { minPrice: 1_000_000, maxPrice: 2_000_000 } },
  { label: '$2 million to $3.5 million', filter: { minPrice: 2_000_000, maxPrice: 3_500_000 } },
  { label: '$3.5 million and up', filter: { minPrice: 3_500_000 } },
]

export const BALLENISLES_LEAD_CTA = 'Receive New BallenIsles Listings'

// ── Recently sold (live, so it never goes stale) ──────────────────────────
// `soldOnly: true` is the only sold key the provider honors (see
// admiralsCoveScope.ts). Newest closing first.

/** The sold cards' search: the full scope, sold only. */
export function ballenIslesSoldSearch(limit = 12): Record<string, unknown> {
  return { locations: BALLENISLES_SCOPE.locations, limit, soldOnly: true }
}

/** Every BallenIsles sale on the full search site, most recent first. */
export function ballenIslesSoldSearchUrl(): string {
  return (
    ballenIslesSearchUrl().replace('s[orderBy]=sourceCreationDate%2Cdesc', 's[orderBy]=soldDate%2Cdesc') +
    '&s[includePending]=f&s[soldOnly]=true'
  )
}
