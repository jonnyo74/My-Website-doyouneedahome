import Link from 'next/link'

export type SavedSearch = { label: string; sublabel?: string; url: string }

type Props = {
  searches: SavedSearch[]
  /** Optional eyebrow + heading shown above the buttons. Omit for a bare button row (e.g. inside an article). */
  heading?: string
  eyebrow?: string
  /** Phone CTA shown alongside the search buttons. Defaults off. */
  phone?: { display: string; href: string }
  className?: string
}

/**
 * Curated MLS search buttons backed by real saved-search URLs.
 * Reused on community pages and inside blog articles.
 */
export default function CitySearchButtons({ searches, heading, eyebrow, phone, className = '' }: Props) {
  if (!searches || searches.length === 0) return null

  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50 via-blue-50 to-white p-7 shadow-card sm:p-9 ${className}`}
    >
      {(eyebrow || heading) && (
        <div className="mb-6">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">{eyebrow}</p>
          )}
          {heading && (
            <h2 className="mt-1 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">{heading}</h2>
          )}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {searches.map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:border-gold-500/50 hover:shadow-card-hover"
          >
            <span>
              <span className="block text-sm font-semibold text-slate-900">{s.label}</span>
              {s.sublabel && <span className="block text-xs text-slate-500">{s.sublabel}</span>}
            </span>
            <span
              aria-hidden
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gold-500 text-white transition group-hover:bg-gold-600"
            >
              {/* magnifying-glass icon */}
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
                <path d="m14 14 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </a>
        ))}
      </div>

      <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <Link
          href="/contact"
          className="text-sm font-semibold text-gold-600 transition hover:text-gold-700"
        >
          Or have us send you matching listings →
        </Link>
        {phone && (
          <>
            <span className="hidden text-slate-300 sm:inline">·</span>
            <a href={phone.href} className="text-sm font-semibold text-slate-600 transition hover:text-gold-600">
              Call {phone.display}
            </a>
          </>
        )}
      </div>
    </div>
  )
}
