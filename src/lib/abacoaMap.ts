// One location dataset for every Abacoa map. The geometry itself lives in
// abacoaMapData.generated.json, which scripts/build-abacoa-map-data.py builds
// from Palm Beach County GIS. This file adds names, guide links and sources,
// and the small helpers the three map views share. No Leaflet import: the
// server renders the link list and source list from this data.
//
// What is drawn, and why:
//  * Village OUTLINES are the Property Appraiser's parcels filed under the
//    village's recorded plat name, dissolved into one shape. A recorded plat is
//    the legal boundary of a subdivision, so this is county geometry.
//  * Antigua and Newhaven get a PIN, not an outline. Antigua sits inside the
//    shared Abacoa Town Center plat, and the plats the county names for Newhaven
//    cover only its later phases, so an outline would be wrong. Their pins are
//    the HOA's own parcel (Antigua) and HOA office (Newhaven).
//  * Dakota Drive is the county's road centerline, not an area.
//  * Landmark pins are the centre of the county parcel at a published address.
//    They show where something is, not where its entrance is.
// Nothing here is hand-drawn, and nothing implies an address-level boundary.

import raw from './abacoaMapData.generated.json' with { type: 'json' }

export type LngLat = [number, number]
export type OutlineGeometry = { type: 'Polygon' | 'MultiPolygon'; coordinates: unknown }

export interface MapSource {
  label: string
  url: string
}

export interface MapVillage {
  slug: string
  name: string
  /** Has a published guide on this site. */
  guide: boolean
  /** Outline from a recorded plat, when the county data supports one. */
  outline?: OutlineGeometry
  /** Where the label sits. For a pin-only village this is the pin. */
  position: LngLat
  /** Set when the village is shown as a pin because no plat outline is supportable. */
  pinNote?: string
  sources: MapSource[]
}

export interface MapLandmark {
  id: string
  name: string
  /** Shorter label for small screens. */
  short: string
  kind: 'landmark' | 'hoa' | 'rental'
  position: LngLat
  note: string
  sources: MapSource[]
}

export interface MapRoad {
  id: string
  name: string
  lines: LngLat[][]
}

export const COUNTY_PARCELS = raw.sources.parcels
export const COUNTY_ROADS = raw.sources.centerline
export const MASTER_PLAN_URL = 'https://www.jupiter.fl.us/616/Abacoa'
export const POA_DIRECTORY_URL = 'https://www.abacoa.com/neighborhoods'

const POA_SLUG: Record<string, string> = {
  antigua: 'antigua-town-center',
  'canterbury-place': 'canterbury-place',
  'charleston-court': 'charleston-court',
  'mallory-creek': 'mallory-creek',
  martinique: 'martinique',
  newhaven: 'newhaven',
  'osceola-woods': 'osceola-woods',
  tuscany: 'tuscany',
  valencia: 'valencia',
  'windsor-park': 'windsor-park',
  somerset: 'somerset',
  cambridge: 'cambridge',
  'the-island': 'island-abacoa',
  'village-at-abacoa': 'village-abacoa',
}

const NAMES: Record<string, string> = {
  antigua: 'Antigua',
  newhaven: 'Newhaven',
}

type RawVillage = { name: string; label: LngLat; outline: OutlineGeometry; platNames: string[] }
type RawPin = { label: string; kind: 'landmark' | 'hoa' | 'rental'; position: LngLat; note: string; address: string | null }
type RawStreet = { lines: LngLat[][] }

const villagesRaw = raw.villages as unknown as Record<string, RawVillage>
const pinsRaw = raw.pins as unknown as Record<string, RawPin>
const streetsRaw = raw.streets as unknown as Record<string, RawStreet>

const GUIDES = new Set([
  'antigua', 'canterbury-place', 'charleston-court', 'mallory-creek', 'martinique',
  'newhaven', 'osceola-woods', 'tuscany', 'valencia', 'windsor-park',
])

function sourcesFor(slug: string, outline: boolean): MapSource[] {
  const poa = POA_SLUG[slug]
  return [
    ...(poa ? [{ label: 'Abacoa POA village page', url: `${POA_DIRECTORY_URL}/${poa}` }] : []),
    outline
      ? { label: 'Palm Beach County parcel data (plat boundary)', url: COUNTY_PARCELS }
      : { label: 'Palm Beach County parcel data (pin location)', url: COUNTY_PARCELS },
  ]
}

const outlined: MapVillage[] = Object.entries(villagesRaw).map(([slug, v]) => ({
  slug,
  name: v.name,
  guide: GUIDES.has(slug),
  outline: v.outline,
  position: v.label,
  sources: sourcesFor(slug, true),
}))

const pinned: MapVillage[] = [
  {
    slug: 'antigua',
    name: NAMES.antigua,
    guide: true,
    position: pinsRaw['antigua-common-area'].position,
    pinNote: 'Pin only: Antigua shares the Abacoa Town Center plat, so its edge is not drawn. The pin is the HOA’s own parcel.',
    sources: sourcesFor('antigua', false),
  },
  {
    slug: 'newhaven',
    name: NAMES.newhaven,
    guide: true,
    position: pinsRaw['newhaven-hoa-office'].position,
    pinNote: 'Pin only: the county’s plat names cover just Newhaven’s later phases, so its edge is not drawn. The pin is the HOA office.',
    sources: sourcesFor('newhaven', false),
  },
]

export const MAP_VILLAGES: MapVillage[] = [...outlined, ...pinned]

export function getMapVillage(slug: string): MapVillage | undefined {
  return MAP_VILLAGES.find((v) => v.slug === slug)
}

