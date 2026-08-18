'use client'

import { useEffect } from 'react'

/**
 * Names third-party iframes that arrive without a `title`.
 *
 * The Follow Up Boss pixel (widgetbe.com/agent) appends a visible 310x186
 * fixed-position CTA iframe straight onto <body> with no title attribute, so
 * a screen reader announces it only as "frame" — an unlabelled, focusable
 * region on every page of the site (WCAG 4.1.2, and axe's `frame-title`).
 *
 * We can't change what the vendor injects, but the element lands in our DOM,
 * so we can label it. Only the title attribute is touched; nothing about the
 * widget's behaviour, position, or tracking changes.
 *
 * Cost is one MutationObserver watching direct children of <body> — that list
 * changes a handful of times per page life, so this is effectively free.
 */
const FRAME_TITLES: Record<string, string> = {
  widgetCta: 'Contact DO Homes Group',
}

export default function ThirdPartyFrameTitles() {
  useEffect(() => {
    const label = () => {
      for (const [name, title] of Object.entries(FRAME_TITLES)) {
        for (const frame of document.querySelectorAll<HTMLIFrameElement>(
          `iframe[name="${name}"]:not([title])`,
        )) {
          frame.title = title
        }
      }
    }

    label()
    const observer = new MutationObserver(label)
    observer.observe(document.body, { childList: true })
    return () => observer.disconnect()
  }, [])

  return null
}
