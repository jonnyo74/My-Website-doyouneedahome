import type { ArticleEditorial } from '@/lib/articles'

type QuickFitData = NonNullable<ArticleEditorial['quickFit']>

// A two-column "short version" for decision articles. Every point is meant to
// be a condensed line from the article body — this component adds no claims of
// its own, so edit the record, not this file, if the wording needs to change.
export default function QuickFit({ data }: { data: QuickFitData }) {
  const columns = [
    { heading: data.fitHeading, items: data.fit, mark: '+' },
    { heading: data.elsewhereHeading, items: data.elsewhere, mark: '–' },
  ]
  return (
    <section aria-labelledby="quick-fit-heading" className="border-b border-slate-200 pb-10">
      <h2 id="quick-fit-heading" className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-600">
        {data.heading ?? 'The short version'}
      </h2>
      <div className="mt-5 grid gap-8 md:grid-cols-2 md:gap-10">
        {columns.map((col) => (
          <div key={col.heading}>
            <h3 className="font-serif text-xl font-semibold text-slate-900">{col.heading}</h3>
            <ul className="mt-4 space-y-3">
              {col.items.map((item) => (
                <li key={item} className="flex gap-3 leading-7 text-slate-600">
                  <span aria-hidden="true" className="mt-px w-3 shrink-0 font-semibold text-gold-600">
                    {col.mark}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
