'use client'

import dynamic from 'next/dynamic'
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import AddressSearch from './AddressSearch'
import DateSelector from './DateSelector'
import ReportCta from './ReportCta'
import SummaryPanel from './SummaryPanel'
import SeasonalComparison from './SeasonalComparison'
import TimeSlider from './TimeSlider'
import {
  DISCLAIMER,
  FEATURE_FETCH_RADIUS_M,
  FLORIDA_BOUNDS,
  FLORIDA_TIMEZONE,
  MAX_SHADOW_BUILDINGS,
} from '@/lib/sunshade/config'
import { estimateExposure } from '@/lib/sunshade/exposure'
import {
  bboxAround,
  findContainingBuilding,
  findNearestBuilding,
  haversineM,
  quantiseBBox,
  ringCentroid,
} from '@/lib/sunshade/geo'
import { buildHeightIndex } from '@/lib/sunshade/heights'
import { buildShadowGeometry } from '@/lib/sunshade/shadows'
import { solarDay, solarPositionAtLocalTime } from '@/lib/sunshade/solar'
import { toDateInputValue, todayInZone } from '@/lib/sunshade/time'
import type {
  BuildingFootprint,
  GeocodeResult,
  LngLat,
  ParcelInfo,
  PoolFootprint,
} from '@/lib/sunshade/types'

/**
 * Leaflet touches `window` at import time, so the map is client-only. The
 * `ssr: false` option is only legal inside a Client Component, which is why
 * this wrapper lives here rather than in the server page.
 */
const SunShadeMap = dynamic(() => import('./SunShadeMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-slate-200" />,
})

export interface SunShadeInitialState {
  address: string
  lat: number | null
  lng: number | null
  date: string | null
  minutes: number | null
}

interface Property {
  address: string
  lat: number
  lng: number
  precision: GeocodeResult['precision']
}

/** Where the map sits before anything has been searched. */
const PALM_BEACH_COUNTY = { lat: 26.7056, lng: -80.0364 }

interface FeatureData {
  buildings: BuildingFootprint[]
  pools: PoolFootprint[]
  note: string | null
}

interface ParcelData {
  parcel: ParcelInfo | null
  parcelRing: LngLat[] | null
  /** Set when the lookup itself failed, as opposed to finding no record. */
  note: string | null
}

/**
 * Building footprints and pools for one location.
 *
 * Kept as plain functions outside the component, with no `setState` in them, so
 * an effect can start one and update React only in the async continuation.
 * That split is what lets a shared link load its property without the effect
 * body itself triggering a cascade of renders.
 */
async function fetchFeatures(lat: number, lng: number): Promise<FeatureData> {
  const bbox = quantiseBBox(bboxAround(lat, lng, FEATURE_FETCH_RADIUS_M))
  try {
    const data = await fetch(`/api/sunshade/features?bbox=${bbox.join(',')}`).then((r) => r.json())
    return {
      buildings: data.buildings ?? [],
      pools: data.pools ?? [],
      note: data.note ?? null,
    }
  } catch {
    return {
      buildings: [],
      pools: [],
      note: 'Building data could not be loaded, so shadows are not shown.',
    }
  }
}

/**
 * County parcel records, fetched SEPARATELY from the footprints on purpose.
 *
 * The Florida statewide cadastral service is free and unmetered, and it is
 * correspondingly erratic — the same query has taken anywhere from 3 to 55
 * seconds. Bundling it with the footprint request meant the map sat empty
 * behind it. Now the shadows draw as soon as OpenStreetMap answers, and the
 * parcel merely improves two things when it eventually lands: the height
 * estimate for the subject building, and the lot outline used for yard sampling.
 */
async function fetchParcel(lat: number, lng: number): Promise<ParcelData> {
  try {
    const data = await fetch(`/api/sunshade/parcel?lat=${lat}&lng=${lng}`).then((r) => r.json())
    return { parcel: data.parcel ?? null, parcelRing: data.ring ?? null, note: data.note ?? null }
  } catch {
    return { parcel: null, parcelRing: null, note: 'County records could not be reached.' }
  }
}

