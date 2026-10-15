import Link from 'next/link'

const METRIC_ORDER = [
  'closedSales',
  'paidInCash',
  'medianPrice',
  'olpReceived',
  'daysToContract',
  'inventory',
  'monthsSupply',
] as const

interface Metric {
  label: string
  current: number
  pct: number
  fmt: string
}

/** The fields this component reads from a scripts/pbc-county-report market file. */
interface CountyMarketData {
  county: string
  dataMonth: string
  priorMonth: string
  source: string
  segments: Array<{
    key: string
    label: string
    metrics: Record<(typeof METRIC_ORDER)[number], Metric>
  }>
  cashShare: Record<string, number>
}

function formatValue(metric: Metric): string {
  switch (metric.fmt) {
    case 'usd':
      return `$${metric.current.toLocaleString('en-US')}`
    case 'pct':
      return `${metric.current.toFixed(1)}%`
    case 'dec1':
      return metric.current.toFixed(1)
    default:
      return metric.current.toLocaleString('en-US')
  }
}

function formatChange(pct: number): string {
  if (pct === 0) return '0.0%'
  return `${pct > 0 ? '+' : '−'}${Math.abs(pct).toFixed(1)}%`
}

/**
 * The crawlable half of a county market report: both property types, every
 * figure, read from the same data file the PDF is built from
 * (scripts/pbc-county-report/data/*-market-*.json), so the page and the
 * download cannot disagree. County totals only — no city-level statistics.
 */
export default function CountyMarketTables({
  data,
  localLine,
}: {
  data: CountyMarketData
  /** The PDF's own sentence naming the local markets the county figure blends. */
  localLine: string
}) {
  const cashShare = data.cashShare

  return (
    <section className="px-6 py-16 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-report-gold-text">
          {data.dataMonth} data
        </p>
        <h2 className="mt-2 font-serif text-3xl font-semibold text-slate-900">
          {data.county}, {data.dataMonth} vs. {data.priorMonth}
        </h2>
        <p className="mt-4 max-w-3xl leading-8 text-slate-600">
          Every figure below is as reported for {data.county}. Percent change is year over year.
          {' '}{localLine}
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {data.segments.map((segment) => (
            <div
              key={segment.key}
              className="overflow-hidden rounded-2xl border border-slate-200 shadow-card"
            >
              <table className="w-full border-collapse text-left text-sm">
                <caption className="sr-only">
                  {data.county} {segment.label}, {data.dataMonth} market data with year-over-year
                  change
                </caption>
                <thead>
                  <tr className="bg-navy-950 text-white">
                    <th scope="col" className="px-4 py-3 font-semibold">
                      {segment.label}
                    </th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">
                      {data.dataMonth}
                    </th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">
                      YoY
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {METRIC_ORDER.map((key, i) => {
                    const metric = segment.metrics[key]
                    return (
                      <tr key={key} className={i % 2 ? 'bg-slate-50' : 'bg-white'}>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-700">
                          {metric.label}
                        </th>
                        <td className="px-4 py-3 text-right font-semibold text-slate-900">
                          {formatValue(metric)}
                        </td>
                        <td
                          className={`px-4 py-3 text-right font-semibold ${
                            metric.pct < 0 ? 'text-slate-500' : 'text-report-gold-text'
                          }`}
                        >
                          {formatChange(metric.pct)}
                        </td>
                      </tr>
                    )
                  })}
                  <tr className="bg-slate-50">
                    <th scope="row" className="px-4 py-3 font-medium text-slate-700">
                      Cash share (calculated)
                    </th>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900">
                      {cashShare[segment.key].toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-right text-slate-400">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs leading-6 text-slate-500">
          Source: {data.source.replace(/^Source:\s*/, '')} Cash share is calculated by DO Homes
          Group from the paid-in-cash and closed-sales counts. These figures describe past closings.
          They are not a prediction, an appraisal, or investment advice, and a county median does
          not reflect the value of any specific property.
        </p>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <p className="text-sm leading-7 text-slate-600">
            Still deciding between the Treasure Coast and Palm Beach County? The{' '}
            <Link
              href="/palm-beach-county-treasure-coast-relocation-guide"
              className="font-semibold text-gold-600 underline underline-offset-4 transition hover:text-gold-700"
            >
              Relocation Decision Guide
            </Link>{' '}
            compares the areas we serve on price, water access, golf, 55+, HOAs, healthcare and
            commute.
          </p>
        </div>
      </div>
    </section>
  )
}
