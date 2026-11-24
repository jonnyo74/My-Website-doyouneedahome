// Builds the county-record data and the static map for /communities/admirals-cove.
// Nothing is hand-drawn and no figure is typed in: every count, sale and shape
// comes from Palm Beach County GIS on the day the script runs.
//
//   node scripts/build-admirals-cove-data.mjs
//
// Writes:
//   src/lib/admiralsCoveData.generated.json     counts, flood summary, recorded sales
//   public/images/admirals-cove/admirals-cove-map.svg   the static community map
//
// HOW THE COMMUNITY IS DEFINED
//   Every Property Appraiser parcel whose recorded plat (SUBDIV_NAME) contains
//   "ADMIRALS COVE", plus the one Golf Village clubhouse plat the county
//   truncates to "... AT  ADMIRALS". Two neighbouring plats with similar names
//   are NOT part of it and are left out on purpose: "ADMIRALS CORNER" (two
//   Mariner Drive lots) and "ADMIRALS CROSSING" (shops on Military Trail).
//
// EAST SIDE vs GOLF VILLAGE
//   A plat whose name contains "GOLF VILLAGE" or "ADMIRALS COVE WEST" is Golf
//   Village; everything else is the East Side. The two never touch: the
//   Florida East Coast Railway and Alternate A1A run between them.
//
// NAVIGABLE-WATER LOTS
//   A house lot counts as adjoining navigable water when any corner of its
//   parcel is within 8 metres of a county-mapped CANAL or ICWW polygon. The
//   measured distances are bimodal (0-8 m or more than 30 m), so the cut-off is
//   not doing any work. This says the lot backs onto the canal system. It does
//   NOT say the lot has a dock, or what boat the dock or the water will take.
//
// RECORDED SALES
//   The parcel layer holds the latest recorded sale of each parcel. A sale is
//   kept when it falls in the 12 months before the build date, the county marks
//   it qualified (QUAL_CODE Q), the instrument is a warranty deed (WD) and the
//   price is over $100,000 (nominal $10 deeds carry a Q now and then). A home
//   that sold twice in the window shows once. The county qualifies sales some
//   months after recording, so the newest months of the window run thin; the
//   file records the date of the latest qualified sale for that reason.
import { mkdirSync, writeFileSync } from 'node:fs'

const GIS = 'https://gis.pbcgov.org/arcgis/rest/services'
const PARCELS = `${GIS}/Parcels/PARCEL_INFO/MapServer/4`
const WATER = `${GIS}/ENG/WATER/MapServer/34`
const CENTERLINE = `${GIS}/ENG/CENTERLINE/MapServer/0`
const FLOOD = `${GIS}/FEMA/SFHA_2023/MapServer/57`

// Map window. Wide enough for both residential areas, Alternate A1A between
// them and the Intracoastal Waterway on the east.
const WEST = -80.1042
const EAST = -80.0722
const SOUTH = 26.8952
const NORTH = 26.9178
const ENVELOPE = `${WEST},${SOUTH},${EAST},${NORTH}`
const envelope = { geometry: ENVELOPE, geometryType: 'esriGeometryEnvelope', inSR: '4326', spatialRel: 'esriSpatialRelIntersects' }

async function query(base, params) {
  const all = []
  for (let offset = 0; ; ) {
    const body = new URLSearchParams({ f: 'json', outSR: '4326', geometryPrecision: '6', resultOffset: String(offset), resultRecordCount: '1000', orderByFields: 'OBJECTID', ...params })
    const res = await fetch(`${base}/query`, { method: 'POST', body })
    if (!res.ok) throw new Error(`${res.status} ${base}`)
    const json = await res.json()
    if (json.error) throw new Error(`${base}: ${JSON.stringify(json.error)}`)
    all.push(...json.features)
    if (json.features.length < 1000) break
    offset += json.features.length
  }
  return all
}

// ── Fetch ────────────────────────────────────────────────────────────────

