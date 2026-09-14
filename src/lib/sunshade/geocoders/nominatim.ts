import type { GeocodeResult, GeocoderProvider } from '../types'

/**
 * OpenStreetMap Nominatim — the fallback provider.
 *
 * Nominatim often beats Census on precision, because it can match a mapped
 * building or address node directly rather than interpolating along a street.
 * It is the fallback rather than the default purely because of its usage
 * policy: one request per second, a genuine identifying User-Agent, and no
 * heavy or commercial use of the public instance. This provider is only ever
 * called server-side, from a cached route, and only when Census finds nothing.
 *
 * Set `SUNSHADE_CONTACT_EMAIL` so the User-Agent identifies a real contact —
 * the policy asks for it, and an anonymous client is the one they block.
 */

interface NominatimPlace {
  lat?: string
  lon?: string
  display_name?: string
  osm_type?: string
  addresstype?: string
  category?: string
}

/**
 * Only these mean Nominatim matched a mapped structure.
 *
 * `place` was in this set and should not have been: for 2414 24th Lane it
 * returned addresstype `place` and a point 61 m from the property, in the road.
 * Claiming rooftop there is not cosmetic — it suppresses the "drag the pin"
 * hint precisely when the pin most needs dragging.
 */
const ROOFTOP_ADDRESS_TYPES = new Set(['house', 'building'])

export const nominatimGeocoder: GeocoderProvider = {
  id: 'nominatim',
  label: 'OpenStreetMap Nominatim',

  async geocode(query, signal) {
    const url = new URL('https://nominatim.openstreetmap.org/search')
    url.searchParams.set('q', query)
    url.searchParams.set('format', 'jsonv2')
    url.searchParams.set('limit', '5')
    url.searchParams.set('countrycodes', 'us')
    url.searchParams.set('addressdetails', '0')

    const contact = process.env.SUNSHADE_CONTACT_EMAIL ?? 'unknown-contact'
    const res = await fetch(url, {
      signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': `FloridaSunShadeAnalyzer/1.0 (${contact})`,
      },
    })
    if (!res.ok) throw new Error(`Nominatim returned ${res.status}`)

    const places = (await res.json()) as NominatimPlace[]
    return places.flatMap<GeocodeResult>((place) => {
      const lat = Number(place.lat)
      const lng = Number(place.lon)
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return []
      return [
        {
          address: place.display_name ?? query,
          lat,
          lng,
          provider: 'nominatim',
          precision: ROOFTOP_ADDRESS_TYPES.has(place.addresstype ?? '')
            ? 'rooftop'
            : 'interpolated',
        },
      ]
    })
  },
}
