import {
  LIVES,
  LIVES_HEADING,
  LIVES_HEADING_ID,
  LIVES_INTRO,
  QUESTIONS,
  QUESTIONS_HEADING,
  QUESTIONS_HEADING_ID,
  QUESTIONS_INTRO,
} from '@/lib/loxCompare'

export { LIVES_HEADING, LIVES_HEADING_ID, QUESTIONS_HEADING, QUESTIONS_HEADING_ID }

// Static decision modules for the comparison guide. No state and no inputs.
export function LoxFiveLives() {
  return (
    <section aria-labelledby={LIVES_HEADING_ID} className="mt-12 rounded-3xl border border-lime-900/20 bg-[#f4efdf] p-6 sm:p-9">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lime-900">The comparison</p>
      <h2 id={LIVES_HEADING_ID} className="mt-2 scroll-mt-28 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
        {LIVES_HEADING}
      </h2>
      <p className="mt-3 leading-7 text-slate-700">{LIVES_INTRO}</p>

      <div className="mt-6 hidden grid-cols-[10rem_1fr_1fr_1fr] gap-4 px-5 text-xs font-semibold uppercase tracking-[0.18em] text-lime-900 lg:grid">
        <span>Place</span>
        <span>The daily rhythm</span>
        <span>Great for</span>
        <span>May feel less ideal if</span>
      </div>
      <ul className="mt-3 space-y-4">
        {LIVES.map((l) => (
          <li key={l.place} className="rounded-2xl border border-lime-900/20 bg-white p-5">
            <div className="grid gap-4 lg:grid-cols-[10rem_1fr_1fr_1fr] lg:gap-4">
              <h3 className="font-serif text-xl font-semibold text-slate-900">
                <a className="underline decoration-lime-900/30 underline-offset-4 hover:decoration-lime-900" href={`#${l.anchor}`}>
                  {l.place}
                </a>
              </h3>
              <p className="leading-7 text-slate-700">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-lime-900 lg:hidden">The daily rhythm</span>
                {l.rhythm}
              </p>
              <p className="leading-7 text-slate-700">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-lime-900 lg:hidden">Great for</span>
                {l.great}
              </p>
              <p className="leading-7 text-slate-700">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-amber-800 lg:hidden">May feel less ideal if</span>
                {l.less}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function LoxThreeQuestions() {
  return (
    <section aria-labelledby={QUESTIONS_HEADING_ID} className="mt-12 rounded-3xl border border-lime-900/20 bg-[#f4efdf] p-6 sm:p-9">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lime-900">The tiebreaker</p>
      <h2 id={QUESTIONS_HEADING_ID} className="mt-2 scroll-mt-28 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
        {QUESTIONS_HEADING}
      </h2>
      <p className="mt-3 leading-7 text-slate-700">{QUESTIONS_INTRO}</p>
      <ol className="mt-6 space-y-5">
        {QUESTIONS.map((q, i) => (
          <li key={q.q} className="rounded-2xl border border-lime-900/20 bg-white p-5 sm:p-6">
            <p className="font-semibold leading-7 text-slate-900">
              <span className="mr-2 text-lime-900">{i + 1}.</span>
              {q.q}
            </p>
            <ul className="mt-4 divide-y divide-lime-900/10">
              {q.options.map((o) => (
                <li key={o.if} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-4">
                  <span className="text-slate-700 sm:w-1/2">{o.if}</span>
                  <span className="text-slate-700">
                    <span aria-hidden="true" className="mr-1 text-lime-900">&rarr;</span>
                    {o.look.map((p, k) => (
                      <span key={p.place}>
                        {k > 0 ? ', ' : ''}
                        <a className="font-medium text-lime-900 underline" href={`#${p.anchor}`}>
                          {p.place}
                        </a>
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  )
}
