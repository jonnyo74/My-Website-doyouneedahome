import Link from 'next/link'
import Prose from '@/components/Prose'
import type { ArticleComparison, ComparisonPlace } from '@/lib/articles'

// The body of a nearby-cities comparison: one H2 section per alternative with
// its two answers set side by side, then a priority framework that points each
// reader at a starting place, then the cost callout. Every anchor here matches
// a shortlist row. Edit the article record, not this file, for wording.

const START =
  'rounded font-semibold text-gold-600 underline decoration-gold-300 underline-offset-4 transition hover:text-gold-700'

function Answer({ label, text, home }: { label: string; text: string; home?: boolean }) {
  return (
    <div
      className={
        home
          ? 'rounded-xl border border-gold-200 bg-gold-50 p-5'
          : 'rounded-xl border border-slate-300 bg-white p-5'
      }
    >
      <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${home ? 'text-gold-700' : 'text-slate-700'}`}>
        {label}
      </p>
      <p className="mt-2 leading-7 text-slate-800">{text}</p>
    </div>
  )
}

function PlaceSection({ place }: { place: ComparisonPlace }) {
  return (
    <section aria-labelledby={place.id} className="border-t border-slate-200 pt-10 first:border-t-0 first:pt-0">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {place.county}
        {place.grouping && <span className="normal-case tracking-normal"> · {place.grouping}</span>}
      </p>
      <h2 id={place.id} className="mt-2 scroll-mt-28 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
        {place.heading}
      </h2>
      <Prose content={place.body} />
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Answer label={place.chooseThem.label} text={place.chooseThem.text} />
        <Answer label={place.chooseHome.label} text={place.chooseHome.text} home />
      </div>
      {place.note && (
        <p className="mt-4 border-l-2 border-slate-300 pl-4 text-sm leading-6 text-slate-600">
          <span className="font-semibold text-slate-900">{place.note.label}:</span> {place.note.text}
        </p>
      )}
      <p className="mt-5 text-sm">
        <a
          href="#shortlist-heading"
          className="rounded text-slate-500 underline decoration-slate-300 underline-offset-4 transition hover:text-gold-600"
        >
          <span aria-hidden="true">↑ </span>Back to the shortlist
        </a>
      </p>
    </section>
  )
}

export default function ComparisonGuide({ comparison }: { comparison: ArticleComparison }) {
  const { places, decide, costCallout } = comparison
  return (
    <div>
      <div className="space-y-12">
        {places.map((p) => (
          <PlaceSection key={p.id} place={p} />
        ))}
      </div>

      <section aria-labelledby="how-to-decide" className="mt-16 border-t-2 border-slate-900 pt-10">
        <h2 id="how-to-decide" className="scroll-mt-28 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
          {decide.heading}
        </h2>
        {decide.intro && <p className="mt-3 leading-7 text-slate-600">{decide.intro}</p>}
        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          {decide.pathways.map((w, i) => (
            <li key={w.priority} className="flex flex-col rounded-2xl border border-slate-200 p-5">
              <p className="flex items-baseline gap-3">
                <span aria-hidden="true" className="font-serif text-xl font-semibold text-gold-600 tabular-nums">
                  {i + 1}
                </span>
                <span className="font-semibold leading-6 text-slate-900">{w.priority}</span>
              </p>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{w.text}</p>
              <p className="mt-4 border-t border-slate-100 pt-3 text-sm leading-6">
                <span className="font-semibold text-slate-900">Start here: </span>
                {w.start.map((s, j) => (
                  <span key={s.href}>
                    {j > 0 && <span className="text-slate-500">, then </span>}
                    {s.href.startsWith('#') ? (
                      <a href={s.href} className={START}>
                        {s.label}
                      </a>
                    ) : (
                      <Link href={s.href} className={START}>
                        {s.label}
                      </Link>
                    )}
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ol>
        {decide.summary && <Prose content={decide.summary} />}
      </section>

      <aside
        aria-labelledby="compare-costs"
        className="mt-12 rounded-2xl border border-slate-200 border-l-4 border-l-gold-500 bg-slate-50 px-6 py-6 sm:px-7"
      >
        <h2 id="compare-costs" className="scroll-mt-28 font-serif text-xl font-semibold text-slate-900 sm:text-2xl">
          {costCallout.heading}
        </h2>
        <Prose content={costCallout.body} />
      </aside>
    </div>
  )
}
