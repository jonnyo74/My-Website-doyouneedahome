import {
  EXPOSURE_NEIGHBOUR_RADIUS_M,
  EXPOSURE_SAMPLE_MINUTES,
  MIN_SHADOW_ELEVATION_DEG,
} from './config'
import { haversineM, metresPerDegree, pointInRing, ringCentroid } from './geo'
import { shadowForFootprint } from './shadows'
import { solarPositionAtLocalTime } from './solar'
import type {
  BuildingFootprint,
  ExposureEstimate,
  ExposureRating,
  ExposureSummary,
  HeightEstimate,
  LngLat,
  PoolFootprint,
  SolarDay,
} from './types'

/**
 * Morning / afternoon / yard sun exposure.
 *
 * These are honest estimates, not measurements, and the method is worth stating
 * because the number is only as good as it: we scatter sample points across the
 * open ground of the lot, step through the daylight hours at
 * `EXPOSURE_SAMPLE_MINUTES` intervals, and at each step ask whether each point
 * falls inside the shadow of a nearby mapped building. The share of samples in
 * direct sun becomes Low / Moderate / High.
 *
 * It therefore accounts for the house itself and its neighbours — and for
 * nothing else. Trees, in particular, are invisible to it, and in Florida a
 * single mature live oak or a row of royal palms can matter more to a patio
 * than the house next door. That is why the ratings are three words rather than
 * a percentage: a decimal would imply a precision the inputs cannot support.
 */

/** Sample points are laid on a grid this many metres apart across the lot. */
const SAMPLE_SPACING_M = 6
const MAX_SAMPLE_POINTS = 48
/** Half-width of the sampling square when no parcel polygon is available. */
const FALLBACK_LOT_HALF_WIDTH_M = 24
/** A pool further away than this belongs to a different property. */
const POOL_MATCH_RADIUS_M = 60

interface SamplePoint {
  lat: number
  lng: number
}

/**
 * Open ground on the lot: a grid clipped to the parcel when we have one,
 * minus anything standing on a building.
 *
 * Points under the roof are dropped rather than counted as shade — "the house
 * is in shadow" is trivially true and would drag every rating down.
 */
export function buildLotSamplePoints(
  centre: { lat: number; lng: number },
  parcelRing: LngLat[] | null,
  buildings: BuildingFootprint[]
): SamplePoint[] {
  const { perLat, perLng } = metresPerDegree(centre.lat)
  const halfWidth = FALLBACK_LOT_HALF_WIDTH_M
  const points: SamplePoint[] = []

  for (let dy = -halfWidth; dy <= halfWidth; dy += SAMPLE_SPACING_M) {
    for (let dx = -halfWidth; dx <= halfWidth; dx += SAMPLE_SPACING_M) {
      const lat = centre.lat + dy / perLat
      const lng = centre.lng + dx / perLng
      if (parcelRing && !pointInRing(lng, lat, parcelRing)) continue
      if (buildings.some((b) => pointInRing(lng, lat, b.ring))) continue
      points.push({ lat, lng })
    }
  }

  // A tightly-built lot can leave nothing outdoors within the grid; fall back to
  // the property point so the panel shows something rather than a blank.
  if (points.length === 0) return [{ lat: centre.lat, lng: centre.lng }]
  if (points.length <= MAX_SAMPLE_POINTS) return points

  // Even thinning, so the survivors still cover the whole lot rather than a corner.
  const stride = Math.ceil(points.length / MAX_SAMPLE_POINTS)
  return points.filter((_, i) => i % stride === 0)
}

/** The mapped pool that plausibly belongs to this property, if there is one. */
export function findPropertyPool(
  pools: PoolFootprint[],
  centre: { lat: number; lng: number }
): PoolFootprint | null {
  let best: PoolFootprint | null = null
  let bestDistance = POOL_MATCH_RADIUS_M
  for (const pool of pools) {
    const d = haversineM(centre, ringCentroid(pool.ring))
    if (d < bestDistance) {
      best = pool
      bestDistance = d
    }
  }
  return best
}

