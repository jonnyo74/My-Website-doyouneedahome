'use client'

import Link from 'next/link'
import { useId, useState } from 'react'
import { LOX_PATHS, type LoxPathKey } from '@/lib/loxChooser'

// "Choose Your Loxahatchee": four ways to live here, described by fit and not
// ranked. Nothing is stored or sent, and no contact details are asked for.

export const CHOOSER_HEADING = 'Choose Your Loxahatchee'
export const CHOOSER_HEADING_ID = 'choose-your-loxahatchee'

export default function LoxChooser() {
  const [picked, setPicked] = useState<LoxPathKey | null>(null)
  const uid = useId()
  const path = LOX_PATHS.find((p) => p.key === picked)

  return (
    <section aria-labelledby={CHOOSER_HEADING_ID} className="mt-12 rounded-3xl border border-lime-900/20 bg-[#f4efdf] p-6 sm:p-9">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lime-900">How much structure do you want?</p>
      <h2 id={CHOOSER_HEADING_ID} className="mt-2 scroll-mt-28 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
        {CHOOSER_HEADING}
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Four ways to live here. They are not a ranking, only a way to see where your priorities point. Pick the one that
        sounds most like you. Nothing you choose is saved or sent anywhere.
      </p>

      <fieldset className="mt-6">
        <legend className="sr-only">Choose a path</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {LOX_PATHS.map((p) => {
            const on = picked === p.key
            return (
              <label
                key={p.key}
                className={`flex cursor-pointer flex-col rounded-2xl border p-4 transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-500 ${
                  on ? 'border-lime-900 bg-lime-900 text-white' : 'border-slate-300 bg-white text-slate-800 hover:border-slate-500'
                }`}
              >
                <input type="radio" name={`${uid}-path`} className="sr-only" checked={on} onChange={() => setPicked(p.key)} />
                <span className="font-serif text-lg font-semibold">{p.title}</span>
                <span className={`mt-1 text-sm leading-6 ${on ? 'text-white/90' : 'text-slate-600'}`}>{p.tagline}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div aria-live="polite" className="mt-6">
        {path ? (
          <div className="rounded-2xl border border-lime-900/25 bg-white p-6">
            <h3 className="font-serif text-xl font-semibold text-slate-900">{path.title}</h3>
            <dl className="mt-3 space-y-3 text-slate-700">
              <div>
                <dt className="text-sm font-semibold text-slate-900">What it feels like</dt>
                <dd className="leading-7">{path.feels}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-slate-900">It may fit if</dt>
                <dd className="leading-7">{path.fitsIf}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-slate-900">Keep in mind</dt>
                <dd className="leading-7">{path.keepInMind}</dd>
              </div>
            </dl>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {path.read.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="font-semibold text-gold-700 underline decoration-gold-300 underline-offset-4 hover:text-gold-800">
                    {r.label} →
                  </Link>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setPicked(null)}
              className="mt-4 rounded text-sm font-semibold text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-slate-900"
            >
              Clear choice
            </button>
          </div>
        ) : (
          <p className="text-sm text-slate-600">Choose a path to see what it feels like and what to keep in mind.</p>
        )}
      </div>
    </section>
  )
}
