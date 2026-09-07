import Link from 'next/link'

/**
 * Lead-generation seam.
 *
 * Deliberately NOT a gate. Everything the analyzer computes stays free and
 * visible: a tool that demands an email before it will draw a shadow gets
 * closed, and a shared link that dead-ends on a form is worth nothing. This is
 * an offer sitting beside a finished answer.
 *
 * When the full report is built, the change is contained here and in one new
 * route: swap this link for a name/email/phone form posting to
 * `/api/sunshade/report-request`, modelled on the existing `/api/leads` handler
 * (honeypot, field validation, Follow Up Boss event) with the property address,
 * coordinates, and the exposure ratings attached as the note body. The address
 * already travels in the URL, so the form has everything it needs.
 */
export default function ReportCta({ address }: { address: string }) {
  return (
    <section className="rounded-2xl border border-navy-800 bg-navy-950 p-5 text-white">
      <h2 className="font-serif text-lg font-semibold">Get your full Sun &amp; Shade report</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
        A written breakdown for {address} — seasonal comparison, pool and patio timing, and what
        the aerial data cannot tell you about the trees on the lot.
      </p>
      <Link
        href="/contact"
        className="mt-4 inline-flex rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-navy-950 transition-colors hover:bg-slate-100"
      >
        Request the report
      </Link>
    </section>
  )
}
