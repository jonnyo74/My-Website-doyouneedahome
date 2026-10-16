import { NIGHT_HEADING, NIGHT_HEADING_ID, NIGHT_INTRO, NIGHT_ROUTES, REGULARS, REGULARS_HEADING, REGULARS_HEADING_ID, REGULARS_NOTE } from '@/lib/loxNight'

export { NIGHT_HEADING, NIGHT_HEADING_ID }

// Static, linked chooser. No state and no inputs.
export default function LoxNightChooser() {
  return (
    <section aria-labelledby={NIGHT_HEADING_ID} className="mt-12 rounded-3xl border border-lime-900/20 bg-[#f4efdf] p-6 sm:p-9">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lime-900">Four ways to spend an evening</p>
      <h2 id={NIGHT_HEADING_ID} className="mt-2 scroll-mt-28 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
        {NIGHT_HEADING}
      </h2>
      <p className="mt-3 leading-7 text-slate-700">{NIGHT_INTRO}</p>
      <ol className="mt-6 grid gap-4 sm:grid-cols-2">
        {NIGHT_ROUTES.map((r, i) => (
          <li key={r.title}>
            <a
              href={`#${r.anchor}`}
              className="group flex h-full flex-col rounded-2xl border border-lime-900/20 bg-white p-5 transition hover:border-lime-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-900">Night {i + 1}</span>
              <span className="mt-2 font-serif text-xl font-semibold leading-snug text-slate-900">{r.title}</span>
              <span className="mt-2 leading-7 text-slate-700">{r.text}</span>
              <span className="mt-4 text-sm font-semibold text-lime-900 group-hover:underline">
                {r.place} <span aria-hidden="true">&rarr;</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}


export { REGULARS_HEADING, REGULARS_HEADING_ID }

export function LoxRegularsGlance() {
  return (
    <section aria-labelledby={REGULARS_HEADING_ID} className="mt-12 overflow-hidden rounded-3xl border border-lime-900/20 bg-white">
      <div className="bg-lime-900 px-6 py-5 sm:px-9">
        <h2 id={REGULARS_HEADING_ID} className="scroll-mt-28 font-serif text-2xl font-semibold text-white sm:text-3xl">
          {REGULARS_HEADING}
        </h2>
      </div>
      <ul className="divide-y divide-lime-900/15 px-6 sm:px-9">
        {REGULARS.map((r) => (
          <li key={r.name} className="py-5">
            <h3 className="font-serif text-xl font-semibold text-slate-900">{r.name}</h3>
            <p className="mt-1 text-sm text-slate-600">{r.address}</p>
            <p className="mt-2 leading-7 text-slate-700">{r.bestFor}</p>
            <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
              {r.links.map((l) => (
                <a key={l.href} className="font-medium text-lime-900 underline" href={l.href} rel="noopener noreferrer" target="_blank">
                  {l.label}
                </a>
              ))}
            </p>
          </li>
        ))}
      </ul>
      <p className="border-t border-lime-900/20 bg-[#f4efdf] px-6 py-4 text-sm text-slate-600 sm:px-9">{REGULARS_NOTE}</p>
    </section>
  )
}
