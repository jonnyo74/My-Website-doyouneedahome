import Link from 'next/link'
import { LAUNCH_DISCLAIMER, formatLastVerified, launches } from '@/lib/paddle/launches'
import { KIND_LABEL } from '@/lib/paddle/labels'
import { SITE_URL } from '@/lib/site'
import LaunchSources from './LaunchSources'
import PrintButton from './PrintButton'

const th = 'border border-slate-300 bg-slate-100 px-2 py-1.5 text-left font-semibold text-navy-950'
const td = 'border border-slate-300 px-2 py-1.5 align-top text-slate-700'

/**
 * The launch chart as one plain table, built for paper.
 *
 * No form, no map, no script beyond the print button: the whole point is that
 * anyone can print it, save it as a PDF or link to it without handing over an
 * email address. `data-print-view` is the hook globals.css uses to drop the
 * site header, footer and overlays when the page is printed.
 */
export default function LaunchPrintChart() {
  // The column only appears once at least one launch has a recorded check.
  const showVerified = launches.some((site) => site.lastVerified)

  return (
    <div data-print-view className="mx-auto max-w-7xl px-6 py-10 sm:px-8 print:max-w-none print:p-0">
      <style>{'@page { size: landscape; margin: 12mm; }'}</style>

      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          href="/kayak-launches-jupiter-tequesta"
          className="text-sm font-semibold text-gold-600 underline underline-offset-4 hover:text-gold-700"
        >
          ← Back to the launch map
        </Link>
        <PrintButton />
      </div>

      <h1 className="mt-6 font-serif text-3xl font-semibold text-navy-950 print:mt-0 print:text-2xl">
        Public Kayak Launches in Jupiter &amp; Tequesta
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Loxahatchee River, Jupiter Inlet and the Intracoastal. Compiled by DO Homes Group.{' '}
        {SITE_URL.replace('https://', '')}/kayak-launches-jupiter-tequesta
      </p>

      <div className="mt-6 overflow-x-auto print:overflow-visible">
        <table className="w-full border-collapse text-xs leading-snug">
          <caption className="sr-only">
            Public paddlecraft launches in Jupiter and Tequesta, Florida, with managing agency,
            launch type, parking, hours and cost
          </caption>
          <thead>
            <tr>
              <th scope="col" className={th}>#</th>
              <th scope="col" className={th}>Launch</th>
              <th scope="col" className={th}>Managed by</th>
              <th scope="col" className={th}>Type</th>
              <th scope="col" className={th}>Water</th>
              <th scope="col" className={th}>Parking</th>
              <th scope="col" className={th}>Hours</th>
              <th scope="col" className={th}>Cost</th>
              {showVerified && <th scope="col" className={th}>Last verified</th>}
            </tr>
          </thead>
          <tbody>
            {launches.map((site) => (
              <tr key={site.id} className="break-inside-avoid">
                <td className={td}>{site.n}</td>
                <th scope="row" className={`${td} text-left font-normal`}>
                  <span className="font-semibold text-navy-950">{site.name}</span>
                  <br />
                  {site.address}
                </th>
                <td className={td}>{site.operator}</td>
                <td className={td}>
                  {KIND_LABEL[site.kind]}
                  <br />
                  {site.launch}
                </td>
                <td className={td}>{site.water}</td>
                <td className={td}>{site.parking}</td>
                <td className={td}>{site.hours}</td>
                <td className={td}>{site.free ? 'Free' : 'Fee'}</td>
                {showVerified && (
                  <td className={td}>
                    {site.lastVerified ? formatLastVerified(site.lastVerified) : ''}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-600">{LAUNCH_DISCLAIMER}</p>

      <div className="mt-10 break-before-page">
        <LaunchSources />
      </div>
    </div>
  )
}
