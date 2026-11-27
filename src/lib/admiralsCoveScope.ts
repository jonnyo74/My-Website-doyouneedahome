// Every listing scope and search link for /communities/admirals-cove. The
// widget, the "open the full search" links, the price bands and the alert form
// all read from here, so they cannot disagree about what "Admirals Cove
// listings" means.
//
// HOW THIS WAS BUILT (2026-11-24, against portal.ylopo.com):
//  * Every location is a `searchValue` the Ylopo autocomplete returned for
//    "Admirals Cove", "Admirals", "Golf Village" and "Captains Way", or a plat
//    name read off a live listing (`listingAttribute.subdivisionInfo`).
//  * Each name was run alone, then as a union, with no price floor. The union
//    returned 25 rows on 24 addresses. Every address is on a street that Palm
//    Beach County files under an Admirals Cove plat.
//  * Nothing was missed: every listing in ZIP 33477 (223) and 33458 (191) was
//    paged through. The only Admirals Cove streets found outside the union were
//    second MLS numbers for homes already in it (156 Spyglass Lane, 466 Mariner
//    Drive). Several homes are entered in two or three MLS systems and the
//    provider shows each entry, so a home can appear twice. That is the feed,
//    not the scope.
//  * East Side and Golf Village separate cleanly in the provider's own
//    neighborhood field: "Admirals Cove" for the East Side and "Cove West -
//    Golf Village" for Golf Village (four of four on Village Way and Golf
//    Village Boulevard). The subdivision entry "Admirals Cove" is NOT used for
//    the East Side scope: agents enter it for Golf Village homes too.
//  * ZIP codes: East Side listings carry 33477, Golf Village listings 33458.
//
// FILTERS, TESTED THE SAME DAY:
//  * propertyTypes 'condo' (5 rows), 'house' (18) and price floors and
//    ceilings are honored. Boundaries are inclusive: a $3.0M home shows under
//    both "under $3M" and "$3M to $5M".
//  * `sa_is_waterfront` is honored but means any water: it returned Golf
//    Village lake homes, which have no boat access. It cannot stand in for
//    "has a dock". `sa_has_waterfront_intracoastal` returned 2 of the 15 or so
//    canal and Intracoastal homes listed. A boat-dock key returned nothing and
//    a golf-course key was ignored (same 25 rows as an invented key). So the
//    page offers no "waterfront", "private dock" or "golf-front" search link.
//    Those are sent by hand, checked against the lot.

import type { AbacoaScope, ScopeLocation } from './abacoaScopes'

const VERIFIED_ON = '2026-11-24'
const J = { city: 'Jupiter', state: 'FL' }
const nb = (neighborhood: string): ScopeLocation => ({ neighborhood, ...J })
const comm = (community: string): ScopeLocation => ({ community, ...J })
const sub = (subdivision: string): ScopeLocation => ({ subdivision, ...J })

export const ADMIRALS_COVE_SLUG = 'admirals-cove'

const EAST_LOCATIONS: ScopeLocation[] = [
  nb('Admirals Cove'),
  sub('Captains Way At Admirals Cove Condo'),
  sub('Spyglass At Admirals Cove Condo'),
  sub('Admirals Cove Par C'),
  sub('Admirals Cove Par A 1'),
]

const GOLF_VILLAGE_LOCATIONS: ScopeLocation[] = [
  nb('Cove West - Golf Village'),
  sub('Golf Village At Admirals Cove Par B'),
  sub('Golf Village Par A'),
]

/** Everything: both residential areas, every property type, any price. */
export const ADMIRALS_COVE_SCOPE: AbacoaScope = {
  slug: ADMIRALS_COVE_SLUG,
  name: 'Admirals Cove',
  kind: 'hub',
  status: 'verified',
  locations: [...EAST_LOCATIONS, ...GOLF_VILLAGE_LOCATIONS, comm('Admirals Cove'), sub('Admirals Cove')],
  evidence: [
    `${VERIFIED_ON}: 25 rows on 24 addresses, every one on a county-platted Admirals Cove street. Sweep of ZIP 33477 and 33458 found no Admirals Cove home outside the scope.`,
    'Open: homes entered in more than one MLS show once per entry. The provider does not merge them.',
  ],
}

