import type { BBox, BuildingFootprint, LngLat } from './types'

/** Small geometry helpers used across the analyzer. All distances in metres. */

const EARTH_RADIUS_M = 6371008.8

export function haversineM(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)))
}

/** Bounding box of a circle of `radiusM` around a point, as [w, s, e, n]. */
export function bboxAround(lat: number, lng: number, radiusM: number): BBox {
  const dLat = (radiusM / EARTH_RADIUS_M) * (180 / Math.PI)
  // Longitude degrees shrink with latitude; the cosine guard stops a division
  // by zero at the poles, which this app will never see but costs nothing.
  const dLng = dLat / Math.max(0.01, Math.cos((lat * Math.PI) / 180))
  return [lng - dLng, lat - dLat, lng + dLng, lat + dLat]
}

/** Rounds a bbox to a fixed grid so nearby lookups share one cache key. */
export function quantiseBBox(bbox: BBox, decimals = 3): BBox {
  const f = 10 ** decimals
  return [
    Math.floor(bbox[0] * f) / f,
    Math.floor(bbox[1] * f) / f,
    Math.ceil(bbox[2] * f) / f,
    Math.ceil(bbox[3] * f) / f,
  ]
}

/** Area-weighted centroid of a ring, falling back to the vertex mean on
 *  degenerate rings (a zero-area sliver would divide by zero). */
export function ringCentroid(ring: LngLat[]): { lat: number; lng: number } {
  let twiceArea = 0
  let x = 0
  let y = 0
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const cross = ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1]
    twiceArea += cross
    x += (ring[j][0] + ring[i][0]) * cross
    y += (ring[j][1] + ring[i][1]) * cross
  }
  if (Math.abs(twiceArea) < 1e-12) {
    const sum = ring.reduce((acc, p) => ({ lng: acc.lng + p[0], lat: acc.lat + p[1] }), { lng: 0, lat: 0 })
    return { lng: sum.lng / ring.length, lat: sum.lat / ring.length }
  }
  return { lng: x / (3 * twiceArea), lat: y / (3 * twiceArea) }
}

/**
 * Ray-casting point-in-ring test.
 *
 * Hand-rolled rather than turf's because exposure sampling calls it tens of
 * thousands of times and this version allocates nothing.
 */
export function pointInRing(lng: number, lat: number, ring: LngLat[]): boolean {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    const straddles = yi > lat !== yj > lat
    if (straddles && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

/** The mapped building the searched address falls inside, if any. */
export function findContainingBuilding(
  buildings: BuildingFootprint[],
  lat: number,
  lng: number
): BuildingFootprint | null {
  for (const b of buildings) {
    if (pointInRing(lng, lat, b.ring)) return b
  }
  return null
}

/** The mapped building nearest a point, within `maxDistanceM`. */
export function findNearestBuilding(
  buildings: BuildingFootprint[],
  lat: number,
  lng: number,
  maxDistanceM: number
): BuildingFootprint | null {
  let best: BuildingFootprint | null = null
  let bestDistance = maxDistanceM
  for (const b of buildings) {
    const d = haversineM({ lat, lng }, ringCentroid(b.ring))
    if (d < bestDistance) {
      best = b
      bestDistance = d
    }
  }
  return best
}

/** Metres per degree of latitude / longitude at a given latitude. */
export function metresPerDegree(lat: number): { perLat: number; perLng: number } {
  const perLat = (Math.PI / 180) * EARTH_RADIUS_M
  return { perLat, perLng: perLat * Math.cos((lat * Math.PI) / 180) }
}
