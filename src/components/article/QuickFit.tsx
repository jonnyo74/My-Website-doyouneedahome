import type { ArticleEditorial } from '@/lib/articles'

type QuickFitData = NonNullable<ArticleEditorial['quickFit']>

// A two-column "short version" for decision articles. Every point is meant to
// be a condensed line from the article body — this component adds no claims of
// its own, so edit the record, not this file, if the wording needs to change.
export default function QuickFit({ data }: { data: QuickFitData }) {
  const cards = data.variant === 'cards'
  const neutral = Boolean(data.third)
  const columns = [
    { heading: data.fitHeading, items: data.fit, mark: neutral ? '•' : '+' },
    { heading: data.elsewhereHeading, items: data.elsewhere, mark: neutral ? '•' : '–' },
    ...(data.third ? [{ heading: data.third.heading, items: data.third.items, mark: '•' }] : []),
  ]
  return (
    <section
      aria-labelledby="quick-fit-heading"
      className={cards ? 'mt-10' : 'border-b border-slate-200 pb-10'}
    >
      <h2 id="quick-fit-heading" className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-600">
        {data.heading ?? 'The short version'}
      </h2>
      <div
        className={
          cards
            ? `mt-4 grid gap-4 md:gap-5 ${neutral ? 'md:grid-cols-3' : 'md:grid-cols-2'}`
            : 'mt-5 grid gap-8 md:grid-cols-2 md:gap-10'
        }
      >
        {columns.map((col) => (
          <div
            key={col.heading}
            className={cards ? 'rounded-2xl border border-slate-200 bg-white p-6 shadow-card' : undefined}
          >
            <h3 className={`font-serif font-semibold text-slate-900 ${cards ? 'text-lg leading-7' : 'text-xl'}`}>
              {col.heading}
            </h3>
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
