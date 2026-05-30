import Link from 'next/link'
import Image from 'next/image'
import { cities } from '@/lib/communities'
import CommunityCard from '@/components/CommunityCard'

const SEARCH_URL = 'https://search.doyouneedahome.com'

const testimonials = [
  { quote: 'Christine listed and sold my home within 3 days.', author: 'Dave Hetzel', role: 'Seller', agent: 'Christine Dekant' },
  { quote: 'A true professional! This is the third time we have worked with her.', author: 'Nancy Fletcher', role: 'Seller', agent: 'Christine Dekant' },
  { quote: "She isn't just trying to sell you a house, she is helping find a home.", author: 'Joel Antoine', role: 'Buyer', agent: 'Christine Dekant' },
  { quote: 'John went above and beyond would be an understatement.', author: 'Felicia', role: 'Buyer', agent: 'John Oliver' },
  { quote: 'John is fair, honest & has your best interest.', author: 'Michelle Probert', role: 'Seller & Buyer', agent: 'John Oliver' },
  { quote: "We didn't just buy a condo, we have a new friend.", author: 'William Woody', role: 'Buyer', agent: 'John Oliver' },
]

const stripPhotos = [
  { src: '/public/Ibis Photos/Covershot with Sunrise2.jpg', label: 'Ibis G&CC' },
  { src: '/public/Singer Island/05CB8C4D-90B8-4D71-8600-712B25BD5CFC.jpg', label: 'Singer Island' },
  { src: '/public/West Palm/IMG_1352.JPG', label: 'West Palm Beach' },
  { src: '/public/Jupiter/IMG_2578.JPG', label: 'Jupiter' },
  { src: '/public/Mirasol/IMG_0547.JPEG', label: 'Mirasol' },
]

