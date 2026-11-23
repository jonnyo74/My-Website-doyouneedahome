// One verified listing scope per Abacoa route. The widget, the "open the full
// search" link, the empty-state probe and the alert request all read from here,
// so they cannot disagree about what a page means.
//
// Self-contained on purpose (no imports): the client listings component and the
// node:test suite both load it.
//
// HOW THESE WERE BUILT (2026-11-18, against portal.ylopo.com):
//  * Every location below is a `searchValue` the Ylopo autocomplete returned
//    (portal.ylopo.com/api/1.0/autocomplete?q=<name>&partyWebsite=search.doyouneedahome.com),
//    or a name read off a live listing's `listingAttribute.subdivisionInfo`
//    that the autocomplete had not surfaced yet (it caps at ten rows). Nothing
//    is inferred from marketing copy.
//  * Every location is pinned to Jupiter, FL. A name alone is never enough:
//    "Martinique" also exists in Coconut Creek, Homestead and Miramar, and
//    "Windsor Park" in North Palm Beach.
//  * Locations are OR'd by the provider (confirmed: a union query returns the
//    union of its parts and nothing outside it). Each village's set was run
//    with no price floor and every returned listing's MLS subdivision was
//    checked against the village. No listing appeared under two villages.
//  * The bare community or neighborhood name is left out wherever it is common
//    outside Abacoa ("Tuscany", "Valencia"): the "... At Abacoa" subdivision
//    entries carry the same homes without the ambiguity.
//
// The old widget asked for `{community|neighborhood|subdivision: <name>}` per
// name with a $400K floor. That is why Martinique and Windsor Park rendered
// nothing (their homes are filed as "Martinique At Abacoa 1" and "Windsor Park
// At Abacoa Pl"), and why the hub, which only asked for the name "Abacoa",
// missed 9 of the 29 village homes and 16 of the 41 in the master scope.

export type ScopeLocation = { community?: string; neighborhood?: string; subdivision?: string; city: string; state: string }

export type ScopeStatus =
  /** Every entry came from the provider and every returned listing was checked. */
  | 'verified'
  /** Entries are provider-valid, but one plat is shared and needs MLS confirmation. */
  | 'provider-evidence'

export interface AbacoaScope {
  slug: string
  /** Name used in visitor-facing copy: "No active homes for sale in {name} right now". */
  name: string
  kind: 'hub' | 'village' | 'town'
  locations: ScopeLocation[]
  /**
   * Mailing cities a listing in this scope may carry, normalized (see
   * normalizeName). Defaults to Jupiter. Jupiter Inlet Colony sets two: the MLS
   * files the same town under "Jupiter" and "Jupiter Inlet Colony".
   */
  cities?: string[]
  /** `area` label on the full-search URL. Defaults to Jupiter. */
  area?: string
  status: ScopeStatus
  /** What was checked, and what is still open. Surfaced in the validation matrix. */
  evidence: string[]
}

const CITY = 'Jupiter'
const STATE = 'FL'
const c = (community: string): ScopeLocation => ({ community, city: CITY, state: STATE })
const n = (neighborhood: string): ScopeLocation => ({ neighborhood, city: CITY, state: STATE })
const s = (subdivision: string): ScopeLocation => ({ subdivision, city: CITY, state: STATE })

const VERIFIED_ON = '2026-11-18'

