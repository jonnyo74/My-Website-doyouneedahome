'use client'

import { useState } from 'react'
import { trackEvent } from '@/lib/analytics'

const VIDEO_ID = 'tkkg5nKqoys'

/**
 * Click-to-play video tour. Shows the YouTube poster until clicked, so the
 * player (and its third-party requests) only loads on demand. Uses the
 * privacy-enhanced domain and hides cross-channel related videos (rel=0).
 */
export default function VideoTour() {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-[#16140f]">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title="Video tour of 8804 Skyward Street, Boca Raton"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setPlaying(true)
            trackEvent('listing_video_play', { listing: '8804-skyward-street' })
          }}
          aria-label="Play video tour of 8804 Skyward Street"
          className="group absolute inset-0 h-full w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- remote YouTube poster, loaded lazily */}
          <img
            src={`https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
          <span className="absolute inset-0 bg-[#16140f]/25 transition group-hover:bg-[#16140f]/10" />
          <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#f5f2eb]/80 bg-[#16140f]/55 backdrop-blur-sm transition group-hover:bg-[#16140f]/75 sm:h-24 sm:w-24">
            <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8 fill-[#f5f2eb] sm:h-9 sm:w-9" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  )
}
