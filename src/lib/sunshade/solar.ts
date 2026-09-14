import { getPosition, getTimes } from 'suncalc'
import type { SolarDay, SolarPosition } from './types'
import { formatMinutesOfDay, zonedMinutesOfDay, zonedWallClockToUtc } from './time'

/**
 * Solar position, wrapped so the rest of the app never touches the library
 * directly.
 *
 * A NOTE ON UNITS, because this cost real debugging time and every tutorial
 * online has it the other way round: SunCalc **2.x** returns DEGREES, with
 * azimuth measured CLOCKWISE FROM NORTH (0 = N, 90 = E, 180 = S, 270 = W).
 * That is already the compass convention, so no conversion happens here at
 * all. SunCalc 1.x returned radians measured from SOUTH, which is what the
 * separate `@types/suncalc` package on npm still describes — installing it
 * alongside 2.x replaces the library's own accurate bundled types with the old
 * ones, and TypeScript then cheerfully accepts a radians-to-degrees conversion
 * that produces a sun elevation of 3,972°. Do not add `@types/suncalc` back;
 * suncalc 2.x ships its own `index.d.ts`.
 *
 * Verified against this build: 8:00 AM EDT on 6 Sep 2026 at Jupiter, FL gives
 * azimuth 88.96° (due east) and altitude 12.09°; solar noon gives 180.17°
 * (due south) and 69.32°.
 */

const COMPASS_POINTS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']

/** Nearest 16-point compass abbreviation for a bearing in degrees from north. */
export function compassPoint(azimuthDeg: number): string {
  const normalised = (((azimuthDeg % 360) + 360) % 360) / 22.5
  return COMPASS_POINTS[Math.round(normalised) % 16]
}

/** Sun position at an absolute instant. */
export function solarPositionAt(date: Date, lat: number, lng: number): SolarPosition {
  const { azimuth, altitude } = getPosition(date, lat, lng)
  const azimuthDeg = ((azimuth % 360) + 360) % 360
  return {
    azimuthDeg,
    elevationDeg: altitude,
    compass: compassPoint(azimuthDeg),
    isDaylight: altitude > 0,
  }
}

/** Sun position at a wall-clock time on a given local date at the property. */
export function solarPositionAtLocalTime(
  date: { year: number; month: number; day: number },
  minutesOfDay: number,
  lat: number,
  lng: number,
  timeZone: string
): SolarPosition {
  const instant = zonedWallClockToUtc(date.year, date.month, date.day, minutesOfDay, timeZone)
  return solarPositionAt(instant, lat, lng)
}

/**
 * Sunrise / solar noon / sunset for a local calendar date at the property.
 *
 * SunCalc keys its day off the instant you hand it, so we ask about local noon
 * rather than local midnight — midnight can fall on the previous UTC day and
 * quietly return the wrong day's times.
 */
export function solarDay(
  date: { year: number; month: number; day: number },
  lat: number,
  lng: number,
  timeZone: string
): SolarDay {
  const localNoon = zonedWallClockToUtc(date.year, date.month, date.day, 12 * 60, timeZone)
  const times = getTimes(localNoon, lat, lng)

  // Events that do not occur on a given day come back null (polar cases), which
  // Florida will never see — but the guard costs nothing and keeps the type honest.
  const toMinutes = (d: Date | null | undefined): number | null => {
    if (!d || Number.isNaN(d.getTime())) return null
    return zonedMinutesOfDay(d, timeZone)
  }

  const sunriseMinutes = toMinutes(times.sunrise)
  const sunsetMinutes = toMinutes(times.sunset)
  const solarNoonMinutes = toMinutes(times.solarNoon) ?? 12 * 60

  return {
    sunriseMinutes,
    solarNoonMinutes,
    sunsetMinutes,
    sunriseLabel: sunriseMinutes === null ? '—' : formatMinutesOfDay(sunriseMinutes),
    solarNoonLabel: formatMinutesOfDay(solarNoonMinutes),
    sunsetLabel: sunsetMinutes === null ? '—' : formatMinutesOfDay(sunsetMinutes),
    daylightMinutes:
      sunriseMinutes !== null && sunsetMinutes !== null ? sunsetMinutes - sunriseMinutes : 0,
  }
}
