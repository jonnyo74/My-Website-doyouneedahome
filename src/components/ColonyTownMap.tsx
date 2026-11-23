import raw from '@/lib/colonyMapData.generated.json'

// A static town map of Jupiter Inlet Colony, drawn as inline SVG from Palm
// Beach County GIS (see scripts/build-colony-map-data.mjs). No tiles, no
// script, nothing to load: the boundary is the county's municipal polygon, the
// streets are county road centerlines, and the two pins are the centre of the
// county parcel at a published address. Nothing is hand-drawn.
//
// The area outside the boundary is left blank on purpose. Water is named on
// the side the Town's own documents put it, not drawn, and no path, walkway or
// private lot is marked: the map is for orientation, not for access.

type LngLat = [number, number]

const W = 760
const H = 720
// View window: the boundary plus room for the water names and Beach Road.
const WEST = -80.0822
const NORTH = 26.9538
const COS = Math.cos((26.948 * Math.PI) / 180)
const SCALE = 66000 // SVG units per degree of latitude

const x = (lng: number) => (lng - WEST) * COS * SCALE
const y = (lat: number) => (NORTH - lat) * SCALE
const path = (pts: LngLat[], close = false) =>
  pts.map(([lng, lat], i) => `${i ? 'L' : 'M'}${x(lng).toFixed(1)} ${y(lat).toFixed(1)}`).join('') + (close ? 'Z' : '')

const boundary = (raw.boundary as LngLat[][]).map((ring) => path(ring, true)).join('')
const roads = raw.roads as { name: string; inTown: boolean; lines: LngLat[][] }[]
const townHall = raw.landmarks.townHall.position as LngLat
const beachClub = raw.landmarks.beachClub.position as LngLat

// Where each street's name sits, and its angle. Positions are along the
// street's own centerline; they were placed by eye so no two names collide.
const STREET_LABELS: { name: string; at: LngLat; rotate: number; dx: number }[] = [
  { name: 'Lighthouse Dr', at: [-80.07748, 26.9493], rotate: -88, dx: -9 },
  { name: 'Beacon Ln', at: [-80.07668, 26.9497], rotate: -88, dx: -8 },
  { name: 'Colony Rd', at: [-80.07486, 26.9505], rotate: -68, dx: 19 },
  { name: 'Ocean Dr', at: [-80.07372, 26.9492], rotate: -68, dx: 21 },
  { name: 'Shelter Ln', at: [-80.0759, 26.9478], rotate: -88, dx: -9 },
]

const FT_500 = (152.4 / 111_320) * SCALE

export const COLONY_MAP_DESCRIPTION =
  'Map of the Town of Jupiter Inlet Colony. The town is a rounded point of land a little over half a mile from north to south. ' +
  'The Atlantic Ocean is on the east side, Jupiter Inlet is at the south end and the Intracoastal Waterway is on the west side. ' +
  'The only road in is Beach Road, which arrives from the Village of Tequesta at the north end and becomes Colony Road. ' +
  'Ocean Drive runs down the east side, Lighthouse Drive down the west side, and Beacon Lane, Shelter Lane and Colony Road run through the middle, ' +
  'joined by three short cross streets: Treasure Place, Pirates Place and Cove Place. ' +
  'Town Hall is at the north end at 50 Colony Road. The Jupiter Inlet Beach Club, a private club, is near the south end at 244 Ocean Drive. ' +
  'The Jupiter Inlet Lighthouse is not in the town: it is across the Intracoastal Waterway to the west, in Jupiter.'

