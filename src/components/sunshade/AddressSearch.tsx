'use client'

import { useId, useState } from 'react'

interface AddressSearchProps {
  initialQuery: string
  busy: boolean
  onSearch: (query: string) => void
}

export default function AddressSearch({ initialQuery, busy, onSearch }: AddressSearchProps) {
  const inputId = useId()
  const [value, setValue] = useState(initialQuery)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const query = value.trim()
        if (query.length >= 4) onSearch(query)
      }}
      className="space-y-2"
    >
      <label htmlFor={inputId} className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        Property address
      </label>
      <div className="flex gap-2">
        <input
          id={inputId}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="123 Ocean Way, Jupiter, FL"
          autoComplete="street-address"
          enterKeyHint="search"
          className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-navy-900 placeholder:text-slate-400 focus:border-gold-500"
        />
        <button
          type="submit"
          disabled={busy || value.trim().length < 4}
          className="shrink-0 rounded-xl bg-gold-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? 'Searching…' : 'Search'}
        </button>
      </div>
    </form>
  )
}
