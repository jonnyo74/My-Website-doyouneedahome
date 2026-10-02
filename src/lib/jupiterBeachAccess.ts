import { headingId } from './headingId'

/**
 * Jupiter beach access points for the interactive map on
 * /blog/jupiter-beach-access-guide.
 *
 * Every record names the official page it comes from. Two kinds of fact live
 * here and they are sourced differently:
 *
 *   - WHAT a point is (name, operator, address, ADA status, guarded status,
 *     the dog corridor's end markers) comes from the Town of Jupiter and Palm
 *     Beach County Parks pages linked on each record.
 *
 *   - WHERE a point sits (lat/lng) is the weak link. The park and lot
 *     positions below were placed by the editor from the published addresses
 *     without a geocoder, so each carries `positionVerified: false` and a
 *     `positionSource` saying exactly how it was placed. The one exception is
 *     DuBois Park, whose coordinates were already on record in
 *     src/lib/paddle/launches.ts against the County's park page. Re-geocode
 *     every unverified position from its address before relying on it at
 *     street level; the map caption tells readers positions are approximate.
 *
 * Numbered crossovers are placed ONLY when a verifiable source gives their
 * position. None does at the time of writing (the Town's GIS layer and the
 * Town map could not be read), so the ADA crossovers are listed but not placed
 * rather than guessed. See `NUMBERING_NOTES` for the #31–#35 overlap, which
 * is recorded as published and deliberately not resolved.
 */

export const MAP_HEADING = 'Jupiter beach access map'
/** Matches headingId(MAP_HEADING), so the table of contents can link to it. */
export const MAP_HEADING_ID = headingId(MAP_HEADING)

export const MAP_CAPTION =
  "Positions are approximate. Source: Town of Jupiter Jupiter Area Beaches map and Palm Beach County Parks. Check the Town's map for exact crossover locations."

export const SOURCES = {
  townBeaches: 'https://www.jupiter.fl.us/465/Beaches',
  townCrossovers: 'https://www.jupiter.fl.us/1975/Dune-Crossover-Information',
  townDogs: 'https://jupiter.fl.us/437/Dogs-on-the-Beach',
  townParkingFaq: 'https://www.jupiter.fl.us/Faq.aspx?QID=420',
  townMap: 'https://jupiter.fl.us/DocumentCenter/View/29369/Jupiter-Beaches-Map--with-ADA-crossovers',
  townGis: 'https://www.jupiter.fl.us/563/JupiterGIS---Maps-More',
  countyGuarded: 'https://discover.pbc.gov/parks/aquatics/about-our-beaches.aspx',
  countyOceanCay: 'https://discover.pbc.gov/parks/Locations/Ocean-Cay.aspx',
  countyCarlin: 'https://discover.pbc.gov/parks/Locations/Carlin.aspx',
  countyJupiterBeach: 'https://discover.pbc.gov/parks/Locations/Jupiter-Beach.aspx',
  countyDuBois: 'https://discover.pbc.gov/parks/Locations/DuBois.aspx',
  countyJunoBeach: 'https://discover.pbc.gov/parks/Locations/Juno-Beach.aspx',
} as const

export type LayerId = 'parks' | 'ada' | 'dogs' | 'guarded'

export const LAYERS: Array<{ id: LayerId; label: string; swatch: string; shape: 'dot' | 'square' | 'ring' | 'line' }> = [
  { id: 'parks', label: 'Parks and parking lots', swatch: '#0F2233', shape: 'dot' },
  { id: 'ada', label: 'ADA-accessible crossovers', swatch: '#1A79B8', shape: 'square' },
  { id: 'dogs', label: 'Dog-friendly corridor (#26 to #57)', swatch: '#7c3aed', shape: 'line' },
  { id: 'guarded', label: 'Guarded swimming areas', swatch: '#2A8630', shape: 'ring' },
]

export interface Position {
  lat: number
  lng: number
  /** How the coordinates were arrived at. Shown nowhere; kept for the next editor. */
  positionSource: string
  /** True only when the coordinates were geocoded from the address or published by the agency. */
  positionVerified: boolean
}

export interface AccessPoint {
  id: string
  layer: 'parks' | 'ada'
  name: string
  /** Who runs it, as the reader should hear it. */
  operator: string
  address: string
  /** Official page for this point. */
  href: string
  /** Secondary official page, where one record rests on two. */
  alsoHref?: string
  /** Shown in the text list and popup. Facts only: no hours, prices, conditions or crowd claims. */
  note?: string
  /** Null when no verifiable source places the point. Such points are listed but never drawn. */
  position: Position | null
  /** Record-level source note: which page says what. */
  source: string
}

/** A guarded swimming area, drawn as a ring around the park's beach. */
export interface GuardedArea {
  id: string
  parkId: string
  name: string
  operator: string
  href: string
  note?: string
  position: Position
  source: string
}

