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
 *   - WHERE a point sits (lat/lng). The six park and lot positions were
 *     confirmed on 2026-10-02 by John Oliver, who centred a Google Maps view
 *     on each lot; the coordinates come from those views and each record's
 *     `positionSource` says so. The dog corridor's two end points are placed
 *     from Town landmarks (Marcinski Road, the Carlin Park line) and stay
 *     `positionVerified: false`. The map caption tells readers positions are
 *     approximate.
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
      lat: 26.89555,
      lng: -80.06197,
      positionSource:
        'Confirmed by John Oliver on 2026-10-02: a Google Maps view centred on the Ocean Cay Park lot (URL centre 26.895554,-80.061965). The park sits just north of the Juno Beach Park pier, across the town line; an earlier placement 900 m north was wrong.',
      positionVerified: true,
    },
    source: `Name, address and guarded status: ${SOURCES.countyOceanCay}. Listed as a free lot: ${SOURCES.townParkingFaq}.`,
  },
  {
    id: 'a1a-lot-27-28',
    layer: 'parks',
    name: 'Town lot between crossovers #27 and #28',
    operator: 'Town of Jupiter',
    address: '3610 S. State Road A1A (Jimmy Buffett Memorial Highway), Jupiter, FL 33477',
    href: SOURCES.townParkingFaq,
    alsoHref: SOURCES.townBeaches,
    note: 'A parking lot, not a park. Named on the Town Beaches page and parking FAQ as a free lot.',
    position: {
      lat: 26.8996,
      lng: -80.0637,
      positionSource:
        'Confirmed by John Oliver on 2026-10-02: a Google Maps view centred on the lot, which Google lists as "Parking lot, 3610 Jimmy Buffett Mem Hwy" (URL centre 26.8996061,-80.06…; the longitude was cut off in the screenshot and is read from the view, so it may be off by a few dozen metres). The lot sits west of A1A behind the Bluffs, about 400 m north of Marcinski Road.',
      positionVerified: true,
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
      lat: 26.9292,
      lng: -80.0718,
      positionSource:
        'Confirmed by John Oliver on 2026-10-02: a Google Maps view centred on Carlin Park (URL centre 26.9283357,-80.0724639); the pin is set on the main beach lot just north of that centre. An earlier placement 1 km south was wrong.',
      positionVerified: true,
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
      lat: 26.941,
      lng: -80.0742,
      positionSource:
        'Confirmed by John Oliver on 2026-10-02: a Google Maps view centred on Jupiter Beach Park (URL centre 26.9402251,-80.0742234); the pin is set on the Ocean Trail Way lot just north of that centre.',
      positionVerified: true,
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
      lat: 26.943,
      lng: -80.0779,
      positionSource:
        'Confirmed by John Oliver on 2026-10-02: a Google Maps view centred on the DuBois Road entrance (URL centre 26.94238,-80.0789549); the pin is set on the lot between DuBois Road and the lagoon. src/lib/paddle/launches.ts carries 26.94238,-80.07638 for the same park, 150 m east inside the park.',
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
      lat: 26.8965,
      lng: -80.0603,
      positionSource:
        'South end: the beach at Marcinski Road, read from the Ocean Cay Park view John Oliver confirmed on 2026-10-02 (Marcinski Road meets A1A about 75 m north of the park lot; the beach is about 180 m east). The Town places #26 at Marcinski Road.',
      positionVerified: false,
    },
    {
      lat: 26.9245,
      lng: -80.07,
      positionSource:
        'North end: the Carlin Park south property line, placed on the beach about 500 m south of the confirmed Carlin Park lot without a parcel map. Confirm against the Town map or a view of the dog-beach sign at the Carlin line.',
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
export const MAP_CENTRE = { lat: 26.918, lng: -80.069 }
export const MAP_ZOOM = 13
