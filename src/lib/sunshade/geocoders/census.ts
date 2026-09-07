import type { GeocodeResult, GeocoderProvider } from '../types'

/**
 * US Census Bureau geocoder — the default provider.
 *
 * Chosen over the commercial options because it needs no key, has no published
 * rate limit, costs nothing, and its output is US federal public-domain data
 * with no attribution or caching restrictions to honour. It only knows US
 * addresses, which is exactly the coverage this tool needs.
 *
 * The trade is precision: Census matches against TIGER street centrelines and
 * interpolates along the address range, so a result lands on the street in
 * front of the house rather than on the roof. Good enough to pick the right
 * parcel, which is all the shadow model needs — but it is why every result is
 * reported as `interpolated` and why the map lets the user drag the pin.
 */

interface CensusMatch {
  matchedAddress?: string
  coordinates?: { x?: number; y?: number }
}

export const censusGeocoder: GeocoderProvider = {
  id: 'census',
  label: 'US Census Bureau',

  async geocode(query, signal) {
    const url = new URL('https://geocoding.geo.census.gov/geocoder/locations/onelineaddress')
    url.searchParams.set('address', query)
    url.searchParams.set('benchmark', 'Public_AR_Current')
    url.searchParams.set('format', 'json')

    const res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`Census geocoder returned ${res.status}`)

    const data = (await res.json()) as { result?: { addressMatches?: CensusMatch[] } }
    const matches = data.result?.addressMatches ?? []

    return matches.flatMap<GeocodeResult>((match) => {
      const lng = match.coordinates?.x
      const lat = match.coordinates?.y
      if (typeof lat !== 'number' || typeof lng !== 'number') return []
      return [
        {
          address: match.matchedAddress ?? query,
          lat,
          lng,
          provider: 'census',
          precision: 'interpolated',
        },
      ]
    })
  },
}
