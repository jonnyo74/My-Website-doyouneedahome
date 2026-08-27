'use client'

import { useEffect, useState } from 'react'
import type { OpenHouse } from '@/lib/listings'

// The listing pages are statically generated, so a build that happens before an
// open house would go on advertising it long after the doors closed. The banner
// therefore renders on the server (crawlers and the first paint both see it)
// and drops itself in the browser once the last window has passed — a stale
// "Open House Sunday" is worse than no banner at all.
export default function OpenHouseBanner({
  openHouses,
  address,
  agentEmail,
  agentName,
  tone,
}: {
  openHouses: OpenHouse[]
  address: string
  agentEmail: string
  agentName: string
  tone: 'onPhoto' | 'onLight'
}) {
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const latest = Math.max(...openHouses.map((o) => new Date(o.endsAt).getTime()))
    if (Number.isFinite(latest) && Date.now() > latest) setExpired(true)
  }, [openHouses])

  if (expired || openHouses.length === 0) return null

  const onPhoto = tone === 'onPhoto'
  const mailto =
    `mailto:${agentEmail}` +
    `?subject=${encodeURIComponent(`Open house at ${address}`)}` +
    `&body=${encodeURIComponent(`Hi ${agentName}, I'd like to stop by the open house at ${address}. Please let me know what I should bring.`)}`

  return (
    <div
      className={`inline-flex flex-col gap-1 rounded-2xl px-5 py-4 ${
        onPhoto
          ? 'border border-white/25 bg-black/45 backdrop-blur-sm'
          : 'border border-gold-200 bg-gold-50'
      }`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-[0.22em] ${
          onPhoto ? 'text-gold-200' : 'text-gold-700'
        }`}
      >
        Open House
      </p>
      {openHouses.map((oh) => (
        <p
          key={oh.endsAt}
          className={`text-base font-semibold ${onPhoto ? 'text-white' : 'text-slate-900'}`}
        >
          {oh.date} · {oh.time}
          {oh.note && (
            <span
              className={`ml-2 text-sm font-normal ${onPhoto ? 'text-white/75' : 'text-slate-600'}`}
            >
              {oh.note}
            </span>
          )}
        </p>
      ))}
      <p className={`text-sm ${onPhoto ? 'text-white/80' : 'text-slate-600'}`}>
        Stop by — no appointment needed.{' '}
        <a
          href={mailto}
          className={`font-semibold underline underline-offset-2 ${
            onPhoto ? 'text-gold-200 hover:text-white' : 'text-gold-700 hover:text-gold-800'
          }`}
        >
          Let us know you&rsquo;re coming
        </a>
      </p>
    </div>
  )
}
