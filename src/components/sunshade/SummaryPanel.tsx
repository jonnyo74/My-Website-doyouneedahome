import SunCompass from './SunCompass'
import { formatLongDate, formatMinutesOfDay } from '@/lib/sunshade/time'
import type {
  ExposureEstimate,
  ExposureSummary,
  HeightEstimate,
  ParcelInfo,
  SolarDay,
  SolarPosition,
} from '@/lib/sunshade/types'

interface SummaryPanelProps {
  address: string
  date: { year: number; month: number; day: number }
  minutes: number
  sun: SolarPosition
  day: SolarDay
  exposure: ExposureSummary | null
  subjectHeight: HeightEstimate | null
  parcel: ParcelInfo | null
  /** County records can take the better part of a minute to arrive, so the
   *  panel says it is still looking rather than showing "no record". */
  parcelPending: boolean
  /** Set when the county lookup failed outright. */
  parcelNote: string | null
  buildingCount: number
}

const RATING_STYLES: Record<ExposureEstimate['rating'], string> = {
  High: 'bg-report-gold/20 text-report-gold-badge',
  Moderate: 'bg-gold-100 text-gold-700',
  Low: 'bg-slate-200 text-slate-700',
}

function ExposureRow({
  label,
  detail,
  estimate,
}: {
  label: string
  detail?: string
  estimate: ExposureEstimate | undefined
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-t border-slate-100 py-2.5 first:border-t-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-navy-900">{label}</p>
        {(estimate?.note ?? detail) && (
          <p className="mt-0.5 text-xs leading-snug text-slate-500">{estimate?.note ?? detail}</p>
        )}
      </div>
      {estimate ? (
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${RATING_STYLES[estimate.rating]}`}
        >
          {estimate.rating}
        </span>
      ) : (
        <span className="shrink-0 text-xs text-slate-400">—</span>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold text-navy-900">{value}</dd>
    </div>
  )
}

export default function SummaryPanel({
  address,
  date,
  minutes,
  sun,
  day,
  exposure,
  subjectHeight,
  parcel,
  parcelPending,
  parcelNote,
  buildingCount,
}: SummaryPanelProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-xl font-semibold leading-snug text-navy-950">{address}</h2>
        <p className="mt-1 text-sm text-slate-600">
          {formatLongDate(date)} · {formatMinutesOfDay(minutes)}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <SunCompass sun={sun} />
      </div>

      <dl className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <Stat label="Sunrise" value={day.sunriseLabel} />
        <Stat label="Solar noon" value={day.solarNoonLabel} />
        <Stat label="Sunset" value={day.sunsetLabel} />
      </dl>

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="mb-1 text-sm font-semibold text-navy-950">Estimated sun exposure</h3>
        <p className="mb-2 text-xs leading-snug text-slate-500">
          Modelled from mapped buildings on and around the lot for{' '}
          {formatLongDate(date).replace(/^\w+, /, '')}. Trees are not included.
        </p>
        <ExposureRow
          label="Morning sun"
          detail="Sunrise to solar noon, across open ground on the lot."
          estimate={exposure?.morning}
        />
        <ExposureRow
          label="Afternoon sun"
          detail="Solar noon to sunset, across open ground on the lot."
          estimate={exposure?.afternoon}
        />
        <ExposureRow
          label={exposure?.yardFromMappedPool ? 'Pool sun' : 'Backyard / pool sun'}
          detail={
            exposure?.yardFromMappedPool
              ? 'Sampled at the mapped pool, full day.'
              : 'Full day, across open ground on the lot.'
          }
          estimate={exposure?.yard}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-navy-950">What this model used</h3>
        <ul className="space-y-1.5 text-xs leading-relaxed text-slate-600">
          <li>
            <span className="font-semibold text-navy-900">Building height:</span>{' '}
            {subjectHeight
              ? `${Math.round(subjectHeight.heightM * 3.28084)} ft — ${subjectHeight.label}`
              : 'No building footprint matched this address.'}
          </li>
          <li>
            <span className="font-semibold text-navy-900">Footprints:</span> {buildingCount} mapped
            {buildingCount === 1 ? ' building' : ' buildings'} nearby (OpenStreetMap)
          </li>
          <li>
            <span className="font-semibold text-navy-900">County records:</span>{' '}
            {parcel?.livingAreaSqFt
              ? `${parcel.livingAreaSqFt.toLocaleString()} sq ft living area${
                  parcel.yearBuilt ? `, built ${parcel.yearBuilt}` : ''
                }`
              : parcelPending
                ? 'Checking county records…'
                : (parcelNote ?? 'No living-area record for this parcel')}
          </li>
        </ul>
      </section>
    </div>
  )
}
