'use client'

import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'

/** Offer id shared with the analytics events and SellerValuationForm. */
export const NET_PROCEEDS_OFFER = 'net-proceeds'

/**
 * "See What I'd Keep After Selling" — a link, not a form. It lands on the one
 * seller form already on /sell (the Pricing & Net Proceeds Review), so there is
 * a single seller flow and a single place those leads are created.
 *
 * The destination carries `?offer=net-proceeds&from=<page>`: SellerValuationForm
 * reads `offer` to label its success event, and the form already records the
 * full URL as "Converted on", so the originating page reaches the CRM note.
 */
export default function NetProceedsCTA({
  fromPath,
  ctaLocation,
  className = '',
}: {
  /** Path of the page this card sits on, e.g. '/' or '/martin-county-market-report'. */
  fromPath: string
  ctaLocation: string
  className?: string
}) {
  const href = `/sell?offer=${NET_PROCEEDS_OFFER}&from=${encodeURIComponent(fromPath)}#valuation`
  return (
    <div
      className={`rounded-3xl border border-report-gold/40 bg-navy-950 p-6 text-left sm:p-8 ${className}`}
      data-offer={NET_PROCEEDS_OFFER}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-report-gold">
        Free, No Obligation
      </p>
      <h3 className="mt-2 font-serif text-xl font-semibold leading-snug text-white">
        What Would You Walk Away With?
      </h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
        Send us the address. You will hear back the same day, and within 48 hours you will have a
        comparative market analysis built by hand from real comparable sales, plus your estimated
        net proceeds after commission, taxes and payoff.
      </p>
      <Link
        href={href}
        onClick={() =>
          trackEvent('offer_cta_click', {
            offer: NET_PROCEEDS_OFFER,
            cta_location: ctaLocation,
            page_path: typeof window !== 'undefined' ? window.location.pathname : fromPath,
          })
        }
        className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-report-gold px-6 py-3 text-sm font-semibold text-navy-950 transition hover:bg-report-gold-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950 sm:w-auto"
      >
        See What I&rsquo;d Keep After Selling
      </Link>
    </div>
  )
}
