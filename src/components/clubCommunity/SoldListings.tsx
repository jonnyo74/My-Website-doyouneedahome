'use client'

import { useEffect, useState } from 'react'

// Recently sold homes for a community, drawn by us instead of by the Ylopo
// widget, because the widget prints the LIST price on a sold card and cannot be
// told otherwise. The data is the same feed the widget reads (JSONP from
// portal.ylopo.com, `soldOnly: true`), which carries the sale price and date.
//
// Newest sale first (the provider's own order for sold searches). A home that
// is entered in more than one MLS comes back once per entry; those duplicates
// are merged here. Each card names the listing office, as MLS display rules
// expect for sold data.

interface SoldRow {
  id?: number | string
  soldPrice?: string | null
  soldDate?: string | null
  price?: string | null
  bedrooms?: number | null
  bathrooms?: number | null
  livingAreaSqFt?: number | null
  mainPhotoLarge?: string | null
  mainPhoto?: string | null
  listingOfficeName?: string | null
  address?: { fullStreetAddress?: string; city?: string; postalCode?: string }
  listingPropertySubType?: { displayPropertySubType?: string }
}

type View = { state: 'loading' } | { state: 'ready'; rows: SoldRow[] } | { state: 'failed' }

const TIMEOUT_MS = 10_000
let seq = 0

function fetchSold(search: Record<string, unknown>): Promise<SoldRow[] | null> {
  return new Promise((resolve) => {
    const name = `__soldListings${seq++}`
    const w = window as unknown as Record<string, unknown>
    const script = document.createElement('script')
    let done = false
    const finish = (rows: SoldRow[] | null) => {
      if (done) return
      done = true
      clearTimeout(timer)
      delete w[name]
      script.remove()
      resolve(rows)
    }
    const timer = setTimeout(() => finish(null), TIMEOUT_MS)
    w[name] = (body: unknown) => finish(Array.isArray(body) ? (body as SoldRow[]) : null)
    script.onerror = () => finish(null)
    script.src =
      'https://portal.ylopo.com/api/1.0/listings?partyWebsite=search.doyouneedahome.com' +
      `&s=${encodeURIComponent(JSON.stringify(search))}&callback=${name}`
    script.async = true
    document.body.appendChild(script)
  })
}

/** "301 Captains Way 301" and "301 Captains Way" are one home. */
const homeKey = (r: SoldRow) => {
  const street = (r.address?.fullStreetAddress ?? '').toUpperCase().replace(/[^A-Z0-9 ]/g, '').trim()
  const num = street.split(' ')[0]
  return street.replace(new RegExp(` ${num}$`), '').replace(/\s+/g, ' ')
}

const money = (v?: string | null) => {
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? `$${Math.round(n).toLocaleString('en-US')}` : null
}

const soldOn = (iso?: string | null) =>
  iso
    ? new Date(`${iso.slice(0, 10)}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
    : null

export default function SoldListings({
  search,
  count = 6,
  community,
  fullSearchUrl,
}: {
  /** The provider search, with `soldOnly: true`. Ask for more than `count`: duplicates are merged. */
  search: Record<string, unknown>
  count?: number
  community: string
  fullSearchUrl: string
}) {
  const [view, setView] = useState<View>({ state: 'loading' })
  const searchKey = JSON.stringify(search)

  useEffect(() => {
    let live = true
    fetchSold(JSON.parse(searchKey)).then((rows) => {
      if (!live) return
      if (!rows) return setView({ state: 'failed' })
      const seen = new Set<string>()
      const unique = rows
        .filter((r) => r.soldDate)
        .sort((a, b) => (b.soldDate ?? '').localeCompare(a.soldDate ?? ''))
        .filter((r) => {
          const k = homeKey(r)
          if (seen.has(k)) return false
          seen.add(k)
          return true
        })
      setView({ state: 'ready', rows: unique.slice(0, count) })
    })
    return () => {
      live = false
    }
  }, [searchKey, count])

  if (view.state === 'loading') {
    return (
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label={`Loading recent sales in ${community}`}>
        {Array.from({ length: Math.min(count, 3) }, (_, i) => (
          <li key={i} className="h-80 animate-pulse rounded-2xl bg-slate-200/70" />
        ))}
      </ul>
    )
  }

  if (view.state === 'failed' || view.rows.length === 0) {
    return (
      <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-600">
        {view.state === 'failed'
          ? 'The sales feed did not load just now.'
          : `No recent sales in ${community} came back from the feed.`}{' '}
        <a href={fullSearchUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-gold-600 underline-offset-4 hover:underline">
          See every sale in the full search →
        </a>
      </p>
    )
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {view.rows.map((r) => {
        const street = r.address?.fullStreetAddress ?? 'Address withheld'
        const sold = money(r.soldPrice)
        const date = soldOn(r.soldDate)
        const photo = r.mainPhotoLarge ?? r.mainPhoto
        const facts = [
          r.bedrooms ? `${r.bedrooms} bd` : null,
          r.bathrooms ? `${r.bathrooms} ba` : null,
          // Zero, missing or not a number: leave the square footage off.
          Number.isFinite(Number(r.livingAreaSqFt)) && Number(r.livingAreaSqFt) > 0
            ? `${Number(r.livingAreaSqFt).toLocaleString('en-US')} sq ft`
            : null,
        ].filter(Boolean)
        const href = r.id != null ? `https://search.doyouneedahome.com/search/detail/${r.id}` : fullSearchUrl
        return (
          <li key={`${homeKey(r)}-${r.soldDate}`}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition hover:border-report-gold-dark"
              aria-label={`${street}, sold${date ? ` ${date}` : ''}${sold ? ` for ${sold}` : ''}: view listing`}
            >
              <div className="relative aspect-[3/2] bg-slate-100">
                {photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                )}
                <span className="absolute left-3 top-3 rounded-full bg-navy-950/85 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                  Sold
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="font-serif text-2xl font-semibold text-slate-900">{sold ?? 'Price not disclosed'}</p>
                {date && <p className="mt-0.5 text-sm font-semibold text-report-gold-text">Sold {date}</p>}
                <p className="mt-3 font-medium text-slate-900">{street}</p>
                <p className="text-sm text-slate-600">
                  {[r.address?.city, r.address?.postalCode].filter(Boolean).join(', ')}
                  {r.listingPropertySubType?.displayPropertySubType ? ` · ${r.listingPropertySubType.displayPropertySubType}` : ''}
                </p>
                {facts.length > 0 && <p className="mt-2 text-sm text-slate-700">{facts.join(' · ')}</p>}
                {r.listingOfficeName && (
                  <p className="mt-auto pt-4 text-xs text-slate-500">Listing courtesy of {r.listingOfficeName}</p>
                )}
              </div>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
