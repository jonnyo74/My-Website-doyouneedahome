import Link from 'next/link'

interface ListingSunShadeProps {
  address: string
  city: string
  /** Verified rooftop coordinates. Both required — see the note on Listing. */
  lat?: number
  lng?: number
  /** e.g. "pool deck", "screened lanai" — used in the copy when known. */
  outdoorFeature?: string
}

/**
 * Sun & Shade entry point for a listing page.
 *
 * Renders nothing unless the listing carries verified coordinates. That guard
 * is the point of the component: these listings are new builds that neither
 * OpenStreetMap nor the state parcel roll has yet, so a geocoded position can
 * land on the neighbour's lot. Showing a buyer the wrong patio under our own
 * listing would be worse than showing nothing at all.
 *
 * Deep-links to the analyzer at 2pm — the hour someone actually pictures
 * themselves outside, and the hour where summer and winter differ most.
 */
export default function ListingSunShade({
  address,
  city,
  lat,
  lng,
  outdoorFeature,
}: ListingSunShadeProps) {
  if (typeof lat !== 'number' || typeof lng !== 'number') return null

  const params = new URLSearchParams({
    lat: lat.toFixed(6),
    lng: lng.toFixed(6),
    address: `${address}, ${city}`,
    t: '840', // 2:00 PM
  })
  const href = `/sun-shade?${params.toString()}`
  const space = outdoorFeature ?? 'outdoor space'

  return (
    <section className="my-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">
        Free tool
      </p>
      <h2 className="mt-2 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
        How much sun does the {space} get?
      </h2>
      <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">
        Listing photos are shot on a good day at a flattering hour. See where the sun and the
        surrounding buildings&rsquo; shadows actually fall on this property — hour by hour, and in
        summer against winter.
      </p>

      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gold-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gold-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
      >
        See the sun on this property
        <span aria-hidden="true">→</span>
      </Link>

      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        Estimates based on available mapping, building and solar-position data. Trees, screen
        enclosures and terrain are not modelled, and in Florida a mature tree is often what
        actually shades a patio.
      </p>
    </section>
  )
}
