import Link from 'next/link'

/**
 * Deep link from a property page into the Sun & Shade Analyzer.
 *
 * The analyzer keeps its whole state in the query string, so this is a plain
 * link rather than an embed — no second map on the page, no extra JavaScript
 * shipped to a listing that may never be clicked through, and the resulting URL
 * is one a buyer can paste to their partner.
 *
 * Passing `lat`/`lng` matters. Without them the analyzer geocodes the address,
 * and a street geocoder interpolates along the address range: the pin lands in
 * the road, and the buyer has to drag it onto the right roof themselves. The
 * coordinates in `listings.ts` are parcel-matched, so the link opens on the
 * house.
 */
export default function SunShadeLink({
  address,
  city,
  state,
  zip,
  lat,
  lng,
  hasPool,
}: {
  address: string
  city: string
  state: string
  zip: string
  lat: number
  lng: number
  hasPool?: boolean
}) {
  const params = new URLSearchParams({
    address: `${address}, ${city}, ${state} ${zip}`,
    lat: lat.toFixed(6),
    lng: lng.toFixed(6),
  })

  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50 to-white p-5 sm:p-6">
      <h3 className="font-serif text-xl font-semibold text-slate-900">
        {hasPool ? 'When does the pool get sun?' : 'When does the yard get sun?'}
      </h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
        Open this property in the Sun &amp; Shade Analyzer to see how sunlight and building shadows
        move across the lot through the day, and how that changes between the summer and winter
        solstices. Estimates only — trees are not modelled.
      </p>
      <Link
        href={`/sun-shade?${params.toString()}`}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold-600"
      >
        View sun &amp; shade for {address}
      </Link>
    </div>
  )
}
