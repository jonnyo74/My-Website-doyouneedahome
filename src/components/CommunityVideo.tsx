'use client'

import { useState } from 'react'
import type { CommunityVideoData } from '@/lib/communities'

type Props = {
  video: CommunityVideoData
  communityName: string
  eyebrow?: string
}

const SITE_URL = 'https://doyouneedahome.com'

function isoDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `PT${m > 0 ? `${m}M` : ''}${s}S`
}

function clockDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * Click-to-load YouTube facade. Renders a poster + play button and only injects
 * the iframe once the visitor actually presses play — an embedded player costs
 * ~1MB and several hundred ms of main-thread work, which is not worth paying on
 * a community page where most visitors never watch.
 *
 * Uses youtube-nocookie.com so no tracking cookies are set unless the video plays.
 */
export default function CommunityVideo({ video, communityName, eyebrow }: Props) {
  const [playing, setPlaying] = useState(false)
  // maxres doesn't exist for every upload; fall back to hq (always generated).
  const [poster, setPoster] = useState(`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description,
    thumbnailUrl: [`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`],
    uploadDate: video.uploadDate,
    duration: isoDuration(video.durationSeconds),
    embedUrl: `https://www.youtube.com/embed/${video.id}`,
    contentUrl: `https://www.youtube.com/watch?v=${video.id}`,
    publisher: {
      '@type': 'Organization',
      name: 'DO Homes Group',
      url: SITE_URL,
    },
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">
        {eyebrow ?? `Video Tour of ${communityName}`}
      </p>

      <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-900 shadow-card">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${video.title}`}
            className="group absolute inset-0 h-full w-full cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={poster}
              alt={`${communityName} video tour`}
              loading="lazy"
              onError={() => setPoster(`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`)}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />

            {/* Scrim keeps the title legible over bright poster frames */}
            <span className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-slate-950/20" />

            {/* Play button */}
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-lg transition duration-300 group-hover:scale-110 group-hover:bg-white sm:h-20 sm:w-20">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="ml-1 text-gold-600"
              >
                <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.8-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14z" />
              </svg>
            </span>

            <span className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-5 text-left sm:p-6">
              <span className="font-serif text-base font-semibold leading-snug text-white sm:text-lg">
                {video.title}
              </span>
              <span className="flex-shrink-0 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {clockDuration(video.durationSeconds)}
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
