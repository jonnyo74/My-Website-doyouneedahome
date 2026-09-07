import area from '@turf/area'
import { polygon } from '@turf/helpers'
import {
  DEFAULT_BUILDING_HEIGHT_M,
  METRES_PER_LEVEL,
  ROOF_ALLOWANCE_M,
} from './config'
import type { BuildingFootprint, HeightEstimate, LngLat, ParcelInfo } from './types'

/**
 * Building-height estimation, worst problem in the app.
 *
 * Measured against OpenStreetMap in Jupiter, FL: of 686 building footprints in
 * a single residential bounding box, ZERO carried a `height` tag and five
 * carried `building:levels`. Height is not a fallback here — it is a guess
 * almost every time, and the UI says which rung of this ladder it came from so
 * nobody reads a guess as a survey.
 *
 * The rungs, best first:
 *   1. OSM `height`            — someone measured it
 *   2. OSM `building:levels`   — someone counted storeys
 *   3. Parcel living area      — county records ÷ footprint ⇒ implied storeys
 *   4. Default                 — 20 ft, the brief's figure
 *
 * Rung 3 is the interesting one and only exists because the Florida statewide
 * cadastral layer exposes `TOT_LVG_AR` for free. It applies to the subject
 * property only; neighbours fall through to the default.
 */

const SQ_METRES_PER_SQ_FOOT = 0.09290304

/** Squat structures that should not throw a two-storey shadow. */
const LOW_BUILDING_TYPES = new Set([
  'garage',
  'garages',
  'shed',
  'carport',
  'roof',
  'hut',
  'cabin',
  'greenhouse',
])

/**
 * Parses an OSM `height` value. The tag is documented as metres, but the wild
 * contains `"12 m"`, `"40'"` and `"40 ft"` too, so all four are handled and
 * anything else is rejected rather than coerced into a wrong number.
 */
export function parseOsmHeight(raw: string | undefined): number | null {
  if (!raw) return null
  const value = raw.trim().toLowerCase()

  const feetInches = /^(\d+(?:\.\d+)?)\s*(?:'|ft|feet)$/.exec(value)
  if (feetInches) {
    const ft = Number(feetInches[1])
    return Number.isFinite(ft) && ft > 0 ? ft * 0.3048 : null
  }

  const metres = /^(\d+(?:\.\d+)?)\s*(?:m|metres|meters)?$/.exec(value)
  if (metres) {
    const m = Number(metres[1])
    return Number.isFinite(m) && m > 0 && m < 400 ? m : null
  }

  return null
}

/** Footprint area in square metres. */
export function footprintAreaM2(ring: LngLat[]): number {
  if (ring.length < 3) return 0
  const closed = [...ring]
  const first = closed[0]
  const last = closed[closed.length - 1]
  if (first[0] !== last[0] || first[1] !== last[1]) closed.push(first)
  try {
    return area(polygon([closed.map((p) => [p[0], p[1]])]))
  } catch {
    return 0
  }
}

function fromLevels(levels: number): HeightEstimate {
  const storeys = Math.max(1, Math.min(levels, 60))
  return {
    heightM: storeys * METRES_PER_LEVEL + ROOF_ALLOWANCE_M,
    source: 'osm-levels',
    confidence: 'medium',
    label: `${storeys} mapped ${storeys === 1 ? 'storey' : 'storeys'} in OpenStreetMap`,
  }
}

function defaultEstimate(tags: Record<string, string>): HeightEstimate {
  if (LOW_BUILDING_TYPES.has(tags.building ?? '')) {
    return {
      heightM: 2.6,
      source: 'default',
      confidence: 'low',
      label: 'assumed outbuilding, no height data',
    }
  }
  return {
    heightM: DEFAULT_BUILDING_HEIGHT_M,
    source: 'default',
    confidence: 'low',
    label: 'assumed default, no height data mapped',
  }
}

/**
 * Storeys implied by county living area against the mapped footprint.
 *
 * A 2,800 sq ft house on a 1,500 sq ft footprint is two storeys; the same house
 * on a 2,700 sq ft footprint is one. The ratio is noisy — garages and lanais
 * are inside the footprint but outside "living area", which biases the ratio
 * DOWN, so we only promote to two storeys past 1.55 rather than 1.5, and never
 * infer more than three from this signal alone.
 */
export function storeysFromParcel(
  livingAreaSqFt: number | null | undefined,
  footprintM2: number
): number | null {
  if (!livingAreaSqFt || livingAreaSqFt <= 0 || footprintM2 <= 20) return null
  const livingM2 = livingAreaSqFt * SQ_METRES_PER_SQ_FOOT
  const ratio = livingM2 / footprintM2
  if (!Number.isFinite(ratio) || ratio <= 0) return null
  if (ratio < 1.55) return 1
  if (ratio < 2.55) return 2
  return 3
}

/**
 * Best available height for one building.
 *
 * `parcel` is passed only for the building the user searched for — it is the
 * one address we have county records for.
 */
export function estimateHeight(
  building: BuildingFootprint,
  parcel?: ParcelInfo | null
): HeightEstimate {
  const tagged = parseOsmHeight(building.tags.height)
  if (tagged !== null) {
    return {
      heightM: tagged,
      source: 'osm-height',
      confidence: 'high',
      label: 'mapped height',
    }
  }

  const levels = Number(building.tags['building:levels'])
  if (Number.isFinite(levels) && levels > 0) return fromLevels(levels)

  if (parcel) {
    const storeys = storeysFromParcel(parcel.livingAreaSqFt, footprintAreaM2(building.ring))
    if (storeys !== null) {
      return {
        heightM: storeys * METRES_PER_LEVEL + ROOF_ALLOWANCE_M,
        source: 'parcel-living-area',
        confidence: storeys === 1 ? 'medium' : 'low',
        label: `${storeys} ${storeys === 1 ? 'storey' : 'storeys'} implied by county records`,
      }
    }
  }

  return defaultEstimate(building.tags)
}

/** Pre-computes heights once per feature load so slider frames stay pure geometry. */
export function buildHeightIndex(
  buildings: BuildingFootprint[],
  subjectBuildingId: string | null,
  parcel: ParcelInfo | null
): Map<string, HeightEstimate> {
  const index = new Map<string, HeightEstimate>()
  for (const building of buildings) {
    index.set(building.id, estimateHeight(building, building.id === subjectBuildingId ? parcel : null))
  }
  return index
}
