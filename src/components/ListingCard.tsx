import Link from 'next/link'
import type { Listing } from '@/lib/listings'

export default function ListingCard({ listing }: { listing: Listing }) {
  const bathsDisplay = listing.bathsHalf > 0
    ? `${listing.bathsFull}.${listing.bathsHalf === 1 ? 5 : listing.bathsHalf}`
    : `${listing.bathsFull}`

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-card-hover"
    >
      {/* Photo thumbnail */}
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        {listing.heroPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listing.heroPhoto.src}
            alt={listing.heroPhoto.alt}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-sky-100 via-blue-50 to-slate-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute left-4 top-3 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          {listing.status}
        </span>
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