const FIELDS = 'PARCEL_NUMBER,ACRES,OWNER_NAME1,SITE_ADDR_STR,STREET_NUMBER,PRE_DIR,STREET_NAME,STREET_SUFFIX_ABBR,MUNICIPALITY,SALE_DATE,PRICE,INSTRUMENT,QUAL_CODE,SUBDIV_NAME,PROPERTY_USE'
const [parcels, water, roads, flood] = await Promise.all([
  query(PARCELS, { where: "UPPER(SUBDIV_NAME) LIKE '%ADMIRALS COVE%' OR SUBDIV_NAME = 'CLUBHOUSE PAR GOLF VILLAGE AT  ADMIRALS'", outFields: FIELDS, returnGeometry: 'true' }),
  query(WATER, { ...envelope, where: '1=1', outFields: 'OBJECTID,FINALNAME,TYPE', returnGeometry: 'true' }),
  query(CENTERLINE, { ...envelope, where: '1=1', outFields: 'STREET', returnGeometry: 'true' }),
  query(FLOOD, { ...envelope, where: '1=1', outFields: 'FLD_ZONE,ZONE_SUBTY', returnGeometry: 'true' }),
])
if (parcels.length < 900) throw new Error(`Only ${parcels.length} parcels returned; the county layer or the plat filter has changed`)

// ── Classify ─────────────────────────────────────────────────────────────

const isGolfVillage = (a) => /GOLF VILLAGE|ADMIRALS COVE WEST/.test(a.SUBDIV_NAME)
const KIND = { 'SINGLE FAMILY': 'house', CONDOMINIUM: 'condo', TOWNHOUSE: 'townhouse' }
const municipalities = [...new Set(parcels.map((p) => p.attributes.MUNICIPALITY))]

const counts = { east: { house: 0, condo: 0, townhouse: 0, vacant: 0 }, golfVillage: { house: 0, condo: 0, townhouse: 0, vacant: 0 } }
for (const { attributes: a } of parcels) {
  const side = isGolfVillage(a) ? 'golfVillage' : 'east'
  if (KIND[a.PROPERTY_USE]) counts[side][KIND[a.PROPERTY_USE]]++
  else if (a.PROPERTY_USE === 'VACANT') counts[side].vacant++
}

// Condominium associations as the county names their declarations.
const CONDO_NAMES = {
  'CAPTAINS WAY AT ADMIRALS COVE': 'Captains Way',
  'WATERSIDE AT ADMIRALS COVE': 'Waterside',
  'SPYGLASS AT ADMIRALS COVE': 'Spyglass',
  'NAUTICAL WAY AT ADMIRALS COVE': 'Nautical Way',
}
const condos = Object.entries(CONDO_NAMES).map(([plat, name]) => {
  const rows = parcels.filter((p) => p.attributes.PROPERTY_USE === 'CONDOMINIUM' && p.attributes.SUBDIV_NAME.startsWith(plat))
  return { name, units: rows.length }
})
const namedCondoUnits = condos.reduce((s, c) => s + c.units, 0)
if (namedCondoUnits !== counts.east.condo + counts.golfVillage.condo) throw new Error('A condominium declaration is not in CONDO_NAMES')

// Acreage: one figure per distinct shape, because every unit in a condominium
// repeats the acreage of the whole condominium parcel.
const seenShape = new Set()
let acres = 0
for (const p of parcels) {
  const key = JSON.stringify(p.geometry.rings[0].slice(0, 4))
  if (seenShape.has(key)) continue
  seenShape.add(key)
  acres += Number(p.attributes.ACRES) || 0
}

// ── Navigable-water lots ─────────────────────────────────────────────────

