'use client'

import { useEffect } from 'react'

interface Props {
  city: string
  neighborhood?: string
  minPrice?: number
  propertyTypes?: string[]
  limit?: number
}

export default function YlopoResultsWidget({ city, neighborhood, minPrice = 600000, propertyTypes, limit = 6 }: Props) {
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

  const search: Record<string, unknown> = { locations: [location], limit, minPrice }
  if (propertyTypes?.length) search.propertyTypes = propertyTypes

  return (
    <div
      className="YLOPO_resultsWidget overflow-hidden rounded-2xl"
      data-search={JSON.stringify(search)}
    />
  )
}
