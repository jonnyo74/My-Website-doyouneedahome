import { censusGeocoder } from './census'
import { nominatimGeocoder } from './nominatim'
import type { GeocodeResult, GeocoderId, GeocoderProvider } from '../types'

/**
 * Geocoder registry.
 *
 * Swapping providers is a one-line change here: write a module exporting a
 * `GeocoderProvider`, add it to `PROVIDERS`, and optionally name it in
 * `SUNSHADE_GEOCODER` to make it the default. Nothing outside this folder
 * knows which service answered — callers get a `GeocodeResult` carrying the
 * provider id, and that is the only place the choice surfaces.
 */

export const PROVIDERS: Record<GeocoderId, GeocoderProvider> = {
  census: censusGeocoder,
  nominatim: nominatimGeocoder,
}

/** Order tried when no explicit provider is requested. */
const DEFAULT_CHAIN: GeocoderId[] = ['census', 'nominatim']

function resolveChain(): GeocoderId[] {
  const preferred = process.env.SUNSHADE_GEOCODER as GeocoderId | undefined
  if (preferred && preferred in PROVIDERS) {
    return [preferred, ...DEFAULT_CHAIN.filter((id) => id !== preferred)]
  }
  return DEFAULT_CHAIN
}

export interface GeocodeOutcome {
  results: GeocodeResult[]
  /** Providers that threw, so the route can log a real outage rather than
   *  reporting it to the user as "address not found". */
  failures: { provider: GeocoderId; message: string }[]
}

/** Tries each provider in turn, stopping at the first with a match. */
export async function geocodeAddress(
  query: string,
  signal?: AbortSignal
): Promise<GeocodeOutcome> {
  const failures: GeocodeOutcome['failures'] = []

  for (const id of resolveChain()) {
    try {
      const results = await PROVIDERS[id].geocode(query, signal)
      if (results.length > 0) return { results, failures }
    } catch (error) {
      failures.push({
        provider: id,
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return { results: [], failures }
}