const M_LAT = 111_320
const M_LNG = M_LAT * Math.cos((((SOUTH + NORTH) / 2) * Math.PI) / 180)
const navigable = water.filter((f) => /^(CANAL|ICWW)$/.test(f.attributes.TYPE))
const segments = []
for (const f of navigable) for (const ring of f.geometry.rings) for (let i = 1; i < ring.length; i++) segments.push([ring[i - 1][0] * M_LNG, ring[i - 1][1] * M_LAT, ring[i][0] * M_LNG, ring[i][1] * M_LAT])
function metresToWater(rings) {
  let best = Infinity
  for (const [lng, lat] of rings[0]) {
    const px = lng * M_LNG
    const py = lat * M_LAT
    for (const [x1, y1, x2, y2] of segments) {
      const dx = x2 - x1
      const dy = y2 - y1
      const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy || 1)))
      const d = Math.hypot(px - x1 - t * dx, py - y1 - t * dy)
      if (d < best) best = d
    }
  }
  return best
}
const NEAR_M = 8
const onWater = new Map()
for (const p of parcels) {
  const a = p.attributes
  if (!/SINGLE FAMILY|TOWNHOUSE|VACANT/.test(a.PROPERTY_USE)) continue
  onWater.set(a.PARCEL_NUMBER, metresToWater(p.geometry.rings) <= NEAR_M)
}
const lotIsHouse = (p) => p.attributes.PROPERTY_USE === 'SINGLE FAMILY'
const eastHouses = parcels.filter((p) => lotIsHouse(p) && !isGolfVillage(p.attributes))
const waterLots = {
  eastHouses: eastHouses.filter((p) => onWater.get(p.attributes.PARCEL_NUMBER)).length,
  eastHousesTotal: eastHouses.length,
  golfVillage: parcels.filter((p) => isGolfVillage(p.attributes) && onWater.get(p.attributes.PARCEL_NUMBER)).length,
}

// ── Flood zones (county copy of FEMA's layer) ────────────────────────────

const inRing = (pt, ring) => {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    if (yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}
const inPolygon = (pt, rings) => rings.reduce((inside, ring) => (inRing(pt, ring) ? !inside : inside), false)
const centre = (rings) => {
  const ring = rings[0]
  const sum = ring.reduce((a, [x, y]) => [a[0] + x, a[1] + y], [0, 0])
  return [sum[0] / ring.length, sum[1] / ring.length]
}
const floodZones = { east: {}, golfVillage: {} }
for (const p of parcels) {
  if (!KIND[p.attributes.PROPERTY_USE]) continue
  const side = isGolfVillage(p.attributes) ? 'golfVillage' : 'east'
  const zone = flood.find((f) => inPolygon(centre(p.geometry.rings), f.geometry.rings))
  const label = !zone ? 'unmapped' : zone.attributes.FLD_ZONE === 'X' ? (/0\.2/.test(zone.attributes.ZONE_SUBTY ?? '') ? 'X-shaded' : 'X') : zone.attributes.FLD_ZONE
  floodZones[side][label] = (floodZones[side][label] ?? 0) + 1
}

// ── Recorded sales ───────────────────────────────────────────────────────

const now = new Date()
const retrieved = now.toISOString().slice(0, 10)
const from = new Date(Date.UTC(now.getUTCFullYear() - 1, now.getUTCMonth(), now.getUTCDate() + 1))
const SUFFIX = { DR: 'Drive', LN: 'Lane', CT: 'Court', WAY: 'Way', BLVD: 'Boulevard', CIR: 'Circle', RD: 'Road' }
const title = (s) => s.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase())
const address = (a) => [a.STREET_NUMBER, a.PRE_DIR, title(a.STREET_NAME), SUFFIX[a.STREET_SUFFIX_ABBR] ?? title(a.STREET_SUFFIX_ABBR ?? '')].filter(Boolean).join(' ')
const inWindow = parcels.map((p) => p.attributes).filter((a) => KIND[a.PROPERTY_USE] && a.SALE_DATE >= from.getTime())
const qualified = inWindow.filter((a) => a.QUAL_CODE === 'Q' && a.INSTRUMENT === 'WD' && Number(a.PRICE) > 100_000)
const sales = qualified
  .sort((a, b) => b.SALE_DATE - a.SALE_DATE)
  .map((a) => ({
    date: new Date(a.SALE_DATE).toISOString().slice(0, 10),
    address: address(a),
    price: Number(a.PRICE),
    area: isGolfVillage(a) ? 'golf-village' : 'east',
    type: KIND[a.PROPERTY_USE],
    // null for condominiums: a unit has no lot line of its own to measure.
    water: a.PROPERTY_USE === 'CONDOMINIUM' ? null : (onWater.get(a.PARCEL_NUMBER) ?? null),
  }))
