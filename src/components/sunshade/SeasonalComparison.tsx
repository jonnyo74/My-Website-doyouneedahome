'use client'

import { useMemo, useState } from 'react'
import { computeSeasons, formatDaylight, seasonFraction, seasonalSwing } from '@/lib/sunshade/seasons'
import type { SeasonSnapshot } from '@/lib/sunshade/seasons'
import type {
  BuildingFootprint,
  HeightEstimate,
  LngLat,
  PoolFootprint,
} from '@/lib/sunshade/types'

interface SeasonalComparisonProps {
  centre: { lat: number; lng: number }
  year: number
  timeZone: string
  buildings: BuildingFootprint[]
  pools: PoolFootprint[]
  heights: Map<string, HeightEstimate>
  parcelRing: LngLat[] | null
  /** Moves the map to a season. */
  onPickDate: (date: { year: number; month: number; day: number }) => void
  /** Currently selected date, so the matching row reads as active. */
  activeDate: { year: number; month: number; day: number }
}

/** Same thresholds the exposure ratings use. */
function barClass(fraction: number): string {
  if (fraction >= 0.7) return 'bg-report-gold'
  if (fraction >= 0.4) return 'bg-gold-400'
  return 'bg-slate-300'
}

function SeasonRow({
  season,
  isActive,
  onPick,
}: {
  season: SeasonSnapshot
  isActive: boolean
  onPick: () => void
}) {
  const scored = seasonFraction(season)
  if (!scored) return null
  const pct = Math.round(scored.fraction * 100)
  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={isActive}
      className={`w-full rounded-xl px-3 py-2.5 text-left transition ${
        isActive ? 'bg-white ring-1 ring-slate-200' : 'hover:bg-white/70'
      }`}
    >
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-slate-900">{season.label}</span>
        <span className="shrink-0 text-xs tabular-nums text-slate-500">
          {Math.round(season.noonElevation)}° sun · {formatDaylight(season.day.daylightMinutes)}
        </span>
      </span>

      <span className="mt-1.5 flex items-center gap-2.5">
        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
          <span
            className={`block h-full rounded-full ${barClass(scored.fraction)}`}
            style={{ width: `${Math.max(2, pct)}%` }}
          />
        </span>
        <span className="w-14 shrink-0 text-right text-xs font-semibold tabular-nums text-slate-700">
          {pct}% <span className="font-normal text-slate-500">sun</span>
        </span>
      </span>
    </button>
  )
}

/**
 * The property at the four turning points of the year.
 *
 * Computed only when the section is opened. Each season runs the whole day
 * sampler, so doing all four up front would add about a second to every
 * property load for a section most visitors never expand.
 */
export default function SeasonalComparison({
  centre,
  year,
  timeZone,
  buildings,
  pools,
  heights,
  parcelRing,
  onPickDate,
  activeDate,
}: SeasonalComparisonProps) {
  const [open, setOpen] = useState(false)

  const seasons = useMemo(() => {
    if (!open) return null
    return computeSeasons({ centre, year, timeZone, buildings, pools, heights, parcelRing })
  }, [open, centre, year, timeZone, buildings, pools, heights, parcelRing])

  const swing = seasons ? seasonalSwing(seasons) : null
  const usable = seasons?.some((s) => seasonFraction(s) !== null)
  // Says what the number measures, since it silently changes when the county
  // parcel has not arrived.
  const basis = seasons?.map(seasonFraction).find(Boolean)?.basis ?? 'yard'

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span>
          <span className="block font-serif text-lg font-semibold text-slate-900">
            Across the year
          </span>
          <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
            How the same outdoor space compares in each season
          </span>
        </span>
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open ? (
        seasons && usable ? (
          <>
            <div className="mt-3 space-y-1">
              {seasons.map((s) => (
                <SeasonRow
                  key={s.key}
                  season={s}
                  isActive={
                    s.date.year === activeDate.year &&
                    s.date.month === activeDate.month &&
                    s.date.day === activeDate.day
                  }
                  onPick={() => onPickDate(s.date)}
                />
              ))}
            </div>

            {swing ? (
              <p className="mt-3 text-xs leading-relaxed text-slate-600">
                {swing.spreadPoints <= 8 ? (
                  <>
                    This space stays close to even all year — about {swing.spreadPoints} points
                    between {swing.best.label.toLowerCase()} and {swing.worst.label.toLowerCase()}.
                  </>
                ) : (
                  <>
                    Sun drops about{' '}
                    <span className="font-semibold text-slate-900">{swing.spreadPoints} points</span>{' '}
                    from {swing.best.label.toLowerCase()} to {swing.worst.label.toLowerCase()} —
                    worth knowing before picturing the patio in winter.
                  </>
                )}
              </p>
            ) : null}

            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              {basis === 'yard'
                ? 'Share of daylight the open ground on the lot is in direct sun.'
                : 'Share of daylight in direct sun, averaged across the day — the county parcel has not arrived, so this is not limited to the yard.'}{' '}
              Tap a season to move the map to it. Building shadows only — trees are not modelled.
            </p>
          </>
        ) : (
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            Not enough footprint or parcel data here to compare the seasons.
          </p>
        )
      ) : null}
    </div>
  )
}
