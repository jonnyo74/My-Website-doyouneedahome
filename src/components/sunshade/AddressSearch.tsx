'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import type { Suggestion } from '@/lib/sunshade/suggest'

interface AddressSearchProps {
  initialQuery: string
  busy: boolean
  onSearch: (query: string) => void
  /** Called when a suggestion carrying coordinates is picked, so selection can
   *  skip the geocoder and land on the exact parcel. */
  onSelect: (suggestion: Suggestion) => void
}

/**
 * Address box with typeahead.
 *
 * Built to the ARIA 1.2 combobox pattern rather than a div soup, because this
 * site takes keyboard and screen-reader access seriously elsewhere and a
 * home-grown autocomplete is one of the easiest things to get wrong: the input
 * keeps focus throughout, `aria-activedescendant` moves the virtual cursor, the
 * listbox is a real `role="listbox"` of `role="option"`s, and a live region
 * announces how many results arrived. Arrow keys move, Enter selects, Escape
 * closes without clearing.
 *
 * Requests are debounced and every in-flight request is aborted when the next
 * keystroke lands, so a slow response can never overwrite a newer one.
 */

const DEBOUNCE_MS = 220
const MIN_CHARS = 2

const KIND_BADGE: Record<Suggestion['kind'], string> = {
  listing: 'Our listing',
  community: 'Community',
  address: 'Address',
}

export default function AddressSearch({
  initialQuery,
  busy,
  onSearch,
  onSelect,
}: AddressSearchProps) {
  const inputId = useId()
  const listboxId = useId()

  const [value, setValue] = useState(initialQuery)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const rootRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  /** Set while a selection is being applied, so the effect below does not
   *  immediately re-query for the text we just put in the box. */
  const suppressRef = useRef(false)

  useEffect(() => {
    if (suppressRef.current) {
      suppressRef.current = false
      return
    }

    const query = value.trim()
    // Too short to query. We deliberately do NOT clear state here — calling
    // setState synchronously in an effect body triggers a cascading render,
    // and it is unnecessary: `showList` below derives visibility from the
    // current value, so short queries hide the list without touching state.
    if (query.length < MIN_CHARS) return

    const timer = setTimeout(async () => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const res = await fetch(`/api/sunshade/suggest?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        })
        if (!res.ok) return
        const data = (await res.json()) as { suggestions: Suggestion[] }
        setSuggestions(data.suggestions)
        setOpen(data.suggestions.length > 0)
        setActiveIndex(-1)
      } catch {
        // An abort is the normal path on every keystroke, and a genuine network
        // failure here only costs suggestions — the form still submits.
      }
    }, DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [value])

  // Close on an outside click. Focus-out alone is not enough: a pointer press
  // on an option blurs the input before the click resolves.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const choose = useCallback(
    (suggestion: Suggestion) => {
      suppressRef.current = true
      setValue(suggestion.label)
      setOpen(false)
      setActiveIndex(-1)
      onSelect(suggestion)
    },
    [onSelect]
  )

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!open || suggestions.length === 0) return
      event.preventDefault()
      const step = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((current) => {
        const next = current + step
        if (next < 0) return suggestions.length - 1
        if (next >= suggestions.length) return 0
        return next
      })
      return
    }

    if (event.key === 'Enter' && open && activeIndex >= 0) {
      event.preventDefault()
      choose(suggestions[activeIndex])
      return
    }

    if (event.key === 'Escape' && open) {
      event.preventDefault()
      setOpen(false)
      setActiveIndex(-1)
    }
  }

  const activeId = activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined
  const showList = open && value.trim().length >= MIN_CHARS && suggestions.length > 0

  return (
    <div ref={rootRef} className="relative">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setOpen(false)
          const query = value.trim()
          if (query.length >= 4) onSearch(query)
        }}
        className="space-y-2"
      >
        <label
          htmlFor={inputId}
          className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500"
        >
          Property address
        </label>
        <div className="flex gap-2">
          <input
            id={inputId}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={activeId}
            // The browser's own address autofill would cover the listbox, and
            // the two cannot be shown at once.
            autoComplete="off"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) setOpen(true)
            }}
            placeholder="Start typing an address or community"
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

      {/* Announced to screen readers, which get no benefit from a list that
          simply appears below the input. */}
      <p aria-live="polite" className="sr-only">
        {showList
          ? `${suggestions.length} suggestion${suggestions.length === 1 ? '' : 's'} available.`
          : ''}
      </p>

      {showList && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Address suggestions"
          className="absolute left-0 right-0 top-full z-[1000] mt-1 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            // In the ARIA combobox pattern the INPUT owns the keyboard: options are
            // never focusable, and are activated through aria-activedescendant plus
            // the Enter handling wired up in onKeyDown above. A key listener here
            // would sit on an element a keyboard user can never reach.
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <li
              key={suggestion.id}
              id={`${listboxId}-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              // Keeps focus in the input, which is what the combobox pattern
              // requires — and what makes Escape and arrow keys keep working.
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => choose(suggestion)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 ${
                index === activeIndex ? 'bg-gold-50' : ''
              }`}
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-navy-900">
                  {suggestion.label}
                </span>
                <span className="block truncate text-xs text-slate-500">{suggestion.detail}</span>
              </span>
              <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                {KIND_BADGE[suggestion.kind]}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
