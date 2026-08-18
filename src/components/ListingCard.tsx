'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { cardRotationMs, priceDisplay, showsPriceReduced, statusBadgeClasses, type Listing } from '@/lib/listings'

export default function ListingCard({ listing }: { listing: Listing; index?: number }) {
  const bathsDisplay = listing.bathsHalf > 0
    ? `${listing.bathsFull}.${listing.bathsHalf === 1 ? 5 : listing.bathsHalf}`
    : `${listing.bathsFull}`

  // Best three: hero shot plus the first two gallery photos (curated exterior
  // shots). A listing with no photos of the house yet falls back to its
  // community shots so the card still moves instead of sitting frozen.
  const ownPhotos = [listing.heroPhoto, ...listing.photos].filter(
    (p): p is { src: string; alt: string } => Boolean(p),
  )
  const photos = (
    ownPhotos.length > 1
      ? ownPhotos
      : [...ownPhotos, ...(listing.communityPhotos ?? [])]
  ).slice(0, 3)

  const [active, setActive] = useState(0)
  const intervalMs = cardRotationMs(listing.slug)

  // The crossfade already stands down under prefers-reduced-motion via
  // motion-reduce:transition-none, but the photos kept swapping regardless —
  // a hard cut is arguably worse than the fade. Freeze the rotation entirely
  // for anyone who asked for reduced motion (WCAG 2.3.3), and stay on the
  // hero shot, which is the one the card is meant to lead with.
  useEffect(() => {
    if (photos.length <= 1) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduced.matches) return
    const id = setInterval(() => {
      setActive((i) => (i + 1) % photos.length)
    }, intervalMs)
    const onChange = () => {
      if (reduced.matches) {
        clearInterval(id)
        setActive(0)
      }
    }
    reduced.addEventListener('change', onChange)
    return () => {
      clearInterval(id)
      reduced.removeEventListener('change', onChange)
    }
  }, [photos.length, intervalMs])

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-card-hover"
    >
      {/* Photo thumbnail */}
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        {photos.length > 0 ? (
          photos.map((photo, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={photo.src}
              // All three frames sit in the DOM at once, so three alt strings
              // would land in this link's accessible name. Only the lead photo
              // describes the card; the rotation is presentational.
              alt={i === 0 ? photo.alt : ''}
              src={photo.src}
              // Crossfade plus a slow settle out of a 4% overscan, so the
              // incoming photo drifts in rather than snapping into place.
              className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1400ms] ease-out motion-reduce:transition-none ${
                i === active ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0'
              }`}
            />
          ))
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-sky-100 via-blue-50 to-slate-100" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute left-4 top-3 flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusBadgeClasses(listing.status, 'solid')}`}>
            {listing.status}
          </span>
          {showsPriceReduced(listing) && (
            <span className="rounded-full bg-gold-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              Price Reduced
            </span>
          )}
        </div>
        <span className="absolute bottom-3 left-4 font-serif text-xl font-semibold text-white drop-shadow">
          {priceDisplay(listing)}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-600">
          {listing.city}, {listing.state}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900 transition group-hover:text-gold-600">
          {listing.address}
        </h3>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
          <span>{listing.beds} Beds</span>
          <span>{bathsDisplay} Baths</span>
          <span>{listing.livingSqft.toLocaleString()} Sq Ft</span>
        </div>
        <span className="mt-5 inline-flex text-sm font-semibold text-gold-600 transition group-hover:text-gold-700">
          View Listing →
        </span>
      </div>
    </Link>
  )
}