const VILLAGE_SCOPES: AbacoaScope[] = [
  {
    slug: 'antigua',
    name: 'Antigua',
    kind: 'village',
    status: 'verified',
    locations: [
      // Subdivision (MLS plat) entries only. Ylopo's community label "Antigua" is
      // stuck on homes in plat Abacoa Town Center 3, which the MLS says is not Antigua.
      s('Antigua At Abacoa'), s('Antigua At Abacoa Town Center'),
    ],
    evidence: [
      `${VERIFIED_ON}: zero actives, confirmed against the MLS by John Oliver. Ylopo labels three Parkside and Greenway Drive homes "Antigua" in their community field, but the MLS files them under plat "Abacoa Town Center 3", which is not Antigua, so that plat is excluded here. They still count in the hub.`,
      'Live/work (commercial-use) eligibility is not filterable.',
    ],
  },
  {
    slug: 'canterbury-place',
    name: 'Canterbury Place',
    kind: 'village',
    status: 'verified',
    locations: [n('Canterbury Place'), c('Canterbury Place'), c('Canterbury Place At Abacoa'), s('Canterbury Place')],
    evidence: [
      `${VERIFIED_ON}: 143 Killarney Court (community "Canterbury Place At Abacoa") and 599 Dakota Drive (subdivision "Canterbury Place"). Both belong here; 599 Dakota Drive is a street name, not a Dakota subdivision.`,
    ],
  },
  {
    slug: 'charleston-court',
    name: 'Charleston Court',
    kind: 'village',
    status: 'verified',
    locations: [n('Charleston Court'), c('Charleston Court'), s('Charleston Court At Abacoa'), s('Charleston Court At Abaco')],
    evidence: [
      `${VERIFIED_ON}: two actives on Legare Court under "Charleston Court At Abacoa". "Charleston Court At Abaco" is a real, truncated MLS subdivision the autocomplete returns.`,
    ],
  },
  {
    slug: 'mallory-creek',
    name: 'Mallory Creek',
    kind: 'village',
    status: 'verified',
    locations: [
      c('Mallory Creek'), c('Mallory Creek At Abacoa'), c('Mallory Creek At Abacoa 01'),
      s('Mallory Creek'), s('Mallory Creek At Abacoa'), s('Mallory Creek At Abacoa 01'),
      s('Mallory Creek At Abacoa 1'), s('Mallory Creek At Abacoa 2'),
      s('Mallory Creek At Abacoa 2 1'), s('Mallory Creek At Abacoa 2 2'),
    ],
    evidence: [
      `${VERIFIED_ON}: four actives across phases "Mallory Creek At Abacoa 2" and "... 01". The "01" spelling was read off 1421 Windley Key Way; the old widget could not see it.`,
    ],
  },
  {
    slug: 'martinique',
    name: 'Martinique',
    kind: 'village',
    status: 'verified',
    locations: [
      c('Martinique'), c('Martinique At Abacoa'),
      s('Martinique At Abacoa 1'), s('Martinique At Abacoa 2'), s('Martinique At Abacoa Pl 2'),
    ],
    evidence: [
      `${VERIFIED_ON}: one active, 3277 E Community Drive, under "Martinique At Abacoa 1". The old plain-name query found none because no listing carries the bare name.`,
      'Open: BeachesMLS B26088730 (3416 W Community Dr) is not in the Ylopo feed under any Martinique subdivision on this date. Confirm its status and IDX eligibility with the MLS; the filter is not the cause.',
    ],
  },
  {
    slug: 'newhaven',
    name: 'Newhaven',
    kind: 'village',
    status: 'verified',
    locations: [
      c('Newhaven'), c('Newhaven At Abacoa'), n('New Haven'),
      s('Newhaven'), s('Newhaven At Abacoa'), s('Newhaven 7a'), s('Newhaven 7a At Abacoa'),
      s('Newhaven 7b Ph 1'), s('Newhaven 7b Ph 2'), s('Newhaven 07b Ph 01 At Abacoa'), s('Abacoa New Haven'), s('New Haven'),
    ],
    evidence: [
      `${VERIFIED_ON}: five in scope across phases 7A, 7B Ph 1, 7B Ph 2, "07b Ph 01 At Abacoa" and plain "New Haven". The old widget saw two.`,
      '198 Poinciana Drive (B26101402, "Newhaven 07b Ph 01 At Abacoa") is the phase the widget never asked for. Its MLS status is Coming Soon, not Active.',
    ],
  },
  {
    slug: 'osceola-woods',
    name: 'Osceola Woods',
    kind: 'village',
    status: 'verified',
    locations: [c('Osceola Woods'), c('Osceola Woods At Abacoa'), s('Osceola Woods')],
    evidence: [
      `${VERIFIED_ON}: three actives under subdivision "Osceola Woods" (Indian Crossing Circle, Apalachee Lane, University Boulevard).`,
    ],
  },
  {
    slug: 'tuscany',
    name: 'Tuscany',
    kind: 'village',
    status: 'verified',
    locations: [c('Tuscany At Abacoa'), s('Tuscany At Abacoa'), s('Tuscany At Abacoa 2')],
    evidence: [
      `${VERIFIED_ON}: five actives under "Tuscany At Abacoa" and "Tuscany At Abacoa 2". The bare "Tuscany" community and neighborhood are left out: the At Abacoa entries return the same five.`,
    ],
  },
  {
    slug: 'valencia',
    name: 'Valencia',
    kind: 'village',
    status: 'verified',
    locations: [c('Valencia At Abacoa'), s('Valencia At Abacoa'), s('Abacoa - Valencia')],
    evidence: [
      `${VERIFIED_ON}: one listing, 136 Santiago Drive, under "Valencia At Abacoa". Its MLS status is Coming Soon, not Active. Tied to the Abacoa subdivision names only, because "Valencia" is a common name.`,
    ],
  },
  {
    slug: 'windsor-park',
    name: 'Windsor Park',
    kind: 'village',
    status: 'verified',
    locations: [
      c('Windsor Park'), c('Windsor Park Abacoa'),
      s('Windsor Park At Abacoa Pl'), s('Windsor Park At Abacoa Pl No 1'), s('Windsor Park At Abacoa Pl No 3'),
    ],
    evidence: [
      `${VERIFIED_ON}: three actives under "Windsor Park At Abacoa Pl" and "... Pl No 3". The old widget returned none; no listing carries the bare name. Pinned to Jupiter, which keeps out Windsor Park in North Palm Beach.`,
      'Open: a "Pl No 2" subdivision was not found in the provider; add it if the MLS uses it.',
    ],
  },
]

