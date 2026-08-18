import Link from 'next/link'
import relocationGuide from '@/content/relocation-guide.json'

type Area = (typeof relocationGuide.areas)[number]

const DETAIL_ROWS: Array<{ key: keyof Area; label: string }> = [
  { key: 'setting', label: 'Coastal vs. inland' },
  { key: 'boating', label: 'Boating & waterfront access' },
  { key: 'golf', label: 'Golf & private-club living' },
  { key: 'fiftyFivePlus', label: '55+ options' },
  { key: 'newConstruction', label: 'New construction' },
  { key: 'hoa', label: 'HOA vs. non-HOA' },
  { key: 'healthcare', label: 'Healthcare access' },
  { key: 'transportation', label: 'Airport & transportation' },
  { key: 'pace', label: 'Pace & community character' },
  { key: 'bestFor', label: 'Which buyer it fits best' },
  { key: 'tradeOff', label: 'The trade-off' },
]

/**
 * Rows that only some areas answer. Kept out of DETAIL_ROWS (and out of the
 * `categories` count advertised on the landing page) because those are the
 * questions asked of every area — an optional row renders only where the field
 * exists, so Wellington can carry an equestrian section without leaving thirteen
 * empty cells everywhere else.
 */
const OPTIONAL_ROWS: Array<{ key: keyof Area; label: string }> = [
  { key: 'equestrianEstates', label: 'Equestrian estates & farms' },
]

const COUNTY_ORDER = ['Palm Beach County', 'Martin County', 'St. Lucie County'] as const

/**
 * The crawlable half of the relocation guide: every area in the PDF, compared
 * on the same questions. Content comes from src/content/relocation-guide.json,
 * which is also the source the PDF generator reads — the page and the download
 * can't drift apart.
 */
export default function RelocationComparison() {
  const areas = relocationGuide.areas

  return (
    <>
      {/* Quick-compare table */}
      <section className="px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-report-gold-text">
            Side by Side
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-slate-900">
            All {areas.length} Areas at a Glance
          </h2>
          <p className="mt-4 max-w-3xl leading-8 text-slate-600">
            Entry price is the bottom of the lowest property-type range published on that area&rsquo;s
            community page — a starting point for orientation, not a median sale price.
          </p>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 shadow-card">
            <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
              <caption className="sr-only">
                Palm Beach County and Treasure Coast areas compared on county, entry price, setting,
                boating, golf and 55+ availability
              </caption>
              <thead>
                <tr className="bg-navy-950 text-white">
                  <th scope="col" className="px-4 py-3 font-semibold">Area</th>
                  <th scope="col" className="px-4 py-3 font-semibold">County</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Entry price</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Setting</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Dockage</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Golf clubs</th>
                  <th scope="col" className="px-4 py-3 font-semibold">55+</th>
                </tr>
              </thead>
              <tbody>
                {areas.map((area, i) => (
                  <tr key={area.slug} className={i % 2 ? 'bg-slate-50' : 'bg-white'}>
                    <th scope="row" className="px-4 py-3 font-semibold text-slate-900">
                      <Link
                        href={area.communityPage}
                        className="underline decoration-report-gold/50 underline-offset-4 transition hover:text-gold-600"
                      >
                        {area.name}
                      </Link>
                    </th>
                    <td className="px-4 py-3 text-slate-600">{area.county}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {area.priceRanges[0].range.split(' - ')[0]}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{area.setting.split(',')[0]}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {area.boating.startsWith('No') ? 'No' : 'Yes'}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {area.golf.startsWith('Not a golf market') ? 'No' : 'Yes'}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {area.fiftyFivePlus.startsWith('Yes') ? 'Yes' : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Per-area detail */}
      <section className="bg-slate-50 px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-report-gold-text">
            Area by Area
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-slate-900">
            Every Area, on the Same {DETAIL_ROWS.length + 1} Questions
          </h2>

          {COUNTY_ORDER.map((county) => {
            const inCounty = areas.filter((a) => a.county === county)
            if (inCounty.length === 0) return null
            return (
              <div key={county} className="mt-12">
                <h3 className="font-serif text-2xl font-semibold text-slate-900">{county}</h3>
                <div className="mt-5 space-y-4">
                  {inCounty.map((area) => (
                    <details
                      key={area.slug}
                      className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
                    >
                      <summary className="cursor-pointer list-none">
                        <span className="block font-serif text-xl font-semibold text-slate-900">
                          {area.name}
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-slate-600">
                          {area.bestFor}
                        </span>
                        <span className="mt-2 block text-xs font-semibold uppercase tracking-[0.16em] text-report-gold-text">
                          Full breakdown
                        </span>
                      </summary>

                      <div className="mt-6 border-t border-slate-200 pt-6">
                        <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Home price ranges
                        </h4>
                        <ul className="mt-3 space-y-1.5">
                          {area.priceRanges.map((pr) => (
                            <li key={pr.type} className="flex flex-wrap gap-x-2 text-sm text-slate-600">
                              <span className="font-semibold text-slate-900">{pr.range}</span>
                              <span>{pr.type}</span>
                            </li>
                          ))}
                        </ul>

                        <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                          {[
                            ...DETAIL_ROWS,
                            ...OPTIONAL_ROWS.filter((row) => area[row.key]),
                          ].map((row) => (
                            <div key={row.key}>
                              <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                {row.label}
                              </dt>
                              <dd className="mt-1 text-sm leading-7 text-slate-600">
                                {area[row.key] as string}
                              </dd>
                            </div>
                          ))}
                        </dl>

                        <Link
                          href={area.communityPage}
                          className="mt-6 inline-flex text-sm font-semibold text-gold-600 transition hover:text-gold-700"
                        >
                          Full {area.name} community guide →
                        </Link>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