function ratingFor(fraction: number): ExposureRating {
  if (fraction >= 0.72) return 'High'
  if (fraction >= 0.4) return 'Moderate'
  return 'Low'
}

interface ExposureInput {
  centre: { lat: number; lng: number }
  date: { year: number; month: number; day: number }
  timeZone: string
  buildings: BuildingFootprint[]
  pools: PoolFootprint[]
  heights: Map<string, HeightEstimate>
  parcelRing: LngLat[] | null
  day: SolarDay
}

export function estimateExposure(input: ExposureInput): ExposureSummary {
  const { centre, date, timeZone, buildings, pools, heights, parcelRing, day } = input

  const empty: ExposureEstimate = {
    rating: 'Moderate',
    sunFraction: 0,
    note: 'Not enough mapping data to estimate.',
  }

  if (day.sunriseMinutes === null || day.sunsetMinutes === null) {
    return { morning: empty, afternoon: empty, yard: empty, yardFromMappedPool: false }
  }

  // Only buildings close enough to reach the lot with a shadow are worth
  // projecting — this is what keeps the whole sweep well under a frame.
  const neighbours = buildings.filter(
    (b) => haversineM(centre, ringCentroid(b.ring)) <= EXPOSURE_NEIGHBOUR_RADIUS_M
  )

  const lotPoints = buildLotSamplePoints(centre, parcelRing, buildings)
  const pool = findPropertyPool(pools, centre)
  const poolPoint = pool ? ringCentroid(pool.ring) : null
  const yardPoints: SamplePoint[] = poolPoint ? [poolPoint] : lotPoints

  let morningLit = 0
  let morningTotal = 0
  let afternoonLit = 0
  let afternoonTotal = 0
  let yardLit = 0
  let yardTotal = 0

  for (
    let minutes = day.sunriseMinutes;
    minutes <= day.sunsetMinutes;
    minutes += EXPOSURE_SAMPLE_MINUTES
  ) {
    const sun = solarPositionAtLocalTime(date, minutes, centre.lat, centre.lng, timeZone)

    // Within a few degrees of the horizon there is no useful direct sun on a
    // patio regardless of geometry, so these steps count as shade for everyone
    // instead of being modelled with a kilometre-long shadow.
    const tooLow = sun.elevationDeg < MIN_SHADOW_ELEVATION_DEG

    const shadowRings: LngLat[][] = []
    if (!tooLow) {
      for (const b of neighbours) {
        const height = heights.get(b.id)?.heightM ?? 0
        const shadow = shadowForFootprint(b.ring, height, sun.azimuthDeg, sun.elevationDeg)
        if (shadow) shadowRings.push(shadow.geometry.coordinates[0] as LngLat[])
      }
    }

    const inSun = (p: SamplePoint) =>
      !tooLow && !shadowRings.some((ring) => pointInRing(p.lng, p.lat, ring))

    const isMorning = minutes < day.solarNoonMinutes
    for (const p of lotPoints) {
      const lit = inSun(p) ? 1 : 0
      if (isMorning) {
        morningLit += lit
        morningTotal += 1
      } else {
        afternoonLit += lit
        afternoonTotal += 1
      }
    }

    for (const p of yardPoints) {
      yardLit += inSun(p) ? 1 : 0
      yardTotal += 1
    }
  }

  const toEstimate = (lit: number, total: number, note?: string): ExposureEstimate => {
    if (total === 0) return empty
    const fraction = lit / total
    return { rating: ratingFor(fraction), sunFraction: fraction, note }
  }

  return {
    morning: toEstimate(morningLit, morningTotal),
    afternoon: toEstimate(afternoonLit, afternoonTotal),
    yard: toEstimate(
      yardLit,
      yardTotal,
      pool ? undefined : 'No mapped pool — sampled across open ground on the lot.'
    ),
    yardFromMappedPool: Boolean(pool),
  }
}
