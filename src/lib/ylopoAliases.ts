// Extra MLS names a community's homes are filed under, keyed by the name the
// listings widget is given (a community's `ylopoLocation ?? name`). The widget
// ORs every alias in alongside the main name.
//
// Listing agents type the subdivision field by hand, so one gated community can
// appear under its marketing name, its recorded plat name, or a plat name cut
// off partway. Lotus is the worked case: John's MLS export of its sales
// (2026-09-23) showed "LOTUS", "Lotus" and eight variants of
// "BRIDGES MIZNER PUD BRIDGES SOUTH PLAT …", and "Lotus" alone returned 8 of the
// 11 actives.
//
// Kept out of communities.ts on purpose: YlopoResultsWidget is rendered from
// client templates, and importing the full communities data there would ship
// it to the browser.
//
// Only add a name after checking it returns nothing outside the community. The
// widget pins every name to the page's city, which is what keeps The Bridges
// (the Delray Beach half of the Bridges Mizner PUD) out of Lotus.

export const YLOPO_ALIASES: Record<string, string[]> = {
  // Verified 2026-09-23: the union returns exactly the 11 actives in John's
  // export, all 33496.
  Lotus: [
    'Lotus-Bridges Mizner Pud Bridges South',
    'Lotus-Bridges Mizner Pud Bridges South Plat On',
    'Bridges Mizner Pud Bridges South Plat On',
    'Bridges Mizner Pud Bridges South Plat One',
    'Bridges Mizner Pud Bridges South Plat Three',
    'Bridges Mizner Pud Bridges South Plat Five',
    'Bridges Mizner Pud Bridges South Plat Six',
    'Bridges Mizner Pud Bridges South Plat Seven',
    'Bridges Mizner Pud Bridges S',
    'Bridges Mizner Pud Bridge',
  ],
}

export function getYlopoAliases(name: string): string[] {
  return YLOPO_ALIASES[name] ?? []
}

export type YlopoLocation = Record<string, string>

// Cities where a plain `{ city }` search returns the wrong homes, keyed by the
// city name the widget is given. The widget swaps in these locations and
// property types whenever it is called for that city with no neighborhood, so
// the community page and every blog article for the city pick it up.
//
// Singer Island (2026-09-26): condowpb.com covers the island's condos and this
// site covers its single-family homes, so the widget shows houses only. A plain
// "Singer Island" city search is almost all condos (48 of 48 checked), and
// Ylopo files most island houses under their West Palm Beach mailing city, by
// neighborhood: Palm Beach Isles, Yacht Harbor, Pine Point, Sugar Sands and the
// Palm Beach Shores plats. The union below returned 15 active houses, every one
// on the island (Palm Beach Isles and Palm Beach Shores), and nothing from
// mainland Riviera Beach. A bare Riviera Beach or West Palm Beach city search
// would pull in the mainland, so never add one here.
//
// Property type must be 'house'. 'SFR' is silently ignored by the listings API.
const WPB = 'West Palm Beach'
const RB = 'Riviera Beach'
const STUART = 'Stuart'

export const YLOPO_CITY_SEARCHES: Record<string, { locations: YlopoLocation[]; propertyTypes: string[] }> = {
  'Singer Island': {
    propertyTypes: ['house'],
    locations: [
      { community: 'Palm Beach Isles', city: WPB, state: 'FL' },
      { subdivision: 'Palm Beach Isles', city: WPB, state: 'FL' },
      { subdivision: 'Palm Beach Isles 1', city: WPB, state: 'FL' },
      { subdivision: 'Palm Beach Isles 2', city: WPB, state: 'FL' },
      { community: 'Yacht Harbor Estates', city: WPB, state: 'FL' },
      { subdivision: 'Yacht Harbor Est', city: WPB, state: 'FL' },
      { subdivision: 'Yacht Harbor Manor', city: WPB, state: 'FL' },
      { subdivision: 'Yacht Harbor Manor', city: RB, state: 'FL' },
      { subdivision: 'Pine Point', city: WPB, state: 'FL' },
      { community: 'Sugar Sands', city: WPB, state: 'FL' },
      { subdivision: 'Sugar Sands', city: WPB, state: 'FL' },
      { community: 'Sophia Seneca Estates', city: RB, state: 'FL' },
      { community: 'South Singer Island', city: WPB, state: 'FL' },
      { community: 'Palm Beach Shores', city: WPB, state: 'FL' },
      { subdivision: 'Palm Beach Shores', city: WPB, state: 'FL' },
      { subdivision: 'Palm Beach Shores', city: 'Palm Beach Shores', state: 'FL' },
      { city: 'Palm Beach Shores', state: 'FL' },
      { city: 'Singer Island', state: 'FL' },
      { neighborhood: 'Singer Island', city: RB, state: 'FL' },
    ],
  },
  // Port Salerno (2026-09-26): unincorporated, so Ylopo has no Port Salerno
  // city and a `{ city }` search returns nothing at all. Its homes are filed
  // under Stuart by subdivision or community. The 34997 ZIP is no substitute:
  // it returned SW Riviera Road and SW Regency Road, miles west. Rocky Point is included on purpose
  // (the Port Salerno blog series covers it); its homes are Stuart listings,
  // so Stuart's plain city search still shows them too. The union below
  // returned 10 active houses, 9 at $500k+, all between the Manatee Pocket,
  // Major Way and Railway Avenue. The names that returned nothing that day
  // (Port Salerno Village, Rocky Point Estates, Salerno Shores) are kept for
  // future listings.
  'Port Salerno': {
    propertyTypes: ['house'],
    locations: [
      { community: 'Port Salerno', city: STUART, state: 'FL' },
      { subdivision: 'Port Salerno', city: STUART, state: 'FL' },
      { subdivision: 'Port Salerno E', city: STUART, state: 'FL' },
      { community: 'Port Salerno Village', city: STUART, state: 'FL' },
      { subdivision: 'Port Salerno Village', city: STUART, state: 'FL' },
      { subdivision: 'Vista Salerno Revised', city: STUART, state: 'FL' },
      { subdivision: 'Salerno Shores', city: STUART, state: 'FL' },
      { community: 'Rocky Point', city: STUART, state: 'FL' },
      { community: 'Rocky Point / Tall Pines', city: STUART, state: 'FL' },
      { community: 'Rocky Point Estates', city: STUART, state: 'FL' },
      { subdivision: 'Rocky Point', city: STUART, state: 'FL' },
      { subdivision: 'Rocky Point Estates', city: STUART, state: 'FL' },
      { subdivision: 'Rocky Point Highlands', city: STUART, state: 'FL' },
    ],
  },
}

export function getYlopoCitySearch(city: string) {
  return YLOPO_CITY_SEARCHES[city]
}

// The same locations as search.doyouneedahome.com query params, for "view all"
// links and saved-search buttons.
export function ylopoLocationParams(locations: YlopoLocation[]): string {
  return locations
    .flatMap((loc, i) =>
      Object.entries(loc).map(([k, v]) => `&s[locations][${i}][${k}]=${encodeURIComponent(v)}`),
    )
    .join('')
}
