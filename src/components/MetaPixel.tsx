'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean; version?: string }
  }
}

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

/**
 * Meta (Facebook) Pixel. Mirrors the FollowUpBoss/GA4 pattern already in the
 * root layout: the loader fires the first PageView on load, and the effect
 * fires PageView again on App Router client-side navigations.
 *
 * Renders nothing unless NEXT_PUBLIC_META_PIXEL_ID is set, so the site is
 * untouched until the ID is added in Vercel → Settings → Environment Variables.
 * Never pass name/email/phone to fbq here.
 */
export default function MetaPixel() {
  const pathname = usePathname()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (!PIXEL_ID) return
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    window.fbq?.('track', 'PageView')
  }, [pathname])

  if (!PIXEL_ID) return null

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
          document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  )
}
