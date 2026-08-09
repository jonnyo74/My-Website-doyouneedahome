'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cities } from '@/lib/communities'

// No location filter — a bare state=FL param breaks Ylopo's search (returns
// zero results); omitting locations entirely falls back to the account's
// configured default market area, which actually works.
const SEARCH_URL = 'https://search.doyouneedahome.com/search?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[minPrice]=400000'

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

// The mobile menu collapses everything, so Treasure Coast is just another group
// rather than the nested flyout the desktop dropdown needs.
const mobileCommunityGroups = [
  ...communityGroups,
  { label: 'Treasure Coast', cities: treasureCoastCities },
]

const sellLinks = [
  { href: '/sell', label: 'Sell Your Home' },
  { href: '/sell#valuation', label: 'Get a Valuation' },
  { href: '/canadahomeseller', label: 'Canadian Sellers' },
]

// Mirrors REGION_ORDER in src/lib/articles.ts. Held locally on purpose: importing
// from that module would pull the whole 204-article dataset into the client
// bundle just to read six labels. If a region is added there, add it here too.
const blogRegions = [
  'North County',
  'Central County',
  'West County',
  'South County',
  'Martin County',
  'St. Lucie County',
]

// Must match slugifyRegion in BlogRegionTabs — these become ?region= values that
// deep-link straight to the right tab on /blog.
const slugifyRegion = (r: string) => r.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [commOpen, setCommOpen] = useState(false)
  const [sellOpen, setSellOpen] = useState(false)
  const [tcOpen, setTcOpen] = useState(false)
  // One open accordion at a time, so the menu always fits a phone screen.
  const [openSection, setOpenSection] = useState<string | null>(null)
  const commTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sellTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tcTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()

  const closeMobile = () => {
    setMobileOpen(false)
    setOpenSection(null)
  }

  // Close on navigation. Links inside the panel call closeMobile directly, but
  // hash links to the page you're already on don't change pathname, and the
  // browser back button doesn't either — this covers the rest.
  useEffect(() => {
    setMobileOpen(false)
    setOpenSection(null)
  }, [pathname])

  // Lock the page behind the panel so scrolling the menu doesn't scroll the
  // article underneath it.
  useEffect(() => {
    if (!mobileOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobile()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [mobileOpen])

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
          className="-mr-1 p-2 text-slate-700 lg:hidden"
          onClick={() => (mobileOpen ? closeMobile() : setMobileOpen(true))}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {mobileOpen && (
        <div
          id="mobile-menu"
          className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain border-t border-slate-200 bg-white pb-8 lg:hidden"
        >
          {/* Primary action first — most people opening this on a phone want listings. */}
          <div className="px-4 pb-2 pt-4">
            <a
              href={SEARCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMobile}
              className="flex items-center justify-center rounded-full bg-gold-500 px-4 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-gold-600"
            >
              Search Homes
            </a>
          </div>

          <nav className="px-2">
            <MobileRow href="/buy" close={closeMobile}>Buy</MobileRow>

            <MobileSection id="sell" label="Sell" openSection={openSection} setOpenSection={setOpenSection}>
              {sellLinks.map((l) => (
                <MobileRow key={l.href} href={l.href} close={closeMobile} indent>
                  {l.label}
                </MobileRow>
              ))}
            </MobileSection>

            <MobileSection
              id="communities"
              label="Communities"
              openSection={openSection}
              setOpenSection={setOpenSection}
            >
              {mobileCommunityGroups.map((group) => (
                <div key={group.label} className="pb-1">
                  <p className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                    {group.label}
                  </p>
                  {group.cities.map((c) => (
                    <MobileRow key={c.slug} href={`/communities/${c.slug}`} close={closeMobile} indent>
                      {c.name}
                    </MobileRow>
                  ))}
                </div>
              ))}
              <MobileRow href="/communities" close={closeMobile} accent>
                All Communities →
              </MobileRow>
            </MobileSection>

            {/* The reason for this rework: the blog was a single link at the bottom
                of a wall of city names, so nothing below the fold got reached. */}
            <MobileSection
              id="blog"
              label="Blog & Area Guides"
              openSection={openSection}
              setOpenSection={setOpenSection}
            >
              {blogRegions.map((region) => (
                <MobileRow
                  key={region}
                  href={`/blog?region=${slugifyRegion(region)}`}
                  close={closeMobile}
                  indent
                >
                  {region}
                </MobileRow>
              ))}
              <MobileRow href="/blog" close={closeMobile} accent>
                All Articles →
              </MobileRow>
            </MobileSection>

            <MobileRow href="/team" close={closeMobile}>Team</MobileRow>
            <MobileRow href="/testimonials" close={closeMobile}>Testimonials</MobileRow>
          </nav>

          <div className="px-4 pt-4">
            <Link
              href="/contact"
              onClick={closeMobile}
              className="flex items-center justify-center rounded-full border border-slate-300 px-4 py-3.5 text-base font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

function MobileSection({
  id,
  label,
  openSection,
  setOpenSection,
  children,
}: {
  id: string
  label: string
  openSection: string | null
  setOpenSection: (v: string | null) => void
  children: React.ReactNode
}) {
  const open = openSection === id
  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        onClick={() => setOpenSection(open ? null : id)}
        aria-expanded={open}
        aria-controls={`mobile-section-${id}`}
        className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-base font-medium text-slate-800 transition hover:bg-slate-50"
      >
        <span>{label}</span>
        <span
          aria-hidden="true"
          className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
        >
          <ChevronRightIcon />
        </span>
      </button>
      {open && (
        <div id={`mobile-section-${id}`} className="pb-2">
          {children}
        </div>
      )}
    </div>
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

function MobileRow({
  href,
  children,
  close,
  indent,
  accent,
}: {
  href: string
  children: React.ReactNode
  close: () => void
  indent?: boolean
  accent?: boolean
}) {
  // py-3 keeps every row at a ~44px tap target; the old menu sat under 40px.
  const base = 'block rounded-xl py-3 transition hover:bg-slate-50 hover:text-gold-600'
  const tone = accent
    ? 'px-4 text-sm font-semibold text-gold-600'
    : indent
      ? 'pl-8 pr-4 text-[15px] text-slate-600'
      : 'px-4 text-base font-medium text-slate-800 border-b border-slate-100'

  return (
    <Link href={href} onClick={close} className={`${base} ${tone}`}>
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