// For-sale Abacoa stock that has no village page of its own. Inventory only:
// the hub counts it, no route is created for it.
const OTHER_ABACOA_LOCATIONS: ScopeLocation[] = [
  c('Abacoa'), n('Abacoa'),
  s('Somerset At Abacoa Condo'),
  s('Abacoa Town Center 3'),
  s('Village At Abacoa Condo'),
  s('Cambridge At Abacoa'),
  s('Greenwich'), s('Greenwich Residential , Abacoa'),
  s('The Island At Abacoa'), s('San Palermo'), s('Abacoa Pl 1'),
]

const locKey = (l: ScopeLocation) => JSON.stringify([l.community, l.neighborhood, l.subdivision, l.city, l.state])

function unionLocations(lists: ScopeLocation[][]): ScopeLocation[] {
  const seen = new Set<string>()
  const out: ScopeLocation[] = []
  for (const l of lists.flat()) {
    const k = locKey(l)
    if (!seen.has(k)) {
      seen.add(k)
      out.push(l)
    }
  }
  return out
}

const HUB_SCOPE: AbacoaScope = {
  slug: 'abacoa',
  name: 'Abacoa',
  kind: 'hub',
  status: 'provider-evidence',
  // The master community is the union of every village plus the for-sale
  // stock with no village page. Asking for the name "Abacoa" alone returned 25
  // listings on 2026-11-18 while the union returned 41.
  // Subdivision entries only, plus the two names "Abacoa" itself goes by. Each
  // village's own scope keeps its community and neighborhood entries; the hub
  // drops them because a 68-entry query makes a 7.6 KB search URL, which is too
  // close to the 8 KB limit many servers enforce. Verified on 2026-11-18: the
  // pruned set returns the same 41 listings as the full union.
  locations: unionLocations([
    VILLAGE_SCOPES.flatMap((v) => v.locations.filter((l) => l.subdivision)),
    OTHER_ABACOA_LOCATIONS,
  ]),
  evidence: [
    `${VERIFIED_ON}: union of the subdivision entries of all ten village scopes plus Somerset At Abacoa Condo, Abacoa Town Center 3, The Village At Abacoa Condo, Cambridge At Abacoa and Greenwich. The plain "Abacoa" query returned 25 of the 41; 16 were invisible to it, nine of them village homes.`,
    'Open: The Island At Abacoa, San Palermo and Abacoa Pl 1 are valid provider names with no actives today, so their eligibility (rental, senior or for-sale) is unconfirmed. Greenwich includes live/work townhomes: confirm which are residential. Somerset and Village at Abacoa have no page on this site.',
  ],
}

