import { estimateExposure } from './exposure'
import { solarPositionAtLocalTime, solarDay } from './solar'
import { seasonalDates } from './time'
import type {
  BuildingFootprint,
  ExposureSummary,
  HeightEstimate,
  LngLat,
  PoolFootprint,
  SolarDay,
} from './types'

/**
 * The same property at the four turning points of the year.
 *
 * The question a buyer actually has about a patio, a pool deck or a lanai is
 * not "is it sunny today" but "will I still want to sit out there in January".
 * Today's view cannot answer that: at Florida's latitude the noon sun swings
 * from about 87 degrees in June to 40 in December, and the day is roughly
 * three and a half hours shorter.
 */
export interface SeasonSnapshot {
  key: string
  label: string
  date: { year: number; month: number; day: number }
  /** Sun elevation at solar noon, degrees. */
  noonElevation: number
  day: SolarDay
  exposure: ExposureSummary
}

export interface SeasonalInput {
  centre: { lat: number; lng: number }
  year: number
  timeZone: string
  buildings: BuildingFootprint[]
  pools: PoolFootprint[]
  heights: Map<string, HeightEstimate>
  parcelRing: LngLat[] | null
}

/**
 * Runs each seasonal date through the same sampler the main panel uses, so the
 * row for a given season matches exactly what the panel shows once that date
 * is selected.
 */
export function computeSeasons(input: SeasonalInput): SeasonSnapshot[] {
  const { centre, year, timeZone, buildings, pools, heights, parcelRing } = input

  return seasonalDates(year).map(({ key, label, date }) => {
    const day = solarDay(date, centre.lat, centre.lng, timeZone)
    const noon = solarPositionAtLocalTime(
      date,
      day.solarNoonMinutes,
      centre.lat,
      centre.lng,
      timeZone
    )

    return {
      key,
      label,
      date,
      noonElevation: noon.elevationDeg,
      day,
      exposure: estimateExposure({
        centre,
        date,
        timeZone,
        buildings,
        pools,
        heights,
        parcelRing,
        day,
      }),
    }
  })
}

/** "13h 49m" */
export function formatDaylight(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  return `${h}h ${m}m`
}

/**
 * The figure to compare a season on, and what it actually measures.
 *
 * The yard estimate is the one worth showing, but it needs a parcel boundary
 * or a mapped pool, and the county parcel service is slow enough that it often
 * has not answered. Rather than hide the whole comparison in that case — while
 * the panel above is happily showing morning and afternoon ratings — fall back
 * to the average of those two, which needs only the footprints.
 */
export function seasonFraction(
  season: SeasonSnapshot
): { fraction: number; basis: 'yard' | 'day' } | null {
  const { yard, morning, afternoon } = season.exposure
  if (!yard.note) return { fraction: yard.sunFraction, basis: 'yard' }
  if (!morning.note && !afternoon.note) {
    return { fraction: (morning.sunFraction + afternoon.sunFraction) / 2, basis: 'day' }
  }
  return null
}

/**
 * The swing between the best and worst season, in percentage points — the
 * single number worth leading with. A patio that barely changes is genuinely
 * year-round; one that drops thirty points is a summer patio whatever the
 * listing photos suggest.
 */
export function seasonalSwing(seasons: SeasonSnapshot[]): {
  best: SeasonSnapshot
  worst: SeasonSnapshot
  spreadPoints: number
} | null {
  const scored = seasons
    .map((s) => ({ season: s, scored: seasonFraction(s) }))
    .filter((x): x is { season: SeasonSnapshot; scored: { fraction: number; basis: 'yard' | 'day' } } =>
      x.scored !== null
    )
  if (scored.length < 2) return null

  let best = scored[0]
  let worst = scored[0]
  for (const s of scored) {
    if (s.scored.fraction > best.scored.fraction) best = s
    if (s.scored.fraction < worst.scored.fraction) worst = s
  }

  return {
    best: best.season,
    worst: worst.season,
    spreadPoints: Math.round((best.scored.fraction - worst.scored.fraction) * 100),
  }
}
