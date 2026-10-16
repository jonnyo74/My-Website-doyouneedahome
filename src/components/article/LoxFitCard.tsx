import { FIT_CLOSING, FIT_HEADING, FIT_HEADING_ID, FIT_LEAD, FIT_ROWS } from '@/lib/loxFit'

export { FIT_HEADING, FIT_HEADING_ID }

// A static, scannable summary of the lifestyle trade. No state, no inputs.
export default function LoxFitCard() {
  return (
    <section aria-labelledby={FIT_HEADING_ID} className="mt-12 overflow-hidden rounded-3xl border border-lime-900/20 bg-[#f4efdf]">
      <div className="p-6 sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lime-900">Loxahatchee fit</p>
        <h2 id={FIT_HEADING_ID} className="mt-2 scroll-mt-28 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
          {FIT_HEADING}
        </h2>
        <p className="mt-3 leading-7 text-slate-700">{FIT_LEAD}</p>
        <ul className="mt-5 divide-y divide-lime-900/15 rounded-2xl border border-lime-900/20 bg-white">
          {FIT_ROWS.map((r, i) => (
            <li key={r.choose} className="flex items-start gap-4 px-4 py-4 sm:px-6">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-900 text-sm font-semibold text-white"
              >
                {i + 1}
              </span>
              <p className="leading-7 text-slate-700">
                <span className="font-serif text-lg font-semibold text-slate-900">{r.choose}</span>{' '}
                <span className="block sm:inline">{r.over}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
      <p className="border-t border-lime-900/20 bg-lime-900 px-6 py-5 font-serif text-lg leading-8 text-white sm:px-9 sm:text-xl">
        {FIT_CLOSING}
      </p>
    </section>
  )
}
