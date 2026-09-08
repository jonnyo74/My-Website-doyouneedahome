/**
 * Builds the street-name index the Sun & Shade typeahead uses when no address
 * provider is configured.
 *
 * Why this exists: no free, keyless service does US street-address
 * autocomplete. Six were tested and all six failed — Photon has no US house
 * numbers, the Census geocoder needs a complete address, Nominatim's policy
 * forbids per-keystroke querying, and a prefix query against the Florida
 * cadastral layer is rejected outright after ~55s whether or not it is bounded
 * to a county.
 *
 * So we own the data instead, which is the same thing condowpb.com does with
 * its 42 buildings. Street NAMES are small — 16,602 distinct ones across Palm
 * Beach County, 314 KB — while the full address roll is ~870,000 rows and far
 * too large to ship. The house number comes from what the user typed, so
 * "2414" + "24th Lane" reconstructs the address without ever needing a
 * provider that knows house numbers.
 *
 * Run manually; the output is committed. Streets change on the timescale of new
 * subdivisions, so this does not need a schedule:
 *
 *   node scripts/build-street-index.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs'

/**
 * Overpass mirrors, tried in order and then round-robin on retry.
 *
 * All of them are volunteer-run and will answer 429 when leaned on, which a
 * bulk query like this one does — hence the backoff. This script is the reason
 * the runtime code never queries Overpass for street names: it happens here,
 * once, and the result is committed.
 */
const OVERPASS_MIRRORS = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
]

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * The service area, as [south, west, north, east].
 *
 * Palm Beach County runs west to roughly -80.70 to take in Wellington,
 * Loxahatchee, Westlake and the Glades communities. Martin and St. Lucie cover
 * the Treasure Coast pages.
 */
const AREAS = [
  { name: 'Palm Beach', bbox: [26.30, -80.70, 27.00, -80.03] },
  { name: 'Martin', bbox: [26.95, -80.45, 27.25, -80.10] },
  { name: 'St. Lucie', bbox: [27.20, -80.60, 27.60, -80.20] },
]

/** Road classes people live on. Motorways and slip roads are not addresses. */
const HIGHWAY_TYPES = 'residential|tertiary|secondary|primary|unclassified|living_street'

async function fetchArea({ name, bbox }) {
  const [s, w, n, e] = bbox
  const query = `[out:json][timeout:240];
way["highway"~"^(${HIGHWAY_TYPES})$"]["name"](${s},${w},${n},${e});
out tags center;`

  process.stdout.write(`  ${name}... `)

  for (let attempt = 0; attempt < 9; attempt += 1) {
    const endpoint = OVERPASS_MIRRORS[attempt % OVERPASS_MIRRORS.length]
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'FloridaSunShadeAnalyzer-build/1.0',
        },
        body: `data=${encodeURIComponent(query)}`,
      })
      if (res.ok) {
        const { elements = [] } = await res.json()
        console.log(`${elements.length} segments`)
        return elements
      }
      // 429 means "come back later", which is a request to honour, not retry
      // through. Backoff grows so a busy mirror gets a real rest.
      process.stdout.write(`[${res.status}] `)
    } catch (error) {
      process.stdout.write(`[${error.code ?? 'error'}] `)
    }
    await sleep(8000 * (attempt + 1))
  }

  throw new Error(`Could not fetch ${name} from any Overpass mirror`)
}

/**
 * Every place we can name, with a coordinate: the cities and neighbourhoods the
 * site already documents. Used to label a street with somewhere real.
 *
 * Read out of communities.ts as TEXT rather than imported. The module is
 * TypeScript with its own imports, and pulling it into a plain build script
 * would drag the whole graph in for two numbers per record.
 */
const PLACES = readFileSync('src/lib/communities.ts', 'utf8')
  // Each record starts at its `slug:`; splitting there keeps a record's `name`
  // with its own coordinates. A single regex cannot: the two sit ~150 lines
  // apart with nested objects (and their braces) in between.
  .split("slug: '")
  .slice(1)
  .flatMap((chunk) => {
    const name = /name: '([^']+)'/.exec(chunk)?.[1]
    const point = /lat:\s*(-?\d+\.\d+),\s*lng:\s*(-?\d+\.\d+)/.exec(chunk)
    if (!name || !point) return []
    return [{ name, lat: Number(point[1]), lng: Number(point[2]) }]
  })

// 24 of the 83 community records carry coordinates; those 24 are the cities
// and towns, which is exactly the set worth labelling a street with.
if (PLACES.length < 20) {
  throw new Error(`Only ${PLACES.length} places parsed from communities.ts - the shape changed.`)
}
console.log(String(PLACES.length) + ' named places with coordinates')

function nearestPlace(lat, lng) {
  let best = null
  let bestDistance = Infinity
  for (const place of PLACES) {
    // Squared degrees is monotonic with real distance over an area this small,
    // and this runs ~48,000 times — no need for haversine.
    const dLat = place.lat - lat
    const dLng = (place.lng - lng) * 0.89 // cos(27°), so a degree of longitude counts fairly
    const d = dLat * dLat + dLng * dLng
    if (d < bestDistance) {
      bestDistance = d
      best = place
    }
  }
  return best?.name ?? null
}

const streets = new Map()

console.log('Fetching road names from OpenStreetMap:')
for (const area of AREAS) {
  const elements = await fetchArea(area)
  for (const el of elements) {
    const name = el.tags?.name?.trim()
    const centre = el.center
    if (!name || !centre) continue
    // A street is keyed by name AND place, so "Ocean Drive" in two cities stays
    // two suggestions rather than one that is wrong for half the people typing it.
    const place = nearestPlace(centre.lat, centre.lon)
    if (!place) continue
    const key = `${name.toLowerCase()}|${place.toLowerCase()}`
    if (!streets.has(key)) {
      streets.set(key, [name, place, Number(centre.lat.toFixed(5)), Number(centre.lon.toFixed(5))])
    }
  }
}

const rows = [...streets.values()].sort((a, b) => a[0].localeCompare(b[0]))
const out = 'src/data/floridaStreets.json'
writeFileSync(out, JSON.stringify(rows))

console.log(`\n${rows.length} distinct street/place pairs -> ${out}`)
console.log(`${(JSON.stringify(rows).length / 1024).toFixed(0)} KB`)
