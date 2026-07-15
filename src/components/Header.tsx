'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cities } from '@/lib/communities'

// No location filter — a bare state=FL param breaks Ylopo's search (returns
// zero results); omitting locations entirely falls back to the account's
// configured default market area, which actually works.
const SEARCH_URL = 'https://search.doyouneedahome.com/search?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1'

const treasureCoastCities = cities.filter((c) => c.region === 'Treasure Coast')

const communityGroups = [
  {
    label: 'Palm Beach County',
    cities: cities.filter((c) => c.region === 'Palm Beach County' || c.region === 'Barrier Island' || c.region === 'Palm Beach County Barrier Island'),
  },
  {
    label: 'Northern PBC',
    cities: cities.filter((c) => c.region === 'Northern Palm Beach County'),
  },
  {
    label: 'Southern PBC',
    cities: cities.filter((c) => c.region === 'Southern Palm Beach County'),
  },
  {
    label: 'Western PBC',
    cities: cities.filter((c) => c.region === 'Western Palm Beach County'),
  },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [commOpen, setCommOpen] = useState(false)
  const [sellOpen, setSellOpen] = useState(false)
  const [tcOpen, setTcOpen] = useState(false)
  const [mobileTcOpen, setMobileTcOpen] = useState(false)
  const commTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sellTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tcTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openComm = () => { if (commTimer.current) clearTimeout(commTimer.current); setCommOpen(true) }
  const closeComm = () => { commTimer.current = setTimeout(() => setCommOpen(false), 200) }
  const openSell = () => { if (sellTimer.current) clearTimeout(sellTimer.current); setSellOpen(true) }
  const closeSell = () => { sellTimer.current = setTimeout(() => setSellOpen(false), 200) }
  const openTc = () => { if (tcTimer.current) clearTimeout(tcTimer.current); setTcOpen(true) }
  const closeTc = () => { tcTimer.current = setTimeout(() => setTcOpen(false), 200) }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3 sm:px-8">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/premier-brokers.png"
            alt="Premier Brokers International"
            width={200}
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
                <DropLink href="/canadahomeseller">Canadian Sellers</DropLink>
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
              <div className="absolute left-0 top-full mt-1 w-[480px] rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
                <div className="grid grid-cols-2 gap-x-4">
                  {communityGroups.map((group) => (
                    <div key={group.label} className="mb-3">
                      <p className="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                        {group.label}
                      </p>
                      {group.cities.map((c) => (
                        <DropLink key={c.slug} href={`/communities/${c.slug}`}>
                          {c.name}
                        </DropLink>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Treasure Coast — nested flyout */}
                <div className="border-t border-slate-100 pt-2">
                  <div
                    className="relative"
                    onMouseEnter={openTc}
                    onMouseLeave={closeTc}
                  >
                    <button className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-gold-600">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Treasure Coast</span>
                      <ChevronRightIcon />
                    </button>
                    {tcOpen && (
                      <div className="absolute left-full top-0 ml-1 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
                        {treasureCoastCities.map((c) => (
                          <DropLink key={c.slug} href={`/communities/${c.slug}`}>
                            {c.name}
                          </DropLink>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2">
                  <Link
                    href="/communities"
                    className="block rounded-xl px-2 py-2 text-sm font-semibold text-gold-600 transition hover:bg-slate-50"
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
            <MobileLink href="/canadahomeseller" close={() => setMobileOpen(false)}>Canadian Sellers</MobileLink>
            <MobileLink href="/communities" close={() => setMobileOpen(false)}>Communities</MobileLink>
            {communityGroups.map((group) => (
              <div key={group.label}>
                <p className="px-4 pb-0.5 pt-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  {group.label}
                </p>
                {group.cities.map((c) => (
                  <MobileLink key={c.slug} href={`/communities/${c.slug}`} close={() => setMobileOpen(false)} indent>
                    {c.name}
                  </MobileLink>
                ))}
              </div>
            ))}
            <button
              onClick={() => setMobileTcOpen(!mobileTcOpen)}
              className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <span>Treasure Coast</span>
              <span className={`transition-transform ${mobileTcOpen ? 'rotate-90' : ''}`}>
                <ChevronRightIcon />
              </span>
            </button>
            {mobileTcOpen && treasureCoastCities.map((c) => (
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

function ChevronRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M4.5 2L8 6L4.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
