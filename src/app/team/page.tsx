import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Our Team | DO Homes Group',
  description:
    'Meet Christine Dekant and John Oliver — licensed REALTORS® serving Palm Beach County and the Treasure Coast with Premier Brokers International.',
}

const agents = [
  {
    name: 'Christine Dekant',
    title: 'REALTOR®',
    credentials: ['RENE', 'GRI', 'CLA', 'CPRES', 'REDM', 'C2EX'],
    license: '3264840',
    phone: '(561) 329-2589',
    phoneHref: 'tel:+15613292589',
    email: 'christine@doyouneedahome.com',
    bio: "Christine Dekant is one of Palm Beach County's most trusted REALTORS®, with a long track record of helping buyers find the right home and sellers achieve top dollar. She is known for her professionalism, deep market knowledge, responsiveness, and genuine care for every client she serves. Clients return to Christine time and again — many have completed three, four, or five transactions with her.",
  },
  {
    name: 'John Oliver',
    title: 'REALTOR®',
    credentials: ['ABR', 'RENE', 'SRS'],
    license: '3355676',
    phone: '(561) 603-6616',
    phoneHref: 'tel:+15616036616',
    email: 'john@doyouneedahome.com',
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
            Meet DO Homes Group
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            We are a team of experienced, licensed REALTORS® serving Palm Beach County and the
            surrounding counties — with a proven track record of results and a direct line of
            communication at all times.
          </p>
          <p className="mt-3 text-sm text-slate-500">Premier Brokers International · Palm Beach Gardens, FL</p>
        </div>
      </section>

      {/* Agent Cards */}
      <section className="bg-white px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-2">
            {agents.map((agent) => (
              <div
                key={agent.name}
                className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-card"
              >
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-slate-900">{agent.name}</h2>
                  <p className="mt-1 text-sm font-medium text-gold-600">{agent.title}</p>
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
            ))}
          </div>
        </div>
      </section>

      {/* Office Info */}
      <section className="bg-slate-50 px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">Office</p>
            <h2 className="mt-3 font-serif text-2xl font-semibold text-slate-900">Premier Brokers International</h2>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>9123 North Military Trail Suite 104</p>
              <p>Palm Beach Gardens, FL 33410</p>
              <a href="tel:+15617837733" className="block pt-1 text-slate-700 transition hover:text-gold-600">
                Main: (561) 783-7733
              </a>
            </div>
            <Link
              href="/contact"
              className="mt-6 inline-flex rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gold-600"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
