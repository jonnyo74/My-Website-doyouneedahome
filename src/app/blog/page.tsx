import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog | DO Homes Group',
  description:
    'Real estate insights, market updates, and buying and selling guides for Palm Beach County from DO Homes Group.',
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-sky-50 via-blue-50 to-white px-6 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">Blog</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-slate-900 sm:text-5xl">
            Real Estate Insights
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Market updates, buying and selling guides, and community spotlights for Palm Beach County
            and the Treasure Coast — coming soon.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-gold-500 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gold-600"
            >
              Contact Us
            </Link>
            <Link
              href="/communities"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-8 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
            >
              Explore Communities
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
