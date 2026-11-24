// The one listing scope for /communities/jupiter-inlet-colony. The hero, the
// listings widget, the "open the full search" link, the empty and unavailable
// states and the alert form all read from here, so they cannot disagree about
// what "Colony listings" means.
//
// Self-contained apart from the shared scope helpers: the client listings
// component and the node:test suite both load it.
//
// HOW THIS WAS BUILT (2026-11-23, against portal.ylopo.com):
//  * Every location is a `searchValue` the Ylopo autocomplete returned for
//    q="Jupiter Inlet", "Jupiter Inlet Colony", "Jupiter Inlet Beach Colony"
//    and "Jupiter Inlet Beach".
//  * The MLS plat name, "Jupiter Inlet Beach Colony", is the entry that
//    carries the inventory. On the day it returned three actives and nothing
//    else: 122 Lighthouse Drive and 170 Beacon Lane (mailing city "Jupiter
//    Inlet Colony") and 187 Shelter Lane (mailing city "Jupiter"). The location
//    is pinned to city "Jupiter" because that is how Ylopo indexes the plat; it
//    still returns the homes whose mailing city is the Colony.
//  * The other entries returned nothing new that day and are kept because they
//    are provider-valid names for the same town: the bare city record (zero
//    rows today), Ylopo's own community label (two of the three), and a
//    truncated plat spelling. The union returns the same three homes.
//  * Nothing was missed: all 162 listings in ZIP 33469 (which the Colony
//    shares with Tequesta) were paged through and only those three sit on a
//    Colony street or under a Colony plat.
//  * Each of the three was checked against Palm Beach County records: the
//    Property Appraiser files all three parcels in the municipality "JUPITER
//    INLET COLONY", and their MLS coordinates fall inside the county's
//    municipal boundary polygon.
//  * "Jupiter Inlet Beach" (a community entry with no rows) is left out: it is
//    not confirmed to be the Colony. Jupiter Inlet Condo and Jupiter Inlet Cove
//    Condo are Jupiter buildings across the water and are left out on purpose.
//
// WHAT IS NOT OFFERED, AND WHY:
//  * Oceanfront and inlet/Intracoastal filters. The provider's
//    `sa_has_waterfront_ocean` flag returned 122 Lighthouse Drive, a home on
//    the west side of town that its own listing marks "not waterfront" (ocean
//    access only). `sa_has_waterfront` is ignored outright (same 162 rows as
//    an invented key). `sa_is_waterfront` and
//    `sa_has_waterfront_intracoastal` are honored but returned zero Colony
//    homes, so they cannot be shown to work here. With about 236 homes the
//    frontage is better read off the map than off an agent-entered flag.
//  * Price reductions. `orderBy=priceReductionDate` only sorts, and no
//    reduced-only filter is honored (`isPriceReduced` and `priceReduced`
//    return every row), so a "Price Reductions" link would just be the full
//    list again.
//  * Condos. The Town is single-family only; a condo filter returns nothing.

import type { AbacoaScope, ScopeLocation } from './abacoaScopes'

const VERIFIED_ON = '2026-11-23'
const AT_JUPITER = { city: 'Jupiter', state: 'FL' }

const locations: ScopeLocation[] = [
  { subdivision: 'Jupiter Inlet Beach Colony', ...AT_JUPITER },
  { subdivision: 'Jupiter Inlet Beach Colon', ...AT_JUPITER },
  { subdivision: 'Jupiter Inlet Colony', ...AT_JUPITER },
  { community: 'Jupiter Inlet Beach Colony', ...AT_JUPITER },
  { community: 'Jupiter Inlet Colony', ...AT_JUPITER },
  { city: 'Jupiter Inlet Colony', state: 'FL' },
]

export const COLONY_SLUG = 'jupiter-inlet-colony'

/** The one lead CTA label, used on every Colony form and button that opens one. */
export const COLONY_LEAD_CTA = 'Send Me Colony Listings & Recent Sales'

export const COLONY_SCOPE: AbacoaScope = {
  slug: COLONY_SLUG,
  name: 'Jupiter Inlet Colony',
  kind: 'town',
  status: 'verified',
  locations,
  // The same town, two mailing cities. Tequesta shares the ZIP but is never a
  // Colony mailing city, so a Tequesta row fails the scope check.
  cities: ['JUPITER', 'JUPITER INLET COLONY'],
  area: 'Jupiter Inlet Colony',
  evidence: [
    `${VERIFIED_ON}: three actives, all under plat "JUPITER INLET BEACH COLONY": 122 Lighthouse Drive (B26094695), 187 Shelter Lane (B26003439, mailing city Jupiter) and 170 Beacon Lane (R11044902). All three are county parcels in the municipality of Jupiter Inlet Colony.`,
    `${VERIFIED_ON}: sweep of all 162 listings in ZIP 33469 found no Colony home outside this scope and no outside home inside it.`,
    'Open: closed sales are not in this feed. Recent Colony sales need an MLS export.',
  ],
}

/** Nearby, not Colony: every Jupiter-area listing, for the labeled context link only. */
export const GREATER_JUPITER_SEARCH_URL =
  'https://search.doyouneedahome.com/search?area=Jupiter&hvl=3&s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Jupiter&s[locations][0][state]=FL'
