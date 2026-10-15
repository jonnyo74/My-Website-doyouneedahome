'use client'

import Link from 'next/link'
import { useId, useState } from 'react'
import { AREA_LABEL, CATEGORY_LABEL, GEMS, directionsUrl, type GemCategory } from '@/lib/tequestaGems'

// A filterable directory of the destinations in this article. It is deliberately
// not a pin map: we do not hold verified coordinates for these places, so each
// card links to directions built from the name and address, and every card says
// whether the place is inside the Village or outside it.

export const GEMS_EXPLORER_HEADING = 'Explore the Destinations'
export const GEMS_EXPLORER_HEADING_ID = 'explore-the-destinations'

const FILTERS: Array<{ key: 'all' | GemCategory; label: string }> = [
  { key: 'all', label: 'All places' },
  { key: 'arts', label: CATEGORY_LABEL.arts },
  { key: 'food', label: CATEGORY_LABEL.food },
  { key: 'parks', label: CATEGORY_LABEL.parks },
  { key: 'water', label: CATEGORY_LABEL.water },
  { key: 'nearby', label: 'Nearby, outside the Village' },
]

export default function TequestaGemsExplorer() {
  const [filter, setFilter] = useState<'all' | GemCategory>('all')
  const uid = useId()
  const shown = GEMS.filter((g) => filter === 'all' || g.category === filter)

  return (
    <section aria-labelledby={GEMS_EXPLORER_HEADING_ID} className="mt-12 border-y border-slate-200 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-600">Destination finder</p>
      <h2 id={GEMS_EXPLORER_HEADING_ID} className="mt-2 scroll-mt-28 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
        {GEMS_EXPLORER_HEADING}
      </h2>
      <p className="mt-3 leading-7 text-slate-600">
        Filter by type, and note the area label on each card. Some places have a Tequesta address but sit outside the
        incorporated Village, and several are in Jupiter, Juno Beach or Martin County. This is a directory rather than a pin
        map, so each Directions link is built from the name and address, not from coordinates.
      </p>

      <div role="group" aria-label="Filter destinations by type" className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            aria-pressed={filter === f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 ${
              filter === f.key ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-500'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <p id={`${uid}-count`} className="mt-3 text-sm text-slate-500" aria-live="polite">
        Showing {shown.length} of {GEMS.length} places
      </p>

      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {shown.map((g) => (
          <li key={g.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">{CATEGORY_LABEL[g.category]}</p>
            <h3 className="mt-1 font-serif text-lg font-semibold leading-snug text-slate-900">{g.name}</h3>
            <p className="mt-1">
              <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">{AREA_LABEL[g.area]}</span>
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{g.where}</p>
            <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-3 text-sm font-semibold">
              <a
                href={directionsUrl(g)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-600 underline decoration-gold-300 underline-offset-4 hover:text-gold-700"
              >
                Directions<span className="sr-only"> to {g.name} (opens in a new tab)</span>
              </a>
              <a
                href={g.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-slate-900"
              >
                Source<span className="sr-only"> for {g.name} (opens in a new tab)</span>
              </a>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-5 text-slate-500">
        Hours, fees and access change. Confirm with the operator before you go. For public paddling access, see the{' '}
        <Link href="/kayak-launches-jupiter-tequesta" className="underline decoration-slate-300 underline-offset-4 hover:text-slate-900">
          kayak launch map
        </Link>
        .
      </p>
    </section>
  )
}
