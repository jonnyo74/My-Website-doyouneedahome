import convex from '@turf/convex'
import { featureCollection, polygon } from '@turf/helpers'
import transformTranslate from '@turf/transform-translate'
import type { Feature, MultiPolygon, Polygon, Position } from 'geojson'
import { MAX_SHADOW_LENGTH_M, MIN_SHADOW_ELEVATION_DEG } from './config'
import type { BuildingFootprint, LngLat } from './types'

/**
 * The shadow engine.
 *
 * The geometry is deliberately simple and stated plainly, because the honest
 * description of what it produces is "the shadow a flat-topped extrusion of
 * this footprint would cast on perfectly level ground":
 *
 *   shadowLength = height / tan(sunElevation)
 *
 * The footprint is copied, the copy is translated `shadowLength` metres along
 * the bearing opposite the sun, and the convex hull of the two together is the
 * shadow. That hull is exactly right for a convex footprint and slightly
 * generous for a concave one (an L-shaped house's inner corner gets filled in),
 * which is a trade we take: it is one hull operation per building instead of a
 * per-edge sweep, and the error is far smaller than the error in the height
 * estimate feeding it.
 *
 * What this model does NOT do, and what the disclaimer exists for: pitched
 * roofs, trees, terrain slope, fences, screen enclosures, and any building the
 * basemap does not know about.
 */

/**
 * Ground distance a shadow reaches, in metres.
 *
 * Returns 0 below `MIN_SHADOW_ELEVATION_DEG`. That floor is not fussiness —
 * `tan` approaches zero at sunrise and sunset, so the length approaches
 * infinity: a 6 m house at 0.5° elevation computes a 688 m shadow, and at 0°
 * the division is undefined. Long shadows near the horizon are also the least
 * meaningful ones, since anything at all in the intervening 600 m breaks them
 * up. Above the floor the result is still clamped, for the same reason.
 */
export function shadowLengthM(heightM: number, elevationDeg: number): number {
  if (!Number.isFinite(heightM) || heightM <= 0) return 0
  if (!Number.isFinite(elevationDeg) || elevationDeg < MIN_SHADOW_ELEVATION_DEG) return 0
  const length = heightM / Math.tan((elevationDeg * Math.PI) / 180)
  if (!Number.isFinite(length) || length <= 0) return 0
  return Math.min(length, MAX_SHADOW_LENGTH_M)
}

/** The bearing shadows point along: directly away from the sun. */
export function shadowBearingDeg(sunAzimuthDeg: number): number {
  return (sunAzimuthDeg + 180) % 360
}

function toClosedRing(ring: LngLat[]): Position[] | null {
  if (ring.length < 3) return null
  const first = ring[0]
  const last = ring[ring.length - 1]
  const closed: Position[] = ring.map((p) => [p[0], p[1]])
  if (first[0] !== last[0] || first[1] !== last[1]) closed.push([first[0], first[1]])
  return closed.length >= 4 ? closed : null
}

/**
 * Shadow cast by one footprint. Returns null when the sun is too low, the
 * height is unusable, or the ring is degenerate — callers skip those rather
 * than drawing something misleading.
 */
export function shadowForFootprint(
  ring: LngLat[],
  heightM: number,
  sunAzimuthDeg: number,
  sunElevationDeg: number
): Feature<Polygon> | null {
  const length = shadowLengthM(heightM, sunElevationDeg)
  if (length === 0) return null

  const closed = toClosedRing(ring)
  if (!closed) return null

  let base: Feature<Polygon>
  try {
    base = polygon([closed])
  } catch {
    // Turf throws on rings it considers invalid; a bad footprint in the basemap
    // should drop that one building, not the whole map.
    return null
  }

  const cast = transformTranslate(base, length, shadowBearingDeg(sunAzimuthDeg), {
    units: 'meters',
  })

  return convex(featureCollection([base, cast]))
}

/**
 * All shadows for a set of buildings, as ONE MultiPolygon.
 *
 * Emitting a single geometry is not just tidiness. Leaflet renders a
 * MultiPolygon as a single SVG `<path>` with the default `nonzero` fill rule,
 * so overlapping shadows from neighbouring houses paint at one uniform opacity.
 * Separate polygons would each apply their own alpha and the overlaps would
 * stack into dark blotches that read as "darker shade" when they mean nothing
 * of the kind — a real union via turf would fix it too, but costs an
 * O(n log n) boolean op on every slider frame instead of nothing.
 */
export function buildShadowGeometry(
  buildings: BuildingFootprint[],
  heightFor: (b: BuildingFootprint) => number,
  sunAzimuthDeg: number,
  sunElevationDeg: number
): MultiPolygon | null {
  if (sunElevationDeg < MIN_SHADOW_ELEVATION_DEG) return null

  const coordinates: Position[][][] = []
  for (const building of buildings) {
    const shadow = shadowForFootprint(
      building.ring,
      heightFor(building),
      sunAzimuthDeg,
      sunElevationDeg
    )
    if (shadow) coordinates.push(shadow.geometry.coordinates)
  }

  if (coordinates.length === 0) return null
  return { type: 'MultiPolygon', coordinates }
}
