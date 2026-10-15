import type { Metadata } from 'next'
import SunShadeApp, { type SunShadeInitialState } from '@/components/sunshade/SunShadeApp'
import CommunityVideo from '@/components/CommunityVideo'
import type { CommunityVideoData } from '@/lib/communities'
import { DISCLAIMER } from '@/lib/sunshade/config'

const SUN_SHADE_VIDEO: CommunityVideoData = {
  id: 's_hwnz0lfSg',
  title: 'Florida Home Buyers: Is the Pool in Sun or Shade? Check Before You Offer',
  durationSeconds: 31,
  uploadDate: '2026-10-15',
  description:
    'A 30-second walkthrough of the Florida Sun & Shade Analyzer: check how much sun a pool, patio or backyard gets before you make an offer.',
}

export const metadata: Metadata = {
  title: 'Florida Sun & Shade Analyzer | DO Homes Group',
  description:
    'See how sunlight and building shadows move across a Florida property through the day and across the seasons. Estimate pool, patio, and backyard sun exposure before you buy.',
  alternates: { canonical: '/sun-shade' },
  openGraph: {
    title: 'Florida Sun & Shade Analyzer',
    description: 'See how sunlight moves across a property before you buy.',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'DO Homes Group — Palm Beach County Real Estate' }],
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
      <div className="bg-slate-50 pb-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <CommunityVideo
            video={SUN_SHADE_VIDEO}
            communityName="the Sun & Shade Analyzer"
            eyebrow="See How It Works"
          />
        </div>
      </div>
      {/* The disclaimer is repeated outside the client component so it is in
          the server-rendered HTML — it must be readable even if the map's
          JavaScript never loads. */}
      <noscript>
        <p className="mx-auto max-w-3xl px-4 py-6 text-sm text-slate-600">{DISCLAIMER}</p>
      </noscript>
    </>
  )
}
