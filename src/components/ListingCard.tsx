'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { statusBadgeClasses, type Listing } from '@/lib/listings'

export default function ListingCard({ listing, index = 0 }: { listing: Listing; index?: number }) {
  const bathsDisplay = listing.bathsHalf > 0
    ? `${listing.bathsFull}.${listing.bathsHalf === 1 ? 5 : listing.bathsHalf}`
    : `${listing.bathsFull}`

  // Best three: hero shot plus the first two gallery photos (curated exterior shots).
  const photos = [listing.heroPhoto, ...listing.photos]
    .filter((p): p is { src: string; alt: string } => Boolean(p))
    .slice(0, 3)

  const [active, setActive] = useState(0)
  // Stagger rotation speed per card so multiple cards don't crossfade in sync.
  const intervalMs = 3800 + (index % 3) * 1100

  useEffect(() => {
    if (photos.length <= 1) return
    const id = setInterval(() => {
      setActive((i) => (i + 1) % photos.length)
    }, intervalMs)
    return () => clearInterval(id)
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
              src={photo.src}
              alt={photo.alt}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
                i === active ? 'opacity-100' : 'opacity-0'
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
          {listing.originalPrice && listing.originalPrice > listing.price && (
            <span className="rounded-full bg-gold-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              Price Reduced
            </span>
          )}
        </div>
        <span className="absolute bottom-3 left-4 font-serif text-xl font-semibold text-white drop-shadow">
          ${listing.price.toLocaleString('en-US')}
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
