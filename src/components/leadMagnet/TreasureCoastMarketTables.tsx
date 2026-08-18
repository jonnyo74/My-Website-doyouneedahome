import Link from 'next/link'
import treasureCoastMarket from '@/content/treasure-coast-market.json'
import { TREASURE_COAST_DATA_MONTH } from '@/lib/leadMagnets'

/**
 * The crawlable half of the Treasure Coast report: both counties, both property
 * types, every figure. Reads the same JSON the PDF generator reads, so the page
 * and the download cannot disagree.
 */
export default function TreasureCoastMarketTables() {
  return (
    <>
      <section className="px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-report-gold-text">
            {TREASURE_COAST_DATA_MONTH} data
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-slate-900">
            Both Counties, Side by Side
          </h2>
          <p className="mt-4 max-w-3xl leading-8 text-slate-600">
            A balanced market is roughly 5.5 months of supply. Below that, conditions favor
            sellers; above it, buyers. That one number is the fastest read on any of the four
            segments here.
          </p>

          <div className="mt-10 space-y-12">
            {treasureCoastMarket.counties.map((county) => (
              <div key={county.key}>
                <h3 className="font-serif text-2xl font-semibold text-slate-900">{county.name}</h3>
                <p className="mt-1 text-sm text-slate-500">Includes {county.cities.join(', ')}.</p>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  {county.propertyTypes.map((type) => (
                    <div
                      key={type.key}
                      className="overflow-hidden rounded-2xl border border-slate-200 shadow-card"
                    >
                      <table className="w-full border-collapse text-left text-sm">
                        <caption className="sr-only">
                          {county.name} {type.label}, {TREASURE_COAST_DATA_MONTH} market data with
                          year-over-year change
                        </caption>
                        <thead>
                          <tr className="bg-navy-950 text-white">
                            <th scope="col" className="px-4 py-3 font-semibold">
                              {type.label}
                            </th>
                            <th scope="col" className="px-4 py-3 text-right font-semibold">
                              {TREASURE_COAST_DATA_MONTH}
                            </th>
                            <th scope="col" className="px-4 py-3 text-right font-semibold">
                              vs. 2025
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {type.metrics.map((metric, i) => (
                            <tr key={metric.key} className={i % 2 ? 'bg-slate-50' : 'bg-white'}>
                              <th
                                scope="row"
                                className="px-4 py-3 font-medium text-slate-700"
                              >
                                {metric.label}
                              </th>
                              <td className="px-4 py-3 text-right font-semibold text-slate-900">
                                {metric.value}
                              </td>
                              <td
                                className={`px-4 py-3 text-right font-semibold ${
                                  metric.yearOverYear?.startsWith('-')
                                    ? 'text-slate-500'
                                    : 'text-report-gold-text'
                                }`}
                              >
                                {metric.yearOverYear}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs leading-6 text-slate-500">
            Source: {treasureCoastMarket.source}. Year-over-year percentages are calculated from
            the published {TREASURE_COAST_DATA_MONTH} and July 2025 values. Cash share is derived
            from the paid-in-cash and closed-sales counts. Market data describes past closings and
            is not a prediction, or an appraisal of any specific property.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-report-gold-text">
            What the numbers mean
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-slate-900">
            Read the Market, Not Just the Median
          </h2>
          <div className="mt-8 space-y-8">
            {treasureCoastMarket.narrativeSlots
              .filter((slot) => slot.value)
              .map((slot) => (
                <div key={slot.key}>
                  <h3 className="font-serif text-xl font-semibold text-slate-900">{slot.label}</h3>
                  <p className="mt-3 leading-8 text-slate-600">{slot.value}</p>
                </div>
              ))}
          </div>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <p className="text-sm leading-7 text-slate-600">
              Deciding between the Treasure Coast and Palm Beach County in the first place? The{' '}
              <Link
                href="/palm-beach-county-treasure-coast-relocation-guide"
                className="font-semibold text-gold-600 underline underline-offset-4 transition hover:text-gold-700"
              >
                Relocation Decision Guide
              </Link>{' '}
              compares all fourteen areas we serve on price, water access, golf, 55+, HOAs,
              healthcare and commute.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
