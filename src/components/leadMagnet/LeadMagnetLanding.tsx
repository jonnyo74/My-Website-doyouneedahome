/* eslint-disable @next/next/no-img-element */

import Link from 'next/link'
import Image from 'next/image'
import { relatedMagnets, type LeadMagnet } from '@/lib/leadMagnets'
import { SITE_URL } from '@/lib/site'
import LeadMagnetForm from './LeadMagnetForm'

export interface LeadMagnetLandingProps {
  magnet: LeadMagnet
  /**
   * Rendered above the FAQ. Used by the relocation guide for its full
   * area-by-area comparison, which is page-specific rather than registry data.
   */
  children?: React.ReactNode
  /** Dev-only banner shown when the magnet is unpublished. */
  devPreviewNotice?: string
}

/**
 * Shared landing-page template for every lead magnet — market reports and
 * evergreen guides alike. All content comes from the registry entry in
 * src/lib/leadMagnets.ts, so a new magnet needs a route file and nothing else.
 */
export default function LeadMagnetLanding({
  magnet,
  children,
  devPreviewNotice,
}: LeadMagnetLandingProps) {
  const url = `${SITE_URL}${magnet.landingPage}`
  const isReport = magnet.kind === 'market-report'
  const others = relatedMagnets(magnet.key, 2)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: magnet.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: magnet.title, item: url },
    ],
  }
  const agentSchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'DO Homes Group',
    url: SITE_URL,
    telephone: '+1-561-783-7733',
    email: 'info@doyouneedahome.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '9123 North Military Trail, Suite 104',
      addressLocality: 'Palm Beach Gardens',
      addressRegion: 'FL',
      postalCode: '33410',
      addressCountry: 'US',
    },
    areaServed: 'Palm Beach County, Martin County and St. Lucie County, FL',
    parentOrganization: { '@type': 'Organization', name: 'Premier Brokers International' },
    employee: [
      { '@type': 'Person', name: 'Christine Dekant', jobTitle: 'REALTOR®' },
      { '@type': 'Person', name: 'John Oliver', jobTitle: 'REALTOR®' },
    ],
  }

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(agentSchema) }} />

      {devPreviewNotice && (
        <p className="bg-red-700 px-6 py-3 text-center text-sm font-semibold text-white">
          {devPreviewNotice}
        </p>
      )}

      {/* ── Hero + form ─────────────────────────────────────────────── */}
      <section className="bg-navy-950 px-6 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs text-white/50">
            <Link href="/" className="transition hover:text-white">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-white/80">{magnet.shortTitle}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-report-gold">
                {isReport
                  ? `Free ${magnet.edition} Edition · Instant PDF Download`
                  : `Free ${magnet.edition} · Instant PDF Download`}
              </p>
              <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl">
                {magnet.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">{magnet.subheadline}</p>

              <div className="mt-9 flex flex-col items-start gap-8 sm:flex-row">
                <img
                  src={magnet.coverImageLarge}
                  alt={magnet.coverAlt}
                  width={230}
                  height={297}
                  className="w-48 flex-shrink-0 rounded-xl shadow-2xl ring-1 ring-report-gold/40 sm:w-56"
                />
                {magnet.keyStats.length > 0 && (
                  <div className="grid flex-1 grid-cols-2 gap-4">
                    {magnet.keyStats.map((stat) => (
                      <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <p className="font-serif text-2xl font-semibold text-report-gold sm:text-3xl">
                          {stat.value}
                        </p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
                          {stat.label}
                        </p>
                        {stat.sub && <p className="mt-1 text-xs text-white/60">{stat.sub}</p>}
                      </div>
                    ))}
                    {magnet.dataAttribution && (
                      <p className="col-span-2 text-xs leading-5 text-white/60">
                        {magnet.dataAttribution}, published in the {magnet.edition} report.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Lead form */}
            <div
              id="download"
              className="rounded-3xl border border-report-gold/40 bg-white/5 p-7 backdrop-blur-sm lg:sticky lg:top-24"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-report-gold">
                {magnet.ctaEyebrow}
              </p>
              <h2 className="mt-2 font-serif text-xl font-semibold leading-snug text-white">
                {isReport
                  ? `Download the ${magnet.edition} edition now`
                  : `Download the ${magnet.edition} now`}
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/60">
                The PDF downloads immediately after you submit — no waiting on an email.
              </p>
              <div className="mt-5">
                <LeadMagnetForm
                  magnet={magnet}
                  ctaLocation="landing-hero"
                  pageCategory="landing-page"
                  idPrefix={`landing-${magnet.key}`}
                  tone="dark"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Summary (crawlable) ─────────────────────────────────────── */}
      <section className="px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-report-gold-text">
            {isReport ? `${magnet.dataMonth} at a Glance` : 'The Short Version'}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-slate-900">
            {magnet.summaryHeading}
          </h2>
          <p className="mt-5 leading-8 text-slate-600">{magnet.summary}</p>

          {magnet.takeaways.length > 0 && (
            <>
              <h3 className="mt-10 font-serif text-2xl font-semibold text-slate-900">
                {isReport
                  ? `Key Takeaways From the ${magnet.edition} Report`
                  : "What's Inside"}
              </h3>
              <ul className="mt-5 space-y-3">
                {magnet.takeaways.map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-1 flex-shrink-0 text-report-gold-text" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M13.485 3.515a1 1 0 0 1 0 1.414l-7 7a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414L6 9.808l6.293-6.293a1 1 0 0 1 1.192 0z" />
                      </svg>
                    </span>
                    <span className="text-sm leading-7 text-slate-600">{t}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {magnet.dataAttribution && isReport && (
            <p className="mt-4 text-xs text-slate-500">
              Statistics are {magnet.dataAttribution}, published in the {magnet.edition} report. The
              full PDF includes the complete year-over-year table and our buyer and seller guidance.
            </p>
          )}
        </div>
      </section>

      {/* ── Audience columns ────────────────────────────────────────── */}
      <section className="bg-slate-50 px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-serif text-3xl font-semibold text-slate-900">
            Made for Both Sides of the Decision
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {magnet.audienceColumns.map((column) => (
              <div
                key={column.heading}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-report-gold-text">
                  {column.heading}
                </p>
                <ul className="mt-5 space-y-4">
                  {column.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm leading-7 text-slate-600">
                      <span className="mt-0.5 flex-shrink-0 text-report-gold-text" aria-hidden="true">✦</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href="#download"
              className="inline-flex items-center justify-center rounded-full bg-report-gold px-8 py-3.5 text-sm font-semibold text-navy-950 transition hover:bg-report-gold-dark"
            >
              {magnet.ctaButtonLabel}
            </a>
            <p className="mt-3 text-xs text-slate-500">
              Download immediately after completing the form · No obligation
            </p>
          </div>
        </div>
      </section>

      {/* ── Registry-defined body sections ──────────────────────────── */}
      {magnet.sections && magnet.sections.length > 0 && (
        <section className="px-6 py-16 sm:px-8">
          <div className="mx-auto max-w-4xl space-y-14">
            {magnet.sections.map((section) => (
              <div key={section.heading}>
                <h2 className="font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
                  {section.heading}
                </h2>
                {section.intro && (
                  <p className="mt-3 leading-8 text-slate-600">{section.intro}</p>
                )}
                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  {section.items.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
                    >
                      <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Page-specific content ───────────────────────────────────── */}
      {children}

      {/* ── About Christine & John ──────────────────────────────────── */}
      <section className="px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-10 md:grid-cols-[auto_1fr]">
            <div className="flex justify-center gap-4">
              {[
                { src: '/images/christine.jpg', name: 'Christine Dekant', creds: 'REALTOR® · RENE · GRI · CLA · CPRES' },
                { src: '/images/john.jpg', name: 'John Oliver', creds: 'REALTOR® · ABR · RENE · RSPS · SRS' },
              ].map((agent) => (
                <div key={agent.name} className="text-center">
                  <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-3xl shadow-card">
                    <Image src={agent.src} alt={agent.name} fill className="object-cover object-top" sizes="128px" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-900">{agent.name}</p>
                  <p className="mx-auto mt-0.5 max-w-[9rem] text-[11px] leading-4 text-report-gold-text">
                    {agent.creds}
                  </p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-report-gold-text">
                Prepared by
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-slate-900">
                About Christine &amp; John
              </h2>
              <p className="mt-4 leading-8 text-slate-600">
                Christine Dekant and John Oliver lead DO Homes Group at Premier Brokers International in
                Palm Beach Gardens, serving buyers and sellers across Palm Beach County and the Treasure
                Coast. They live in the communities they serve, they answer their own phones, and every
                guide and report on this site is built from the same information they use to price
                listings and advise their own clients.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <a
                  href="tel:+15617837733"
                  className="inline-flex items-center rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold-600"
                >
                  Call (561) 783-7733
                </a>
                <Link
                  href="/team"
                  className="inline-flex items-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
                >
                  Meet the Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section className="bg-slate-50 px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl font-semibold text-slate-900">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-4">
            {magnet.faqs.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <summary className="cursor-pointer list-none font-semibold text-slate-900">{f.q}</summary>
                <p className="mt-3 leading-7 text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Other magnets + internal links ──────────────────────────── */}
      <section className="px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          {others.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2">
              {others.map((other) => (
                <div
                  key={other.key}
                  className="flex flex-col items-center gap-5 rounded-3xl border border-report-gold/40 bg-navy-950 p-7 text-center sm:flex-row sm:text-left"
                >
                  <img
                    src={other.coverImage}
                    alt={other.coverAlt}
                    width={96}
                    height={124}
                    loading="lazy"
                    className="w-20 flex-shrink-0 rounded-lg shadow-xl ring-1 ring-white/10"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-report-gold">
                      Also Free
                    </p>
                    <h2 className="mt-1 font-serif text-lg font-semibold leading-snug text-white">
                      {other.title}
                    </h2>
                    <Link
                      href={other.landingPage}
                      className="mt-3 inline-flex rounded-full bg-report-gold px-5 py-2.5 text-xs font-semibold text-navy-950 transition hover:bg-report-gold-dark"
                    >
                      View That Download
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-report-gold-text">
              Keep Exploring
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold text-slate-900">
              More From DO Homes Group
            </h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {magnet.internalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-card transition hover:border-gold-500/40 hover:text-gold-600"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {magnet.disclaimer && (
            <p className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-xs leading-6 text-slate-500">
              {magnet.disclaimer}
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
