import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | DO Homes Group',
  description:
    'Contact DO Homes Group at Premier Brokers International. Call, email, or visit our Palm Beach Gardens office.',
}

const agents = [
  {
    name: 'Christine Dekant',
    title: 'REALTOR® · RENE · GRI · CLA · CPRES',
    phone: '(561) 778-7042',
    phoneHref: 'tel:+15617787042',
    email: 'christine@doyouneedahome.com',
  },
  {
    name: 'John Oliver',
    title: 'REALTOR® · ABR · RENE · SRS',
    phone: '(561) 786-3630',
    phoneHref: 'tel:+15617863630',
    email: 'john@doyouneedahome.com',
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-50 via-blue-50 to-white px-6 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">Contact</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-slate-900 sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            We're available every day and respond the same day. Call, email, or stop by our Palm
            Beach Gardens office.
          </p>
        </div>
      </section>

      {/* Contacts */}
      <section className="bg-white px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Agent contacts */}
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-semibold text-slate-900">Reach Us Directly</h2>
              {agents.map((agent) => (
                <div
                  key={agent.name}
                  className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card"
                >
                  <h3 className="font-semibold text-slate-900">{agent.name}</h3>
                  <p className="mt-1 text-xs font-medium text-gold-600">{agent.title}</p>
                  <div className="mt-5 space-y-3">
                    <a
                      href={agent.phoneHref}
                      className="flex items-center gap-3 rounded-2xl bg-gold-50 px-4 py-3 text-sm font-semibold text-gold-700 transition hover:bg-gold-100"
                    >
                      <PhoneIcon />
                      {agent.phone}
                    </a>
                    <a
                      href={`mailto:${agent.email}`}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:border-gold-500/40 hover:bg-white"
                    >
                      <MailIcon />
                      {agent.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Office info */}
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-semibold text-slate-900">Our Office</h2>
              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card">
                <p className="font-semibold text-slate-900">DO Homes Group</p>
                <p className="mt-1 text-sm text-slate-500">Premier Brokers International</p>
                <div className="mt-5 space-y-1.5 text-sm text-slate-600">
                  <p>9123 North Military Trail</p>
                  <p>Suite 104</p>
                  <p>Palm Beach Gardens, FL 33410</p>
                </div>
                <a
                  href="tel:+15617837733"
                  className="mt-5 flex items-center gap-3 rounded-2xl bg-gold-50 px-4 py-3 text-sm font-semibold text-gold-700 transition hover:bg-gold-100"
                >
                  <PhoneIcon />
                  (561) 783-7733 — Main
                </a>
                <a
                  href="mailto:info@doyouneedahome.com"
                  className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:border-gold-500/40 hover:bg-white"
                >
                  <MailIcon />
                  info@doyouneedahome.com
                </a>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">Hours</p>
                <div className="mt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monday – Friday</span>
                    <span className="font-medium text-slate-900">9am – 6pm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Saturday</span>
                    <span className="font-medium text-slate-900">9am – 4pm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sunday</span>
                    <span className="font-medium text-slate-900">By appointment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}
