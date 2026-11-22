'use client'

import { useEffect } from 'react'

/**
 * Reports the dead URL and where the visitor came from.
 *
 * This has to run in the browser: the 404 page is prerendered, so on the server
 * it has neither the requested path nor a Referer header to read. Renders
 * nothing.
 */
export default function NotFoundLogger() {
  useEffect(() => {
    const payload = JSON.stringify({
      path: window.location.pathname,
      referrer: document.referrer,
    })
    try {
      const blob = new Blob([payload], { type: 'application/json' })
      if (!navigator.sendBeacon?.('/api/not-found-log', blob)) {
        void fetch('/api/not-found-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        })
      }
    } catch {
      // Logging a 404 must never break the 404 page.
    }
  }, [])

  return null
}