export default function Home() {
  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] overflow-hidden bg-slate-900">
        {/* Background photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/public/Ibis Photos/Covershot with Sunrise2.jpg"
          alt="Palm Beach County luxury real estate"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        {/* Gradient overlay — darker on left for legibility, fades right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-400">
                Palm Beach County &amp; the Treasure Coast
              </p>
              <h1 className="font-serif text-5xl font-semibold leading-tight text-white sm:text-6xl">
                Find Your Home<br />in Palm Beach County
              </h1>
              <p className="max-w-xl text-lg leading-8 text-white/80">
                DO Homes Group at Premier Brokers International — trusted local agents helping
                buyers and sellers across Palm Beach County and the Treasure Coast.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href={SEARCH_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-gold-500 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gold-600"
                >
                  Search Homes
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                >
                  Contact Us
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-6 border-t border-white/20 pt-8">
                {[
                  { stat: '500+', label: 'Homes Sold' },
                  { stat: '15+', label: 'Communities' },
                  { stat: '5★', label: 'Client Rating' },
                ].map(({ stat, label }) => (
                  <div key={stat} className="text-center">
                    <p className="font-serif text-3xl font-semibold text-gold-400">{stat}</p>
                    <p className="mt-1 text-sm text-white/60">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent photos */}
            <div className="relative flex gap-4">
              <div className="relative aspect-[3/4] w-1/2 overflow-hidden rounded-3xl bg-slate-700 shadow-2xl ring-1 ring-white/10">
                <Image
                  src="/images/christine.jpg"
                  alt="Christine Dekant"
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="(max-width: 1024px) 25vw, 20vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                  <p className="font-semibold text-white">Christine Dekant</p>
                  <p className="text-xs text-white/80">REALTOR® · RENE · GRI · CLA</p>
                </div>
              </div>
              <div className="relative mt-10 aspect-[3/4] w-1/2 overflow-hidden rounded-3xl bg-slate-700 shadow-2xl ring-1 ring-white/10">
                <Image
                  src="/images/john.jpg"
                  alt="John Oliver"
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="(max-width: 1024px) 25vw, 20vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                  <p className="font-semibold text-white">John Oliver</p>
                  <p className="text-xs text-white/80">REALTOR® · ABR · RENE · SRS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Three CTA Cards ───────────────────────────────────────── */}
      <section className="bg-white px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-3">
            <CtaCard
              eyebrow="Buying"
              title="Find Your Dream Home"
              body="Browse all active MLS listings across Palm Beach County and the Treasure Coast."
              href={SEARCH_URL}
              external
              cta="Search Listings"
              accent="blue"
            />
            <CtaCard
              eyebrow="Selling"
              title="List Your Home With Us"
              body="Our proven marketing strategy gets you maximum exposure and top dollar."
              href="/sell"
              cta="Learn More"
              accent="green"
            />
            <CtaCard
              eyebrow="Valuation"
              title="Get a Free Home Valuation"
              body="Find out what your home is worth in today's market with a personalized analysis."
              href="/sell#valuation"
              cta="Request Valuation"
              accent="blue"
            />
          </div>
        </div>
      </section>

      {/* ── Photo Strip ───────────────────────────────────────────── */}
      <section className="px-6 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">
              Palm Beach County
            </p>
            <Link href="/communities" className="text-xs font-semibold text-slate-400 transition hover:text-gold-600">
              Explore communities →
            </Link>
          </div>
          {/* Desktop bento */}
          <div className="hidden h-[400px] grid-cols-3 grid-rows-2 gap-1.5 overflow-hidden rounded-2xl md:grid">
            <div className="relative col-span-1 row-span-2 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={stripPhotos[0].src} alt={stripPhotos[0].label} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
              <span className="absolute bottom-3 left-4 text-xs font-semibold text-white drop-shadow">{stripPhotos[0].label}</span>
            </div>
            {stripPhotos.slice(1).map((p) => (
              <div key={p.src} className="relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.label} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
                <span className="absolute bottom-2 left-3 text-xs font-semibold text-white drop-shadow">{p.label}</span>
              </div>
            ))}
          </div>
          {/* Mobile 2-col */}
          <div className="grid grid-cols-2 gap-1.5 overflow-hidden rounded-2xl md:hidden">
            {stripPhotos.slice(0, 4).map((p) => (
              <div key={p.src} className="relative aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.label} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Communities ──────────────────────────────────── */}
      <section className="bg-slate-50 px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">Communities</p>
              <h2 className="font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">
                Explore Palm Beach County
              </h2>
            </div>
            <Link href="/communities" className="text-sm font-semibold text-gold-600 transition hover:text-gold-700">
              All communities →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {cities.map((city) => (
              <CommunityCard key={city.slug} community={city} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 rounded-3xl border border-slate-200 bg-white p-10 shadow-card lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">Your Agents</p>
                <h2 className="font-serif text-3xl font-semibold text-slate-900">Meet the Team</h2>
              </div>
              <p className="leading-7 text-slate-600">
                Christine Dekant and John Oliver are licensed REALTORS® with Premier Brokers International,
                serving Palm Beach County with local expertise, direct communication, and a proven record
                of getting results.
              </p>
              <Link
                href="/team"
                className="inline-flex rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
              >
                Meet the Team
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <AgentCard
                name="Christine Dekant"
                credentials="RENE · GRI · CLA · CPRES"
                phone="(561) 778-7042"
                phoneHref="tel:+15617787042"
                email="christine@doyouneedahome.com"
              />
              <AgentCard
                name="John Oliver"
                credentials="ABR · RENE · SRS"
                phone="(561) 786-3630"
                phoneHref="tel:+15617863630"
                email="john@doyouneedahome.com"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────── */}
      <section className="bg-slate-50 px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">Client Reviews</p>
              <h2 className="font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">
                What Our Clients Say
              </h2>
            </div>
            <Link href="/testimonials" className="text-sm font-semibold text-gold-600 transition hover:text-gold-700">
              All reviews →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.author} className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="flex-1 text-sm leading-7 text-slate-600">"{t.quote}"</p>
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.author}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                  <p className="text-xs font-medium text-gold-600">{t.agent}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-gold-700 to-gold-500 p-10 text-center shadow-lg">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-200">Get Started</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">
              Ready to Make Your Move?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-blue-100">
              Call us at (561) 783-7733 or send a message — we respond the same day.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="tel:+15617837733"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-gold-700 shadow transition hover:bg-blue-50"
              >
                Call (561) 783-7733
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white/80 hover:bg-white/10"
              >
                Send a Message
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function CtaCard({
  eyebrow, title, body, href, external, cta, accent,
}: {
  eyebrow: string; title: string; body: string; href: string; external?: boolean; cta: string; accent: 'blue' | 'green'
}) {
  const borderColor = accent === 'green' ? 'border-brand-green/30 hover:border-brand-green/60' : 'border-gold-500/30 hover:border-gold-500/60'
  const eyebrowColor = accent === 'green' ? 'text-brand-green-dark' : 'text-gold-600'
  const ctaColor = accent === 'green' ? 'text-brand-green-dark hover:text-brand-green' : 'text-gold-600 hover:text-gold-700'

  return (
    <div className={`flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-7 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover ${borderColor}`}>
      <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${eyebrowColor}`}>{eyebrow}</p>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
      </div>
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex text-sm font-semibold transition ${ctaColor}`}>
          {cta} →
        </a>
      ) : (
        <a href={href} className={`inline-flex text-sm font-semibold transition ${ctaColor}`}>
          {cta} →
        </a>
      )}
    </div>
  )
}

function AgentCard({
  name, credentials, phone, phoneHref, email,
}: {
  name: string; credentials: string; phone: string; phoneHref: string; email: string
}) {
  return (
    <div className="space-y-3 rounded-2xl bg-slate-50 p-5">
      <div>
        <p className="font-semibold text-slate-900">{name}</p>
        <p className="mt-0.5 text-xs font-medium text-gold-600">REALTOR®</p>
      </div>
      <p className="text-xs text-slate-500">{credentials}</p>
      <div className="space-y-1 border-t border-slate-200 pt-3">
        <a href={phoneHref} className="block text-sm text-slate-700 transition hover:text-gold-600">
          {phone}
        </a>
        <a href={`mailto:${email}`} className="block truncate text-xs text-slate-500 transition hover:text-gold-600">
          {email}
        </a>
      </div>
    </div>
  )
}
