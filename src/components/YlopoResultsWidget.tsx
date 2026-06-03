'use client'

import { useEffect } from 'react'

interface Props {
  city: string
  neighborhood?: string
}

export default function YlopoResultsWidget({ city, neighborhood }: Props) {
  const location = neighborhood
    ? { neighborhood, city, state: 'FL' }
    : { city, state: 'FL' }

  useEffect(() => {
    ;(window as any).YLOPO_WIDGETS = { domain: 'search.doyouneedahome.com' }

    document.querySelectorAll('script[src*="widgets-1.0.0"]').forEach(s => s.remove())

    const script = document.createElement('script')
    script.id = 'ylopo-widget-script'
    script.src = '//search.doyouneedahome.com/build/js/widgets-1.0.0.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.querySelectorAll('script[src*="widgets-1.0.0"]').forEach(s => s.remove())
    }
  }, [city, neighborhood])

  return (
    <div
      className="YLOPO_resultsWidget overflow-hidden rounded-2xl"
      data-search={JSON.stringify({ locations: [location], limit: 6, minPrice: 600000 })}
    />
  )
}
