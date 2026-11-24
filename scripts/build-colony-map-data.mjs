// Builds src/lib/colonyMapData.generated.json for the Jupiter Inlet Colony
// town map from Palm Beach County GIS. Nothing is hand-drawn.
//
//   node scripts/build-colony-map-data.mjs
//
//  * boundary   PBC_Municipal_Boundaries, MUNINAME = 'JUPITER INLET COLONY'
//  * roads      County Engineering road centerlines whose left or right
//               municipality is the Colony, plus Beach Road (the way in)
//  * landmarks  centre of the Property Appraiser parcel at a published address
//  * parcels    a count by property use, for the "about 236 homes" figure
//  * sales      the Property Appraiser's latest recorded sale per parcel, kept
//               only when it is a qualified (code Q) warranty-deed sale of a
//               single-family parcel in the 12 months before the build date.
//               The layer holds one sale per parcel, so a home that sold twice
//               in the window shows once.
import { writeFileSync } from 'node:fs'

const BOUNDARY = 'https://services1.arcgis.com/ZWOoUZbtaYePLlPw/ArcGIS/rest/services/PBC_Municipal_Boundaries/FeatureServer/0'
const PARCELS = 'https://gis.pbcgov.org/arcgis/rest/services/Parcels/PARCEL_INFO/MapServer/4'
const CENTERLINE = 'https://gis.pbcgov.org/arcgis/rest/services/ENG/CENTERLINE/MapServer/0'
const ENVELOPE = '-80.0800,26.9438,-80.0703,26.9528'

const round = (n) => Math.round(n * 1e6) / 1e6
const pt = ([x, y]) => [round(x), round(y)]

async function query(base, params) {
  const url = `${base}/query?${new URLSearchParams({ f: 'json', outSR: '4326', ...params })}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  const body = await res.json()
  if (body.error) throw new Error(JSON.stringify(body.error))
  return body.features
}

const envelope = { geometry: ENVELOPE, geometryType: 'esriGeometryEnvelope', inSR: '4326', spatialRel: 'esriSpatialRelIntersects' }

const [town] = await query(BOUNDARY, { where: "MUNINAME='JUPITER INLET COLONY'", outFields: 'MUNINAME,FNAME', returnGeometry: 'true' })
if (!town) throw new Error('No boundary returned for Jupiter Inlet Colony')
const boundary = town.geometry.rings.map((ring) => ring.map(pt))

const lines = await query(CENTERLINE, { ...envelope, where: '1=1', outFields: 'STREET,L_MUNI,R_MUNI', returnGeometry: 'true' })
const COLONY = 'JUPITER INLET COLONY'
const roads = {}
for (const f of lines) {
  const { STREET, L_MUNI, R_MUNI } = f.attributes
  const inTown = L_MUNI === COLONY || R_MUNI === COLONY
  if (!inTown && STREET !== 'Beach Rd') continue
  const key = inTown ? STREET : 'Beach Rd'
  roads[key] ??= { name: key, inTown, lines: [] }
  for (const path of f.geometry.paths) roads[key].lines.push(path.map(pt))
}

const parcels = (await query(PARCELS, { ...envelope, where: "MUNICIPALITY='JUPITER INLET COLONY'", outFields: 'SITE_ADDR_STR,OWNER_NAME1,PROPERTY_USE,STREET_NAME,STREET_SUFFIX_ABBR,SALE_DATE,PRICE,INSTRUMENT,QUAL_CODE', returnGeometry: 'true', resultRecordCount: '1000' }))
const use = {}
for (const p of parcels) use[p.attributes.PROPERTY_USE] = (use[p.attributes.PROPERTY_USE] ?? 0) + 1

function parcelCentre(address) {
  const p = parcels.find((f) => f.attributes.SITE_ADDR_STR === address)
  if (!p) throw new Error(`No parcel at ${address}`)
  const ring = p.geometry.rings[0]
  const sum = ring.reduce((a, [x, y]) => [a[0] + x, a[1] + y], [0, 0])
  return { position: pt([sum[0] / ring.length, sum[1] / ring.length]), owner: p.attributes.OWNER_NAME1, use: p.attributes.PROPERTY_USE }
}

const now = new Date()
const retrieved = now.toISOString().slice(0, 10)
const from = new Date(Date.UTC(now.getUTCFullYear() - 1, now.getUTCMonth(), now.getUTCDate() + 1))
const inWindow = parcels
  .map((p) => p.attributes)
  .filter((a) => a.SALE_DATE >= from.getTime() && a.QUAL_CODE === 'Q' && a.INSTRUMENT === 'WD')
const STREET_SUFFIX = { RD: 'Road', DR: 'Drive', LN: 'Lane', PL: 'Place' }
const sales = inWindow
  .filter((a) => a.PROPERTY_USE === 'SINGLE FAMILY')
  .sort((a, b) => b.SALE_DATE - a.SALE_DATE)
  .map((a) => ({
    date: new Date(a.SALE_DATE).toISOString().slice(0, 10),
    street: `${a.STREET_NAME[0]}${a.STREET_NAME.slice(1).toLowerCase()} ${STREET_SUFFIX[a.STREET_SUFFIX_ABBR] ?? a.STREET_SUFFIX_ABBR}`,
    price: Number(a.PRICE),
  }))

const out = {
  retrieved,
  sources: { boundary: BOUNDARY, parcels: PARCELS, centerline: CENTERLINE },
  boundary,
  roads: Object.values(roads).sort((a, b) => a.name.localeCompare(b.name)),
  landmarks: {
    townHall: { address: '50 Colony Road', ...parcelCentre('50 COLONY RD') },
    beachClub: { address: '244 Ocean Drive', ...parcelCentre('244 OCEAN DR') },
  },
  parcels: { total: parcels.length, byUse: use },
  sales: {
    from: from.toISOString().slice(0, 10),
    to: retrieved,
    singleFamily: sales,
    /** Qualified sales in the window of parcels the county does not class single-family today (e.g. vacant). */
    excludedOtherUse: inWindow.length - sales.length,
  },
}

writeFileSync(new URL('../src/lib/colonyMapData.generated.json', import.meta.url), JSON.stringify(out) + '\n')
console.log(`boundary ${boundary[0].length} points, ${out.roads.length} roads, ${parcels.length} parcels`, use)
