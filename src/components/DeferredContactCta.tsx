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
const PAST_ATTR = 'data-cta-defer-past'

// `hide` removes the card for the whole visit to the page (posts that carry Discover The
// Palm Beaches photos must not sit beside a lead-capture offer).
//
// `untilPast` names an element (by id): the card, and the vendor's mobile
// call/text bar, stay hidden at every width until that element has scrolled
// up past the sticky header, and hide again if the reader scrolls back to it.
// Used on pages whose hero carries jump links the card would otherwise cover.
export default function DeferredContactCta({ hide = false, untilPast }: { hide?: boolean; untilPast?: string }) {
  useEffect(() => {
    const root = document.documentElement
    if (hide) {
      root.setAttribute(HIDE_ATTR, '')
      return () => root.removeAttribute(HIDE_ATTR)
    }
    if (untilPast) {
      const target = document.getElementById(untilPast)
      if (!target) return
      // Passed = the element's bottom edge has gone up behind the sticky site
      // header (73px tall). Measured on every scroll frame rather than with an
      // IntersectionObserver, which misses a jump from below the fold to above
      // the header (a phone tapping a jump link, or returning to the top).
      const HEADER = 80
      let frame = 0
      const update = () => {
        frame = 0
        if (target.getBoundingClientRect().bottom <= HEADER) root.removeAttribute(PAST_ATTR)
        else root.setAttribute(PAST_ATTR, '')
      }
      const onPastScroll = () => {
        if (!frame) frame = requestAnimationFrame(update)
      }
      update()
      window.addEventListener('scroll', onPastScroll, { passive: true })
      window.addEventListener('resize', onPastScroll, { passive: true })
      return () => {
        window.removeEventListener('scroll', onPastScroll)
        window.removeEventListener('resize', onPastScroll)
        if (frame) cancelAnimationFrame(frame)
        root.removeAttribute(PAST_ATTR)
      }
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
  }, [hide, untilPast])

  return null
}