export const ABACOA_SCOPES: Record<string, AbacoaScope> = Object.fromEntries(
  [HUB_SCOPE, ...VILLAGE_SCOPES].map((sc) => [sc.slug, sc]),
)

/** Routes under /communities/ that read a scope. Dakota has none on purpose. */
export const ABACOA_SCOPE_SLUGS = Object.keys(ABACOA_SCOPES)

export function getAbacoaScope(slug: string): AbacoaScope | undefined {
  return ABACOA_SCOPES[slug]
}

// ── Provider requests ─────────────────────────────────────────────────────

export const CARD_LIMIT = 6
/** The listings API returns at most ten rows per page whatever `limit` says. */
export const PROVIDER_PAGE_SIZE = 10

/**
 * The widget's `data-search` payload. There is deliberately no `minPrice`: the
 * agreed scope is every active residential listing, so a $400K floor would hide
 * Somerset and Village at Abacoa condos and most Antigua and Osceola Woods
 * townhomes. Property type is left unset so houses, townhomes and condos all
 * qualify.
 */
export function scopeSearch(scope: AbacoaScope, limit: number = CARD_LIMIT): Record<string, unknown> {
  return { locations: scope.locations, limit, sortBy: 'listdate' }
}

function locationParams(locations: ScopeLocation[]): string {
  return locations
    .flatMap((loc, i) =>
      Object.entries(loc).map(([k, v]) => `&s[locations][${i}][${k}]=${encodeURIComponent(String(v))}`),
    )
    .join('')
}

/** The full search for the same scope: same locations, no price floor. */
export function scopeFullSearchUrl(scope: AbacoaScope): string {
  return (
    `https://search.doyouneedahome.com/search?area=${encodeURIComponent(scope.area ?? 'Jupiter')}&hvl=3&s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1` +
    locationParams(scope.locations)
  )
}

/** JSONP url for the same search the widget makes; used to tell empty from broken. */
export function scopeProbeUrl(scope: AbacoaScope, callback: string): string {
  // Byte-for-byte the widget's own search. The provider caches identical
  // queries for a few minutes (a new listing showed under limit 9 while limit
  // 10 still returned the old answer), so the probe must share the widget's
  // cache entry or the two can disagree about the same moment.
  const search = scopeSearch(scope)
  return (
    'https://portal.ylopo.com/api/1.0/listings?partyWebsite=search.doyouneedahome.com' +
    `&s=${encodeURIComponent(JSON.stringify(search))}&callback=${encodeURIComponent(callback)}`
  )
}

// ── Membership and eligibility (pure; used by the probe and the tests) ───────

export interface ProviderListing {
  /** Ylopo's own listing id: the number in each widget card's /search/detail/<id> link. */
  id?: number | string
  mlsNumber?: string
  address?: { city?: string; stateOrProvince?: string }
  addressStandard?: { neighborhoodName?: string; communityName?: string }
  listingAttribute?: { subdivisionInfo?: string[] }
  listingStatus?: { displayStatus?: string; ylopoStatus?: string }
  listingPropertyType?: { displayPropertyType?: string }
}

