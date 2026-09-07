/** Shared shapes for the Sun & Shade Analyzer. */

export interface LatLng {
  lat: number
  lng: number
}

/** [west, south, east, north] — the order Overpass, Turf and Leaflet agree on. */
export type BBox = [number, number, number, number]

/** GeoJSON position order: [lng, lat]. Named so call sites can't forget. */
export type LngLat = [number, number]

export type GeocoderId = 'census' | 'nominatim'

export interface GeocodeResult {
  /** Formatted address as the provider returned it. */
  address: string
  lat: number
  lng: number
  provider: GeocoderId
  /** `rooftop` — the provider matched a specific parcel or building.
   *  `interpolated` — position estimated along a street's address range.
   *  `approximate` — anything coarser (block, locality). */
  precision: 'rooftop' | 'interpolated' | 'approximate'
}

/**
 * A geocoding provider. Adding a new one (Mapbox, Google, Geoapify, Smarty)
 * means writing this interface and registering it in `geocoders/index.ts` —
 * nothing else in the app knows which provider answered.
 */
export interface GeocoderProvider {
  id: GeocoderId
  label: string
  /** Returns [] on no match. Throws only on transport/parse failure, so the
   *  registry can distinguish "nothing found" from "provider is down". */
  geocode(query: string, signal?: AbortSignal): Promise<GeocodeResult[]>
}

export interface BuildingFootprint {
  id: string
  /** Closed exterior ring, GeoJSON winding, [lng, lat]. */
  ring: LngLat[]
  tags: Record<string, string>
}

export interface PoolFootprint {
  id: string
  ring: LngLat[]
}

export interface SiteFeatures {
  buildings: BuildingFootprint[]
  pools: PoolFootprint[]
  /** Set when the upstream source failed or returned nothing — the UI says so
   *  rather than silently drawing an empty map. */
  note?: string
}

export type HeightSourceId = 'osm-height' | 'osm-levels' | 'parcel-living-area' | 'default'

export interface HeightEstimate {
  heightM: number
  source: HeightSourceId
  confidence: 'high' | 'medium' | 'low'
  /** Human-readable, shown in the UI so nobody mistakes a guess for a survey. */
  label: string
}

/** Parcel attributes from the Florida statewide cadastral layer. */
export interface ParcelInfo {
  parcelId: string | null
  address: string | null
  /** Total living area, square feet. 0 or null on vacant/common-area parcels. */
  livingAreaSqFt: number | null
  yearBuilt: number | null
  buildingCount: number | null
}

export interface SolarPosition {
  /** Compass bearing of the sun, degrees clockwise from true north. */
  azimuthDeg: number
  /** Degrees above the horizon. Negative when the sun is down. */
  elevationDeg: number
  /** Eight-point compass abbreviation, e.g. "SE". */
  compass: string
  isDaylight: boolean
}

export interface SolarDay {
  /** Minutes after local midnight. Null on the (impossible in Florida) polar cases. */
  sunriseMinutes: number | null
  solarNoonMinutes: number
  sunsetMinutes: number | null
  sunriseLabel: string
  solarNoonLabel: string
  sunsetLabel: string
  /** Length of the daylight window, in minutes. */
  daylightMinutes: number
}

export type ExposureRating = 'Low' | 'Moderate' | 'High'

export interface ExposureEstimate {
  rating: ExposureRating
  /** Fraction of sampled daylight minutes the point was in direct sun, 0–1. */
  sunFraction: number
  /** Present when the estimate could not be computed (no footprints, etc.). */
  note?: string
}

export interface ExposureSummary {
  morning: ExposureEstimate
  afternoon: ExposureEstimate
  yard: ExposureEstimate
  /** True when a mapped pool was used for the yard sample rather than a guess. */
  yardFromMappedPool: boolean
}
