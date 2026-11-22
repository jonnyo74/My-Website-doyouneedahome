import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { agents } from '@/lib/agents'
import { leadMagnets } from '@/lib/leadMagnets'
import { OFFICE_ADDRESS } from '@/lib/site'
import {
  PRESS_KIT_READY,
  isPlaceholder,
  phoneHref,
  pressKit,
  pressKitPlaceholders,
} from '@/lib/press/pressKit'

export const metadata: Metadata = {
  title: 'Press & Media | DO Homes Group',
  description:
    'Press information for DO Homes Group: bios and headshots for Christine Dekant and John Oliver, the market data we can supply, and a direct press contact.',
  alternates: { canonical: '/press' },
  // Stays out of the index until the kit is complete, even on a dev preview.
  robots: PRESS_KIT_READY ? { index: true, follow: true } : { index: false, follow: false },
}

const linkCls = 'text-gold-700 underline underline-offset-2 transition hover:text-gold-800'
const h2Cls = 'font-serif text-2xl font-semibold text-slate-900'

const COUNTY_REPORTS = [
  leadMagnets['palm-beach-county-market-report'],
  leadMagnets['martin-county-market-report'],
  leadMagnets['st-lucie-county-market-report'],
].filter((m) => m.published)

/** Dev-only marker for a field nobody has written yet. Never reaches production. */
function Unfilled({ name }: { name: string }) {
  return (
    <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs text-amber-900">
      {name}
    </span>
  )
}

function text(value: string) {
  return isPlaceholder(value) ? <Unfilled name={value} /> : value
}

export default function PressPage() {
  // Same rule as an unpublished lead magnet: reviewable in `next dev`, absent
  // from production until every placeholder in pressKit.ts has real copy.
  if (!PRESS_KIT_READY && process.env.NODE_ENV === 'production') notFound()

  const open = pressKitPlaceholders()
  const { contact, people, dataOnRequest } = pressKit

  return (
    <div className="min-h-screen bg-white">
      {!PRESS_KIT_READY && (
        <div role="status" className="bg-amber-100 px-6 py-3 text-sm text-amber-900 sm:px-8">
          <strong className="font-semibold">Not published.</strong> This page 404s in production
          until these fields in <code>src/lib/press/pressKit.ts</code> are filled:{' '}
          {open.join(', ')}.
        </div>
      )}

      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-50 via-blue-50 to-white px-6 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">Press</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-slate-900 sm:text-5xl">
            Press &amp; Media
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            DO Homes Group is Christine Dekant and John Oliver, REALTORS® with Premier Brokers
            International in Palm Beach Gardens, Florida. This page has what a reporter or editor
            usually asks us for first.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-16 px-6 py-16 sm:px-8">
        {/* Contact */}
        <section aria-labelledby="press-contact">
          <h2 id="press-contact" className={h2Cls}>
            Press Contact
          </h2>
          <address className="mt-5 space-y-2 not-italic leading-7 text-slate-600">
            <p>
              Phone:{' '}
              {isPlaceholder(contact.phone) ? (
                <Unfilled name={contact.phone} />
              ) : (
                <a href={phoneHref(contact.phone)} className={linkCls}>
                  {contact.phone}
                </a>
              )}
            </p>
            <p>
              Email:{' '}
              {isPlaceholder(contact.email) ? (
                <Unfilled name={contact.email} />
              ) : (
                <a href={`mailto:${contact.email}`} className={linkCls}>
                  {contact.email}
                </a>
              )}
            </p>
            <p>{text(contact.responseTime)}</p>
            <p className="pt-2">
              DO Homes Group at Premier Brokers International
              <br />
              {OFFICE_ADDRESS.streetLine}
              <br />
              {OFFICE_ADDRESS.cityLine}
            </p>
          </address>
        </section>

        {/* Bios + headshots */}
        <section aria-labelledby="press-bios">
          <h2 id="press-bios" className={h2Cls}>
            Bios &amp; Headshots
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {people.map((person) => {
              const agent = agents.find((a) => a.slug === person.agentSlug)
              if (!agent) return null
              return (
                <article
                  key={agent.slug}
                  className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card"
                >
                  <div className="relative h-56 w-44 overflow-hidden rounded-2xl">
                    <Image
                      src={person.headshot.src}
                      alt={person.headshot.alt}
                      fill
                      sizes="176px"
                      className="object-cover object-top"
                    />
                  </div>
                  <h3 className="mt-5 font-serif text-xl font-semibold text-slate-900">
                    {agent.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {agent.title} · {agent.credentials.join(' · ')}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Florida license #{agent.license}</p>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{text(person.shortBio)}</p>
                  <a
                    href={person.headshot.src}
                    download={person.headshot.downloadName}
                    className="mt-5 inline-flex rounded-full bg-gold-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gold-700"
                  >
                    Download headshot
                    <span className="sr-only"> of {agent.name}</span>
                    <span className="ml-1.5 font-normal text-white/80">
                      (JPG, {person.headshot.width} × {person.headshot.height})
                    </span>
                  </a>
                </article>
              )
            })}
          </div>
          <p className="mt-6 text-sm leading-7 text-slate-600">
            Longer bios are on the <Link href="/team" className={linkCls}>team page</Link>.
          </p>
        </section>

        {/* Data on request */}
        <section aria-labelledby="press-data">
          <h2 id="press-data" className={h2Cls}>
            Data We Can Supply on Request
          </h2>
          <ul className="mt-5 list-disc space-y-2 pl-5 leading-7 text-slate-600">
            {dataOnRequest.map((item) => (
              <li key={item}>{text(item)}</li>
            ))}
          </ul>
        </section>

        {/* County reports */}
        <section aria-labelledby="press-reports">
          <h2 id="press-reports" className={h2Cls}>
            County Market Reports
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            The headline figures on each page are in plain HTML and can be cited without filling
            in a form.
          </p>
          <ul className="mt-5 space-y-2 leading-7">
            {COUNTY_REPORTS.map((report) => (
              <li key={report.key}>
                <Link href={report.landingPage} className={linkCls}>
                  {report.title}
                </Link>
                <span className="text-slate-600">, {report.edition}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