export interface DogCorridor {
  name: string
  operator: string
  href: string
  from: string
  to: string
  /** South to north. */
  path: Position[]
  source: string
}

const COUNTY = 'Palm Beach County Parks & Recreation'

export const ACCESS_POINTS: AccessPoint[] = [
  {
    id: 'juno-beach-park',
    layer: 'parks',
    name: 'Juno Beach Park',
    operator: `${COUNTY}, in the Town of Juno Beach`,
    address: '14775 U.S. Highway 1, Juno Beach, FL 33408',
    href: SOURCES.countyJunoBeach,
    note: 'Town of Juno Beach, not Jupiter. Pier and guarded beach. Free lot per the Town of Jupiter parking FAQ.',
    position: {
      lat: 26.89336,
      lng: -80.06003,
      positionSource:
        'Confirmed by John Oliver on 2026-10-02: a Google Maps view centred on the Juno Beach Park lot and pier (URL centre 26.8933571,-80.0600297). An earlier placement a mile south at Atlantic Blvd was wrong.',
      positionVerified: true,
    },
    source: `Name, address and guarded status: ${SOURCES.countyJunoBeach}. Listed as a free lot: ${SOURCES.townParkingFaq}.`,
  },
  {
    id: 'ocean-cay-park',
    layer: 'parks',
    name: 'Ocean Cay Park',
    operator: COUNTY,
    address: '2188 Marcinski Road, Jupiter, FL 33477',
    href: SOURCES.countyOceanCay,
    note: 'Guarded beach. The dog corridor begins at crossover #26, at Marcinski Road.',
    position: {
      lat: 26.9037,
      lng: -80.0623,
      positionSource:
        'Placed by the editor at Marcinski Road and A1A from the County address, without a geocoder. A 2022 photo in public/images/jupiter/SOURCES.md carries an EXIF fix of 26°54′14″N 80°03′38″W on the beach near Marcinski Road, which agrees in latitude. Re-geocode 2188 Marcinski Road.',
      positionVerified: false,
    },
    source: `Name, address and guarded status: ${SOURCES.countyOceanCay}. Listed as a free lot: ${SOURCES.townParkingFaq}.`,
  },
  {
    id: 'a1a-lot-27-28',
    layer: 'parks',
    name: 'Town lot between crossovers #27 and #28',
    operator: 'Town of Jupiter',
    address: 'S. State Road A1A, Jupiter, FL 33477 (no street number published)',
    href: SOURCES.townParkingFaq,
    alsoHref: SOURCES.townBeaches,
    note: 'A parking lot, not a park. Named on the Town Beaches page and parking FAQ as a free lot.',
    position: {
      lat: 26.9065,
      lng: -80.0632,
      positionSource:
        'Derived: the Town says crossover #26 is at Marcinski Road and the lot sits between #27 and #28, so it is placed a short distance north of Marcinski Road on A1A. No address exists to geocode; confirm against the Town map before relying on it.',
      positionVerified: false,
    },
    source: `Existence and operator: ${SOURCES.townBeaches} and ${SOURCES.townParkingFaq}.`,
  },
  {
    id: 'carlin-park',
    layer: 'parks',
    name: 'Carlin Park',
    operator: COUNTY,
    address: '400 S. State Road A1A, Jupiter, FL 33477',
    href: SOURCES.countyCarlin,
    note: 'Guarded beach. Beach surf wheelchair available through the lifeguard, per the County. The dog corridor ends at crossover #57 at the Carlin Park property line.',
    position: {
      lat: 26.9203,
      lng: -80.0688,
      positionSource:
        'Placed by the editor at the 400 S. A1A entrance from the County address, without a geocoder. Re-geocode 400 S. State Road A1A, Jupiter.',
      positionVerified: false,
    },
    source: `Name, address, guarded status and beach wheelchair: ${SOURCES.countyCarlin}. Listed as a free lot: ${SOURCES.townParkingFaq}.`,
  },
  {
    id: 'jupiter-beach-park',
    layer: 'parks',
    name: 'Jupiter Beach Park',
    operator: COUNTY,
    address: '2462 Jupiter Beach Road, Jupiter, FL 33477 (entrance)',
    href: SOURCES.countyJupiterBeach,
    note: 'South side of the Jupiter Inlet. Guarded beach. ADA beach mat, per the County.',
    position: {
      lat: 26.9428,
      lng: -80.073,
      positionSource:
        'Placed by the editor at the east end of Jupiter Beach Road, south of the inlet, without a geocoder. Re-geocode 2462 Jupiter Beach Road.',
      positionVerified: false,
    },
    source: `Name, entrance address, guarded status and beach mat: ${SOURCES.countyJupiterBeach}. Listed as a free lot: ${SOURCES.townParkingFaq}.`,
  },
  {
    id: 'dubois-park',
    layer: 'parks',
    name: 'DuBois Park',
    operator: COUNTY,
    address: '19075 DuBois Road, Jupiter, FL 33477',
    href: SOURCES.countyDuBois,
    note: 'Lagoon and Intracoastal frontage on the inlet rather than open ocean. Guarded swimming area on the lagoon side.',
    position: {
      lat: 26.94238,
      lng: -80.07638,
      positionSource:
        'Coordinates already on record in src/lib/paddle/launches.ts (coordsPublished: true) against the County park page.',
      positionVerified: true,
    },
    source: `Name, address and guarded status: ${SOURCES.countyDuBois}. Listed as a free lot: ${SOURCES.townParkingFaq}.`,
  },
  // The four ADA-accessible crossovers, per the Town's Beaches page and Dune
  // Crossover Information page. None has a position: no source read for this
  // map places an individual crossover, so they are listed and not drawn.
  ...([24, 31, 45, 48] as const).map<AccessPoint>((n) => ({
    id: `crossover-${n}`,
    layer: 'ada',
    name: `Crossover #${n} (ADA accessible)`,
    operator:
      n === 24
        ? 'Palm Beach County (listed among County crossovers by the Town)'
        : 'Town of Jupiter (listed among Town crossovers; rebuilt to ADA requirements)',
    address: 'Jupiter beach, numbered post at the dune. Exact location on the Town map.',
    href: SOURCES.townBeaches,
    alsoHref: SOURCES.townCrossovers,
    note:
      n === 24
        ? 'Not placed on this map: no source read for this map gives its position.'
        : 'Not placed on this map: no source read for this map gives its position. The Town says #31, #45 and #48 were demolished and rebuilt to meet ADA requirements.',
    position: null,
    source: `ADA status: ${SOURCES.townBeaches}. Ownership and rebuild: ${SOURCES.townCrossovers}.`,
  })),
]

