'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

/**
 * Counts taps on phone and email links sitewide with one delegated listener, so
 * individual links need no changes. Calls and emails never reach the
 * lead-magnet or form events, so without this they are invisible in GA4.
 * Never sends the number or address itself — only the method and where on the
 * page the link sat.
 */
export default function ContactClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href^="tel:"], a[href^="mailto:"], a[href^="sms:"]')
      if (!link) return
      const href = link.getAttribute('href') ?? ''
      const method = href.startsWith('tel:') ? 'phone' : href.startsWith('sms:') ? 'text' : 'email'
      const region = link.closest('header')
        ? 'header'
        : link.closest('footer')
          ? 'footer'
          : link.closest('aside')
            ? 'sidebar'
            : 'content'
      trackEvent('contact_click', {
        method,
        link_location: region,
        page_url: window.location.pathname,
      })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
