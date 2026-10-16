'use client'

import Link from 'next/link'
import { useId, useState } from 'react'
import { COMMUNITIES, FIT_TAGS, matchCommunities, partialMatches, type FitTag } from '@/lib/nearbyCommunities'

// Two client-side reading aids for the Tequesta comparison article. Neither
// stores or sends anything. Both read the qualitative data in
// src/lib/nearbyCommunities.ts: no prices, drive times, ratings or rankings.

export const MATRIX_HEADING = 'Side-by-Side Community Comparison Matrix'
export const MATRIX_HEADING_ID = 'side-by-side-community-comparison-matrix'
export const SELECTOR_HEADING = 'Which Community Fits Your Property Priorities?'
export const SELECTOR_HEADING_ID = 'which-community-fits-your-property-priorities'

const COLUMNS: Array<{ key: 'jurisdiction' | 'housing' | 'water' | 'character' | 'assoc' | 'costs' | 'convenience' | 'verify'; label: string }> = [
  { key: 'jurisdiction', label: 'Municipality and county' },
  { key: 'housing', label: 'Housing formats' },
  { key: 'water', label: 'Waterfront and beach' },
  { key: 'character', label: 'Neighborhood character' },
  { key: 'assoc', label: 'Association and club considerations' },
  { key: 'costs', label: 'Ownership-cost differences' },
  { key: 'convenience', label: 'Daily convenience' },
  { key: 'verify', label: 'Verify for a specific property' },
]

export function CompareMatrix() {
  return (
    <section aria-labelledby={MATRIX_HEADING_ID} className="mt-12">
      <h2 id={MATRIX_HEADING_ID} className="scroll-mt-28 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
        {MATRIX_HEADING}
      </h2>
      <p className="mt-3 leading-7 text-slate-600">
        A qualitative comparison. We have not printed prices, drive times or rankings, because they depend on the specific
        property and change over time.
      </p>

      {/* Wide screens: one table. */}
      <div className="mt-6 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <caption className="sr-only">Comparison of Tequesta and nearby communities</caption>
          <thead>
            <tr className="border-b-2 border-slate-300 align-bottom">
              <th scope="col" className="py-2 pr-3 font-semibold text-slate-900">
                Community
              </th>
              {COLUMNS.map((c) => (
                <th key={c.key} scope="col" className="px-2 py-2 font-semibold text-slate-900">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMMUNITIES.map((c) => (
              <tr key={c.id} className="border-b border-slate-200 align-top">
                <th scope="row" className="py-3 pr-3 font-semibold text-slate-900">
                  {c.name}
                </th>
                {COLUMNS.map((col) => (
                  <td key={col.key} className="px-2 py-3 leading-5 text-slate-600">
                    {c[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phones and tablets: one card per community, so nothing scrolls sideways. */}
      <ul className="mt-6 space-y-4 md:hidden">
        {COMMUNITIES.map((c) => (
          <li key={c.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-serif text-lg font-semibold text-slate-900">{c.name}</h3>
            <dl className="mt-2 space-y-2 text-sm">
              {COLUMNS.map((col) => (
                <div key={col.key}>
                  <dt className="font-medium text-slate-800">{col.label}</dt>
                  <dd className="leading-6 text-slate-600">{c[col.key]}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function FitSelector() {
  const [selected, setSelected] = useState<FitTag[]>([])
  const uid = useId()
  const toggle = (k: FitTag) => setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]))
  const all = matchCommunities(selected)
  const partial = partialMatches(selected).filter((m) => !all.includes(m.community))

  return (
    <section aria-labelledby={SELECTOR_HEADING_ID} className="mt-12 border-y border-slate-200 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-600">Starting-point tool</p>
      <h2 id={SELECTOR_HEADING_ID} className="mt-2 scroll-mt-28 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
        {SELECTOR_HEADING}
      </h2>
      <p className="mt-3 leading-7 text-slate-600">
        Choose what matters most. The tool lists communities that offer those features, using the plain criteria shown
        below. It is an editorial starting point, not a ranking, and it uses no market statistics. Nothing you select is
        saved or sent anywhere.
      </p>

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold text-slate-900">Your priorities</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {FIT_TAGS.map((t) => (
            <label
              key={t.key}
              className={`flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-500 ${
                selected.includes(t.key) ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-500'
              }`}
            >
              <input type="checkbox" className="sr-only" checked={selected.includes(t.key)} onChange={() => toggle(t.key)} />
              {t.label}
            </label>
          ))}
        </div>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={() => setSelected([])}
            className="mt-3 rounded text-sm font-semibold text-gold-600 underline decoration-gold-300 underline-offset-4 hover:text-gold-700"
          >
            Clear selections
          </button>
        )}
      </fieldset>

      <div id={`${uid}-results`} aria-live="polite" className="mt-6">
        {selected.length === 0 ? (
          <p className="text-sm text-slate-500">Select one or more priorities to see communities that offer them.</p>
        ) : (
          <>
            <h3 className="font-serif text-xl font-semibold text-slate-900">
              {all.length > 0 ? `Offer all ${selected.length} selected` : 'No single community offers every selection'}
            </h3>
            {all.length === 0 && (
              <p className="mt-2 text-sm leading-6 text-slate-600">
                That is normal. Priorities often pull in different directions. These communities each offer some of what you chose.
              </p>
            )}
            <ul className="mt-3 space-y-3">
              {(all.length > 0 ? all.map((community) => ({ community, count: selected.length })) : partial).map(({ community, count }) => (
                <li key={community.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="font-serif text-lg font-semibold text-slate-900">
                    {community.name}
                    {all.length === 0 && <span className="ml-2 text-sm font-normal text-slate-500">offers {count} of {selected.length}</span>}
                  </p>
                  <p className="text-xs text-slate-500">{community.jurisdiction}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
                    {selected
                      .filter((t) => community.tags[t])
                      .map((t) => (
                        <li key={t}>
                          <span className="font-medium text-slate-800">{FIT_TAGS.find((f) => f.key === t)?.label}:</span> {community.tags[t]}
                        </li>
                      ))}
                  </ul>
                  <p className="mt-2 text-sm text-slate-600">
                    Verify: {community.verify}
                  </p>
                  <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
                    {community.guideHref && (
                      <Link href={community.guideHref} className="text-gold-600 underline decoration-gold-300 underline-offset-4 hover:text-gold-700">
                        {community.name} guide
                      </Link>
                    )}
                    {community.compareHref && (
                      <Link href={community.compareHref} className="text-gold-600 underline decoration-gold-300 underline-offset-4 hover:text-gold-700">
                        Compare nearby
                      </Link>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <details className="mt-6 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
        <summary className="cursor-pointer font-medium text-slate-800">How the criteria work</summary>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {FIT_TAGS.map((t) => (
            <li key={t.key}>
              <span className="font-medium text-slate-800">{t.label}:</span> {t.criterion}
            </li>
          ))}
        </ul>
        <p className="mt-2">
          A community appears when it offers the feature, not because it does it better than another. The list is not
          exhaustive, and every property still needs its own checks.
        </p>
      </details>
    </section>
  )
}
