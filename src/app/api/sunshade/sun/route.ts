import { NextResponse, type NextRequest } from 'next/server'
import { FLORIDA_TIMEZONE } from '@/lib/sunshade/config'
import { solarDay, solarPositionAtLocalTime } from '@/lib/sunshade/solar'
import { fromDateInputValue, todayInZone } from '@/lib/sunshade/time'

/**
 * Public solar-position endpoint: coordinates in, sun geometry out.
 *
 * Exists so the analyzer's maths can be reused without the map — a property
 * page, a WordPress embed, or a report generator can call this directly. It is
 * pure computation with no upstream dependency, so it is cheap and cacheable.
 *
 * GET /api/sunshade/sun?lat=26.92&lng=-80.11&date=2026-06-21&time=14:30
 */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const lat = Number(params.get('lat'))
  const lng = Number(params.get('lng'))

  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return NextResponse.json({ error: 'Valid lat and lng are required.' }, { status: 400 })
  }

  const timeZone = params.get('tz') ?? FLORIDA_TIMEZONE
  const date = fromDateInputValue(params.get('date') ?? '') ?? todayInZone(timeZone)

  const day = solarDay(date, lat, lng, timeZone)

  const timeParam = params.get('time')
  const timeMatch = /^(\d{1,2}):(\d{2})$/.exec(timeParam ?? '')
  const minutesOfDay = timeMatch
    ? Number(timeMatch[1]) * 60 + Number(timeMatch[2])
    : day.solarNoonMinutes

  if (minutesOfDay < 0 || minutesOfDay > 1440) {
    return NextResponse.json({ error: 'time must be HH:MM in 24-hour form.' }, { status: 400 })
  }

  const position = solarPositionAtLocalTime(date, minutesOfDay, lat, lng, timeZone)

  return NextResponse.json(
    {
      query: { lat, lng, timeZone, date, minutesOfDay },
      sun: {
        azimuthDeg: Number(position.azimuthDeg.toFixed(2)),
        elevationDeg: Number(position.elevationDeg.toFixed(2)),
        compass: position.compass,
        isDaylight: position.isDaylight,
      },
      day: {
        sunrise: day.sunriseLabel,
        solarNoon: day.solarNoonLabel,
        sunset: day.sunsetLabel,
        daylightMinutes: Math.round(day.daylightMinutes),
      },
    },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
  )
}
