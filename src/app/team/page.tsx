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
    title: 'REALTOR®',
    credentials: ['RENE', 'GRI', 'CLA', 'CPRES', 'REDM', 'C2EX'],
    license: '3264840',
    phone: '(561) 778-7042',
    phoneHref: 'tel:+15617787042',
    email: 'christine@doyouneedahome.com',
    photo: '/images/Christine-rooftop.png',
    photoPosition: 'object-top',
    bio: "Christine Dekant is one of Palm Beach County's most trusted REALTORS®, with a long track record of helping buyers find the right home and sellers achieve top dollar. She is known for her professionalism, deep market knowledge, responsiveness, and genuine care for every client she serves. Clients return to Christine time and again — many have completed three, four, or five transactions with her.",
  },
  {
    name: 'John Oliver',
    title: 'REALTOR®',
    credentials: ['ABR', 'RENE', 'SRS'],
    license: '3355676',
    phone: '(561) 786-3630',
    phoneHref: 'tel:+15617863630',
    email: 'john@doyouneedahome.com',
    photo: '/images/Event-81.jpg',
    photoPosition: 'object-[center_25%]',
    bio: 'John Oliver brings honesty, dedication, and an exceptional work ethic to every real estate transaction. He specializes in helping buyers and sellers across Palm Beach County, with a particular focus on condos and waterfront properties. John is known for going above and beyond — clients consistently describe him as patient, knowledgeable, and genuinely invested in getting the best outcome for them.',
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
            Meet Christine & John
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Licensed REALTORS® with Premier Brokers International, serving buyers and sellers across
            Palm Beach Island, Palm Beach County, and the Treasure Coast — with a proven track record
            and a direct line of communication at all times.
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
                    <p className="mt-1 text-sm font-medium text-gold-600">{agent.title} · Premier Brokers International</p>
                  </div>

                  <p className="text-sm leading-7 text-slate-600">{agent.bio}</p>

                  <div className="flex flex-wrap gap-2">
                    {agent.credentials.map((c) => (
                      <span
                        key={c}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-5 text-sm">
                    <p className="text-slate-400">License #{agent.license}</p>
                    <a href={agent.phoneHref} className="block text-slate-700 transition hover:text-gold-600">
                      {agent.phone}
                    </a>
                    <a href={`mailto:${agent.email}`} className="block text-slate-700 transition hover:text-gold-600">
                      {agent.email}
                    </a>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a
                      href={agent.phoneHref}
                      className="flex items-center justify-center rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gold-600"
                    >
                      Call Now
                    </a>
                    <a
                      href={`mailto:${agent.email}`}
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

      {/* Palm Beach Island */}
      <section className="bg-white px-6 pb-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">Palm Beach Island</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-slate-900">Representing Buyers on Palm Beach Island</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            Palm Beach Island real estate moves differently than the mainland — off-market listings, estate
            sales, and relationships that matter as much as MLS access. Christine and John work as buyer&apos;s
            agents across the Island&apos;s estate section, mid-town, and North End, alongside the broader Palm
            Beach County and Treasure Coast markets, giving clients a single point of contact whether the
            search starts on the Island or expands beyond it.
          </p>
        </div>
      </section>

      {/* Brokerage — Christine & Ray */}
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
                Christine and John are proud members of Premier Brokers International, one of Palm Beach County's
                leading independent brokerages. Pictured with broker Ray Carrano at a Premier Brokers award ceremony —
                Christine has been recognized as a top producer year after year.
              </p>
              <p className="text-sm leading-7 text-slate-600">
                We also run{' '}
                <a
                  href="https://www.condowpb.com/about"
                  className="font-medium text-gold-600 underline decoration-gold-300 underline-offset-2 transition hover:text-gold-700"
                >
                  CondoWPB.com — our dedicated guide to West Palm Beach condo living
                </a>
                .
              </p>
              <div className="space-y-1 text-sm text-slate-600">
                <p>9123 North Military Trail Suite 104</p>
                <p>Palm Beach Gardens, FL 33410</p>
                <a href="tel:+15617837733" className="block pt-1 text-slate-700 transition hover:text-gold-600">
                  (561) 783-7733
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Photos */}
      <section className="bg-white px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">The Team</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-slate-900">Christine & John in the Field</h2>
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
            Call or email Christine or John directly — we respond the same day.
          </p>
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
