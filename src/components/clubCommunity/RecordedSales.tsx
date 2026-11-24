import ScrollTable from './ScrollTable'
import { td, th } from './ui'

export interface SalesSegment {
  label: string
  count: number
  low?: number
  high?: number
  median?: number
}

export interface SalesRow {
  key: string
  month: string
  address: string
  area: string
  kind: string
  price: string
}

/**
 * Recorded-sales summary and table for a community. Segments with too few
 * sales show their range and no median. When `stale` is set the block is
 * labeled historical instead of current.
 */
export default function RecordedSales({
  community,
  period,
  segments,
  rows,
  stale,
  format,
  minForMedian,
}: {
  community: string
  period: { from: string; to: string }
  segments: SalesSegment[]
  rows: SalesRow[]
  stale: boolean
  format: (n: number) => string
  minForMedian: number
}) {
  return (
    <div>
      {stale && (
        <p className="mb-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-slate-800">
          Historical data. These records cover {period.from} to {period.to} and have not been refreshed since.
          Ask us for current sales.
        </p>
      )}
      <ScrollTable label={`Recorded sales in ${community} by segment`}>
        <table className="w-full min-w-[34rem]">
          <caption className="sr-only">
            Recorded sales in {community} by segment, {period.from} to {period.to}
          </caption>
          <thead className="bg-slate-100">
            <tr>
              <th scope="col" className={th}>Segment</th>
              <th scope="col" className={`${th} text-right`}>Sales</th>
              <th scope="col" className={`${th} text-right`}>Lowest</th>
              <th scope="col" className={`${th} text-right`}>Highest</th>
              <th scope="col" className={`${th} text-right`}>Median</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {segments.map((s) => (
              <tr key={s.label}>
                <th scope="row" className={`${td} text-left font-semibold text-slate-900`}>{s.label}</th>
                <td className={`${td} text-right`}>{s.count}</td>
                <td className={`${td} text-right`}>{s.low != null ? format(s.low) : 'n/a'}</td>
                <td className={`${td} text-right`}>{s.high != null ? format(s.high) : 'n/a'}</td>
                <td className={`${td} text-right`}>
                  {s.median != null ? format(s.median) : s.count ? <span className="text-slate-500">too few</span> : 'n/a'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollTable>
      <p className="mt-3 text-xs leading-6 text-slate-500">
        A median is shown only for a segment with at least {minForMedian} sales. A sale can sit in more than one
        segment.
      </p>

      <ScrollTable label={`Every recorded sale in ${community}`} className="mt-8">
        <table className="w-full min-w-[40rem]">
          <caption className="sr-only">
            Every recorded sale in {community}, {period.from} to {period.to}
          </caption>
          <thead className="bg-slate-100">
            <tr>
              <th scope="col" className={th}>Recorded</th>
              <th scope="col" className={th}>Address</th>
              <th scope="col" className={th}>Area</th>
              <th scope="col" className={th}>Type</th>
              <th scope="col" className={`${th} text-right`}>Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.key}>
                <td className={`${td} whitespace-nowrap`}>{r.month}</td>
                <th scope="row" className={`${td} text-left font-medium text-slate-900`}>{r.address}</th>
                <td className={td}>{r.area}</td>
                <td className={td}>{r.kind}</td>
                <td className={`${td} text-right font-semibold text-slate-900`}>{r.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollTable>
    </div>
  )
}
