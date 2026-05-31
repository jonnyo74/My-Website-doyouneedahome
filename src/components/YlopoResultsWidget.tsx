'use client'
import { useEffect, useRef } from 'react'

export default function YlopoResultsWidget({ city }: { city: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ;(window as any).YLOPO_WIDGETS = { domain: 'search.doyouneedahome.com' }

    document.querySelectorAll('#ylopo-widget-script').forEach(s => s.remove())

    const script = document.createElement('script')
    script.id = 'ylopo-widget-script'
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
