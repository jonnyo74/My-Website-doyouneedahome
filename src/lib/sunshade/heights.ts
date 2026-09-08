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
 * The naive version of this compares living area to footprint and calls
 * anything above ~1.5 a two-storey house. That is wrong, and measurably so,
 * because the two numbers do not describe the same thing:
 *
 *   - `TOT_LVG_AR` counts air-conditioned space only. Garages, lanais and
 *     covered entries are excluded.
 *   - An OpenStreetMap footprint is traced from aerial imagery, so it is the
 *     whole UNDER-ROOF outline, garage and lanai very much included.
 *
 * In Florida that gap is big. A three-car garage and a 36-foot lanai can be a
 * third of the roof. So we model the relationship explicitly instead of
 * guessing a threshold: roughly `LIVING_SHARE_OF_FOOTPRINT` of the under-roof
 * area is living space on the ground floor, and the storey count is the living
 * area divided by that.
 *
 * Calibrated against the three listings in `listings.ts`, where the MLS storey
 * count is known ground truth:
 *
 *   8804 Skyward St   4,932 sq ft living / 4,422 sq ft footprint -> 1.72 -> 2  (true: 2)
 *   6145 SE Audubon   1,416 / 2,612                              -> 0.83 -> 1  (true: 1)
 *   982 SW Worcester  1,710 / 2,566                              -> 1.03 -> 1  (true: 1)
 *
 * Three houses is a thin calibration set and this is stated as such in the UI —
 * every result from this path is reported as an estimate, never a fact. But it
 * beats the threshold it replaced, which called Skyward a single-storey house
 * and so drew half the shadow it should have.
 */
const LIVING_SHARE_OF_FOOTPRINT = 0.65

export function storeysFromParcel(
  livingAreaSqFt: number | null | undefined,
  footprintM2: number
): number | null {
  if (!livingAreaSqFt || livingAreaSqFt <= 0 || footprintM2 <= 20) return null
  const footprintSqFt = footprintM2 / SQ_METRES_PER_SQ_FOOT
  const implied = livingAreaSqFt / (LIVING_SHARE_OF_FOOTPRINT * footprintSqFt)
  if (!Number.isFinite(implied) || implied <= 0) return null
  // Clamped at three: past that the ratio is telling us the footprint is wrong
  // (a traced block of townhouses, say), not that the house is a tower.
  return Math.min(3, Math.max(1, Math.round(implied)))
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