/** Deeds in the window with a real price that the county has not marked qualified. */
const pricedNotQualified = inWindow.filter((a) => !(a.QUAL_CODE === 'Q' && a.INSTRUMENT === 'WD') && Number(a.PRICE) > 100_000).length

// ── Landmarks ────────────────────────────────────────────────────────────

function parcelCentre(test, what) {
  const hits = parcels.filter((p) => test(p.attributes)).sort((a, b) => b.attributes.ACRES - a.attributes.ACRES)
  if (!hits.length) throw new Error(`No parcel for ${what}`)
  return centre(hits[0].geometry.rings)
}
const landmarks = {
  // The club's own parcels, by the plat each sits on.
  mainClubhouse: parcelCentre((a) => a.SUBDIV_NAME.startsWith('CLUBHOUSE ISLAND') && /CLUB AT ADMIRALS COVE/.test(a.OWNER_NAME1 ?? ''), 'main clubhouse'),
  golfVillageClubhouse: parcelCentre((a) => a.SUBDIV_NAME.startsWith('CLUBHOUSE PAR GOLF VILLAGE') && a.PROPERTY_USE === 'GOLF COURSE', 'Golf Village clubhouse'),
  marina: parcelCentre((a) => a.SUBDIV_NAME === 'MARINA AT ADMIRALS COVE', 'marina'),
}

const data = {
  retrieved,
  sources: { parcels: PARCELS, water: WATER, centerline: CENTERLINE, flood: FLOOD },
  municipalities,
  parcels: { total: parcels.length, acres: Math.round(acres), counts, condos, waterLots },
  floodZones,
  sales: {
    from: from.toISOString().slice(0, 10),
    to: retrieved,
    latestQualified: sales[0]?.date ?? null,
    rows: sales,
    pricedNotQualified,
  },
}
writeFileSync(new URL('../src/lib/admiralsCoveData.generated.json', import.meta.url), JSON.stringify(data, null, 1) + '\n')

// ── Static map ───────────────────────────────────────────────────────────

const W = 1000
const SCALE = W / ((EAST - WEST) * M_LNG) // SVG units per metre
const H = Math.round((NORTH - SOUTH) * M_LAT * SCALE)
const X = (lng) => ((lng - WEST) * M_LNG * SCALE).toFixed(1)
const Y = (lat) => ((NORTH - lat) * M_LAT * SCALE).toFixed(1)
const ringPath = (ring) => ring.map(([lng, lat], i) => `${i ? 'L' : 'M'}${X(lng)} ${Y(lat)}`).join('') + 'Z'
const linePath = (line) => line.map(([lng, lat], i) => `${i ? 'L' : 'M'}${X(lng)} ${Y(lat)}`).join('')
const shapes = (features) => {
  const seen = new Set()
  const out = []
  for (const f of features) for (const ring of f.geometry.rings) {
    const d = ringPath(ring)
    if (seen.has(d)) continue
    seen.add(d)
    out.push(d)
  }
  return out.join('')
}

const residential = (p) => KIND[p.attributes.PROPERTY_USE] || p.attributes.PROPERTY_USE === 'VACANT'
const eastHomes = shapes(parcels.filter((p) => residential(p) && !isGolfVillage(p.attributes)))
const gvHomes = shapes(parcels.filter((p) => residential(p) && isGolfVillage(p.attributes)))
const golf = shapes(parcels.filter((p) => p.attributes.PROPERTY_USE === 'GOLF COURSE'))
const marinaShape = shapes(parcels.filter((p) => p.attributes.SUBDIV_NAME === 'MARINA AT ADMIRALS COVE'))
const navWater = shapes(navigable)
const lakes = shapes(water.filter((f) => !/^(CANAL|ICWW)$/.test(f.attributes.TYPE)))

