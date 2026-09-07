import { NextResponse, type NextRequest } from 'next/server'
import { RequestCache } from '@/lib/sunshade/serverCache'
import type { BuildingFootprint, LngLat, PoolFootprint, SiteFeatures } from '@/lib/sunshade/types'

/**
 * Building footprints and pools around a property, from OpenStreetMap.
 *
 * Overpass is a shared volunteer service with no SLA and an active fair-use
 * policy, so this route is built to lean on it as lightly as possible: the
 * bounding box is capped, the response is aggressively cached at the edge, and
 * the query asks for the two tags we actually draw rather than everything in
 * the box.
 *
 * Coverage note, measured before building this: a single residential bounding
 * box in Jupiter, FL returned 686 footprints — so coverage is good — but not
 * one of them carried a `height` tag. See `lib/sunshade/heights.ts`.
 */

/** Mirrors are tried in order. The main instance is the busiest one. */
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
]

/** Roughly 2 km on a side at Florida latitudes — one neighbourhood, not a city. */
const MAX_BBOX_DEGREES = 0.02

/**
 * Footprints change on the scale of months, so an hour in process memory is
 * conservative. This sits in front of the edge cache and exists mainly to
 * coalesce the concurrent identical requests a single page load can produce —
 * Overpass answers those with 429 and a cool-off period.
 */
const featureCache = new RequestCache<SiteFeatures>(60 * 60 * 1000)

interface OverpassElement {
  type: string
  id: number
  tags?: Record<string, string>
  geometry?: { lat: number; lon: number }[]
}

function parseBBox(param: string | null): [number, number, number, number] | null {
  if (!param) return null
  const parts = param.split(',').map(Number)
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) return null
  const [west, south, east, north] = parts
  if (west >= east || south >= north) return null
  if (east - west > MAX_BBOX_DEGREES || north - south > MAX_BBOX_DEGREES) return null
  if (south < -90 || north > 90 || west < -180 || east > 180) return null
  return [west, south, east, north]
}

function toRing(element: OverpassElement): LngLat[] | null {
  if (!element.geometry || element.geometry.length < 3) return null
  return element.geometry.map((p) => [p.lon, p.lat] as LngLat)
}

async function queryOverpass(query: string): Promise<OverpassElement[]> {
  let lastError: unknown = null

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          // Not optional. Both mirrors reject Node's default fetch identity:
          // overpass-api.de answers 406 Not Acceptable and kumi.systems answers
          // 429 with the body "Please include a meaningful User-Agent string
          // with your requests to avoid rate-limiting." Adding this header is
          // the difference between zero footprints and a working map.
          'User-Agent': `FloridaSunShadeAnalyzer/1.0 (${
            process.env.SUNSHADE_CONTACT_EMAIL ?? 'unknown-contact'
          })`,
        },
        body: `data=${encodeURIComponent(query)}`,
        signal: AbortSignal.timeout(25_000),
      })
      if (!res.ok) {
        lastError = new Error(`Overpass ${endpoint} returned ${res.status}`)
        continue
      }
      const data = (await res.json()) as { elements?: OverpassElement[] }
      return data.elements ?? []
    } catch (error) {
      lastError = error
    }
  }

  throw lastError ?? new Error('Overpass unavailable')
}

export async function GET(req: NextRequest) {
  const bbox = parseBBox(req.nextUrl.searchParams.get('bbox'))
  if (!bbox) {
    return NextResponse.json(
      { error: 'A bbox of west,south,east,north within 0.02° is required.' },
      { status: 400 }
    )
  }

  const [west, south, east, north] = bbox
  const box = `${south},${west},${north},${east}`

  // `out geom` inlines each way's coordinates, which saves a second round trip
  // for node resolution. Multipolygon relations are deliberately not requested:
  // they are rare for detached housing and cost a much heavier query to
  // assemble. Their buildings simply do not cast a shadow here.
  const query = `[out:json][timeout:25];
(
  way["building"](${box});
  way["leisure"="swimming_pool"](${box});
);
out geom;`

  let body: SiteFeatures
  try {
    body = await featureCache.fetch(bbox.join(','), async () => {
      const elements = await queryOverpass(query)

      const buildings: BuildingFootprint[] = []
      const pools: PoolFootprint[] = []

      for (const element of elements) {
        const ring = toRing(element)
        if (!ring) continue
        const tags = element.tags ?? {}
        if (tags.leisure === 'swimming_pool') {
          pools.push({ id: `pool-${element.id}`, ring })
        } else if (tags.building) {
          buildings.push({ id: `building-${element.id}`, ring, tags })
        }
      }

      return {
        buildings,
        pools,
        note:
          buildings.length === 0
            ? 'No mapped building footprints here yet, so no shadows can be drawn.'
            : undefined,
      }
    })
  } catch (error) {
    console.error('Sun & Shade Overpass failure:', error)
    return NextResponse.json(
      {
        buildings: [],
        pools: [],
        note: 'Building data is unavailable right now, so shadows cannot be drawn.',
      } satisfies SiteFeatures,
      { status: 502 }
    )
  }

  return NextResponse.json(body, {
    headers: {
      // Footprints change on the timescale of months. A day at the edge with a
      // week of stale-while-revalidate keeps Overpass essentially untouched for
      // any property that has been looked at once.
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
    },
  })
}