export default function SunShadeApp({ initial }: { initial: SunShadeInitialState }) {
  const today = todayInZone(FLORIDA_TIMEZONE)

  const [property, setProperty] = useState<Property | null>(
    initial.lat !== null && initial.lng !== null
      ? {
          address: initial.address || 'Dropped pin',
          lat: initial.lat,
          lng: initial.lng,
          precision: 'approximate',
        }
      : null
  )
  const [date, setDate] = useState(() => {
    const parsed = initial.date?.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    return parsed
      ? { year: Number(parsed[1]), month: Number(parsed[2]), day: Number(parsed[3]) }
      : today
  })
  const [minutes, setMinutes] = useState<number | null>(initial.minutes)
  const [buildings, setBuildings] = useState<BuildingFootprint[]>([])
  const [pools, setPools] = useState<PoolFootprint[]>([])
  const [parcel, setParcel] = useState<ParcelInfo | null>(null)
  const [parcelRing, setParcelRing] = useState<LngLat[] | null>(null)
  const [parcelNote, setParcelNote] = useState<string | null>(null)
  const [searching, setSearching] = useState(false)
  const hasInitialProperty = initial.lat !== null && initial.lng !== null
  const [loadingFeatures, setLoadingFeatures] = useState(hasInitialProperty)
  const [loadingParcel, setLoadingParcel] = useState(hasInitialProperty)
  const [error, setError] = useState<string | null>(null)
  const [featureNote, setFeatureNote] = useState<string | null>(null)

  const centre = property ?? PALM_BEACH_COUNTY

  // -- Solar maths ---------------------------------------------------------
  const day = useMemo(
    () => solarDay(date, centre.lat, centre.lng, FLORIDA_TIMEZONE),
    [date, centre.lat, centre.lng]
  )

  /**
   * Defaults to solar noon, and keeps the handle inside the daylight window
   * when the date changes: a 7 PM handle carried onto a December date would
   * otherwise sit past sunset, where the model draws nothing at all.
   */
  const activeMinutes = useMemo(() => {
    if (minutes === null) return day.solarNoonMinutes
    const min = day.sunriseMinutes ?? 0
    const max = day.sunsetMinutes ?? 1440
    return Math.min(max, Math.max(min, minutes))
  }, [minutes, day])

  const sun = useMemo(
    () => solarPositionAtLocalTime(date, activeMinutes, centre.lat, centre.lng, FLORIDA_TIMEZONE),
    [date, activeMinutes, centre.lat, centre.lng]
  )

  // -- Data loading --------------------------------------------------------
  const applyFeatures = useCallback((data: FeatureData) => {
    setBuildings(data.buildings)
    setPools(data.pools)
    setFeatureNote(data.note)
    setLoadingFeatures(false)
  }, [])

  const applyParcel = useCallback((data: ParcelData) => {
    setParcel(data.parcel)
    setParcelRing(data.parcelRing)
    setParcelNote(data.note)
    setLoadingParcel(false)
  }, [])

  /** Event-handler entry point. The two requests are started together and
   *  applied independently, so neither blocks the other. */
  const loadSite = useCallback(
    (lat: number, lng: number) => {
      setLoadingFeatures(true)
      setLoadingParcel(true)
      setFeatureNote(null)
      setParcelNote(null)
      void fetchFeatures(lat, lng).then(applyFeatures)
      void fetchParcel(lat, lng).then(applyParcel)
    },
    [applyFeatures, applyParcel]
  )

  const search = useCallback(
    async (query: string) => {
      setSearching(true)
      setError(null)
      try {
        const res = await fetch(`/api/sunshade/geocode?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        if (!res.ok) {
          setError(data.error ?? 'Address lookup failed.')
          return
        }
        const match: GeocodeResult = data.results[0]
        setProperty({
          address: match.address,
          lat: match.lat,
          lng: match.lng,
          precision: match.precision,
        })
        loadSite(match.lat, match.lng)
      } catch {
        setError('Address lookup failed. Check your connection and try again.')
      } finally {
        setSearching(false)
      }
    },
    [loadSite]
  )

  /**
   * Loads site data for a property restored from a shared link, once.
   *
   * It watches the INITIAL coordinates rather than `property`: keyed off
   * `property`, a search fired the fetch itself and then setting the new
   * property fired this effect too, sending every lookup upstream twice —
   * which is what earned a 429 from Overpass during development.
   */
  const bootstrapped = useRef(false)
  useEffect(() => {
    if (bootstrapped.current) return
    bootstrapped.current = true
    const { lat, lng } = initial
    if (lat === null || lng === null) return

    let cancelled = false
    void fetchFeatures(lat, lng).then((data) => {
      if (!cancelled) applyFeatures(data)
    })
    void fetchParcel(lat, lng).then((data) => {
      if (!cancelled) applyParcel(data)
    })
    return () => {
      cancelled = true
    }
    // `initial` is the server-parsed query string and never changes identity
    // in a way that matters here; the ref guard is the real gate.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial.lat, initial.lng, applyFeatures, applyParcel])

  const moveProperty = useCallback(
    (lat: number, lng: number) => {
      setProperty((current) => (current ? { ...current, lat, lng, precision: 'rooftop' } : current))
      loadSite(lat, lng)
    },
    [loadSite]
  )

  // -- Shared link ---------------------------------------------------------
  // `history.replaceState` rather than the router, so keeping the URL in step
  // with the controls never re-renders the tree in the middle of a drag.
  useEffect(() => {
    if (!property) return
    const params = new URLSearchParams({
      address: property.address,
      lat: property.lat.toFixed(6),
      lng: property.lng.toFixed(6),
      date: toDateInputValue(date),
      t: String(Math.round(activeMinutes)),
    })
    window.history.replaceState(null, '', `?${params.toString()}`)
  }, [property, date, activeMinutes])

  // -- Derived geometry ----------------------------------------------------
  const subjectBuilding = useMemo(() => {
    if (!property || buildings.length === 0) return null
    return (
      findContainingBuilding(buildings, property.lat, property.lng) ??
      findNearestBuilding(buildings, property.lat, property.lng, 35)
    )
  }, [property, buildings])

  const heights = useMemo(
    () => buildHeightIndex(buildings, subjectBuilding?.id ?? null, parcel),
    [buildings, subjectBuilding, parcel]
  )

  /**
   * Nearest N buildings only. A footprint 400 m away cannot reach the lot with
   * a shadow, and projecting it would cost frames for nothing.
   */
  const shadowCasters = useMemo(() => {
    if (buildings.length <= MAX_SHADOW_BUILDINGS) return buildings
    return [...buildings]
      .sort(
        (a, b) =>
          haversineM(centre, ringCentroid(a.ring)) - haversineM(centre, ringCentroid(b.ring))
      )
      .slice(0, MAX_SHADOW_BUILDINGS)
  }, [buildings, centre])

  // Deferred so React can drop stale shadow work mid-drag: the readouts and the
  // slider handle stay on the live value and never wait for the geometry.
  const deferredSun = useDeferredValue(sun)
  const shadows = useMemo(
    () =>
      buildShadowGeometry(
        shadowCasters,
        (b) => heights.get(b.id)?.heightM ?? 0,
        deferredSun.azimuthDeg,
        deferredSun.elevationDeg
      ),
    [shadowCasters, heights, deferredSun]
  )

  const exposure = useMemo(() => {
    if (!property || buildings.length === 0) return null
    return estimateExposure({
      centre: { lat: property.lat, lng: property.lng },
      date,
      timeZone: FLORIDA_TIMEZONE,
      buildings,
      pools,
      heights,
      parcelRing,
      day,
    })
  }, [property, buildings, pools, heights, parcelRing, date, day])

  const outsideFlorida =
    property !== null &&
    (property.lat < FLORIDA_BOUNDS.minLat ||
      property.lat > FLORIDA_BOUNDS.maxLat ||
      property.lng < FLORIDA_BOUNDS.minLng ||
      property.lng > FLORIDA_BOUNDS.maxLng)

  // -- Render --------------------------------------------------------------
  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <header className="mb-3 lg:mb-5">
          <h1 className="font-serif text-xl font-semibold text-navy-950 sm:text-3xl">
            Florida Sun &amp; Shade Analyzer
          </h1>
          <p className="mt-0.5 text-sm text-slate-600 sm:mt-1 sm:text-base">
            See how sunlight moves across a property before you buy.
          </p>
        </header>

        <div className="mb-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-card sm:p-4 lg:mb-4">
          <AddressSearch initialQuery={initial.address} busy={searching} onSearch={search} />
          {error && (
            <p role="alert" className="mt-2 text-sm font-medium text-red-700">
              {error}
            </p>
          )}
          {property?.precision === 'interpolated' && (
            <p className="mt-2 text-xs text-slate-500">
              This address was matched along the street rather than to the building itself. Drag the
              blue pin onto the house for a closer estimate.
            </p>
          )}
          {outsideFlorida && (
            <p className="mt-2 text-xs text-slate-500">
              This address is outside Florida. The solar maths still hold, but the parcel data and
              default assumptions are tuned for Florida.
            </p>
          )}
        </div>

        {/* Two columns on a laptop, one on a phone. The grid exists so the map
            can span both sidebar rows on desktop while the mobile ORDER stays
            map-then-controls.

            The mobile map is 40vh rather than something taller for one reason:
            the slider has to be on screen at the same time as the map. Dragging
            a control to watch a map you have to scroll to see is not a control
            at all, and every taller value tested pushed the slider past the
            fold on a 375x812 phone. */}
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start">
          <div className="order-2 space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card lg:col-start-1 lg:row-start-1">
            {/* Time above date on purpose. The slider is the control people
                touch continuously while watching the map, so it sits directly
                under the map edge and stays above the fold on a phone; the date
                is set once and can afford the scroll. */}
            <TimeSlider day={day} minutes={activeMinutes} onChange={setMinutes} />
            <div className="border-t border-slate-100 pt-4">
              <DateSelector date={date} onChange={setDate} />
            </div>
          </div>

          <div className="relative order-1 h-[40vh] min-h-[300px] overflow-hidden rounded-2xl border border-slate-200 shadow-card lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-[calc(100vh-11rem)] lg:min-h-[560px]">
            <SunShadeMap
              centre={centre}
              address={property?.address ?? 'Palm Beach County'}
              buildings={buildings}
              pools={pools}
              parcelRing={parcelRing}
              shadows={shadows}
              sun={sun}
              onMoveProperty={moveProperty}
            />
            {!property && (
              <div className="pointer-events-none absolute inset-0 z-[500] flex items-center justify-center bg-navy-950/55 p-6">
                <p className="max-w-sm rounded-2xl bg-white/95 p-5 text-center text-sm font-medium text-navy-900 shadow-lg">
                  Enter a Florida address above to see how sun and shade move across the property
                  through the day.
                </p>
              </div>
            )}
            {loadingFeatures && (
              <p className="absolute left-3 top-3 z-[500] rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-navy-900 shadow">
                Loading building data…
              </p>
            )}
          </div>

          <div className="order-3 space-y-4 lg:col-start-1 lg:row-start-2">
            {property && (
              <>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
                  <SummaryPanel
                    address={property.address}
                    date={date}
                    minutes={activeMinutes}
                    sun={sun}
                    day={day}
                    exposure={exposure}
                    subjectHeight={subjectBuilding ? heights.get(subjectBuilding.id) ?? null : null}
                    parcel={parcel}
                    parcelPending={loadingParcel}
                    parcelNote={parcelNote}
                    buildingCount={buildings.length}
                  />

                  {/* Sits under the exposure rows: having read what today
                      looks like, the next question is whether that holds in
                      January. */}
                  <SeasonalComparison
                    centre={centre}
                    year={date.year}
                    timeZone={FLORIDA_TIMEZONE}
                    buildings={buildings}
                    pools={pools}
                    heights={heights}
                    parcelRing={parcelRing}
                    onPickDate={setDate}
                    activeDate={date}
                  />
                </div>
                <ReportCta address={property.address} />
              </>
            )}

            {featureNote && (
              <p className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
                {featureNote}
              </p>
            )}

            <p className="px-1 text-xs leading-relaxed text-slate-500">{DISCLAIMER}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
