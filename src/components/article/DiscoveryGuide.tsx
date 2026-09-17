import Image from 'next/image'
import Link from 'next/link'
import Prose from '@/components/Prose'
import type { ArticleGuide, GuidePlace } from '@/lib/articles'

// A local discovery guide: jump links to each category, then one H2 per
// category and one H3 per place. Every place gets the same compact treatment —
// why it's worth the detour, who it suits, a practical note where one can be
// verified, and the official page — so readers can scan and compare.
//
// Anything time-sensitive (hours, fees, conditions) belongs behind the official
// link, not in the note. Edit the article record, not this file, for wording.

function PlaceLink({ link }: { link: NonNullable<GuidePlace['link']> }) {
  const cls =
    'inline-flex items-center gap-1 rounded text-sm font-semibold text-gold-600 underline decoration-gold-300 underline-offset-4 transition hover:text-gold-700'
  if (link.href.startsWith('/')) {
    return (
      <Link href={link.href} className={cls}>
        {link.label}
        <span aria-hidden="true">→</span>
      </Link>
    )
  }
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {link.label}
      <span aria-hidden="true">↗</span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}

function Place({ place, id }: { place: GuidePlace; id: string }) {
  return (
    <article aria-labelledby={id} className="border-t border-slate-200 pt-8 first:border-t-0 first:pt-0">
      <h3 id={id} className="scroll-mt-28 font-serif text-xl font-semibold text-slate-900 sm:text-2xl">
        {place.name}
      </h3>

      {place.image && (
        // Supporting images are lazy (next/image default) and sized by their
        // intrinsic dimensions, so the box is reserved before they arrive.
        <figure className="mt-5">
          <Image
            src={place.image.src}
            alt={place.image.alt}
            width={place.image.width}
            height={place.image.height}
            sizes="(min-width: 768px) 704px, 100vw"
            className="h-auto w-full rounded-xl"
          />
          {place.image.credit && (
            <figcaption className="mt-2 text-xs text-slate-500">{place.image.credit}</figcaption>
          )}
        </figure>
      )}

      {/* Prose adds its own top margin to each paragraph. */}
      <Prose content={place.body} />

      <dl className="mt-5 grid gap-x-6 gap-y-3 rounded-xl bg-slate-50 px-5 py-4 text-sm sm:grid-cols-[7.5rem_minmax(0,1fr)]">
        <dt className="font-semibold text-slate-900">Best for</dt>
        <dd className="text-slate-700">{place.bestFor.join(' · ')}</dd>
        {place.note && (
          <>
            <dt className="font-semibold text-slate-900">Good to know</dt>
            <dd className="leading-6 text-slate-700">{place.note}</dd>
          </>
        )}
        {place.link && (
          <>
            <dt className="font-semibold text-slate-900">Official info</dt>
            <dd>
              <PlaceLink link={place.link} />
            </dd>
          </>
        )}
      </dl>
    </article>
  )
}

export default function DiscoveryGuide({ guide }: { guide: ArticleGuide }) {
  return (
    <div>
      <nav aria-labelledby="guide-nav-heading" className="border-b border-slate-200 pb-10">
        <h2 id="guide-nav-heading" className="font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
          {guide.heading}
        </h2>
        {guide.intro && <p className="mt-3 leading-7 text-slate-600">{guide.intro}</p>}
        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          {guide.categories.map((c) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                className="flex h-full items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3.5 font-semibold text-slate-900 transition hover:border-gold-500 hover:text-gold-600"
              >
                <span>
                  {c.title}
                  <span className="mt-0.5 block text-xs font-normal text-slate-500">
                    {c.places.length} {c.places.length === 1 ? 'place' : 'places'}
                  </span>
                </span>
                <span aria-hidden="true" className="text-gold-600">↓</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {guide.categories.map((c) => (
        <section key={c.id} aria-labelledby={c.id} className="mt-14">
          <h2 id={c.id} className="scroll-mt-28 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
            {c.title}
          </h2>
          {c.intro && <p className="mt-3 leading-7 text-slate-600">{c.intro}</p>}
          <div className="mt-8 space-y-10">
            {c.places.map((p, i) => (
              <Place key={p.name} place={p} id={`${c.id}-${i + 1}`} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
