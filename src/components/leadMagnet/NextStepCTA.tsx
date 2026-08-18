'use client'

import Link from 'next/link'
import type { LeadMagnet } from '@/lib/leadMagnets'
import { trackEvent } from '@/lib/analytics'

/**
 * Shown in place of a lead-magnet CTA once the visitor has already downloaded
 * that magnet. Re-offering a PDF someone already has wastes the placement and
 * reads as if we weren't paying attention — so the slot becomes the logical
 * next step instead (a shortlist, a building question, a consultation), defined
 * per magnet in the registry.
 */
export default function NextStepCTA({
  magnet,
  ctaLocation,
  pageCategory,
  className = '',
  compact = false,
}: {
  magnet: LeadMagnet
  ctaLocation: string
  pageCategory: string
  className?: string
  compact?: boolean
}) {
  const track = () =>
    trackEvent('lead_magnet_next_step_click', {
      magnet_key: magnet.key,
      magnet_id: magnet.id,
      magnet_edition: magnet.edition,
      report_type: magnet.key,
      cta_location: ctaLocation,
      page_category: pageCategory,
      page_url: typeof window !== 'undefined' ? window.location.pathname : undefined,
    })

  if (compact) {
    return (
      <Link
        href={magnet.nextStep.href}
        onClick={track}
        className={`flex items-center gap-3 rounded-2xl border border-report-gold/40 bg-navy-950 px-5 py-4 transition hover:border-report-gold ${className}`}
      >
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-white">{magnet.nextStep.label}</span>
          <span className="mt-0.5 block truncate text-xs text-white/60">
            {magnet.nextStep.description}
          </span>
        </span>
        <span className="flex-shrink-0 text-report-gold" aria-hidden="true">
          →
        </span>
      </Link>
    )
  }

  return (
    <div
      className={`rounded-3xl border border-report-gold/40 bg-navy-950 p-7 text-center sm:p-8 ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-report-gold">
        Your Next Step
      </p>
      <h3 className="mt-2 font-serif text-xl font-semibold leading-snug text-white">
        {magnet.nextStep.headline}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/60">
        {magnet.nextStep.description}
      </p>
      <Link
        href={magnet.nextStep.href}
        onClick={track}
        className="mt-5 inline-flex items-center justify-center rounded-full bg-report-gold px-7 py-3 text-sm font-semibold text-navy-950 transition hover:bg-report-gold-dark"
      >
        {magnet.nextStep.label}
      </Link>
    </div>
  )
}
