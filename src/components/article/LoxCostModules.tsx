import {
  EQUATION_HEADING,
  EQUATION_HEADING_ID,
  EQUATION_INTRO,
  EQUATION_LENSES,
  VALUE_CARDS,
  VALUE_HEADING,
  VALUE_HEADING_ID,
  VALUE_INTRO,
} from '@/lib/loxCost'

export { EQUATION_HEADING, EQUATION_HEADING_ID, VALUE_HEADING, VALUE_HEADING_ID }

// Static, explanatory modules for the cost-of-living guide. No inputs, no figures.
export function LoxCostEquation() {
  return (
    <section aria-labelledby={EQUATION_HEADING_ID} className="mt-12 rounded-3xl border border-lime-900/20 bg-[#f4efdf] p-6 sm:p-9">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lime-900">Four lenses</p>
      <h2 id={EQUATION_HEADING_ID} className="mt-2 scroll-mt-28 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
        {EQUATION_HEADING}
      </h2>
      <p className="mt-3 leading-7 text-slate-700">{EQUATION_INTRO}</p>
      <ol className="mt-6 grid gap-4 sm:grid-cols-2">
        {EQUATION_LENSES.map((l, i) => (
          <li key={l.lens} className="rounded-2xl border border-lime-900/20 bg-white p-5">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-900 text-sm font-semibold text-white">
                {i + 1}
              </span>
              <h3 className="font-serif text-lg font-semibold text-slate-900">{l.lens}</h3>
            </div>
            <p className="mt-3 leading-7 text-slate-700">{l.changes}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function LoxValueCards() {
  return (
    <section aria-labelledby={VALUE_HEADING_ID} className="mt-12 overflow-hidden rounded-3xl border border-lime-900/20 bg-white">
      <div className="p-6 sm:p-9">
        <h2 id={VALUE_HEADING_ID} className="scroll-mt-28 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
          {VALUE_HEADING}
        </h2>
        <p className="mt-3 leading-7 text-slate-700">{VALUE_INTRO}</p>
      </div>
      <ul className="grid divide-y divide-lime-900/15 border-t border-lime-900/20 bg-[#f4efdf] md:grid-cols-3 md:divide-x md:divide-y-0">
        {VALUE_CARDS.map((c) => (
          <li key={c.title} className="p-6 sm:p-7">
            <h3 className="font-serif text-xl font-semibold text-lime-900">{c.title}</h3>
            <p className="mt-2 leading-7 text-slate-700">{c.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
