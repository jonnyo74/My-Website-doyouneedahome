'use client'

import { useId } from 'react'
import { formatMinutesOfDay } from '@/lib/sunshade/time'
import type { SolarDay } from '@/lib/sunshade/types'

/**
 * Sunrise-to-sunset time control.
 *
 * The track spans the actual daylight window for the chosen date and location
 * rather than a fixed 24 hours, so the whole width of the control is time the
 * user cares about — and so dragging to either end lands exactly on sunrise or
 * sunset instead of somewhere in the dark.
 */

interface TimeSliderProps {
  day: SolarDay
  minutes: number
  onChange: (minutes: number) => void
}

/** Quick jumps, in minutes after midnight. Clamped into the daylight window. */
const PRESETS = [
  { label: '8 AM', minutes: 8 * 60 },
  { label: '10 AM', minutes: 10 * 60 },
  { label: 'Noon', minutes: 12 * 60 },
  { label: '2 PM', minutes: 14 * 60 },
  { label: '4 PM', minutes: 16 * 60 },
]

export default function TimeSlider({ day, minutes, onChange }: TimeSliderProps) {
  const sliderId = useId()
  const min = Math.round(day.sunriseMinutes ?? 6 * 60)
  const max = Math.round(day.sunsetMinutes ?? 20 * 60)
  const clamped = Math.min(max, Math.max(min, minutes))
  const progress = max > min ? ((clamped - min) / (max - min)) * 100 : 0

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={sliderId} className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Time of day
        </label>
        <output htmlFor={sliderId} className="font-serif text-2xl font-semibold text-navy-900">
          {formatMinutesOfDay(clamped)}
        </output>
      </div>

      <div>
        <input
          id={sliderId}
          type="range"
          min={min}
          max={max}
          step={5}
          value={clamped}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-valuetext={formatMinutesOfDay(clamped)}
          className="sunshade-slider w-full"
          style={{ ['--sunshade-progress' as string]: `${progress}%` }}
        />
        <div className="mt-1 flex justify-between text-[11px] font-medium text-slate-500">
          <span>Sunrise {day.sunriseLabel}</span>
          <span>Sunset {day.sunsetLabel}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((preset) => {
          const target = Math.min(max, Math.max(min, preset.minutes))
          // A preset outside the daylight window would silently land on the
          // same instant as its neighbour — hide it rather than lie.
          if (preset.minutes < min || preset.minutes > max) return null
          const active = Math.abs(clamped - target) < 3
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange(target)}
              aria-pressed={active}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                active
                  ? 'bg-navy-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {preset.label}
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => onChange(max)}
          aria-pressed={Math.abs(clamped - max) < 3}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            Math.abs(clamped - max) < 3
              ? 'bg-navy-900 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Sunset
        </button>
      </div>
    </div>
  )
}
