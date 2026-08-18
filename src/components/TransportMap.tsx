'use client'
import { useEffect, useRef } from 'react'

interface TransportMapProps {
  lat: number
  lng: number
  cityName: string
}

const TRANSPORT_HUBS = [
  { name: 'Palm Beach Intl Airport (PBI)', lat: 26.6834, lng: -80.0956, type: 'airport', emoji: '✈' },
  { name: 'Fort Lauderdale Airport (FLL)', lat: 26.0742, lng: -80.1506, type: 'airport', emoji: '✈' },
  { name: 'Miami Intl Airport (MIA)', lat: 25.7959, lng: -80.2870, type: 'airport', emoji: '✈' },
  { name: 'Brightline — West Palm Beach', lat: 26.7102, lng: -80.0537, type: 'brightline', emoji: '▶' },
  { name: 'Brightline — Boca Raton', lat: 26.3527, lng: -80.0837, type: 'brightline', emoji: '▶' },
  { name: 'Brightline — Fort Lauderdale', lat: 26.1195, lng: -80.1456, type: 'brightline', emoji: '▶' },
  { name: 'Brightline — Miami', lat: 25.7749, lng: -80.1977, type: 'brightline', emoji: '▶' },
  { name: 'Tri-Rail — West Palm Beach', lat: 26.7116, lng: -80.0534, type: 'trirail', emoji: '◆' },
  { name: 'Tri-Rail — Boynton Beach', lat: 26.5312, lng: -80.0947, type: 'trirail', emoji: '◆' },
  { name: 'Tri-Rail — Delray Beach', lat: 26.4516, lng: -80.0934, type: 'trirail', emoji: '◆' },
  { name: 'Tri-Rail — Boca Raton', lat: 26.3601, lng: -80.0933, type: 'trirail', emoji: '◆' },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: any

export default function TransportMap({ lat, lng, cityName }: TransportMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Load Leaflet CSS from CDN
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return
      const L = window.L

      const map = L.map(mapRef.current).setView([lat, lng], 10)
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      const colors: Record<string, string> = {
        airport: '#1e40af',
        brightline: '#7c3aed',
        trirail: '#065f46',
      }

      // Community marker
      const communityIcon = L.divIcon({
        html: `<div style="background:#b8922a;width:13px;height:13px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
        className: '',
        iconSize: [13, 13],
        iconAnchor: [6, 6],
      })
      // Leaflet makes every marker keyboard-focusable. A divIcon marker has no
      // text of its own, so without `title`/`alt` each one reads as a bare
      // "button" — `title` also gives sighted mouse users the same hover label.
      L.marker([lat, lng], { icon: communityIcon, title: cityName, alt: cityName })
        .addTo(map)
        .bindPopup(`<strong>${cityName}</strong>`)

      // Transport markers
      TRANSPORT_HUBS.forEach((hub) => {
        const icon = L.divIcon({
          html: `<div aria-hidden="true" style="background:${colors[hub.type]};color:white;font-size:10px;padding:2px 5px;border-radius:4px;white-space:nowrap;box-shadow:0 2px 4px rgba(0,0,0,0.3);font-weight:700">${hub.emoji}</div>`,
          className: '',
          iconSize: [22, 18],
          iconAnchor: [11, 9],
        })
        L.marker([hub.lat, hub.lng], { icon, title: hub.name, alt: hub.name })
          .addTo(map)
          .bindPopup(`<strong>${hub.name}</strong>`)
      })
    }

    if (window.L) {
      initMap()
    } else {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = initMap
      document.head.appendChild(script)
    }

    return () => {
      if (mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(mapInstanceRef.current as any).remove()
        mapInstanceRef.current = null
      }
    }
  }, [lat, lng, cityName])

  return (
    <div className="space-y-3">
      <ul className="flex flex-wrap gap-4 text-xs text-slate-500">
        <li className="flex items-center gap-1.5"><span aria-hidden="true" className="inline-block h-3 w-3 rounded-full bg-gold-500"></span>{cityName}</li>
        <li className="flex items-center gap-1.5"><span aria-hidden="true" className="inline-block h-3 w-3 rounded bg-blue-800"></span>Airport</li>
        <li className="flex items-center gap-1.5"><span aria-hidden="true" className="inline-block h-3 w-3 rounded bg-violet-700"></span>Brightline</li>
        <li className="flex items-center gap-1.5"><span aria-hidden="true" className="inline-block h-3 w-3 rounded bg-emerald-800"></span>Tri-Rail</li>
      </ul>
      {/* The map is a supplementary view of the hub list below it, not the only
          route to that information — the airports and rail stations are named
          in the surrounding page copy. */}
      <div
        ref={mapRef}
        role="application"
        aria-label={`Map of ${cityName} showing nearby airports, Brightline stations, and Tri-Rail stations`}
        className="h-[420px] w-full overflow-hidden rounded-2xl border border-slate-200"
      />
    </div>
  )
}
