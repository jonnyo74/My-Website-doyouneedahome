'use client'

/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from 'react'
import { pbcReports, REPORT_EDITION, type LeadMagnetKey } from '@/lib/leadMagnets'
import { trackEvent } from '@/lib/analytics'
import LeadMagnetModal from './LeadMagnetModal'

export interface DualReportCTAProps {
  pageCategory: string
  headline?: string
  intro?: string
  className?: string
}

/**
 * Two-card "pick your report" section for the county-level hub pages (home,
 * sell). Deliberately limited to the two Palm Beach County market reports —
 * this is a property-type choice, not a menu of every magnet on the site.
 */
export default function DualReportCTA({
  pageCategory,
  headline = 'Choose Your Palm Beach County Market Report',
  intro = `Free ${REPORT_EDITION} reports prepared by Christine Dekant & John Oliver — local prices, inventory, cash activity, and what it all means for your next move. Instant PDF download, no obligation.`,
  className = '',
}: DualReportCTAProps) {
  const [openKey, setOpenKey] = useState<LeadMagnetKey | null>(null)
  const triggerRefs = {
    'single-family': useRef<HTMLButtonElement>(null),
    'condo-townhome': useRef<HTMLButtonElement>(null),
  } as Record<LeadMagnetKey, React.RefObject<HTMLButtonElement | null>>

  const handleClick = (key: LeadMagnetKey) => {
    trackEvent('lead_magnet_click', {
      magnet_key: key,
      report_type: key,
      magnet_edition: REPORT_EDITION,
      report_edition: REPORT_EDITION,
      cta_location: 'dual-cards',
      page_category: pageCategory,
      page_url: window.location.pathname,
    })
    setOpenKey(key)
  }

  return (
    <div className={className}>
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-report-gold-text">
          Free {REPORT_EDITION} Market Intelligence
        </p>
        <h2 className="mt-2 font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">{headline}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{intro}</p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {pbcReports.map((report) => (
          <div
            key={report.key}
            className="flex flex-col overflow-hidden rounded-3xl border border-report-gold/40 bg-navy-950 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            <div className="flex items-start gap-5 p-7">
              <img
                src={report.coverImage}
                alt={report.coverAlt}
                width={110}
                height={142}
                loading="lazy"
                className="w-24 flex-shrink-0 rounded-lg shadow-xl ring-1 ring-white/10 sm:w-[6.5rem]"
              />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-report-gold">
                  {report.category}
                </p>
                <h3 className="mt-1.5 font-serif text-xl font-semibold leading-snug text-white">
                  {report.title}
                </h3>
              </div>
            </div>
            <ul className="space-y-2 px-7">
              {report.keyStats.slice(0, 3).map((stat) => (
                <li key={stat.label} className="flex items-baseline gap-2 text-sm text-white/70">
                  <span className="font-semibold text-report-gold">{stat.value}</span>
                  <span>
                    {stat.label.toLowerCase()}
                    {stat.sub ? ` (${stat.sub})` : ''}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 px-7 text-xs text-white/60">
              {report.dataMonth} Palm Beach County market data · {report.edition} edition
            </p>
            <div className="mt-auto p-7 pt-5">
              <button
                ref={triggerRefs[report.key]}
                type="button"
                onClick={() => handleClick(report.key)}
                className="w-full rounded-full bg-report-gold px-6 py-3.5 text-sm font-semibold text-navy-950 transition hover:bg-report-gold-dark"
              >
                Download the {report.shortTitle}
              </button>
            </div>
          </div>
        ))}
      </div>

      {openKey && (
        <LeadMagnetModal
          isOpen
          onClose={() => setOpenKey(null)}
          selection={openKey}
          ctaLocation="dual-cards"
          pageCategory={pageCategory}
          returnFocusRef={triggerRefs[openKey]}
        />
      )}
    </div>
  )
}
