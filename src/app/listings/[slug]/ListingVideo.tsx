'use client'

import { useState } from 'react'
import { trackEvent } from '@/lib/analytics'

/**
 * Click-to-play video tour. Shows the YouTube poster until clicked, so the
 * player (and its third-party requests) only loads on demand. Uses the
 * privacy-enhanced domain and hides cross-channel related videos (rel=0).
 */
export default function ListingVideo({
  videoId,
  address,
  slug,
}: {
  videoId: string
  address: string
  slug: string
}) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={`Video tour of ${address}`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setPlaying(true)
            trackEvent('listing_video_play', { listing: slug })
          }}
          aria-label={`Play video tour of ${address}`}
          className="group absolute inset-0 h-full w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- remote YouTube poster, loaded lazily */}
          <img
            src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
          <span className="absolute inset-0 bg-black/25 transition group-hover:bg-black/10" />
          <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-black/55 backdrop-blur-sm transition group-hover:bg-black/75 sm:h-24 sm:w-24">
            <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8 fill-white sm:h-9 sm:w-9" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  )
}