export const EAST_SIDE_SCOPE: AbacoaScope = {
  slug: 'admirals-cove-east-side',
  name: 'the East Side of Admirals Cove',
  kind: 'village',
  status: 'provider-evidence',
  locations: EAST_LOCATIONS,
  evidence: [
    `${VERIFIED_ON}: 20 rows, all east of Alternate A1A. The split rests on the provider's neighborhood field, which an agent could enter differently on a future listing, so it is checked by street in the tests and on each data refresh.`,
  ],
}

export const GOLF_VILLAGE_SCOPE: AbacoaScope = {
  slug: 'admirals-cove-golf-village',
  name: 'Golf Village at Admirals Cove',
  kind: 'village',
  status: 'provider-evidence',
  locations: GOLF_VILLAGE_LOCATIONS,
  evidence: [
    `${VERIFIED_ON}: four rows, on Village Way and Golf Village Boulevard. Same caveat as the East Side: the split rests on the provider's neighborhood field.`,
  ],
}

// ── Search links ─────────────────────────────────────────────────────────

const SEARCH = 'https://search.doyouneedahome.com/search'

export interface SearchFilter {
  minPrice?: number
  maxPrice?: number
  propertyTypes?: ('house' | 'condo')[]
}

/** The full search site for a scope, with only filters the provider was shown to honor. */
export function admiralsSearchUrl(scope: AbacoaScope = ADMIRALS_COVE_SCOPE, filter: SearchFilter = {}): string {
  let url = `${SEARCH}?area=Jupiter&hvl=3&s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1`
  scope.locations.forEach((loc, i) => {
    for (const [k, v] of Object.entries(loc)) url += `&s[locations][${i}][${k}]=${encodeURIComponent(String(v))}`
  })
  if (filter.minPrice) url += `&s[minPrice]=${filter.minPrice}`
  if (filter.maxPrice) url += `&s[maxPrice]=${filter.maxPrice}`
  filter.propertyTypes?.forEach((t, i) => (url += `&s[propertyTypes][${i}]=${t}`))
  return url
}

/** Price bands, set from the spread of recorded sales and active listings on the build date. The page counts recorded sales per band from the data, so no description here can go stale. */
export const PRICE_BANDS: { label: string; filter: SearchFilter }[] = [
  { label: 'Under $3 million', filter: { maxPrice: 3_000_000 } },
  { label: '$3 million to $5 million', filter: { minPrice: 3_000_000, maxPrice: 5_000_000 } },
  { label: '$5 million to $10 million', filter: { minPrice: 5_000_000, maxPrice: 10_000_000 } },
  { label: '$10 million to $20 million', filter: { minPrice: 10_000_000, maxPrice: 20_000_000 } },
  { label: '$20 million and up', filter: { minPrice: 20_000_000 } },
]

export const ADMIRALS_LEAD_CTA = 'Receive New Admirals Cove Listings'

// ── Recently sold (live, so it never goes stale) ──────────────────────────
//
// TESTED 2026-11-27: `soldOnly: true` is the key the search site itself sets
// for its "Sold" filter. On the listings API it returned 114 closed sales for
// the full Admirals Cove scope, all on Admirals Cove streets, dated from
// November 2023 to the day before the test, newest sale first. The provider
// ignores every other status key tried (status, statuses, ylopoStatus, sold).
// On the search site, `orderBy=soldDate,desc` sorts the same way.

/** The sold widget's `data-search`: the full scope, sold only, newest first. */
export function soldSearch(limit = 6): Record<string, unknown> {
  return { locations: ADMIRALS_COVE_SCOPE.locations, limit, soldOnly: true }
}

/** Every Admirals Cove sale on the full search site, most recent first. */
export function admiralsSoldSearchUrl(): string {
  return (
    admiralsSearchUrl().replace('s[orderBy]=sourceCreationDate%2Cdesc', 's[orderBy]=soldDate%2Cdesc') +
    '&s[includePending]=f&s[soldOnly]=true'
  )
}
