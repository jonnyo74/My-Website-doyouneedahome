'use client'

import { useState } from 'react'
import { headingId } from '@/lib/headingId'
import { SATURDAY_ROUTES, type SaturdayRoute } from '@/lib/loxSaturday'

const routeAnchor = (r: SaturdayRoute) => `#${headingId(r.section)}`

// "Pick Your Kind of Saturday": five routes through the article. It reads the
// data in src/lib/loxSaturday.ts, stores nothing and asks for nothing.

export const SATURDAY_HEADING = 'Pick Your Kind of Saturday'
export const SATURDAY_HEADING_ID = 'pick-your-kind-of-saturday'

export default function LoxSaturdayChooser() {
  const [open, setOpen] = useState<string | null>(null)
  const route = SATURDAY_ROUTES.find((r) => r.key === open)

  return (
    <section aria-labelledby={SATURDAY_HEADING_ID} className="mt-12 rounded-3xl border border-lime-900/20 bg-[#f4efdf] p-6 sm:p-9">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lime-900">The quick answer</p>
      <h2 id={SATURDAY_HEADING_ID} className="mt-2 scroll-mt-28 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
        {SATURDAY_HEADING}
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Loxahatchee does not have an attractions list so much as a menu of country weekends. Choose the one that sounds like
        yours.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="group" aria-label="Weekend routes">
        {SATURDAY_ROUTES.map((r) => {
          const on = open === r.key
          return (
            <button
              key={r.key}
              type="button"
              aria-pressed={on}
              onClick={() => setOpen(on ? null : r.key)}
              className={`rounded-2xl border p-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 ${
                on ? 'border-lime-900 bg-lime-900 text-white' : 'border-slate-300 bg-white text-slate-800 hover:border-slate-500'
              }`}
            >
              <span className="block font-serif text-lg font-semibold">{r.title}</span>
              <span className={`mt-1 block text-sm leading-6 ${on ? 'text-white/90' : 'text-slate-600'}`}>{r.where}</span>
            </button>
          )
        })}
      </div>

      <div aria-live="polite" className="mt-6">
        {route ? (
          <div className="rounded-2xl border border-lime-900/25 bg-white p-6">
            <h3 className="font-serif text-xl font-semibold text-slate-900">{route.title}</h3>
            <p className="mt-2 leading-7 text-slate-700">{route.vibe}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{route.good}</p>
            <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              <a href={routeAnchor(route)} className="font-semibold text-gold-700 underline decoration-gold-300 underline-offset-4 hover:text-gold-800">
                Read the section →
              </a>
              {route.official && (
                <a
                  href={route.official.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-900"
                >
                  {route.official.label} ↗
                </a>
              )}
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-600">Choose a route to see what it feels like and where it goes.</p>
        )}
      </div>
    </section>
  )
}
