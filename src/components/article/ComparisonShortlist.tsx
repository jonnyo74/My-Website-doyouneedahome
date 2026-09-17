import type { ArticleComparison } from '@/lib/articles'

// "Shortlist at a glance": every alternative in one scannable view, each row
// linking down to its full comparison. A real <table> from lg up; below that
// the same content as stacked cards, since four text columns can't survive a
// phone. The hidden variant is display:none, so assistive tech meets it once.
//
// Cells are qualitative on purpose — no scores, prices, drive times or school
// ratings. Edit the article record, not this file, for wording.

function GroupTag({ county, grouping }: { county: string; grouping?: string }) {
  return (
    <span className="mt-1 block text-xs font-normal leading-5 text-slate-500">
      {county}
      {grouping && (
        <>
          <span aria-hidden="true"> · </span>
          <span className="font-medium text-slate-600">{grouping}</span>
        </>
      )}
    </span>
  )
}

const JUMP =
  'rounded font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 transition hover:text-gold-600 hover:decoration-gold-500'

export default function ComparisonShortlist({ comparison }: { comparison: ArticleComparison }) {
  const { shortlist, places } = comparison
  return (
    <section aria-labelledby="shortlist-heading" className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8 lg:py-14">
        <div className="max-w-3xl">
          <h2 id="shortlist-heading" className="scroll-mt-28 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
            {shortlist.heading}
          </h2>
          {shortlist.intro && <p className="mt-3 leading-7 text-slate-600">{shortlist.intro}</p>}
        </div>

        {/* Wide screens: a table. Row headers carry the jump links. */}
        <div className="mt-8 hidden lg:block">
          <table className="w-full table-fixed border-collapse text-left text-sm">
            <caption className="sr-only">
              {shortlist.heading}: each alternative, what it suits, what to weigh, and {shortlist.whyHomeHeading.toLowerCase()}.
              Place names link to the full comparison below.
            </caption>
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[26%]" />
              <col className="w-[26%]" />
              <col className="w-[26%]" />
            </colgroup>
            <thead>
              <tr className="border-b-2 border-slate-900">
                <th scope="col" className="py-3 pr-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">Place</th>
                <th scope="col" className="py-3 pr-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">Best fit for</th>
                <th scope="col" className="py-3 pr-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">What to weigh carefully</th>
                <th scope="col" className="py-3 text-xs font-semibold uppercase tracking-[0.16em] text-gold-700">{shortlist.whyHomeHeading}</th>
              </tr>
            </thead>
            <tbody>
              {places.map((p) => (
                <tr key={p.id} className="border-b border-slate-200 align-top">
                  <th scope="row" className="py-4 pr-5 font-normal">
                    <a href={`#${p.id}`} className={`${JUMP} text-base`}>
                      {p.name}
                      <span className="sr-only">: read the full comparison</span>
                    </a>
                    <GroupTag county={p.county} grouping={p.grouping} />
                  </th>
                  <td className="py-4 pr-5 leading-6 text-slate-700">{p.bestFor}</td>
                  <td className="py-4 pr-5 leading-6 text-slate-700">{p.weigh}</td>
                  <td className="bg-gold-50/60 px-4 py-4 leading-6 text-slate-700">{p.whyHome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Narrow screens: one card per place. */}
        <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:hidden">
          {places.map((p) => (
            <li key={p.id} className="rounded-2xl border border-slate-200 p-5">
              <a href={`#${p.id}`} className={`${JUMP} font-serif text-lg`}>
                {p.name}
                <span className="sr-only">: read the full comparison</span>
              </a>
              <GroupTag county={p.county} grouping={p.grouping} />
              <dl className="mt-4 space-y-3 text-sm leading-6">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">Best fit for</dt>
                  <dd className="mt-0.5 text-slate-700">{p.bestFor}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">What to weigh carefully</dt>
                  <dd className="mt-0.5 text-slate-700">{p.weigh}</dd>
                </div>
                <div className="rounded-lg bg-gold-50 px-3 py-2.5">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-700">{shortlist.whyHomeHeading}</dt>
                  <dd className="mt-0.5 text-slate-700">{p.whyHome}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>

        {shortlist.footnote && <p className="mt-6 max-w-3xl text-xs leading-5 text-slate-500">{shortlist.footnote}</p>}
      </div>
    </section>
  )
}
