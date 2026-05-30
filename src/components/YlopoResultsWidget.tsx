'use client'
import { useEffect, useRef } from 'react'

export default function YlopoResultsWidget({ city }: { city: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Remove stale script so the new one re-initializes the widget
    document.querySelectorAll('script[src*="widgets-1.0.0"]').forEach(s => s.remove())

    const script = document.createElement('script')
    script.src = '//search.doyouneedahome.com/build/js/widgets-1.0.0.js'
    script.async = true
    document.body.appendChild(script)

    return () => { script.remove() }
  }, [city])

  return (
    <div
      ref={ref}
      className="YLOPO_resultsWidget overflow-hidden rounded-2xl"
      data-search={JSON.stringify({ locations: [{ city, state: 'FL' }], limit: 6, minPrice: 600000 })}
    />
  )
}