export const normalizeName = (v: string | undefined | null): string =>
  (v ?? '').toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim()

/** True when the listing sits in one of the scope's named places, in one of its cities. */
export function inScope(listing: ProviderListing, scope: AbacoaScope): boolean {
  const city = normalizeName(listing.address?.city)
  if (city && !(scope.cities ?? ['JUPITER']).includes(city)) return false
  const subs = (listing.listingAttribute?.subdivisionInfo ?? []).map(normalizeName)
  const nb = normalizeName(listing.addressStandard?.neighborhoodName)
  const comm = normalizeName(listing.addressStandard?.communityName)
  return scope.locations.some((l) => {
    if (l.subdivision) return subs.includes(normalizeName(l.subdivision))
    if (l.community) return comm === normalizeName(l.community)
    if (l.neighborhood) return nb === normalizeName(l.neighborhood)
    // A bare { city } entry is a municipality: the mailing city must name it.
    return city === normalizeName(l.city)
  })
}

const INELIGIBLE_TYPE = /rental|lease|land|vacant|commercial|business/i

/** Strictly "Active": Coming Soon, pending, contingent and sold do not qualify. */
export function isStrictActive(listing: ProviderListing): boolean {
  return listing.listingStatus?.displayStatus === 'Active'
}

export function isEligibleType(listing: ProviderListing): boolean {
  return !INELIGIBLE_TYPE.test(listing.listingPropertyType?.displayPropertyType ?? '')
}

/**
 * What the cards should be: in scope, strictly Active, an eligible type, one
 * row per MLS number (aliases overlap), and only then cut to the card limit, so
 * a filtered-out row can never use up a slot.
 */
export function selectCards(listings: ProviderListing[], scope: AbacoaScope, limit: number = CARD_LIMIT): ProviderListing[] {
  const seen = new Set<string>()
  const out: ProviderListing[] = []
  for (const l of listings) {
    if (!inScope(l, scope) || !isStrictActive(l) || !isEligibleType(l)) continue
    const id = l.mlsNumber ?? ''
    if (id && seen.has(id)) continue
    seen.add(id)
    out.push(l)
    if (out.length >= limit) break
  }
  return out
}

export type ProbeOutcome =
  /** Provider answered and the scope has rows. */
  | { state: 'results'; total: number; active: number; comingSoon: number; hiddenIds: string[] }
  /** Provider answered, rows are zero: a verified empty. */
  | { state: 'empty' }
  /** Provider failed, or returned rows outside the scope, so nothing can be claimed. */
  | { state: 'unavailable'; reason: 'error' | 'timeout' | 'out-of-scope' | 'malformed' }

/**
 * Turns a raw provider answer into a state. `raw` is the parsed JSONP body, or
 * null when the request failed or timed out. A provider that falls back to
 * "nearby" results would put out-of-scope rows in the answer; that is treated
 * as unverifiable rather than shown.
 */
export function classifyProbe(
  raw: unknown,
  scope: AbacoaScope,
  failure?: 'error' | 'timeout',
): ProbeOutcome {
  if (failure) return { state: 'unavailable', reason: failure }
  if (!Array.isArray(raw)) return { state: 'unavailable', reason: 'malformed' }
  if (raw.length === 0) return { state: 'empty' }
  const rows = raw as ProviderListing[]
  if (rows.some((r) => !inScope(r, scope))) return { state: 'unavailable', reason: 'out-of-scope' }
  const active = rows.filter(isStrictActive).length
  const comingSoon = rows.filter((r) => r.listingStatus?.displayStatus === 'Coming Soon').length
  // Ylopo's widget cannot filter by status, so the page hides these cards itself.
  const hiddenIds = rows.filter((r) => !isStrictActive(r) && r.id != null).map((r) => String(r.id))
  return { state: 'results', total: rows.length, active, comingSoon, hiddenIds }
}