const INSIDE = new Set(['Admirals Cove Blvd', 'Captains Way', 'Clipper Ln', 'Commodore Dr', 'Eagle Dr', 'Golf Village Blvd', 'Island Dr', 'Mariner Dr', 'N Village Way', 'Nautical Way', 'Quayside Dr', 'Regatta Dr', 'S Village Way', 'Schooner Ln', 'Spinnaker Ln', 'Spyglass Ct', 'Spyglass Ln', 'Spyglass Way', 'Victory Dr', 'Village Clubhouse Cir', 'W Village Way', 'Waters Edge Dr'])
const MAJOR = new Set(['S Alternate A1A', 'Military Trl', 'Frederick Small Rd', 'E Frederick Small Rd', 'W Frederick Small Rd'])
const roadPaths = (names) => roads.filter((f) => names.has(f.attributes.STREET)).flatMap((f) => f.geometry.paths.map(linePath)).join('')

// Where Admirals Cove Boulevard meets Alternate A1A: the East Side entrance the
// association's own map shows. Found as the closest pair of centerline points.
const pts = (name) => roads.filter((f) => f.attributes.STREET === name).flatMap((f) => f.geometry.paths.flat())
let entrance = null
let bestGap = Infinity
for (const a of pts('Admirals Cove Blvd')) for (const b of pts('S Alternate A1A')) {
  const gap = Math.hypot((a[0] - b[0]) * M_LNG, (a[1] - b[1]) * M_LAT)
  if (gap < bestGap) {
    bestGap = gap
    entrance = a
  }
}
if (!entrance || bestGap > 60) throw new Error('Admirals Cove Blvd no longer meets Alternate A1A in the centerline layer')

const pin = ([lng, lat], label, sub, dx = 12, dy = 5, anchor = 'start') => `
  <rect x="${(X(lng) - 6).toFixed(1)}" y="${(Y(lat) - 6).toFixed(1)}" width="12" height="12" fill="#0B1929" stroke="#fff" stroke-width="2"/>
  <text x="${(+X(lng) + dx).toFixed(1)}" y="${(+Y(lat) + dy).toFixed(1)}" text-anchor="${anchor}" font-weight="700">${label}</text>${sub ? `
  <text x="${(+X(lng) + dx).toFixed(1)}" y="${(+Y(lat) + dy + 17).toFixed(1)}" text-anchor="${anchor}">${sub}</text>` : ''}`
