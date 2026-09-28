import Link from 'next/link'
import type { WhatsNewItem } from '@/lib/communities'

/**
 * Dated local-news roundup for a city page: headline, a short plain-English
 * read on what it means for a buyer, and where the news came from. Always
 * rendered newest first regardless of the order the items are stored in.
 */

// Noon UTC so the calendar date can't roll back a day in any US zone.
// Month-only dates ('2026-08') render as "Aug 2026" rather than a made-up day.
function formatDate(iso: string) {
  const monthOnly = iso.length === 7
  return new Date(`${monthOnly ? `${iso}-01` : iso}T12:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    ...(monthOnly ? {} : { day: 'numeric' as const }),
    timeZone: 'UTC',
  })
}

export default function WhatsNew({
  cityName,
  items,
  updated,
}: {
  cityName: string
  items: WhatsNewItem[]
  /** ISO date the section was last reviewed — shown to readers. */
  updated?: string
}) {
  if (items.length === 0) return null
  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <section aria-labelledby="whats-new-heading">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold-600">Local News</p>
      <h2 id="whats-new-heading" className="mt-1 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
        What&apos;s New in {cityName}
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        Recent news and what it means if you&apos;re buying here, newest first.
        {updated && <> Last updated <time dateTime={updated}>{formatDate(updated)}</time>.</>}
      </p>
      <ol className="mt-6 space-y-4">
        {sorted.map((item) => (
          <li key={`${item.date}-${item.headline}`} className="rounded-2xl border border-slate-200 bg-white p-6">
            <time dateTime={item.date} className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {formatDate(item.date)}
            </time>
            <h3 className="mt-2 font-serif text-lg font-semibold text-slate-900">{item.headline}</h3>
            <p className="mt-2 leading-7 text-slate-600">{item.take}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <span className="text-slate-500">
                Source:{' '}
                {item.source.url ? (
                  <a
                    href={item.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-gold-600 transition hover:text-gold-700"
                  >
                    {item.source.name}
                  </a>
                ) : (
                  <span className="font-medium text-slate-700">{item.source.name}</span>
                )}
              </span>
              {item.link && (
                <Link href={item.link.href} className="font-semibold text-gold-600 transition hover:text-gold-700">
                  {item.link.label} →
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
