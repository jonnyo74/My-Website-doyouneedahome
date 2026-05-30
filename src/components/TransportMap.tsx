'use client'
import { useEffect, useRef } from 'react'

interface TransportMapProps {
  lat: number
  lng: number
  cityName: string
}

const TRANSPORT_HUBS = [
  { name: 'Palm Beach Intl Airport (PBI)', lat: 26.6834, lng: -80.0956, type: 'airport', emoji: '✈️' },
  { name: 'Fort Lauderdale Airport (FLL)', lat: 26.0742, lng: -80.1506, type: 'airport', emoji: '✈️' },
  { name: 'Miami Intl Airport (MIA)', lat: 25.7959, lng: -80.2870, type: 'airport', emoji: '✈️' },
  { name: 'Brightline — West Palm Beach', lat: 26.7102, lng: -80.0537, type: 'brightline', emoji: '🚄' },
  { name: 'Brightline — Boca Raton', lat: 26.3527, lng: -80.0837, type: 'brightline', emoji: '🚄' },
  { name: 'Brightline — Fort Lauderdale', lat: 26.1195, lng: -80.1456, type: 'brightline', emoji: '🚄' },
  { name: 'Brightline — Miami', lat: 25.7749, lng: -80.1977, type: 'brightline', emoji: '🚄' },
  { name: 'Tri-Rail — West Palm Beach', lat: 26.7116, lng: -80.0534, type: 'trirail', emoji: '🚊' },
  { name: 'Tri-Rail — Lake Worth', lat: 26.6183, lng: -80.0834, type: 'trirail', emoji: '🚊' },
  { name: 'Tri-Rail — Boynton Beach', lat: 26.5312, lng: -80.0947, type: 'trirail', emoji: '🚊' },
  { name: 'Tri-Rail — Delray Beach', lat: 26.4516, lng: -80.0934, type: 'trirail', emoji: '🚊' },
  { name: 'Tri-Rail — Boca Raton', lat: 26.3601, lng: -80.0933, type: 'trirail', emoji: '🚊' },
]

export default function TransportMap({ lat, lng, cityName }: TransportMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Dynamically import leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      // Fix default icon path issue with webpack
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!).setView([lat, lng], 10)
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      // Community marker (gold pin)
      const communityIcon = L.divIcon({
        html: `<div style="background:#b8922a;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
        className: '',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      })
      L.marker([lat, lng], { icon: communityIcon })
        .addTo(map)
        .bindPopup(`<strong>${cityName}</strong>`)

      // Transport hub markers
      TRANSPORT_HUBS.forEach((hub) => {
        const colors: Record<string, string> = {
          airport: '#1e40af',
          brightline: '#7c3aed',
          trirail: '#065f46',
        }
        const icon = L.divIcon({
          html: `<div style="background:${colors[hub.type]};color:white;font-size:11px;padding:2px 6px;border-radius:4px;white-space:nowrap;box-shadow:0 2px 4px rgba(0,0,0,0.3);font-weight:600">${hub.emoji}</div>`,
          className: '',
          iconSize: [28, 22],
          iconAnchor: [14, 11],
        })
        L.marker([hub.lat, hub.lng], { icon })
          .addTo(map)
          .bindPopup(`<strong>${hub.name}</strong>`)
      })
    })

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
      <div className="flex flex-wrap gap-4 text-xs">
        <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full bg-gold-600"></span> {cityName}</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded bg-blue-800"></span> Airport</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded bg-violet-700"></span> Brightline</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded bg-emerald-800"></span> Tri-Rail</span>
      </div>
      <div ref={mapRef} className="h-[400px] w-full overflow-hidden rounded-2xl border border-slate-200" />
    </div>
  )
}
