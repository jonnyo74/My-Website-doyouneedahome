'use client'

import { useSyncExternalStore } from 'react'
import { isRecentlySold, type Listing } from '@/lib/listings'
import ListingCard from './ListingCard'

// Nothing to subscribe to — the snapshot only has to change once, when React
// stops replaying the server's render and starts trusting the browser. This is
// useSyncExternalStore rather than the usual setState-in-an-effect because the
// value is read during render, not written back into state.
const neverChanges = () => () => {}
const onClient = () => true
const onServer = () => false

// A closed sale is the best proof either page carries, but it cannot sit under
// "Homes We're Currently Marketing" — that heading would be advertising a home
// nobody can buy. So it gets its own row, plainly labelled, underneath.
//
// The window is re-checked in the browser for the same reason the open-house
// banner is: these pages are statically generated, so a build from inside the
// window would keep showing a sale for months after it should have retired. The
// server pass renders whatever was current at build time and the browser drops
// anything that has since aged out — which means the row shrinks on its own
// between deploys, but never grows.
export default function RecentlySold({
  listings,
  sectionClassName = 'bg-white px-6 py-20 sm:px-8',
  containerClassName = 'mx-auto max-w-7xl',
  gridClassName = 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3',
  blurb,
}: {
  listings: Listing[]
  sectionClassName?: string
  containerClassName?: string
  gridClassName?: string
  blurb?: string
}) {
  // Before hydration this has to render exactly what the server sent, or the
  // markup won't match; after it, the window is re-measured against the real
  // clock instead of the clock the page was built on.
  const hydrated = useSyncExternalStore(neverChanges, onClient, onServer)
  const visible = hydrated ? listings.filter((l) => isRecentlySold(l)) : listings

  if (visible.length === 0) return null

  return (
    <section className={sectionClassName}>
      <div className={`${containerClassName} space-y-8`}>
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">
            Recently Sold
          </p>
          <h2 className="font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">
            Recently Closed by DO Homes Group
          </h2>
          {blurb && <p className="max-w-2xl text-slate-600">{blurb}</p>}
        </div>
        <div className={gridClassName}>
          {visible.map((listing, i) => (
            <ListingCard key={listing.slug} listing={listing} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
