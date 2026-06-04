'use client'

import { useEffect } from 'react'

/**
 * Fires once per page mount and reloads the Ylopo widget script so that
 * widgets rendered by React (market trends, results) are picked up after
 * client-side navigation — when the layout script has already run and the
 * widget divs didn't yet exist.
 *
 * Place this once on the blog article page. Individual widget components
 * should NOT reload the script themselves.
 */
export default function YlopoInit({ city }: { city: string }) {
  useEffect(() => {
    ;(window as any).YLOPO_WIDGETS = { domain: 'search.doyouneedahome.com' }
    document.querySelectorAll('script[src*="widgets-1.0.0"]').forEach(s => s.remove())
    const script = document.createElement('script')
    script.src = '//search.doyouneedahome.com/build/js/widgets-1.0.0.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.querySelectorAll('script[src*="widgets-1.0.0"]').forEach(s => s.remove())
    }
  }, [city])

  return null
}
