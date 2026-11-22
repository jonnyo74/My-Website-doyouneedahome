interface SupplyMetric {
  current: number
  prior: number
}

/** The fields this chart reads from a scripts/pbc-county-report market file. */
interface CountySupplyData {
  county: string
  dataMonth: string
  priorMonth: string
  source: string
  segments: Array<{
    key: string
    label: string
    metrics: { monthsSupply: SupplyMetric }
  }>
}

/**
 * Months of supply, this year against last, for both property types.
 *
 * Sits in the landing-page hero ahead of the download form so the figures can
 * be read and cited without submitting anything. Every number comes from the
 * same data file the PDF and the tables further down are built from; nothing
 * is typed in here.
 *
 * Months of supply is the measure charted because it is the one all three
 * county pages already lead with for both property types. Condo/townhome
 * medians are left to the table: in Martin and St. Lucie they rest on fewer
 * than a hundred closings and the page says so in words, which a bar cannot.
 *
 * Plain HTML bars rather than an image, so the values are real text. Each bar
 * carries its value as a visible label, so the two colours are never the only
 * thing telling the years apart.
 */
export default function CountySupplyChart({
  data,
  tableHref = '#county-data',
}: {
  data: CountySupplyData
  tableHref?: string
}) {
  const max = Math.max(
    ...data.segments.flatMap((s) => [s.metrics.monthsSupply.current, s.metrics.monthsSupply.prior])
  )
  const width = (value: number) => `${Math.max((value / max) * 100, 2)}%`
  const headingId = 'county-supply-chart'

  return (
    <figure
      aria-labelledby={headingId}
      className="mt-9 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6"
    >
      <figcaption>
        <p id={headingId} className="font-serif text-xl font-semibold text-white">
          Months of supply, {data.dataMonth} vs. {data.priorMonth}
        </p>
        <p className="mt-1 text-xs leading-5 text-white/70">
          {data.county}. How long the active listings would last at the current pace of sales.
        </p>
      </figcaption>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-white/80">
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-report-gold" />
          {data.dataMonth}
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-slate-400" />
          {data.priorMonth}
        </li>
      </ul>

      <dl className="mt-5 space-y-5">
        {data.segments.map((segment) => {
          const { current, prior } = segment.metrics.monthsSupply
          return (
            <div key={segment.key}>
              <dt className="text-sm font-semibold text-white">{segment.label}</dt>
              <dd className="mt-2 space-y-0.5">
                {[
                  { label: data.dataMonth, value: current, bar: 'bg-report-gold' },
                  { label: data.priorMonth, value: prior, bar: 'bg-slate-400' },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center gap-2"
                    title={`${segment.label}, ${row.label}: ${row.value.toFixed(1)} months of supply`}
                  >
                    <div className="min-w-0 flex-1">
                      <div
                        aria-hidden="true"
                        className={`h-4 rounded-r ${row.bar}`}
                        style={{ width: width(row.value) }}
                      />
                    </div>
                    <p className="w-28 flex-shrink-0 text-right text-sm text-white">
                      <span className="font-semibold">{row.value.toFixed(1)}</span>{' '}
                      <span className="text-xs text-white/70">months</span>
                      <span className="sr-only">, {row.label}</span>
                    </p>
                  </div>
                ))}
              </dd>
            </div>
          )
        })}
      </dl>

      <p className="mt-5 text-xs leading-5 text-white/60">
        {data.source.replace(/\.$/, '')}. These figures may be quoted with attribution.{' '}
        <a href={tableHref} className="text-white underline underline-offset-4 hover:text-report-gold">
          See every figure in the full table
        </a>
        , no form needed.
      </p>
    </figure>
  )
}
