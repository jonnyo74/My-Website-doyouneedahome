'use client'

// Imported here, not in the lazy canvas: a stylesheet pulled in by a dynamic chunk
// was not being emitted in dev, which left Leaflet's layers unpositioned.
import 'leaflet/dist/leaflet.css'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import type { MapView } from '@/lib/abacoaMap'

// The interactive map (Leaflet, the county geometry) loads only when this block
// is about to scroll into view. The box is a fixed height from the first paint,
// so nothing shifts when the map arrives, and a visitor who never scrolls here
// never downloads it.

const Canvas = dynamic(() => import('./AbacoaMapCanvas'), { ssr: false, loading: () => <MapPlaceholder text="Loading map" /> })

function MapPlaceholder({ text }: { text: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center text-sm text-slate-600" role="status">
      {text}
    </div>
  )
}

export default function AbacoaMapLazy({ view, description }: { view: MapView; description: string }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      // Very old browser: load the map after first paint instead of on scroll.
      const id = setTimeout(() => setNear(true), 0)
      return () => clearTimeout(id)
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '400px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={boxRef}
      className={`relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 ${
        view.view === 'hub' ? 'h-[560px] sm:h-[640px]' : 'h-[400px] sm:h-[500px]'
      }`}
    >
      {near ? <Canvas view={view} description={description} /> : <MapPlaceholder text="Map loads as you scroll here" />}
    </div>
  )
}
