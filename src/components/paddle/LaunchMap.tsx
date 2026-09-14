'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useRef } from 'react'
import type { LaunchSite } from '@/lib/paddle/types'

/**
 * The launch map.
 *
 * Markers are created once at mount and then mutated in place. Filtering only
 * ever changes a marker's opacity and pointer-events, so the map never tears
 * down and rebuilds its layer tree while a user is tapping through filters —
 * which on a phone is the difference between instant and a visible stutter.
 *
 * Leaflet's default marker icon is a PNG resolved relative to the CSS, which
 * breaks under Next's asset hashing. Numbered `divIcon`s sidestep that entirely
 * and let the marker carry the same index as the list entry below it, so a pin
 * and its write-up are the same object to the reader.
 */

interface LaunchMapProps {
  sites: LaunchSite[]
  centre: { lat: number; lng: number }
  zoom: number
  /** Ids passing the active filter. Everything else fades back rather than disappearing. */
  visibleIds: string[]
  selectedId: string | null
  onSelect: (id: string) => void
}

const KIND_FILL: Record<LaunchSite['kind'], string> = {
  hand: '#1A79B8',
  ramp: '#0E4A82',
  'water-only': '#2A8630',
  unconfirmed: '#8A6E33',
}

function markerHtml(site: LaunchSite, selected: boolean): string {
  const fill = KIND_FILL[site.kind]
  const ring = selected ? 'box-shadow:0 0 0 5px rgba(26,121,184,0.35);' : ''
  const dashed = site.kind === 'unconfirmed' || site.kind === 'water-only'
  return `<span style="
    display:flex;align-items:center;justify-content:center;
    width:30px;height:30px;border-radius:9999px;
    background:${dashed ? '#FFFFFF' : fill};
    color:${dashed ? fill : '#FFFFFF'};
    border:${dashed ? `2px dashed ${fill}` : `2px solid ${fill}`};
    font:600 14px/1 var(--font-sans, system-ui, sans-serif);
    ${ring}
  ">${site.n}</span>`
}

export default function LaunchMap({
  sites,
  centre,
  zoom,
  visibleIds,
  selectedId,
  onSelect,
}: LaunchMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())

  // Held in a ref so the map-init effect never lists the callback in its deps.
  // Re-running that effect would destroy and rebuild the whole map on every
  // parent render. Seeded at mount, then kept current in an effect rather than
  // during render, which React forbids.
  const onSelectRef = useRef(onSelect)
  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  useEffect(() => {
    const container = containerRef.current
    if (!container || mapRef.current) return
    // Captured here rather than read as `markersRef.current` in the cleanup:
    // by the time cleanup runs the ref could point at a different Map, and the
    // markers this effect created are the ones it is responsible for clearing.
    const markers = markersRef.current

    const map = L.map(container, {
      center: [centre.lat, centre.lng],
      zoom,
      scrollWheelZoom: false,
    })
    mapRef.current = map

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    for (const site of sites) {
      const marker = L.marker([site.lat, site.lng], {
        icon: L.divIcon({
          html: markerHtml(site, false),
          className: '',
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        }),
        keyboard: true,
        alt: `${site.name} — ${site.operator}`,
        title: site.name,
      })
      marker.on('click', () => onSelectRef.current(site.id))
      marker.on('keypress', () => onSelectRef.current(site.id))
      marker.addTo(map)
      markers.set(site.id, marker)
    }

    return () => {
      map.remove()
      mapRef.current = null
      markers.clear()
    }
    // Sites, centre and zoom are module constants for this page — the map is
    // built once and never needs rebuilding for them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Repaint icons when selection changes, without touching the layer itself.
  useEffect(() => {
    for (const site of sites) {
      const marker = markersRef.current.get(site.id)
      if (!marker) continue
      marker.setIcon(
        L.divIcon({
          html: markerHtml(site, site.id === selectedId),
          className: '',
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        })
      )
      marker.setZIndexOffset(site.id === selectedId ? 1000 : 0)
    }
  }, [sites, selectedId])

  // Filtering fades rather than removes. A pin that vanishes reads as an error;
  // a pin that dims reads as "not what you asked for", which is the truth.
  useEffect(() => {
    const visible = new Set(visibleIds)
    for (const [id, marker] of markersRef.current) {
      const on = visible.has(id)
      marker.setOpacity(on ? 1 : 0.25)
      const element = marker.getElement()
      if (element) element.style.pointerEvents = on ? 'auto' : 'none'
    }
  }, [visibleIds])

  return (
    <div
      ref={containerRef}
      className="h-[420px] w-full rounded-2xl sm:h-[520px]"
      role="application"
      aria-label="Map of public paddle launches in Jupiter and Tequesta"
    />
  )
}
