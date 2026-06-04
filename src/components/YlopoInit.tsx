'use client'

import { useEffect } from 'react'

const SCRIPT_SRC = 'https://search.doyouneedahome.com/build/js/widgets-1.0.0.js'

/**
 * Loads (or reloads) the Ylopo widget script once per city change so that
 * market-trends and results widget divs rendered by React are picked up.
 *
 * Intentionally no cleanup — removing the script on unmount was causing it to
 * disappear permanently after the first client-side navigation away, because
 * the layout-level Script no longer re-injects it in App Router.
 */
export default function YlopoInit({ city }: { city: string }) {
  useEffect(() => {
    ;(window as any).YLOPO_WIDGETS = { domain: 'search.doyouneedahome.com' }

    // Remove any stale copy so the new one re-runs widget discovery on load.
    document.querySelectorAll(`script[src="${SCRIPT_SRC}"]`).forEach(s => s.remove())

    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    document.body.appendChild(script)
  }, [city])

  return null
}
