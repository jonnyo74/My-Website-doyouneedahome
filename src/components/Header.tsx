'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cities } from '@/lib/communities'

const SEARCH_URL = 'https://search.doyouneedahome.com/search?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][state]=FL'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [commOpen, setCommOpen] = useState(false)
  const [sellOpen, setSellOpen] = useState(false)
  const commTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sellTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openComm = () => { if (commTimer.current) clearTimeout(commTimer.current); setCommOpen(true) }
  const closeComm = () => { commTimer.current = setTimeout(() => setCommOpen(false), 200) }
  const openSell = () => { if (sellTimer.current) clearTimeout(sellTimer.current); setSellOpen(true) }
  const closeSell = () => { sellTimer.current = setTimeout(() => setSellOpen(false), 200) }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3 sm:px-8">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/logo.png"
            alt="DoYouNeedAHome.com"
            width={180}
            height={54}
            className="h-12 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          <Link href="/buy" className="text-sm font-medium text-slate-700 transition hover:text-gold-600">
            Buy
          </Link>

          <div
            className="relative"
            onMouseEnter={openSell}
            onMouseLeave={closeSell}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-slate-700 transition hover:text-gold-600">
              Sell <ChevronIcon />
            </button>
            {sellOpen && (
              <div className="absolute left-0 top-full mt-1 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
                <DropLink href="/sell">Sell Your Home</DropLink>
                <DropLink href="/sell#valuation">Get a Valuation</DropLink>
              </div>
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={openComm}
            onMouseLeave={closeComm}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-slate-700 transition hover:text-gold-600">
              Communities <ChevronIcon />
            </button>
            {commOpen && (
              <div className="absolute left-0 top-full mt-1 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
                {cities.map((c) => (
                  <DropLink key={c.slug} href={`/communities/${c.slug}`}>
                    {c.name}
                  </DropLink>
                ))}
                <div className="mt-1 border-t border-slate-100 pt-1">
                  <Link
                    href="/communities"
                    className="block rounded-xl px-4 py-2 text-sm font-semibold text-gold-600 transition hover:bg-slate-50"
                  >
                    All Communities →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link href="/team" className="text-sm font-medium text-slate-700 transition hover:text-gold-600">
            Team
          </Link>
          <Link href="/testimonials" className="text-sm font-medium text-slate-700 transition hover:text-gold-600">
            Testimonials
          </Link>
          <Link href="/blog" className="text-sm font-medium text-slate-700 transition hover:text-gold-600">
            Blog
          </Link>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={SEARCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-slate-700 transition hover:text-gold-600"
          >
            Search Homes
          </a>
          <Link
            href="/contact"
            className="rounded-full bg-gold-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gold-600"
          >
            Contact Us
          </Link>
        </div>

        <button
          className="p-1 text-slate-700 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-6 pb-6 pt-2 lg:hidden">
          <div className="flex flex-col gap-0.5">
            <MobileLink href="/buy" close={() => setMobileOpen(false)}>Buy</MobileLink>
            <MobileLink href="/sell" close={() => setMobileOpen(false)}>Sell Your Home</MobileLink>
            <MobileLink href="/sell#valuation" close={() => setMobileOpen(false)}>Get a Valuation</MobileLink>
            <MobileLink href="/communities" close={() => setMobileOpen(false)}>Communities</MobileLink>
            {cities.map((c) => (
              <MobileLink key={c.slug} href={`/communities/${c.slug}`} close={() => setMobileOpen(false)} indent>
                {c.name}
              </MobileLink>
            ))}
            <MobileLink href="/team" close={() => setMobileOpen(false)}>Team</MobileLink>
            <MobileLink href="/testimonials" close={() => setMobileOpen(false)}>Testimonials</MobileLink>
            <MobileLink href="/blog" close={() => setMobileOpen(false)}>Blog</MobileLink>
            <MobileLink href="/contact" close={() => setMobileOpen(false)}>Contact Us</MobileLink>
            <a
              href={SEARCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="mt-3 flex items-center justify-center rounded-full bg-gold-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gold-600"
            >
              Search Homes
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

function DropLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block rounded-xl px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-gold-600"
    >
      {children}
    </Link>
  )
}

function MobileLink({
  href,
  children,
  close,
  indent,
}: {
  href: string
  children: React.ReactNode
  close: () => void
  indent?: boolean
}) {
  return (
    <Link
      href={href}
      onClick={close}
      className={`rounded-xl py-2.5 text-sm font-medium transition hover:bg-slate-50 hover:text-gold-600 ${
        indent ? 'pl-8 pr-4 text-slate-500' : 'px-4 text-slate-700'
      }`}
    >
      {children}
    </Link>
  )
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 4.5L6 8L10 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M3 6H19M3 11H19M3 16H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M4 4L18 18M18 4L4 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
