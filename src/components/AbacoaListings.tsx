'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

// Wraps the Ylopo results widget so the page has a loading state and a useful
// fallback. The widget div is rendered by the server (YlopoResultsWidget) and
// passed in as children; Ylopo fills it asynchronously after the script loads.
// It must stay mounted and full-width the whole time — hide with opacity only.

const GIVE_UP_MS = 12_000

export default function AbacoaListings({
  children,
  searchUrl,
}: {
  children: React.ReactNode
  searchUrl: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'empty'>('loading')

  useEffect(() => {
    const wrap = wrapRef.current
    const el = wrap?.querySelector('.YLOPO_resultsWidget') as HTMLElement | null
    if (!el) return
    if (el.childElementCount > 0) {
      setState('ready')
      return
    }
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
  }, [])

  return (
    <div>
      <div
        ref={wrapRef}
        className={state === 'loading' ? 'relative min-h-[420px]' : state === 'empty' ? 'hidden' : ''}
      >
        <div className={state === 'ready' ? '' : 'opacity-0'}>{children}</div>
        {state === 'loading' && (
          <div className="absolute inset-0" role="status" aria-live="polite">
            <span className="sr-only">Loading Abacoa listings</span>
            <div className="grid animate-pulse gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div className="h-44 bg-slate-100" />
                  <div className="space-y-3 p-5">
                    <div className="h-5 w-1/2 rounded bg-slate-200" />
                    <div className="h-4 w-3/4 rounded bg-slate-100" />
                    <div className="h-4 w-1/3 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {state === 'empty' && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <h3 className="font-serif text-xl font-semibold text-slate-900">
            The live feed didn&apos;t load here
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-600">
            This can happen with a content blocker or a slow connection. The full Abacoa search
            still works, or we can send you matching homes directly.
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold-600"
            >
              Open the Abacoa search →
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
            >
              Have an agent send matches
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
