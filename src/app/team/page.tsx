import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Our Team | DO Homes Group',
  description:
    'Meet Christine Dekant and John Oliver — licensed REALTORS® serving Palm Beach County and the Treasure Coast with Premier Brokers International.',
  alternates: { canonical: '/team' },
}

const agents = [
  {
    name: 'Christine Dekant',
    title: 'REALTOR® · Co-Founder, DO Homes Group',
    brokerage: 'Premier Brokers International',
    credentials: ['RENE', 'GRI', 'CLA', 'CPRES', 'REDM', 'C2EX'],
    license: '3264840',
    phone: '(561) 778-7042',
    phoneHref: 'tel:+15617787042',
    email: 'christine@doyouneedahome.com',
    photo: '/images/Christine-rooftop.png',
    photoPosition: 'object-top',
    bio: [
      'Christine Dekant has been serving residential real estate clients in Palm Beach County since 2012. She is known for her analytical approach, responsiveness, market knowledge, and straightforward guidance.',
      'Her business has grown largely through repeat clients and referrals, including clients who have worked with her through multiple purchases and sales over the years.',
      'Before entering real estate, Christine worked in accounting within the renewable energy industry. That financial background continues to shape the detail-oriented approach she brings to pricing, comparable sales, market trends, negotiations, and property evaluation.',
      'Christine works with buyers and sellers across a broad range of residential real estate, including condominiums, single-family homes, resale properties, new construction, and relocation.',
    ],
  },
  {
    name: 'John Oliver',
    title: 'REALTOR® · Co-Founder, DO Homes Group',
    brokerage: 'Premier Brokers International',
    credentials: ['ABR', 'RENE', 'RSPS', 'SRS'],
    license: '3355676',
    phone: '(561) 786-3630',
    phoneHref: 'tel:+15617863630',
    email: 'john@doyouneedahome.com',
    photo: '/images/Event-81.jpg',
    photoPosition: 'object-[center_25%]',
    bio: [
      'John Oliver brings a practical, consultative approach to real estate, helping buyers and sellers understand both the opportunities and the details behind each transaction.',
      'After relocating to South Florida from Connecticut in 2007, John developed extensive familiarity with Palm Beach County and the surrounding market, with particular experience in condominiums, waterfront properties, investment opportunities, new construction, and resale homes.',
      'Clients appreciate John’s patience, responsiveness, and willingness to take the time to explain the process, whether they are seasoned property owners or purchasing in South Florida for the first time.',
      'John is also a 2018 and 2020 Platinum Producer Award recipient at Premier Brokers International.',
    ],
  },
]

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-50 via-blue-50 to-white px-6 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">Our Team</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-slate-900 sm:text-5xl">
            Meet Christine &amp; John
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Licensed REALTORS® with Premier Brokers International, Christine Dekant and John Oliver help
            buyers and sellers throughout Palm Beach County and surrounding South Florida and Treasure
            Coast markets.
          </p>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            As Co-Founders of DO Homes Group, DoYouNeedAHome.com, and CondoWPB.com, they combine local
            market knowledge, practical guidance, and direct communication to help clients make informed
            real estate decisions.
          </p>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Whether buying a primary residence, selling a longtime home, relocating to South Florida,
            purchasing a condominium, exploring new construction, or evaluating an investment property,
            clients work directly with Christine and John throughout the process.
          </p>
        </div>
      </section>

      {/* Agent Cards */}
      <section className="bg-white px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-2">
            {agents.map((agent) => (
              <div
                key={agent.name}
                className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card"
              >
                {/* Photo */}
                <div className="relative h-72 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={agent.photo}
                    alt={agent.name}
                    fill
                    className={`object-cover ${agent.photoPosition}`}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>

                <div className="flex flex-col gap-5 p-8">
                  <div>
                    <h2 className="font-serif text-2xl font-semibold text-slate-900">{agent.name}</h2>
                    <p className="mt-1 text-sm font-medium text-gold-600">{agent.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{agent.brokerage}</p>
                  </div>

                  <div className="space-y-4">
                    {agent.bio.map((paragraph) => (
                      <p key={paragraph} className="text-sm leading-7 text-slate-600">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Credentials</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {agent.credentials.map((c) => (
                        <span
                          key={c}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-5 text-sm">
                    <p className="text-slate-500">License #{agent.license}</p>
                    <a
                      href={agent.phoneHref}
                      aria-label={`Call ${agent.name} at ${agent.phone}`}
                      className="block text-slate-700 transition hover:text-gold-600"
                    >
                      {agent.phone}
                    </a>
                    <a
                      href={`mailto:${agent.email}`}
                      aria-label={`Email ${agent.name} at ${agent.email}`}
                      className="block text-slate-700 transition hover:text-gold-600"
                    >
                      {agent.email}
                    </a>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a
                      href={agent.phoneHref}
                      aria-label={`Call ${agent.name} now at ${agent.phone}`}
                      className="flex items-center justify-center rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gold-600"
                    >
                      Call Now
                    </a>
                    <a
                      href={`mailto:${agent.email}`}
                      aria-label={`Send email to ${agent.name} at ${agent.email}`}
                      className="flex items-center justify-center rounded-full border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
                    >
                      Send Email
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Expertise */}
      <section className="bg-white px-6 pb-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">Local Expertise</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-slate-900">
            Serving Palm Beach County and Surrounding Markets
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            Christine and John work with buyers and sellers throughout Palm Beach County and neighboring
            South Florida and Treasure Coast communities.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            Their experience spans a wide range of property types and price points, including condominiums,
            single-family homes, waterfront properties, new construction, resale homes, relocation, and
            investment opportunities.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            Whether a client’s search begins in Palm Beach County or extends into surrounding counties,
            Christine and John provide the same practical guidance, market insight, and direct communication
            throughout the process.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            Their approach is never one-size-fits-all. They focus on understanding each client’s priorities,
            evaluating the available options carefully, and helping buyers and sellers make informed
            decisions based on current market conditions and individual goals.
          </p>
        </div>
      </section>

      {/* Brokerage */}
      <section className="bg-slate-50 px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card lg:grid-cols-2">
            <div className="relative min-h-[320px] overflow-hidden">
              <Image
                src="/images/christine-award.jpg"
                alt="Christine Dekant with Ray Carrano — Premier Brokers International"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-col justify-center gap-5 p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">Our Brokerage</p>
                <h2 className="mt-2 font-serif text-2xl font-semibold text-slate-900">Premier Brokers International</h2>
              </div>
              <p className="text-sm leading-7 text-slate-600">
                Christine and John are REALTORS® with Premier Brokers International in Palm Beach Gardens.
              </p>
              <p className="text-sm leading-7 text-slate-600">
                Their affiliation with Premier Brokers International provides the brokerage resources and
                support behind their work as DO Homes Group while allowing clients to work directly with
                Christine and John throughout the transaction.
              </p>
              <p className="text-sm leading-7 text-slate-600">
                Christine has also received recognition for her production through Premier Brokers
                International.
              </p>
              <div className="space-y-1 text-sm text-slate-600">
                <p>Premier Brokers International</p>
                <p>9123 North Military Trail, Suite 104</p>
                <p>Palm Beach Gardens, FL 33410</p>
                <a
                  href="tel:+15617837733"
                  aria-label="Call Premier Brokers International at (561) 783-7733"
                  className="block pt-1 text-slate-700 transition hover:text-gold-600"
                >
                  (561) 783-7733
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Estate Resources */}
      <section className="bg-white px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">Our Real Estate Resources</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-slate-900">More Than a Team Website</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            Christine and John are also the Co-Founders of two real estate resources designed to help
            consumers better understand South Florida real estate before they buy or sell.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            <Link
              href="/"
              className="font-medium text-gold-600 underline decoration-gold-300 underline-offset-2 transition hover:text-gold-700"
            >
              DoYouNeedAHome.com
            </Link>{' '}
            provides community guides, local real estate information, market content, and resources for
            buyers and sellers throughout Palm Beach County and surrounding areas.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            <a
              href="https://www.condowpb.com/about"
              className="font-medium text-gold-600 underline decoration-gold-300 underline-offset-2 transition hover:text-gold-700"
            >
              CondoWPB.com
            </a>{' '}
            is dedicated specifically to the West Palm Beach condominium market, with detailed building
            information, comparisons, market insights, and resources for condo buyers, sellers, and owners.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            Together, the two sites reflect the same goal: giving consumers useful, practical information so
            they can make better-informed real estate decisions.
          </p>
        </div>
      </section>

      {/* Team Photos */}
      <section className="bg-white px-6 pb-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">The Team</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-slate-900">Christine &amp; John in the Field</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            Real estate is personal, and clients work directly with us.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            From property tours and showings to inspections, negotiations, closings, and everything in
            between, we stay involved throughout the process and remain available when questions come up.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            Our goal is simple: provide knowledgeable guidance, honest communication, and a level of service
            that clients feel comfortable returning to and recommending to others.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/team-condo.jpg"
                alt="Christine and John at a WPB condo"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/team-lunch.jpg"
                alt="Christine and John"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">Ready to Work Together?</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Call or email Christine or John directly to start a conversation about your real estate plans.
          </p>
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-4">
            {agents.map((agent) => (
              <div
                key={agent.name}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
              >
                <h3 className="font-serif text-lg font-semibold text-slate-900">{agent.name}</h3>
                <a
                  href={agent.phoneHref}
                  aria-label={`Call ${agent.name} at ${agent.phone}`}
                  className="mt-2 block text-sm text-slate-700 transition hover:text-gold-600"
                >
                  {agent.phone}
                </a>
                <a
                  href={`mailto:${agent.email}`}
                  aria-label={`Email ${agent.name} at ${agent.email}`}
                  className="mt-1 block break-words text-sm text-slate-700 transition hover:text-gold-600"
                >
                  {agent.email}
                </a>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://search.doyouneedahome.com/search?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[minPrice]=400000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-gold-500 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-gold-600"
            >
              Search Homes
            </a>
            <Link
              href="/contact"
              className="inline-flex rounded-full border border-slate-300 px-8 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
            >
              Contact Us
            </Link>
            <Link
              href="/testimonials"
              className="inline-flex rounded-full border border-slate-300 px-8 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
            >
              Read Client Reviews
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
