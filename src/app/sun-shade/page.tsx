import type { Metadata } from 'next'
import SunShadeApp, { type SunShadeInitialState } from '@/components/sunshade/SunShadeApp'
import { DISCLAIMER } from '@/lib/sunshade/config'

export const metadata: Metadata = {
  title: 'Florida Sun & Shade Analyzer | DO Homes Group',
  description:
    'See how sunlight and building shadows move across a Florida property through the day and across the seasons. Estimate pool, patio, and backyard sun exposure before you buy.',
  alternates: { canonical: '/sun-shade' },
  openGraph: {
    title: 'Florida Sun & Shade Analyzer',
    description: 'See how sunlight moves across a property before you buy.',
  },
}

/**
 * Server shell for the analyzer.
 *
 * Its one job beyond metadata is turning a shared link back into app state.
 * Reading the query string here rather than in the client component means a
 * pasted link renders at the right property, date, and time on the first paint
 * instead of flashing the empty state and then jumping.
 */
export default async function SunShadePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams

  const first = (key: string): string | null => {
    const value = params[key]
    if (Array.isArray(value)) return value[0] ?? null
    return value ?? null
  }

  /**
   * Absent params must come back null, not zero. `Number(null)` is 0, which is
   * a perfectly valid latitude and longitude, so a naive parse silently drops
   * every first-time visitor onto a pin in the Gulf of Guinea.
   */
  const numeric = (key: string, min: number, max: number): number | null => {
    const raw = first(key)
    if (raw === null || raw.trim() === '') return null
    const value = Number(raw)
    return Number.isFinite(value) && value >= min && value <= max ? value : null
  }

  const initial: SunShadeInitialState = {
    address: first('address') ?? '',
    lat: numeric('lat', -90, 90),
    lng: numeric('lng', -180, 180),
    date: first('date'),
    minutes: numeric('t', 0, 1440),
  }

  return (
    <>
      <SunShadeApp initial={initial} />
      {/* The disclaimer is repeated outside the client component so it is in
          the server-rendered HTML — it must be readable even if the map's
          JavaScript never loads. */}
      <noscript>
        <p className="mx-auto max-w-3xl px-4 py-6 text-sm text-slate-600">{DISCLAIMER}</p>
      </noscript>
    </>
  )
}
