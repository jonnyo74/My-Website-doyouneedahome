import type { Metadata } from 'next'
import Link from 'next/link'
import NotFoundLogger from '@/components/notFound/NotFoundLogger'

export const metadata: Metadata = {
  title: 'Page Not Found | DO Homes Group',
  robots: { index: false, follow: true },
}

const links = [
  { href: '/communities', label: 'Communities' },
  { href: '/buy', label: 'Search homes' },
  { href: '/sell', label: 'Sell your home' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact us' },
]

/**
 * The site-wide 404, for unmatched URLs and for any route that calls
 * notFound(). NotFoundLogger sends the requested path and the referrer to
 * /api/not-found-log so inbound links to dead URLs show up in the Vercel logs
 * as "[404] path=… referrer=…".
 */
export default function NotFound() {
  return (
    <section className="bg-gradient-to-br from-sky-50 via-blue-50 to-white px-6 py-24 sm:px-8 sm:py-32">
      <NotFoundLogger />
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">404</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-slate-900 sm:text-5xl">
          We can’t find that page
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          The page may have moved or the link may be out of date. These are the places most
          people are looking for.
        </p>
        <ul className="mt-8 flex flex-wrap gap-3">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8">
          <Link
            href="/"
            className="inline-flex rounded-full bg-gold-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold-700"
          >
            Back to the home page
          </Link>
        </p>
      </div>
    </section>
  )
}
