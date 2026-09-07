import { cities, neighborhoods } from '@/lib/communities'
import { listings } from '@/lib/listings'

/**
 * Address suggestions for the analyzer's search box.
 *
 * What follows is shaped by a hard constraint that is worth writing down,
 * because it looks like it should be a solved problem and is not. Four zero-key
 * options were tested against real Florida addresses before this was written:
 *
 *   - Photon (komoot/OSM)  — returned Sewanee TN and Sewickley PA for
 *                            "6145 SE Audubon". Its OSM index has almost no US
 *                            house numbers. Unusable.
 *   - FL statewide cadastral, `PHY_ADDR1 LIKE '6145 SE AUDU%'`
 *                          — 55 seconds and zero rows. A prefix match over
 *                            10.8M parcels with no spatial filter is a full
 *                            scan. Unusable for typeahead.
 *   - US Census geocoder   — needs street AND city; returns zero matches for
 *                            "6145 SE Audubon" or "100 Australian Ave". It can
 *                            resolve a finished address, not predict one.
 *   - Nominatim            — its usage policy explicitly rules out
 *                            per-keystroke querying of the public instance.
 *
 * So street-address typeahead genuinely requires a keyed provider. Rather than
 * ship nothing until someone signs up for one, this module does the part that
 * needs no key at all: it predicts from data this site already owns — our own
 * listings, and every community we have a page for. Those are also the searches
 * most likely to be typed here.
 *
 * When `GEOAPIFY_API_KEY` is set, real street addresses are merged in ahead of
 * the local matches. When it is not, the box still predicts, just over a
 * smaller world, and never pretends otherwise.
 */

export type SuggestionKind = 'listing' | 'community' | 'address'

export interface Suggestion {
  /** Stable id, used as the React key and the option id for ARIA. */
  id: string
  /** What the user sees as the main line. */
  label: string
  /** Secondary line — city, region, or "Our listing". */
  detail: string
  kind: SuggestionKind
  /** The string handed to the geocoder if this option has no coordinates. */
  query: string
  /** Present when we already know exactly where this is, which lets selection
   *  skip geocoding entirely and land on the right roof. */
  lat?: number
  lng?: number
}

interface LocalEntry {
  id: string
  label: string
  detail: string
  kind: SuggestionKind
  query: string
  lat?: number
  lng?: number
  /** Lower-cased haystack, built once at module load. */
  haystack: string
}

/**
 * Built once per server instance, not per request. The communities module is
 * several thousand lines and must never be walked on a keystroke.
 */
const LOCAL_INDEX: LocalEntry[] = (() => {
  const entries: LocalEntry[] = []

  for (const listing of listings) {
    const label = `${listing.address}, ${listing.city}, ${listing.state} ${listing.zip}`
    entries.push({
      id: `listing-${listing.slug}`,
      label,
      detail: listing.subdivision ? `Our listing · ${listing.subdivision}` : 'Our listing',
      kind: 'listing',
      query: label,
      // Parcel-matched in listings.ts, so selecting one never touches a geocoder.
      lat: listing.lat,
      lng: listing.lng,
      haystack: [label, listing.subdivision ?? '', listing.citySlug].join(' ').toLowerCase(),
    })
  }

  for (const community of [...cities, ...neighborhoods]) {
    entries.push({
      id: `community-${community.slug}`,
      label: community.name,
      detail: community.region,
      kind: 'community',
      query: `${community.name}, FL`,
      // Only ~24 of the communities carry coordinates; the rest fall through to
      // the geocoder on selection, which handles a "Name, FL" query well.
      lat: community.lat,
      lng: community.lng,
      haystack: `${community.name} ${community.region} ${community.slug}`.toLowerCase(),
    })
  }

  return entries
})()

/**
 * Ranks a match. A prefix hit beats a hit buried mid-string, and our own
 * listings outrank a community of equal textual merit — someone typing "8804"
 * wants the house, not the subdivision it sits in.
 */
function score(entry: LocalEntry, needle: string): number {
  const at = entry.haystack.indexOf(needle)
  if (at < 0) return -1
  let value = at === 0 ? 100 : 60 - Math.min(at, 40)
  if (entry.kind === 'listing') value += 15
  return value
}

export function localSuggestions(query: string, limit = 6): Suggestion[] {
  const needle = query.trim().toLowerCase()
  if (needle.length < 2) return []

  return LOCAL_INDEX.map((entry) => ({ entry, value: score(entry, needle) }))
    .filter((row) => row.value >= 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)
    .map(({ entry }) => ({
      id: entry.id,
      label: entry.label,
      detail: entry.detail,
      kind: entry.kind,
      query: entry.query,
      lat: entry.lat,
      lng: entry.lng,
    }))
}

interface GeoapifyFeature {
  properties?: {
    place_id?: string
    formatted?: string
    address_line1?: string
    address_line2?: string
    lat?: number
    lon?: number
  }
}

/**
 * Street-address suggestions from Geoapify.
 *
 * Chosen as the reference keyed provider because its free tier (3,000 requests
 * a day) needs no card on file, which matters for a tool that is not itself
 * generating revenue. Swapping it for Mapbox or Google is a matter of writing
 * another function with this signature — the route and the UI do not care.
 *
 * Returns [] rather than throwing when no key is configured, so the search box
 * degrades to local suggestions instead of erroring.
 */
export async function addressSuggestions(
  query: string,
  signal?: AbortSignal,
  limit = 5
): Promise<Suggestion[]> {
  const key = process.env.GEOAPIFY_API_KEY
  if (!key) return []

  const url = new URL('https://api.geoapify.com/v1/geocode/autocomplete')
  url.searchParams.set('text', query)
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('type', 'street')
  url.searchParams.set('filter', 'countrycode:us')
  // Biases results toward South Florida without excluding the rest of the state.
  url.searchParams.set('bias', 'proximity:-80.1,26.8')
  url.searchParams.set('format', 'geojson')
  url.searchParams.set('apiKey', key)

  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`Geoapify autocomplete returned ${res.status}`)

  const data = (await res.json()) as { features?: GeoapifyFeature[] }
  return (data.features ?? []).flatMap<Suggestion>((feature, index) => {
    const p = feature.properties
    const label = p?.address_line1 ?? p?.formatted
    if (!label) return []
    return [
      {
        id: `address-${p?.place_id ?? index}`,
        label,
        detail: p?.address_line2 ?? 'Street address',
        kind: 'address',
        query: p?.formatted ?? label,
        lat: typeof p?.lat === 'number' ? p.lat : undefined,
        lng: typeof p?.lon === 'number' ? p.lon : undefined,
      },
    ]
  })
}
