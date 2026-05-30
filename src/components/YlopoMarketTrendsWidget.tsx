'use client'
import { useEffect } from 'react'

export default function YlopoMarketTrendsWidget({ city }: { city: string }) {
  useEffect(() => {
    document.querySelectorAll('script[src*="widgets-1.0.0"]').forEach(s => s.remove())
    const script = document.createElement('script')
    script.src = '//search.doyouneedahome.com/build/js/widgets-1.0.0.js'
    script.async = true
    document.body.appendChild(script)
    return () => { script.remove() }
  }, [city])

  return (
    <div
      className="YLOPO_marketTrendsWidget"
      data-searchlocation={JSON.stringify({ simpleSearchCity: city, simpleSearchState: 'FL' })}
    />
  )
}
