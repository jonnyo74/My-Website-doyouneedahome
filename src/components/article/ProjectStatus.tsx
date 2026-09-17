import Link from 'next/link'
import type { CivicProject } from '@/lib/articles'

// The status card for a live civic project, shown directly under the hero.
// A reader should be able to tell in seconds how mature the project is: what is
// settled sits in the definition list, what is not sits in its own panel, and
// the whole card carries the date it was last checked plus the official source.
//
// Every value here must come from a primary source. A concept is not funding,
// funding is not construction, and construction is not an opening date — if a
// stage cannot be verified, say so in `unconfirmed` rather than softening it.

function SourceLink({ link, className = '' }: { link: { label: string; href: string }; className?: string }) {
  const cls = `inline-flex items-center gap-1 rounded font-semibold text-gold-700 underline decoration-gold-300 underline-offset-4 transition hover:text-gold-800 ${className}`
  if (link.href.startsWith('/') || link.href.startsWith('#')) {
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

export function ProjectStatusCard({ status }: { status: CivicProject['status'] }) {
  return (
    <section aria-labelledby="project-status" className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-3xl px-6 py-10 sm:px-8">
        <div>
          <h2 id="project-status" className="scroll-mt-28 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
            {status.heading}
          </h2>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Last verified{' '}
            <time dateTime={status.lastVerified}>
              {new Date(`${status.lastVerified}T12:00:00Z`).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC',
              })}
            </time>
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <dl className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-5 py-1">
            {status.items.map((item) => (
              <div key={item.label} className="grid gap-x-5 gap-y-1 py-3.5 sm:grid-cols-[9rem_minmax(0,1fr)]">
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 sm:pt-1">
                  {item.label}
                </dt>
                <dd className="leading-7 text-slate-800">{item.value}</dd>
              </div>
            ))}
          </dl>

          {/* Deliberately its own panel: these are the things a reader must not
              come away believing are settled. */}
          <div className="rounded-2xl border border-slate-300 border-l-4 border-l-slate-400 bg-white px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
              {status.unconfirmedLabel}
            </p>
            <ul className="mt-3 space-y-2">
              {status.unconfirmed.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-6 text-slate-700">
                  <span aria-hidden="true" className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-5 text-sm">
          <SourceLink link={status.source} />
        </p>
      </div>
    </section>
  )
}

export function ProjectTimeline({ timeline }: { timeline: CivicProject['timeline'] }) {
  return (
    <section aria-labelledby="project-timeline" className="mt-14 border-t-2 border-slate-900 pt-8">
      <h2 id="project-timeline" className="scroll-mt-28 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
        {timeline.heading}
      </h2>
      {timeline.intro && <p className="mt-3 leading-7 text-slate-600">{timeline.intro}</p>}
      <ol className="mt-7 space-y-7 border-l-2 border-slate-200 pl-6">
        {timeline.items.map((item) => (
          <li key={item.title} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-[1.9rem] top-1.5 h-3 w-3 rounded-full border-2 border-gold-500 bg-white"
            />
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-700">
              <time dateTime={item.date}>{item.dateLabel}</time>
            </p>
            <h3 className="mt-1 font-semibold leading-7 text-slate-900">{item.title}</h3>
            {item.text && <p className="mt-1 leading-7 text-slate-600">{item.text}</p>}
            {item.source && (
              <p className="mt-2 text-sm">
                <SourceLink link={item.source} />
              </p>
            )}
          </li>
        ))}
      </ol>
      {timeline.note && <p className="mt-6 text-sm leading-6 text-slate-500">{timeline.note}</p>}
    </section>
  )
}

export function ProjectTracking({ tracking }: { tracking: CivicProject['tracking'] }) {
  return (
    <section
      aria-labelledby="how-to-follow"
      className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-6 sm:px-7"
    >
      <h2 id="how-to-follow" className="scroll-mt-28 font-serif text-xl font-semibold text-slate-900 sm:text-2xl">
        {tracking.heading}
      </h2>
      {tracking.intro && <p className="mt-3 leading-7 text-slate-600">{tracking.intro}</p>}
      <ul className="mt-5 space-y-3">
        {tracking.links.map((link) => (
          <li key={link.href} className="flex gap-2.5">
            <span aria-hidden="true" className="mt-2.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
            <SourceLink link={link} className="text-sm leading-6" />
          </li>
        ))}
      </ul>
      {tracking.note && <p className="mt-5 text-sm leading-6 text-slate-500">{tracking.note}</p>}
    </section>
  )
}
