'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { onOpenLightbox } from './lightboxBus'
import { PHOTOS } from './photos'

/**
 * Single lightbox for the whole page, mounted once. Opens via lightboxBus,
 * closes on Esc/backdrop, arrows navigate, and the neighboring frames are
 * pre-fetched so paging feels instant.
 */
export default function Lightbox() {
  const [index, setIndex] = useState<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  useEffect(
    () =>
      onOpenLightbox((i) => {
        returnFocusRef.current = document.activeElement as HTMLElement | null
        setIndex(i)
      }),
    []
  )

  const close = useCallback(() => {
    setIndex(null)
    returnFocusRef.current?.focus()
  }, [])

  const step = useCallback((delta: number) => {
    setIndex((prev) => (prev === null ? prev : (prev + delta + PHOTOS.length) % PHOTOS.length))
  }, [])

  // Keyboard, scroll lock, and initial focus while open.
  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
    // Bind once per open/close, not per photo — paging shouldn't re-lock scroll.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index === null])

  // Pre-fetch neighbors so arrowing through the set never shows a blank frame.
  useEffect(() => {
    if (index === null) return
    for (const offset of [1, -1]) {
      const neighbor = PHOTOS[(index + offset + PHOTOS.length) % PHOTOS.length]
      const img = new window.Image()
      img.src = neighbor.src
    }
  }, [index])

  if (index === null) return null
  const photo = PHOTOS[index]

  return (
    // Backdrop click is a convenience for pointer users only — keyboard users
    // close with Esc (bound above) or the labeled close button, so the
    // click-without-key-handler warnings don't apply here.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <div
      className="sky-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${PHOTOS.length}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div className="flex items-center justify-between px-5 py-4">
        <p className="sky-num text-sm text-[#f5f2eb]/70">
          {index + 1} / {PHOTOS.length}
        </p>
        <button ref={closeRef} type="button" className="sky-lightbox-btn" onClick={close} aria-label="Close photo viewer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-2 sm:px-20">
        {/* eslint-disable-next-line @next/next/no-img-element -- the lightbox
            always shows the full-size 2048px file; optimizer variants would
            just duplicate what the gallery already cached. */}
        <img
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          className="max-h-full max-w-full object-contain"
        />

        <div className="absolute inset-y-0 left-3 flex items-center sm:left-5">
          <button type="button" className="sky-lightbox-btn" onClick={() => step(-1)} aria-label="Previous photo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="absolute inset-y-0 right-3 flex items-center sm:right-5">
          <button type="button" className="sky-lightbox-btn" onClick={() => step(1)} aria-label="Next photo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <p className="px-6 pb-5 pt-3 text-center text-sm leading-6 text-[#f5f2eb]/60">{photo.alt}</p>
    </div>
  )
}
