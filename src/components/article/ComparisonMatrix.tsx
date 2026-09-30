import Link from 'next/link'
import type { ComparisonMatrixData } from '@/lib/articles'
import { headingId } from '@/lib/headingId'

// Several places side by side, one card per place. Cards rather than a table
// at every width: five text columns don't survive the reading column, let
// alone a phone. Content is qualitative on purpose — edit the article record,
// not this file, for wording.
export function matrixHeadingId(data: ComparisonMatrixData) {
  return headingId(data.heading)
}

export default function ComparisonMatrix({ data }: { data: ComparisonMatrixData }) {
  const id = matrixHeadingId(data)
  const fields = [
    { key: 'priorities', label: data.labels.priorities },
    { key: 'questions', label: data.labels.questions },
    { key: 'daily', label: data.labels.daily },
  ] as const
  return (
    <section aria-labelledby={id} className="mt-10">
      <h2 id={id} className="scroll-mt-28 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
        {data.heading}
      </h2>
      {data.intro && <p className="mt-3 leading-7 text-slate-600">{data.intro}</p>}
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {data.rows.map((row) => (
          <li key={row.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h3 className="font-serif text-lg font-semibold leading-7 text-slate-900">
              {row.href ? (
                <Link
                  href={row.href}
                  className="rounded underline decoration-slate-300 underline-offset-4 transition hover:text-gold-600 hover:decoration-gold-500"
                >
                  {row.name}
                </Link>
              ) : (
                row.name
              )}
            </h3>
            {row.tag && <p className="mt-0.5 text-xs leading-5 text-slate-500">{row.tag}</p>}
            <dl className="mt-4 space-y-3 text-sm leading-6">
              {fields.map((f) => (
                <div key={f.key}>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">{f.label}</dt>
                  <dd className="mt-0.5 text-slate-700">{row[f.key]}</dd>
                </div>
              ))}
              <div className="rounded-lg bg-gold-50 px-3 py-2.5">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-700">{data.labels.singer}</dt>
                <dd className="mt-0.5 text-slate-700">{row.singer}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
      {data.note && <p className="mt-4 text-xs leading-5 text-slate-500">{data.note}</p>}
    </section>
  )
}
