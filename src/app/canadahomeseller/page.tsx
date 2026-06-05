import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Selling Your Florida Home as a Canadian | DO Homes Group',
  description:
    'Canadian snowbird selling your Palm Beach County property? DO Homes Group specializes in remote closings, FIRPTA guidance, and making the process simple from anywhere in Canada.',
}

const steps = [
  {
    number: '01',
    title: 'Remote-Friendly Valuation',
    body: "We'll analyze comparable sales and current market conditions to give you an honest value for your Florida property — no need to be in the state. We deliver everything by video call, email, or phone, whatever works for you.",
  },
  {
    number: '02',
    title: 'FIRPTA & Tax Planning Referrals',
    body: 'As a non-US resident seller, FIRPTA requires a 15% withholding on the sale price unless you qualify for a reduced withholding certificate. We connect you with a Florida-based CPA who works with Canadian sellers regularly — before you list, not after.',
  },
  {
    number: '03',
    title: 'Listing & Marketing',
    body: 'Professional photography, MLS exposure, digital advertising, and targeted outreach — all coordinated without you being on the ground. We handle access, showings, and property prep through our trusted local network.',
  },
  {
    number: '04',
    title: 'Offers & Negotiation',
    body: 'We present every offer with a clear breakdown and negotiate on your behalf. You review and sign everything electronically via DocuSign — no flights required.',
  },
  {
    number: '05',
    title: 'Remote Closing',
    body: 'Florida allows fully remote closings. We coordinate with the title company and your Canadian attorney or notary to ensure documents are executed correctly. Your proceeds are wire-transferred directly — no need to be present.',
  },
]

const concerns = [
  {
    q: 'Do I have to come to Florida to sell?',
    a: 'No. Florida law permits fully remote closings using a Power of Attorney or remote online notarization. We handle everything on the ground — you sign electronically and receive proceeds by wire.',
  },
  {
    q: 'What is FIRPTA and how does it affect me?',
    a: "FIRPTA (Foreign Investment in Real Property Tax Act) requires the buyer to withhold 15% of the gross sale price and remit it to the IRS. If your actual tax liability is lower — often much lower — your CPA can apply for a withholding certificate to reduce it. Don't wait until closing to deal with this.",
  },
  {
    q: 'What about Canadian taxes on the sale?',
    a: 'Canada also taxes the gain on foreign real estate. You may owe capital gains tax to the CRA in addition to US obligations. A cross-border CPA can model both exposures and structure the sale to minimize your total tax hit.',
  },
  {
    q: 'What if I inherited the property or it\'s part of an estate?',
    a: 'Estate and probate sales from Canadian-owned Florida property have additional layers — US probate, potential ancillary probate in Florida, and cross-border executor issues. We work with attorneys who handle exactly this and can refer you to the right people before any legal complications slow the sale.',
  },
  {
    q: 'When is the best time to sell as a Canadian snowbird?',
    a: "Palm Beach County's peak buyer season runs November through April — exactly when you're here. Listing in January or February puts your property in front of the largest buyer pool. If you've already headed back to Canada, we can list and manage everything in your absence.",
  },
]

export default function CanadaHomeSellerPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-50 via-blue-50 to-white px-6 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">Canadian Sellers</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-slate-900 sm:text-5xl">
            Selling Your Florida Home From Canada
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Selling a Florida property as a Canadian resident involves FIRPTA withholding, cross-border
            taxes, and a closing process that needs to work from thousands of miles away. We've done
            this before — and we make it straightforward.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-gold-500 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gold-600"
            >
              Talk to Us — No Obligation
            </Link>
            <a
              href="tel:+15617837733"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-8 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
            >
              Call (561) 783-7733
            </a>
          </div>
        </div>
      </section>

      {/* What makes this different */}
      <section className="bg-white px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">Why It's Different</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-slate-900">
            This Isn't a Standard Home Sale
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
            Most Florida agents handle the transaction side — but Canadian sellers face layers that
            most agents aren't equipped for: US federal withholding requirements, Canadian capital
            gains reporting, remote execution of closing documents, and coordinating across time zones.
            We're not tax attorneys, but we know what questions to ask, which professionals to bring in,
            and how to keep the process moving so nothing surprises you at the closing table.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {[
              { icon: '🇨🇦', title: 'Canadian Seller Experience', body: 'We regularly work with Canadian snowbirds and estate sellers across Palm Beach County.' },
              { icon: '📄', title: 'Remote & DocuSign Ready', body: 'Every document in the transaction can be signed electronically. No trips to Florida required.' },
              { icon: '🔗', title: 'CPA & Attorney Network', body: 'We connect you with cross-border tax professionals and real estate attorneys before you need them.' },
            ].map(({ icon, title, body }) => (
              <div key={title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card">
                <p className="text-3xl">{icon}</p>
                <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-slate-50 px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">How It Works</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-slate-900">The Process for Canadian Sellers</h2>
          <div className="mt-10 space-y-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex gap-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-card"
              >
                <p className="flex-shrink-0 font-serif text-3xl font-semibold text-gold-500/40">
                  {step.number}
                </p>
                <div>
                  <h3 className="font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">Common Questions</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-slate-900">
            What Canadian Sellers Ask Us
          </h2>
          <div className="mt-10 space-y-4">
            {concerns.map(({ q, a }) => (
              <div key={q} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card">
                <h3 className="font-semibold text-slate-900">{q}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facebook community */}
      <section className="bg-slate-50 px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-card">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
              <div className="flex-1">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">Facebook Community</p>
                <h2 className="mt-3 font-serif text-2xl font-semibold text-slate-900">
                  Join Our Canadian Snowbird Sellers Group
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  We run a Facebook group specifically for Canadians navigating the Florida real estate
                  market — whether you're thinking about selling, already listed, or just figuring out
                  your options. Ask questions, get updates on the Palm Beach market, and connect with
                  others in the same situation.
                </p>
                <a
                  href="https://www.facebook.com/profile.php?id=61573736736277"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-[#1877F2] px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1565d8]"
                >
                  Join on Facebook
                </a>
              </div>
              <div className="flex-shrink-0 rounded-2xl bg-slate-50 p-8 text-center">
                <p className="font-serif text-5xl font-semibold text-gold-600">Free</p>
                <p className="mt-2 text-sm text-slate-500">No cost, no catch</p>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Real answers from an agent<br />who knows this market cold.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-gold-700 to-gold-500 px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-100">Ready to Talk?</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">
            Let's Figure Out Your Best Move
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-blue-100">
            No pressure, no commitment. Tell us about your property and we'll walk you through
            exactly what a sale would look like — timeline, taxes, net proceeds, and all.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-gold-700 shadow transition hover:bg-blue-50"
            >
              Send Us a Message
            </Link>
            <a
              href="tel:+15617837733"
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white/80 hover:bg-white/10"
            >
              Call (561) 783-7733
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