const LANDMARK_SOURCE = (note: string): MapSource[] => [{ label: note, url: COUNTY_PARCELS }]

const SHORT: Record<string, string> = { 'town-center': 'Downtown Abacoa', 'roger-dean-stadium': 'Roger Dean Stadium', 'abacoa-golf-club': 'Golf Club' }

export const MAP_LANDMARKS: MapLandmark[] = (['town-center', 'roger-dean-stadium', 'abacoa-golf-club'] as const).map((id) => ({
  id,
  name: pinsRaw[id].label,
  short: SHORT[id],
  kind: 'landmark' as const,
  position: pinsRaw[id].position,
  note: pinsRaw[id].note,
  sources: LANDMARK_SOURCE('Palm Beach County parcel data'),
}))

export const DAKOTA_RENTAL: MapLandmark = {
  id: 'dakota-at-abacoa',
  name: 'Dakota at Abacoa (rental community)',
  short: 'Dakota at Abacoa (rentals)',
  kind: 'rental',
  position: pinsRaw['dakota-at-abacoa'].position,
  note: pinsRaw['dakota-at-abacoa'].note,
  sources: [
    { label: 'Abacoa POA: Dakota at Abacoa', url: `${POA_DIRECTORY_URL}/dakota-abacoa` },
    { label: 'Palm Beach County parcel data', url: COUNTY_PARCELS },
  ],
}

const ROAD_NAMES: [string, string][] = [
  ['military-trail', 'Military Trail'],
  ['indiantown-road', 'Indiantown Road'],
  ['central-boulevard', 'Central Blvd'],
  ['frederick-small-road', 'Frederick Small Rd'],
  ['indian-creek-parkway', 'Indian Creek Pkwy'],
  ['main-street', 'Main Street'],
  ['turnpike', 'Florida’s Turnpike'],
]

export const MAP_ROADS: MapRoad[] = ROAD_NAMES.map(([id, name]) => ({ id, name, lines: streetsRaw[id].lines }))

export const DAKOTA_DRIVE: MapRoad = { id: 'dakota-drive', name: 'Dakota Drive', lines: streetsRaw['dakota-drive'].lines }

/**
 * Villages the county's Dakota Drive centerline touches or runs within about
 * 15 m of. Measured when the dataset was built (scripts/build-abacoa-map-data.py
 * output, checked with shapely): Martinique 0 m, Mallory Creek 6 m, Windsor Park
 * 6 m, Canterbury Place 10 m. Tuscany (226 m) and Valencia (330 m) are not on it.
 */
export const DAKOTA_VILLAGES = ['martinique', 'mallory-creek', 'windsor-park', 'canterbury-place']

export type MapView =
  | { view: 'hub' }
  | { view: 'village'; slug: string }
  | { view: 'dakota' }

export const MAP_HEADINGS = {
  hub: 'Explore the Abacoa villages on the map',
  dakota: 'Which Abacoa villages are along Dakota Drive?',
  village: (name: string) => `Where is ${name} in Abacoa?`,
}

/** Plain-text description for the map's accessible name and the no-map fallback. */
export function mapDescription(v: MapView): string {
  if (v.view === 'hub') {
    return 'Map of Abacoa in Jupiter, Florida, showing each village and landmarks such as Downtown Abacoa, Roger Dean Chevrolet Stadium and Abacoa Golf Club.'
  }
  if (v.view === 'dakota') {
    return 'Map of Dakota Drive in Abacoa, with the villages it passes or borders and the Dakota at Abacoa rental community.'
  }
  const name = getMapVillage(v.slug)?.name ?? 'This village'
  return `Map of Abacoa with ${name} highlighted, shown against Downtown Abacoa and the neighboring villages.`
}

// ── Geometry helpers (no Leaflet) ──────────────────────────────────────────

export type Bounds = [[number, number], [number, number]] // [[south, west], [north, east]]

function eachCoord(geom: OutlineGeometry, fn: (lng: number, lat: number) => void) {
  const walk = (c: unknown): void => {
    if (Array.isArray(c) && typeof c[0] === 'number') fn(c[0] as number, c[1] as number)
    else if (Array.isArray(c)) c.forEach(walk)
  }
  walk(geom.coordinates)
}

export function boundsOf(points: LngLat[], geoms: OutlineGeometry[] = [], lines: LngLat[][] = []): Bounds {
  let s = 90, w = 180, n = -90, e = -180
  const add = (lng: number, lat: number) => {
    s = Math.min(s, lat); n = Math.max(n, lat); w = Math.min(w, lng); e = Math.max(e, lng)
  }
  points.forEach(([lng, lat]) => add(lng, lat))
  geoms.forEach((g) => eachCoord(g, add))
  lines.forEach((l) => l.forEach(([lng, lat]) => add(lng, lat)))
  return [[s, w], [n, e]]
}

/** The frame each view opens on. */
export function viewBounds(v: MapView): Bounds {
  const town = MAP_LANDMARKS.find((l) => l.id === 'town-center')!.position
  if (v.view === 'hub') {
    return boundsOf(
      [...MAP_LANDMARKS.map((l) => l.position), ...pinned.map((p) => p.position)],
      outlined.map((o) => o.outline!),
    )
  }
  if (v.view === 'dakota') {
    const near = outlined.filter((o) => DAKOTA_VILLAGES.includes(o.slug))
    return boundsOf([DAKOTA_RENTAL.position], near.map((o) => o.outline!), DAKOTA_DRIVE.lines)
  }
  const sel = getMapVillage(v.slug)
  if (!sel) return viewBounds({ view: 'hub' })
  return boundsOf([town, ...(sel.outline ? [] : [sel.position])], sel.outline ? [sel.outline] : [])
}
