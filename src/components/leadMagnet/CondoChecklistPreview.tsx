import condoDueDiligence from '@/content/condo-due-diligence.json'

/**
 * The crawlable half of the condo due-diligence checklist. The registry entry
 * already renders the first four sections; this lists the full set of section
 * headings plus the red flags, so the page is genuinely useful without the
 * download and search can see what the checklist covers.
 */
export default function CondoChecklistPreview() {
  const sections = condoDueDiligence.sections

  return (
    <>
      <section className="bg-slate-50 px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-report-gold-text">
            The Full Checklist
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-slate-900">
            All {sections.length} Sections
          </h2>
          <p className="mt-4 leading-8 text-slate-600">
            The four sections above are reproduced in full. The PDF contains all {sections.length},
            formatted so you can work through them in order and check items off as the documents
            arrive.
          </p>

          <ol className="mt-8 grid gap-4 sm:grid-cols-2">
            {sections.map((section, i) => (
              <li
                key={section.heading}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
              >
                <p className="font-serif text-lg font-semibold text-report-gold-text">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-1 text-sm font-semibold text-slate-900">{section.heading}</h3>
                <p className="mt-1.5 text-xs text-slate-500">
                  {section.items.length} item{section.items.length === 1 ? '' : 's'}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-report-gold-text">
            Slow Down If You See These
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-slate-900">
            {condoDueDiligence.redFlags.length} Red Flags
          </h2>
          <p className="mt-4 leading-8 text-slate-600">
            None of these means walk away on its own. All of them mean ask another question, and get
            the answer in writing, before your inspection period runs out.
          </p>
          <ul className="mt-7 space-y-3">
            {condoDueDiligence.redFlags.map((flag) => (
              <li
                key={flag}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-600 shadow-card"
              >
                <span className="mt-0.5 flex-shrink-0 text-report-gold-text" aria-hidden="true">
                  ⚑
                </span>
                {flag}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
