'use client'

import { useEffect } from 'react'

/**
 * Holds back the Follow Up Boss contact card on article pages until the reader
 * has scrolled past the opening copy.
 *
 * The FUB pixel (widgetbe.com/agent) injects a fixed 310x186 iframe named
 * `widgetCta` at the bottom-right, which on desktop sits over the first
 * paragraphs of an article. The pixel itself still loads and tracks from the
 * first paint — this only toggles a data attribute that globals.css uses to
 * hide the card (desktop widths only) until SCROLL_DEPTH is reached. Mobile
 * shows the vendor's slim call/text bar instead, so it is left alone.
 */
const SCROLL_DEPTH = 600
const ATTR = 'data-cta-defer'
const HIDE_ATTR = 'data-cta-hide'

// `hide` removes the card for the whole visit to the page (posts that carry Discover The
// Palm Beaches photos must not sit beside a lead-capture offer).
export default function DeferredContactCta({ hide = false }: { hide?: boolean }) {
  useEffect(() => {
    const root = document.documentElement
    if (hide) {
      root.setAttribute(HIDE_ATTR, '')
      return () => root.removeAttribute(HIDE_ATTR)
    }
    const release = () => {
      root.removeAttribute(ATTR)
      window.removeEventListener('scroll', onScroll)
    }
    const onScroll = () => {
      if (window.scrollY >= SCROLL_DEPTH) release()
    }

    if (window.scrollY < SCROLL_DEPTH) {
      root.setAttribute(ATTR, '')
      window.addEventListener('scroll', onScroll, { passive: true })
    }
    return release
  }, [hide])

  return null
}
