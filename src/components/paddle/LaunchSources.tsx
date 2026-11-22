import Link from 'next/link'
import { formatLastVerified, launches } from '@/lib/paddle/launches'
import { SOURCING_LABEL } from '@/lib/paddle/labels'

/**
 * The page's reference list: every launch, how well sourced it is, when it was
 * last checked, and the documents it was checked against.
 *
 * `lastVerified` is printed only where a check has actually been recorded. A
 * launch with no recorded date shows no date at all rather than a guess.
 */
export default function LaunchSources({ printHref }: { printHref?: string }) {
  return (
    <section id="sources" aria-labelledby="sources-heading" className="scroll-mt-24">
      <h2 id="sources-heading" className="font-serif text-2xl font-semibold text-navy-950">
        Sources
      </h2>
      <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-slate-600">
        Each launch above is listed here with the documents it was checked against. Where the
        managing agency publishes the facility, that is the source used.
        {printHref && (
          <>
            {' '}
            <Link
              href={printHref}
              className="font-semibold text-gold-600 underline underline-offset-4 hover:text-gold-700"
            >
              Open the printable launch chart
            </Link>
            .
          </>
        )}
      </p>

      <ol className="mt-6 space-y-5">
        {launches.map((site) => (
          <li key={site.id} className="text-sm leading-relaxed text-slate-600">
            <p>
              <span className="font-semibold text-navy-900">
                {site.n}. {site.name}
              </span>{' '}
              <span className="text-slate-600">
                ({site.operator}). {SOURCING_LABEL[site.sourcing]}.
                {site.lastVerified && (
                  <>
                    {' '}
                    Last verified{' '}
                    <time dateTime={site.lastVerified}>
                      {formatLastVerified(site.lastVerified)}
                    </time>
                    .
                  </>
                )}
              </span>
            </p>
            <ul className="mt-1 space-y-0.5">
              {site.sources.map((source) => (
                <li key={source.href}>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 underline underline-offset-4 hover:text-gold-600"
                  >
                    {source.label}
                  </a>
                  <span className="hidden break-all text-xs text-slate-500 print:inline">
                    {' '}
                    {source.href}
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
