import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getListingBySlug } from '@/lib/listings'
import ValueForm from './ValueForm'

// Mailed-postcard landing page. Reached only by QR code, so it is kept out of
// search results and the sitemap. Header/Footer are suppressed in SiteChrome.
export const metadata: Metadata = {
  title: 'What Would Your Home Sell For Today? | DO Homes Group',
  description:
    'Request a hand-built home value review, including your estimated net proceeds, from John Oliver or Christine Dekant.',
  robots: { index: false, follow: false },
}

const deliverables = [
  {
    title: 'A real price range',
    body: 'Built by hand from recent comparable sales, adjusted for your home. Not an automated estimate.',
  },
  {
    title: 'Your net proceeds',
    body: 'What you would actually walk away with after commission, closing costs and your mortgage payoff.',
  },
  {
    title: 'A plan, not a pitch',
    body: 'The prep, pricing and marketing moves we would make, and which ones are worth the money.',
  },
]

const stats = [
  { stat: '24 Years', label: 'Combined real estate experience' },
  { stat: '5★', label: 'Client rating across all reviews' },
  { stat: 'Same Day', label: 'Reply from John or Christine' },
]

const workListings = [
  { slug: '8804-skyward-street', tag: 'Current listing' },
  { slug: '6145-se-audubon-lane', tag: 'Current listing' },
  { slug: '982-sw-worcester-lane', tag: 'Recently sold' },
]

const agentsOnCard = [
  { name: 'John Oliver', src: '/images/john.jpg' },
  { name: 'Christine Dekant', src: '/images/christine.jpg' },
]

export default function ValuePage() {
  const work = workListings
    .map((w) => ({ ...w, listing: getListingBySlug(w.slug) }))
    .filter((w) => w.listing)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero + form */}
      <section className="bg-gradient-to-br from-gold-700 via-gold-600 to-gold-500 px-6 py-12 sm:px-8 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_440px] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white">DO Homes Group</p>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              What would your home sell for today?
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white">
              Send us the address. John or Christine will reply the same day, and within 48 hours
              you&rsquo;ll have a home value review we build by hand, including what you would
              actually walk away with.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                {agentsOnCard.map((a) => (
                  <Image
                    key={a.name}
                    src={a.src}
                    alt={a.name}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full border-2 border-white object-cover object-top"
                  />
                ))}
              </div>
              <p className="text-sm leading-6 text-white">
                <span className="font-semibold">John Oliver &amp; Christine Dekant</span>
                <br />
                Palm Beach County &amp; Treasure Coast
              </p>
            </div>
          </div>
          <ValueForm />
        </div>
      </section>

      {/* What you get */}
      <section className="bg-white px-6 py-14 sm:px-8" aria-labelledby="get-heading">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">What You Get</p>
          <h2 id="get-heading" className="mt-3 font-serif text-3xl font-semibold text-slate-900">
            Free, within 48 hours, no obligation
          </h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-3">
            {deliverables.map((d, i) => (
              <li key={d.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
                <p className="font-serif text-3xl font-semibold text-gold-500/40" aria-hidden="true">
                  0{i + 1}
                </p>
                <h3 className="mt-2 font-semibold text-slate-900">{d.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{d.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Trust */}
      <section className="bg-slate-50 px-6 py-12 sm:px-8" aria-label="Why DO Homes Group">
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
          {stats.map(({ stat, label }) => (
            <div key={stat} className="rounded-2xl bg-white p-6 text-center shadow-card">
              <p className="font-serif text-4xl font-semibold text-gold-600">{stat}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* See our work first */}
      <section className="bg-white px-6 py-14 sm:px-8" aria-labelledby="our-work-heading">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">Our Work</p>
          <h2 id="our-work-heading" className="mt-3 font-serif text-3xl font-semibold text-slate-900">
            See our work first
          </h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-3">
            {work.map(({ listing, tag }) => (
              <li key={listing!.slug}>
                <Link
                  href={`/listings/${listing!.slug}`}
                  className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card transition hover:border-gold-500"
                >
                  <div className="relative aspect-[4/3] bg-slate-100">
                    {listing!.heroPhoto && (
                      <Image
                        src={listing!.heroPhoto.src}
                        alt={listing!.heroPhoto.alt}
                        fill
                        sizes="(min-width: 640px) 33vw, 100vw"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-900">
                      {tag}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="font-semibold text-slate-900">{listing!.address}</p>
                    <p className="text-sm text-slate-600">
                      {listing!.city}, {listing!.state}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <Link href="/testimonials" className="font-semibold text-gold-600 underline underline-offset-4 hover:text-gold-700">
              Read what our clients say
            </Link>
          </p>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50 px-6 py-8 sm:px-8">
        <p className="mx-auto max-w-5xl text-center text-sm text-slate-600">
          DO Homes Group &middot; Premier Brokers International
        </p>
      </footer>
    </div>
  )
}
