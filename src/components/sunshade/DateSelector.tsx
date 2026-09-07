'use client'

import { useId } from 'react'
import { seasonalDates, toDateInputValue, fromDateInputValue, todayInZone } from '@/lib/sunshade/time'
import { FLORIDA_TIMEZONE } from '@/lib/sunshade/config'

/**
 * Date control, with the four dates a buyer actually wants to compare.
 *
 * The solstices are the useful pair: in Florida the summer sun clears 85° at
 * noon and shadows collapse to almost nothing, while in December it tops out
 * near 40° and the same house throws a shadow more than twice its own height.
 * A screened patio that bakes in June can sit in shade all winter, and this is
 * the control that shows it.
 */

interface DateSelectorProps {
  date: { year: number; month: number; day: number }
  onChange: (date: { year: number; month: number; day: number }) => void
}

export default function DateSelector({ date, onChange }: DateSelectorProps) {
  const inputId = useId()
  const today = todayInZone(FLORIDA_TIMEZONE)
  const presets = seasonalDates(date.year)
  const currentValue = toDateInputValue(date)
  const isToday = currentValue === toDateInputValue(today)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={inputId} className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Date
        </label>
        <input
          id={inputId}
          type="date"
          value={currentValue}
          onChange={(e) => {
            const parsed = fromDateInputValue(e.target.value)
            if (parsed) onChange(parsed)
          }}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-navy-900"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => onChange(today)}
          aria-pressed={isToday}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            isToday ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Today
        </button>
        {presets.map((preset) => {
          const active = toDateInputValue(preset.date) === currentValue
          return (
            <button
              key={preset.key}
              type="button"
              onClick={() => onChange(preset.date)}
              aria-pressed={active}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                active ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {preset.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