export default function ColonyTownMap() {
  const [thX, thY] = [x(townHall[0]), y(townHall[1])]
  const [bcX, bcY] = [x(beachClub[0]), y(beachClub[1])]
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby="colony-map-title colony-map-desc"
      className="h-auto w-full rounded-2xl border border-slate-200 bg-slate-50"
      style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
    >
      <title id="colony-map-title">Town of Jupiter Inlet Colony: boundary, streets and landmarks</title>
      <desc id="colony-map-desc">{COLONY_MAP_DESCRIPTION}</desc>

      {/* Water names, on the side the Town's documents put each one */}
      <g fill="#33526E" fontSize="21" fontStyle="italic" fontWeight="600" letterSpacing="1.5">
        <text x={W - 40} y={H * 0.5} textAnchor="middle" transform={`rotate(72 ${W - 40} ${H * 0.5})`}>
          Atlantic Ocean
        </text>
        <text x={x(-80.0752)} y={H - 34} textAnchor="middle">Jupiter Inlet</text>
        <text x={104} y={H * 0.62} textAnchor="middle" transform={`rotate(-80 104 ${H * 0.62})`}>
          Intracoastal Waterway
        </text>
      </g>

      {/* Town boundary */}
      <path d={boundary} fill="#FFFBF0" stroke="#0B1929" strokeWidth="3" strokeLinejoin="round" />

      {/* Beach Road, outside the town: the way in */}
      {roads
        .filter((r) => !r.inTown)
        .flatMap((r) => r.lines)
        .map((line, i) => (
          <path key={`out-${i}`} d={path(line)} fill="none" stroke="#64748B" strokeWidth="4" strokeDasharray="2 7" strokeLinecap="round" />
        ))}

      {/* Streets inside the town */}
      {roads
        .filter((r) => r.inTown)
        .flatMap((r) => r.lines.map((line, i) => (
          <path key={`${r.name}-${i}`} d={path(line)} fill="none" stroke="#8A6E33" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        )))}

      <g fill="#0B1929" fontSize="17" fontWeight="600" paintOrder="stroke" stroke="#FFFBF0" strokeWidth="5" strokeLinejoin="round">
        {STREET_LABELS.map((l) => (
          <text
            key={l.name}
            x={x(l.at[0]) + l.dx}
            y={y(l.at[1])}
            textAnchor="middle"
            transform={`rotate(${l.rotate} ${(x(l.at[0]) + l.dx).toFixed(1)} ${y(l.at[1]).toFixed(1)})`}
          >
            {l.name}
          </text>
        ))}
      </g>

      {/* Way in */}
      <g fill="#0B1929" fontSize="17" fontWeight="600">
        <text x={x(-80.0806)} y={y(26.9531)} textAnchor="middle">Beach Road</text>
        <text x={x(-80.0806)} y={y(26.9531) + 21} textAnchor="middle" fontWeight="400">from Tequesta</text>
      </g>

      {/* Landmarks: centre of the county parcel at the published address */}
      <g paintOrder="stroke" stroke="#F8FAFC" strokeWidth="5" strokeLinejoin="round" fontSize="17" fill="#0B1929">
        <rect x={thX - 8} y={thY - 8} width="16" height="16" fill="#0B1929" stroke="#FFFFFF" strokeWidth="2.5" />
        <text x={thX + 22} y={thY - 24} fontWeight="700">Town Hall</text>
        <rect x={bcX - 8} y={bcY - 8} width="16" height="16" fill="#0B1929" stroke="#FFFFFF" strokeWidth="2.5" />
        <text x={bcX + 18} y={bcY + 2} fontWeight="700">Beach Club</text>
        <text x={bcX + 18} y={bcY + 23}>(private club)</text>
      </g>

      {/* The lighthouse is off the map, across the water */}
      <g fill="#0B1929" fontSize="16">
        <path d="M22 108 l14 -9 v6 h30 v6 h-30 v6 z" />
        <text x={20} y={140} fontWeight="700">Jupiter Inlet</text>
        <text x={20} y={160} fontWeight="700">Lighthouse</text>
        <text x={20} y={180}>across the water,</text>
        <text x={20} y={200}>in Jupiter</text>
      </g>

      {/* North arrow and scale */}
      <g fill="#0B1929" stroke="#0B1929" fontSize="16">
        <path d={`M${W - 52} 64 l9 26 h-18 z`} />
        <text x={W - 52} y={52} textAnchor="middle" stroke="none" fontWeight="700">N</text>
        <path d={`M34 ${H - 34} h${FT_500.toFixed(1)}`} strokeWidth="3" />
        <path d={`M34 ${H - 41} v14 M${(34 + FT_500).toFixed(1)} ${H - 41} v14`} strokeWidth="2" />
        <text x={34} y={H - 50} stroke="none">500 ft</text>
      </g>
    </svg>
  )
}