export const GUARDED_AREAS: GuardedArea[] = ACCESS_POINTS.filter(
  (p): p is AccessPoint & { position: Position } =>
    p.layer === 'parks' && p.id !== 'a1a-lot-27-28' && p.position !== null,
).map((p) => ({
  id: `guarded-${p.id}`,
  parkId: p.id,
  name: `${p.name} guarded swimming area`,
  operator: 'Palm Beach County Ocean Rescue',
  href: SOURCES.countyGuarded,
  note:
    p.id === 'dubois-park'
      ? 'Guarded area is on the lagoon side. The County lists DuBois as an exception to its usual guard schedule.'
      : undefined,
  position: {
    ...p.position,
    positionSource: `Drawn around the park position. ${p.position.positionSource}`,
  },
  source: `Guarded parks list: ${SOURCES.countyGuarded}.`,
}))

/** Radius of the guarded-area ring, in screen pixels. A marker for the idea, not a surveyed extent. */
export const GUARDED_RADIUS_PX = 22

export const DOG_CORRIDOR: DogCorridor = {
  name: 'Dog-friendly beach, crossover #26 to #57',
  operator: 'Town of Jupiter',
  href: SOURCES.townDogs,
  from: 'Crossover #26 at Marcinski Road',
  to: 'Crossover #57 at the Carlin Park property line',
  path: [
    {
      lat: 26.9039,
      lng: -80.0606,
      positionSource:
        'South end: the beach at Marcinski Road. Taken from the EXIF fix on a 2022 photo recorded in public/images/jupiter/SOURCES.md as "the beach near Marcinski Road". The Town places #26 at Marcinski Road.',
      positionVerified: false,
    },
    {
      lat: 26.916,
      lng: -80.0665,
      positionSource:
        'North end: the Carlin Park south property line, placed by the editor south of the 400 S. A1A entrance without a parcel map. Confirm against the Town map.',
      positionVerified: false,
    },
  ],
  source: `Extent and end markers: ${SOURCES.townDogs}.`,
}

/**
 * The numbering overlap on the Town's own pages, recorded as published.
 * The Dune Crossover Information page lists Town crossovers as #23, #25–31,
 * #37, #39–41, #45–53 and #65; County crossovers as #22, #24, #32–36, #38,
 * #42–44, #55, #57–64 and #66–72; and private crossovers as #31–35, #54 and
 * #56. So #31 appears as both Town and private, and #32–35 as both County and
 * private, while the Beaches page lists #31 as ADA accessible. This map does
 * not resolve that; it is left to the Town's map.
 */
export const NUMBERING_NOTES =
  "The Town's Dune Crossover Information page lists #31 to #35 as private crossovers while also counting #31 among Town crossovers and #32 to #35 among County crossovers. This map leaves that numbering as the Town publishes it."

/** Initial view: the whole Jupiter beach from the Juno Beach line to the inlet. */
export const MAP_CENTRE = { lat: 26.918, lng: -80.066 }
export const MAP_ZOOM = 13
