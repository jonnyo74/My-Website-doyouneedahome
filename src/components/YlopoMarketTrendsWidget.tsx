'use client'

import { useEffect, useRef, useState } from 'react'

// Script loading is handled by YlopoInit on the parent page — do not reload here.
//
// Ylopo fills this div asynchronously: the script loads, then calls
// portal.ylopo.com for the city's trends. On a fast connection the div sits
// empty for roughly two seconds, and it stays empty forever when that call
// fails or a content blocker drops it. Either way the page rendered a heading
// over an empty bordered box — the same thing marketTrendsCity() already
// exists to prevent for cities with no coverage.
//
// So the div reserves its space with a skeleton until content lands, and
// reports 'empty' once it has waited long enough for the caller to drop the
// whole section.
//
// The div itself must stay mounted and full-width the entire time. The widget
// measures its container to size the chart SVG, so a display:none ancestor
// makes it compute a negative width and render broken (`viewBox="0 0 -60 200"`).
// Hide it with opacity, never with display or conditional rendering.

const GIVE_UP_MS = 12_000

export type TrendsState = 'loading' | 'ready' | 'empty'

/** Watches a Ylopo widget container and reports whether the script filled it. */
export function useYlopoWidgetContent(city: string) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<TrendsState>('loading')

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (el.childElementCount > 0) {
      setState('ready')
      return
    }

    setState('loading')

    // Held in an object so the observer can clear a timer declared after it.
    const timer: { id?: ReturnType<typeof setTimeout> } = {}

    const observer = new MutationObserver(() => {
      if (el.childElementCount > 0) {
        observer.disconnect()
        clearTimeout(timer.id)
        setState('ready')
      }
    })
    observer.observe(el, { childList: true })

    timer.id = setTimeout(() => {
      observer.disconnect()
      setState(el.childElementCount > 0 ? 'ready' : 'empty')
    }, GIVE_UP_MS)

    return () => {
      observer.disconnect()
      clearTimeout(timer.id)
    }
  }, [city])

  return { ref, state }
}

/** Placeholder shaped roughly like the real widget, to hold the space. */
export function TrendsSkeleton() {
  return (
    <div className="animate-pulse p-6" aria-hidden="true">
      <div className="h-5 w-56 rounded bg-slate-200" />
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="h-20 rounded-lg bg-slate-100" />
        ))}
      </div>
      <div className="mt-6 h-48 rounded-lg bg-slate-100" />
    </div>
  )
}

export default function YlopoMarketTrendsWidget({ city }: { city: string }) {
  const { ref, state } = useYlopoWidgetContent(city)

  if (state === 'empty') return null

  return (
    <div className={`relative ${state === 'loading' ? 'min-h-[420px]' : ''}`}>
      <div
        ref={ref}
        className={`YLOPO_marketTrendsWidget ${state === 'loading' ? 'opacity-0' : ''}`}
        data-searchlocation={JSON.stringify({ simpleSearchCity: city, simpleSearchState: 'FL' })}
      />
      {state === 'loading' && (
        <div className="absolute inset-0">
          <TrendsSkeleton />
        </div>
      )}
    </div>
  )
}
