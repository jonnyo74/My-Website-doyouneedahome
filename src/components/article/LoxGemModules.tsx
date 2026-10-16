import {
  GEM_TEST_HEADING,
  GEM_TEST_HEADING_ID,
  GEM_TEST_INTRO,
  GEM_TEST_ITEMS,
  GLANCE_HEADING,
  GLANCE_HEADING_ID,
  GLANCE_ROWS,
  GLANCE_SOURCE,
} from '@/lib/loxGems'

export { GEM_TEST_HEADING, GEM_TEST_HEADING_ID, GLANCE_HEADING, GLANCE_HEADING_ID }

// Static editorial modules for the hidden-gems guide. No state and no inputs.
export function LoxGemTest() {
  return (
    <section aria-labelledby={GEM_TEST_HEADING_ID} className="mt-12 rounded-3xl border border-lime-900/20 bg-[#f4efdf] p-6 sm:p-9">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lime-900">Three ways to spot one</p>
      <h2 id={GEM_TEST_HEADING_ID} className="mt-2 scroll-mt-28 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
        {GEM_TEST_HEADING}
      </h2>
      <p className="mt-3 leading-7 text-slate-700">{GEM_TEST_INTRO}</p>
      <ol className="mt-6 space-y-0 divide-y divide-lime-900/15 border-y border-lime-900/20">
        {GEM_TEST_ITEMS.map((g, i) => (
          <li key={g.title} className="flex gap-4 py-5 sm:gap-6">
            <span aria-hidden="true" className="font-serif text-4xl font-semibold leading-none text-lime-900/40 sm:text-5xl">
              {i + 1}
            </span>
            <div>
              <h3 className="font-serif text-xl font-semibold leading-snug text-slate-900">{g.title}</h3>
              <p className="mt-1 leading-7 text-slate-700">{g.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function LoxAcreagePinesGlance() {
  return (
    <section aria-labelledby={GLANCE_HEADING_ID} className="mt-12 overflow-hidden rounded-3xl border border-lime-900/20 bg-white">
      <div className="bg-lime-900 px-6 py-5 sm:px-9">
        <h2 id={GLANCE_HEADING_ID} className="scroll-mt-28 font-serif text-2xl font-semibold text-white sm:text-3xl">
          {GLANCE_HEADING}
        </h2>
      </div>
      <dl className="divide-y divide-lime-900/15 px-6 sm:px-9">
        {GLANCE_ROWS.map((r) => (
          <div key={r.label} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
            <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-900">{r.label}</dt>
            <dd className="leading-7 text-slate-700">{r.value}</dd>
          </div>
        ))}
      </dl>
      <p className="border-t border-lime-900/20 bg-[#f4efdf] px-6 py-4 text-sm text-slate-600 sm:px-9">
        Source:{' '}
        <a className="font-medium text-lime-900 underline" href={GLANCE_SOURCE.href} rel="noopener noreferrer" target="_blank">
          {GLANCE_SOURCE.label}
        </a>
        , checked {GLANCE_SOURCE.checked}. Hours and rules can change, so use the county page for current conditions.
      </p>
    </section>
  )
}
