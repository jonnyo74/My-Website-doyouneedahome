import { NextResponse, type NextRequest } from 'next/server'
import { RequestCache } from '@/lib/sunshade/serverCache'
import type { LngLat, ParcelInfo } from '@/lib/sunshade/types'

/**
 * Parcel lookup against the Florida Statewide Cadastral layer (FDOR/FGIO).
 *
 * This is the best free property data available for the whole state: every one
 * of Florida's 67 county appraisers submits to the Department of Revenue
 * annually, and the result is published as an open ArcGIS FeatureServer with no
 * key and no quota. It gives us two things nothing else does — the parcel
 * boundary (so "the yard" is the real yard, not a square drawn around the pin)
 * and total living area (so a two-storey house is modelled as two storeys).
 *
 * Two hard-won details about querying it, both discovered the slow way:
 *
 *   1. `returnGeometry=true` fails outright with "Invalid query parameters"
 *      UNLESS `maxAllowableOffset` is supplied. With it, the same query
 *      succeeds in ~2s. Without it, ~55s and an error.
 *   2. The layer's native SR is EPSG:3086 (Florida GDL Albers), so `outSR` and
 *      `f=geojson` are both required to get usable lng/lat back — and
 *      `maxAllowableOffset` is then expressed in DEGREES, not metres.
 *
 * Palm Beach County's own parcel service was evaluated first and rejected: it
 * is a cached tile service whose query endpoint returns a placeholder row, not
 * parcel attributes.
 */

const CADASTRAL_URL =
  'https://services9.arcgis.com/Gh9awoU677aKree0/arcgis/rest/services/Florida_Statewide_Cadastral/FeatureServer/0/query'

/** ~0.5 m at Florida latitudes. Enough to keep a lot line honest, small enough
 *  that the service will actually answer. */
const GEOMETRY_TOLERANCE_DEG = 0.000005

/**
 * Vercel's platform default (10s on Hobby) is far below what a cold query to
 * this layer needs, and a truncated function looks identical to a missing
 * parcel from the client's side. 60s is the ceiling this route can ever use;
 * the in-process and edge caches mean it is paid once per area, not per view.
 */
export const maxDuration = 60

/**
 * Generous, because this service is genuinely erratic. The SAME point query,
 * measured back to back during development, returned in 0.35s, 15.1s, 20.6s,
 * 47.8s and 55.5s. It is a cold-start effect, not a cost of the geometry —
 * dropping `returnGeometry` was measured and made no difference, so there is
 * nothing to trim. There is no key, no quota and no SLA, and that is the price.
 *
 * The client therefore never waits on this: parcel data is requested
 * separately from the building footprints and applied whenever it turns up, so
 * a 50-second lookup delays nothing but its own two enrichments (a better
 * height estimate, and the real lot boundary for yard sampling).
 */
const PARCEL_TIMEOUT_MS = 50_000

/** Parcel rolls are refreshed annually; an hour in memory is conservative. The
 *  coalescing is the point, as with the features route. */
const parcelCache = new RequestCache<{
  parcel: ParcelInfo | null
  ring: LngLat[] | null
  note: string | null
}>(60 * 60 * 1000)

interface CadastralFeature {
  properties?: {
    PARCEL_ID?: string
    PHY_ADDR1?: string
    PHY_CITY?: string
    TOT_LVG_AR?: number
    ACT_YR_BLT?: number
    NO_BULDNG?: number
  }
  geometry?: { type?: string; coordinates?: number[][][] }
}

function cleanString(value: string | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function cleanNumber(value: number | undefined): number | null {
  return typeof value === 'number' && value > 0 ? value : null
}

export async function GET(req: NextRequest) {
  const lat = Number(req.nextUrl.searchParams.get('lat'))
  const lng = Number(req.nextUrl.searchParams.get('lng'))

  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return NextResponse.json({ error: 'Valid lat and lng are required.' }, { status: 400 })
  }

  const url = new URL(CADASTRAL_URL)
  url.searchParams.set('geometry', `${lng},${lat}`)
  url.searchParams.set('geometryType', 'esriGeometryPoint')
  url.searchParams.set('inSR', '4326')
  url.searchParams.set('outSR', '4326')
  url.searchParams.set('spatialRel', 'esriSpatialRelIntersects')
  url.searchParams.set('outFields', 'PARCEL_ID,PHY_ADDR1,PHY_CITY,TOT_LVG_AR,ACT_YR_BLT,NO_BULDNG')
  url.searchParams.set('returnGeometry', 'true')
  url.searchParams.set('maxAllowableOffset', String(GEOMETRY_TOLERANCE_DEG))
  // NO `resultRecordCount`. It looks like a harmless optimisation and is the
  // opposite: this layer REJECTS the query with a 400 when it is present
  // alongside `returnGeometry` + `maxAllowableOffset`, and takes ~55s to say so.
  // Without it the same query answers in ~29s. A point-intersect against a
  // parcel layer returns one polygon anyway, so there is nothing to cap.
  url.searchParams.set('f', 'geojson')

  // Rounded to ~1 m so a dragged pin does not mint a new upstream query for
  // every pixel of movement within the same parcel.
  const cacheKey = `${lat.toFixed(5)},${lng.toFixed(5)}`

  try {
    const result = await parcelCache.fetch(cacheKey, async () => {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(PARCEL_TIMEOUT_MS),
        headers: {
          Accept: 'application/json',
          'User-Agent': `FloridaSunShadeAnalyzer/1.0 (${
            process.env.SUNSHADE_CONTACT_EMAIL ?? 'unknown-contact'
          })`,
        },
      })
      if (!res.ok) throw new Error(`Cadastral service returned ${res.status}`)
      const data = (await res.json()) as { features?: CadastralFeature[]; error?: unknown }
      if (data.error) throw new Error('Cadastral service rejected the query')

      const feature: CadastralFeature | undefined = data.features?.[0]
      if (!feature) return { parcel: null, ring: null, note: null }

      const props = feature.properties ?? {}
      const parcel: ParcelInfo = {
        parcelId: cleanString(props.PARCEL_ID),
        address: cleanString(
          [cleanString(props.PHY_ADDR1), cleanString(props.PHY_CITY)].filter(Boolean).join(', ')
        ),
        livingAreaSqFt: cleanNumber(props.TOT_LVG_AR),
        yearBuilt: cleanNumber(props.ACT_YR_BLT),
        buildingCount: cleanNumber(props.NO_BULDNG),
      }

      const outerRing = feature.geometry?.coordinates?.[0]
      const ring: LngLat[] | null =
        Array.isArray(outerRing) && outerRing.length >= 3
          ? outerRing.map((p) => [p[0], p[1]] as LngLat)
          : null

      return { parcel, ring, note: null }
    })

    return NextResponse.json(result, {
      // Parcel rolls are refreshed annually. A day of edge cache is
      // conservative and keeps a shared link from re-querying on every open.
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
    })
  } catch (error) {
    // A parcel miss is never fatal: the analyzer falls back to a default height
    // and a square sampling area. So this returns 200 with nulls rather than an
    // error the UI would have to render as a failure.
    console.error('Sun & Shade parcel lookup failed:', error)
    return NextResponse.json(
      {
        parcel: null,
        ring: null,
        // Distinct from a successful lookup that found no record. The panel
        // says which, because "no living-area record for this parcel" is a
        // claim about the property, and it would be a false one here.
        //
        // Covers both observed failure modes: a timeout, and the service
        // answering HTTP 200 with an error body after ~55s while degraded —
        // the same query having succeeded minutes earlier.
        note: 'County records are not responding right now.',
      },
      { status: 200 }
    )
  }
}
