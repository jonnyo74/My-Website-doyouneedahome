import type { ArticleEditorial } from '@/lib/articles'

type KeyFactorsData = NonNullable<ArticleEditorial['keyFactors']>

// A numbered decision aid: the handful of things that move the answer, each
// with one line of why. A single ruled list rather than a card grid, so it
// reads as the argument of the article and not as decoration. Like QuickFit,
// every line should be a condensation of the body — edit the record, not this.
export default function KeyFactors({ data }: { data: KeyFactorsData }) {
  return (
    <section aria-labelledby="key-factors-heading" className="border-b border-slate-200 pb-10">
      <h2 id="key-factors-heading" className="font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
        {data.heading}
      </h2>
      {data.intro && <p className="mt-3 leading-7 text-slate-600">{data.intro}</p>}
      <ol className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
        {data.items.map((item, i) => (
          <li key={item.title} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 py-4 sm:grid-cols-[2.5rem_minmax(0,1fr)]">
            <span aria-hidden="true" className="font-serif text-xl font-semibold leading-7 text-gold-600 tabular-nums">
              {i + 1}
            </span>
            <div>
              <h3 className="font-semibold leading-7 text-slate-900">{item.title}</h3>
              <p className="mt-1 leading-7 text-slate-600">{item.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
