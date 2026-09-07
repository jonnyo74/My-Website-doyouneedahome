/**
 * Wall-clock ↔ UTC conversion for a named IANA timezone, with no dependencies.
 *
 * The whole app reasons in "3:40 PM at the property on this date". SunCalc
 * reasons in absolute instants. Getting between the two correctly matters more
 * than it looks: Florida observes DST, so 2:00 PM on 21 June and 2:00 PM on
 * 21 December are 4 and 5 hours behind UTC respectively. Formatting with
 * `toLocaleString` and hoping is what produces shadows an hour out of place.
 *
 * `Intl.DateTimeFormat` is the only zone database the browser exposes, so we
 * use it to measure the offset rather than hard-coding DST rules.
 */

const PARTS_FORMAT_CACHE = new Map<string, Intl.DateTimeFormat>()

function partsFormatter(timeZone: string): Intl.DateTimeFormat {
  let fmt = PARTS_FORMAT_CACHE.get(timeZone)
  if (!fmt) {
    fmt = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    PARTS_FORMAT_CACHE.set(timeZone, fmt)
  }
  return fmt
}

export interface ZonedParts {
  year: number
  month: number // 1-12
  day: number
  hour: number
  minute: number
  second: number
}

/** What the clock on the wall in `timeZone` reads at instant `date`. */
export function utcToZonedParts(date: Date, timeZone: string): ZonedParts {
  const parts = partsFormatter(timeZone).formatToParts(date)
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? '0')
  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour: get('hour'),
    minute: get('minute'),
    second: get('second'),
  }
}

/** How far `timeZone` is ahead of UTC at instant `date`, in milliseconds. */
function zoneOffsetMs(date: Date, timeZone: string): number {
  const p = utcToZonedParts(date, timeZone)
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second)
  // Discard sub-second drift so a fixed offset stays exactly on the hour.
  return asUtc - Math.floor(date.getTime() / 1000) * 1000
}

/**
 * The instant at which the clock in `timeZone` reads the given wall-clock time.
 *
 * Solved by iteration: guess the instant as if the wall time were UTC, measure
 * the zone's offset there, correct, then measure once more. The second pass is
 * what handles the two hours a year when the first guess lands on the wrong
 * side of a DST transition.
 */
export function zonedWallClockToUtc(
  year: number,
  month: number, // 1-12
  day: number,
  minutesOfDay: number,
  timeZone: string
): Date {
  const hour = Math.floor(minutesOfDay / 60)
  const minute = Math.round(minutesOfDay % 60)
  const naive = Date.UTC(year, month - 1, day, hour, minute, 0)
  let instant = naive - zoneOffsetMs(new Date(naive), timeZone)
  instant = naive - zoneOffsetMs(new Date(instant), timeZone)
  return new Date(instant)
}

/** Minutes since local midnight for an instant, in the property's zone. */
export function zonedMinutesOfDay(date: Date, timeZone: string): number {
  const p = utcToZonedParts(date, timeZone)
  return p.hour * 60 + p.minute + p.second / 60
}

/** "7:12 AM" from minutes-since-midnight. */
export function formatMinutesOfDay(minutes: number): string {
  const total = Math.round(minutes)
  const h24 = Math.floor(total / 60) % 24
  const m = total % 60
  const suffix = h24 < 12 ? 'AM' : 'PM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`
}

/** Today's date in the property's zone as { year, month, day }. */
export function todayInZone(timeZone: string): { year: number; month: number; day: number } {
  const p = utcToZonedParts(new Date(), timeZone)
  return { year: p.year, month: p.month, day: p.day }
}

/** "2026-09-06" for an <input type="date"> value. */
export function toDateInputValue(d: { year: number; month: number; day: number }): string {
  return `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`
}

/** Parses an <input type="date"> value. Returns null on anything malformed. */
export function fromDateInputValue(
  value: string
): { year: number; month: number; day: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!m) return null
  const year = Number(m[1])
  const month = Number(m[2])
  const day = Number(m[3])
  if (month < 1 || month > 12 || day < 1 || day > 31) return null
  return { year, month, day }
}

/** "Saturday, September 6, 2026" — the summary panel's date line. */
export function formatLongDate(d: { year: number; month: number; day: number }): string {
  // Noon UTC keeps the calendar date stable regardless of the viewer's own zone.
  const dt = new Date(Date.UTC(d.year, d.month - 1, d.day, 12))
  return dt.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Solstice and equinox dates for a given year.
 *
 * These are the astronomical events, which drift by a day between years — but
 * for a shade comparison the difference between 20 and 21 June is well under
 * the model's own error, so fixed dates are used deliberately rather than
 * pulling in an ephemeris. The labels say "approx." for the same reason.
 */
export function seasonalDates(year: number) {
  return [
    { key: 'spring', label: 'Spring Equinox', date: { year, month: 3, day: 20 } },
    { key: 'summer', label: 'Summer Solstice', date: { year, month: 6, day: 21 } },
    { key: 'fall', label: 'Fall Equinox', date: { year, month: 9, day: 22 } },
    { key: 'winter', label: 'Winter Solstice', date: { year, month: 12, day: 21 } },
  ] as const
}
