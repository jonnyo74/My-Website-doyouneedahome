import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAgentBySlug, getAgentPaths } from '@/lib/agents'
import SellerValuationForm from '@/components/SellerValuationForm'
import { SITE_URL } from '@/lib/site'

type Props = { params: Promise<{ agent: string }> }

// Only John and Christine — /sell/anything-else should 404, not render an empty shell.
export const dynamicParams = false

export function generateStaticParams() {
  return getAgentPaths()
}

export async function generateMetadata({ params }: Props) {
  const { agent: slug } = await params
  const agent = getAgentBySlug(slug)
  if (!agent) return { title: 'Agent not found' }
  const title = `Free Home Valuation from ${agent.name} | DO Homes Group`
  const description = `Get a free comparative market analysis of your Palm Beach County home from ${agent.name}, ${agent.title} with Premier Brokers International. Hand-prepared from real comparable sales and delivered within 48 hours — not an automated estimate.`
  return {
    title,
    description,
    alternates: { canonical: `/sell/${agent.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/sell/${agent.slug}`,
      type: 'profile',
      images: [{ url: agent.photo, width: 1200, height: 630, alt: agent.name }],
    },
  }
}

const deliverables = [
  {
    title: 'Recent Comparable Sales',
    body: 'The homes near you that actually closed in the last six months — with the adjustments that make them comparable to yours.',
  },
  {
    title: 'A Realistic Price Range',
    body: 'Not a single automated number. A range, with the reasoning for the top and the bottom of it, so you can decide where you want to sit.',
  },
  {
    title: 'Your Estimated Net Proceeds',
    body: 'What you would actually walk away with after commission, taxes, and payoff — the number that matters when you are deciding whether to move.',
  },
  {
    title: 'What I Would Do Differently',
    body: 'The specific prep, pricing, and marketing moves that would move your number up, and an honest read on which are worth the money.',
  },
]

export default async function AgentValuationPage({ params }: Props) {
  const { agent: slug } = await params
  const agent = getAgentBySlug(slug)
  if (!agent) notFound()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero — agent on the left, form on the right */}
      <section className="bg-gradient-to-br from-sky-50 via-blue-50 to-white px-6 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
            <div className="flex-1">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">
                Free Home Valuation
              </p>
              <h1 className="mt-3 font-serif text-4xl font-semibold text-slate-900 sm:text-5xl">
                What Is Your Home Worth?
              </h1>

              <div className="mt-8 flex items-center gap-4">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-200">
                  <Image
                    src={agent.photo}
                    alt={agent.name}
                    fill
                    className={`object-cover ${agent.photoPosition}`}
                    sizes="80px"
                    priority
                  />
                </div>
                <div>
                  <p className="font-serif text-lg font-semibold text-slate-900">{agent.name}</p>
                  <p className="text-sm text-slate-500">
                    {agent.title} · Premier Brokers International
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {agent.credentials.map((c) => (
                      <span
                        key={c}
                        className="rounded border border-gold-500/40 bg-gold-500/10 px-1.5 py-0.5 text-[11px] font-semibold text-gold-700"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                &ldquo;{agent.pitch}&rdquo;
              </p>

              {/* The offer, stated plainly — this is human work with a deadline,
                  not an instant on-screen estimate. Two separate promises on
                  purpose: the fast touch, then the finished deliverable. */}
              <div className="mt-6 flex flex-wrap gap-2">
                {['A reply from me the same day', 'Your full CMA within 48 hours'].map((promise) => (
                  <p
                    key={promise}
                    className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-2 text-sm font-semibold text-gold-700"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {promise}
                  </p>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={agent.phoneHref}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
                >
                  Call {agent.firstName} — {agent.phone}
                </a>
                <a
                  href={`mailto:${agent.email}`}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
                >
                  Email {agent.firstName}
                </a>
              </div>
            </div>

            <div id="valuation" className="w-full flex-shrink-0 lg:w-[26rem]">
              <SellerValuationForm agent={agent} />
            </div>
          </div>
        </div>
      </section>

      {/* What you actually get */}
      <section className="bg-white px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">
            What You Get
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-slate-900">
            A Real CMA, Not an Instant Estimate
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            You will not get a number the moment you hit submit. {agent.firstName} replies the same
            day, then builds you a comparative market analysis — a CMA — by hand and sends it within
            48 hours. That turnaround is the point: automated valuations work off public records and
            averages, so they do not know that you redid the kitchen, that your unit faces the
            water, or that the comp down the street closed with a $40,000 seller credit.{' '}
            {agent.firstName} does.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {deliverables.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card"
              >
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why this agent */}
      <section className="bg-slate-50 px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">
            Why {agent.firstName}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-slate-900">
            Who Is Pricing Your Home
          </h2>
          <div className="mt-10 space-y-4">
            {agent.strengths.map((s) => (
              <div
                key={s.title}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card"
              >
                <h3 className="font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
            <p className="text-sm leading-7 text-slate-600">{agent.bio}</p>
            <p className="mt-4 text-xs text-slate-500">
              Florida license #{agent.license} · Premier Brokers International, 9123 North Military
              Trail, Suite 104, Palm Beach Gardens, FL 33410
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/testimonials"
                className="text-sm font-semibold text-gold-600 transition hover:text-gold-700"
              >
                Read client reviews →
              </Link>
              <Link
                href="/team"
                className="text-sm font-semibold text-gold-600 transition hover:text-gold-700"
              >
                Meet the whole team →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-gradient-to-br from-gold-700 to-gold-500 px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-3xl font-semibold text-white sm:text-4xl">
            Start With the Address
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white">
            Send the address, hear back from {agent.firstName} today, and have your CMA within 48
            hours. No obligation and no pressure — if the number is not what you hoped,{' '}
            {agent.firstName} will tell you that too, and what it would take to change it.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#valuation"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-gold-700 shadow transition hover:bg-blue-50"
            >
              Get My Free CMA
            </a>
            <a
              href={agent.phoneHref}
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white/80 hover:bg-white/10"
            >
              Call {agent.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
