/**
 * Florida Sun & Shade Analyzer — tunable constants.
 *
 * Everything the shadow model guesses at lives here rather than being scattered
 * through the geometry code, so the day better data arrives (LiDAR heights,
 * county building layers) there is one place to change.
 */

/** Default residential building height when no better source exists.
 *  20 ft is the brief's figure — a typical Florida single-storey house with a
 *  low-pitch hip roof. See `heights.ts` for the ladder of better sources. */
export const DEFAULT_BUILDING_HEIGHT_FT = 20
export const DEFAULT_BUILDING_HEIGHT_M = DEFAULT_BUILDING_HEIGHT_FT * 0.3048

/** Metres of height per storey, plus a roof allowance. Florida residential
 *  construction runs 9–10 ft plate heights; 3.2 m per level is the common OSM
 *  convention and lands close enough for a shadow estimate. */
export const METRES_PER_LEVEL = 3.2
export const ROOF_ALLOWANCE_M = 1.0

/**
 * Below this solar elevation the shadow model stops.
 *
 * shadowLength = height / tan(elevation) goes to infinity as elevation goes to
 * zero: at 1° a 6 m house casts a 344 m shadow, at 0.1° it casts 3.4 km, and at
 * 0° it divides by zero. Real shadows that long are also meaningless — they are
 * broken up by every tree and structure in between. So we draw nothing under 3°
 * and hard-clamp the length above it.
 */
export const MIN_SHADOW_ELEVATION_DEG = 3
export const MAX_SHADOW_LENGTH_M = 250

/** Overpass fetch radius around the property, and the cap on how many
 *  buildings we will project. Both keep mobile responsive — see README. */
export const FEATURE_FETCH_RADIUS_M = 400
export const MAX_SHADOW_BUILDINGS = 220

/** Radius within which a building can plausibly shade the property's yard.
 *  Used to trim the exposure sampling set. */
export const EXPOSURE_NEIGHBOUR_RADIUS_M = 90

/** Sampling resolution for the morning/afternoon exposure estimate. */
export const EXPOSURE_SAMPLE_MINUTES = 20

/** Florida sits entirely in US Eastern time apart from the western panhandle,
 *  which this tool does not serve. Kept as a named constant rather than
 *  inlined so a future multi-state build has one thing to make dynamic. */
export const FLORIDA_TIMEZONE = 'America/New_York'

/** Rough bounds of the Florida peninsula, used to warn (never block) when a
 *  geocode lands outside the area this tool is calibrated for. */
export const FLORIDA_BOUNDS = { minLat: 24.3, maxLat: 31.1, minLng: -87.7, maxLng: -79.9 }

export const DISCLAIMER =
  'Sun and shade projections are estimates based on available mapping, building, and solar-position data. Actual conditions may vary due to trees, structures, terrain, weather, and unavailable building-height information.'