const label = (lng, lat, text, extra = '') => `<text x="${X(lng)}" y="${Y(lat)}" ${extra}>${text}</text>`
const rot = (lng, lat, deg) => `transform="rotate(${deg} ${X(lng)} ${Y(lat)})"`
const QUARTER_MILE = 402.336 * SCALE

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="15" fill="#0B1929">
<title>Admirals Cove, Jupiter: East Side, Golf Village, clubhouses, marina and waterways</title>
<rect width="${W}" height="${H}" fill="#F8FAFC"/>
<path d="${lakes}" fill="#D9E8F2"/>
<path d="${navWater}" fill="#A9CBE3"/>
<path d="${golf}" fill="#D5E5C8"/>
<path d="${eastHomes}" fill="#F1DFAE" stroke="#B8975A" stroke-width="0.6"/>
<path d="${gvHomes}" fill="#C9D3E6" stroke="#6B7FA8" stroke-width="0.6"/>
<path d="${marinaShape}" fill="none" stroke="#0B1929" stroke-width="2" stroke-dasharray="5 4"/>
<path d="${roadPaths(MAJOR)}" fill="none" stroke="#64748B" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${roadPaths(INSIDE)}" fill="none" stroke="#8A6E33" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.75"/>
<g paint-order="stroke" stroke="#F8FAFC" stroke-width="4" stroke-linejoin="round">
  <g fill="#33526E" font-style="italic" font-weight="600" font-size="17" letter-spacing="1">
    ${label(-80.0752, 26.9064, 'Intracoastal Waterway', `text-anchor="middle" ${rot(-80.0752, 26.9064, 80)}`)}
  </g>
  <g fill="#475569" font-size="14" font-weight="600">
    ${label(-80.0957, 26.9152, 'Alternate A1A', `text-anchor="middle" ${rot(-80.0957, 26.9152, -84)}`)}
    ${label(-80.1026, 26.9120, 'Military Trail', `text-anchor="middle" ${rot(-80.1026, 26.9120, -88)}`)}
    ${label(-80.0860, 26.8958, 'Frederick Small Road', 'text-anchor="middle"')}
  </g>
  <g font-size="21" font-weight="700" letter-spacing="0.5">
    ${label(-80.0868, 26.9112, 'EAST SIDE', 'text-anchor="middle"')}
    ${label(-80.0988, 26.9092, 'GOLF VILLAGE', 'text-anchor="middle"')}
  </g>
  ${pin(landmarks.mainClubhouse, 'Main clubhouse', '', 12, 5)}
  ${pin(landmarks.marina, 'Marina', '', 12, -8)}
  ${pin(landmarks.golfVillageClubhouse, 'Golf Village clubhouse', '', 0, 26, 'middle')}
  <g font-size="14">
    <path d="M${X(-80.0768)} ${Y(26.9160)} v-34 m-7 9 l7 -11 l7 11" fill="none" stroke="#0B1929" stroke-width="2.5" paint-order="normal"/>
    ${label(-80.0760, 26.9166, 'To Jupiter Inlet', 'font-weight="700"')}
    ${label(-80.0760, 26.9166 - 0.00048, 'by water, north')}
  </g>
  <g font-size="14">
    <circle cx="${X(entrance[0])}" cy="${Y(entrance[1])}" r="6" fill="#C9A961" stroke="#0B1929" stroke-width="2" paint-order="normal"/>
    <text x="${(+X(entrance[0]) + 12).toFixed(1)}" y="${(+Y(entrance[1]) - 9).toFixed(1)}" font-weight="700">East Side entrance</text>
  </g>
</g>
<g font-size="14">
  <rect x="14" y="${H - 132}" width="250" height="118" rx="8" fill="#fff" stroke="#CBD5E1"/>
  <rect x="28" y="${H - 118}" width="18" height="12" fill="#F1DFAE" stroke="#B8975A"/><text x="54" y="${H - 107}">East Side homes</text>
  <rect x="28" y="${H - 96}" width="18" height="12" fill="#C9D3E6" stroke="#6B7FA8"/><text x="54" y="${H - 85}">Golf Village homes</text>
  <rect x="28" y="${H - 74}" width="18" height="12" fill="#D5E5C8"/><text x="54" y="${H - 63}">Club golf course land</text>
  <rect x="28" y="${H - 52}" width="18" height="12" fill="#A9CBE3"/><text x="54" y="${H - 41}">Canals and Intracoastal</text>
  <rect x="28" y="${H - 30}" width="18" height="12" fill="#D9E8F2"/><text x="54" y="${H - 19}">Lakes (not navigable)</text>
</g>
<g font-size="14" stroke="#0B1929">
  <path d="M34 52 l9 26 h-18 z"/><text x="34" y="40" text-anchor="middle" stroke="none" font-weight="700">N</text>
  <path d="M${W - 40 - QUARTER_MILE} ${H - 30} h${QUARTER_MILE.toFixed(1)}" stroke-width="3"/>
  <text x="${(W - 40 - QUARTER_MILE).toFixed(1)}" y="${H - 40}" stroke="none">¼ mile</text>
</g>
</svg>
`
mkdirSync(new URL('../public/images/admirals-cove/', import.meta.url), { recursive: true })
writeFileSync(new URL('../public/images/admirals-cove/admirals-cove-map.svg', import.meta.url), svg)

console.log(`${parcels.length} parcels in ${municipalities.join('/')}, about ${Math.round(acres)} platted acres`)
console.log(counts, condos, waterLots, floodZones)
console.log(`${sales.length} qualified sales ${data.sales.from} to ${retrieved}; latest ${data.sales.latestQualified}; ${pricedNotQualified} priced deeds not qualified`)
console.log(`map ${W}x${H}, ${(svg.length / 1024).toFixed(0)} KB`)
