'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useRef } from 'react'
import {
  ACCESS_POINTS,
  DOG_CORRIDOR,
  GUARDED_AREAS,
  GUARDED_RADIUS_PX,
  LAYERS,
  MAP_CENTRE,
  MAP_ZOOM,
  type AccessPoint,
  type LayerId,
} from '@/lib/jupiterBeachAccess'

/**
 * The Leaflet half of the Jupiter beach access map. Built once at mount, one
 * L.layerGroup per toggle; the parent flips groups on and off through
 * `visible`, so toggling never rebuilds the map.
 *
 * Follows LaunchMap: Leaflet from node_modules (its CSS imported here, not a
 * CDN), OpenStreetMap tiles, divIcon markers so the default PNG icon never
 * has to resolve through Next's asset pipeline, and a fixed-height container
 * owned by the parent so the space is reserved before this chunk loads.
 *
 * Points with `position: null` are never drawn. They are listed in the text
 * below the map instead, which is the honest rendering of "we know it exists
 * but cannot place it".
 */

interface Props {
  visible: Record<LayerId, boolean>
}

const SWATCH = Object.fromEntries(LAYERS.map((l) => [l.id, l.swatch])) as Record<LayerId, string>

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)
}

/** Popup body: name, who runs it, address, official link. Nothing else. */
function popupHtml(p: { name: string; operator: string; address?: string; href: string }): string {
  const lines = [
    `<strong style="font-size:14px">${escapeHtml(p.name)}</strong>`,
    `<span>${escapeHtml(p.operator)}</span>`,
    p.address ? `<span>${escapeHtml(p.address)}</span>` : '',
    `<a href="${escapeHtml(p.href)}" target="_blank" rel="noopener noreferrer" style="text-decoration:underline">Official page</a>`,
  ].filter(Boolean)
  return `<div style="display:grid;gap:4px;font:13px/1.4 var(--font-sans, system-ui, sans-serif);color:#0F2233">${lines.join('')}</div>`
}

function markerIcon(p: AccessPoint): L.DivIcon {
  const lot = p.id === 'a1a-lot-27-28'
  const fill = lot ? '#1561A0' : SWATCH.parks
  return L.divIcon({
    html: `<span aria-hidden="true" style="
      display:flex;align-items:center;justify-content:center;
      width:28px;height:28px;border-radius:${lot ? '6px' : '9999px'};
      background:${fill};color:#fff;border:2px solid #fff;
      box-shadow:0 1px 4px rgba(0,0,0,.35);
      font:700 13px/1 var(--font-sans, system-ui, sans-serif)">P</span>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  })
}

export default function JupiterBeachAccessMap({ visible }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const groupsRef = useRef<Record<LayerId, L.LayerGroup> | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || mapRef.current) return

    const map = L.map(container, {
      center: [MAP_CENTRE.lat, MAP_CENTRE.lng],
      zoom: MAP_ZOOM,
      scrollWheelZoom: false,
    })
    mapRef.current = map

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    const groups: Record<LayerId, L.LayerGroup> = {
      parks: L.layerGroup(),
      ada: L.layerGroup(),
      dogs: L.layerGroup(),
      guarded: L.layerGroup(),
    }
    groupsRef.current = groups

    for (const p of ACCESS_POINTS) {
      if (!p.position) continue
      L.marker([p.position.lat, p.position.lng], {
        icon: markerIcon(p),
        keyboard: true,
        title: p.name,
        alt: `${p.name}, ${p.operator}`,
      })
        .bindPopup(popupHtml(p))
        .addTo(groups[p.layer])
    }

    // A pixel-radius ring, not a metre-radius circle: the County publishes no
    // extent for a guarded area, and a metre circle sized honestly would hide
    // under the park marker at the opening zoom.
    for (const g of GUARDED_AREAS) {
      L.circleMarker([g.position.lat, g.position.lng], {
        radius: GUARDED_RADIUS_PX,
        color: SWATCH.guarded,
        weight: 3,
        fillColor: SWATCH.guarded,
        fillOpacity: 0.15,
      })
        .bindPopup(popupHtml(g))
        .addTo(groups.guarded)
    }

    L.polyline(
      DOG_CORRIDOR.path.map((pt) => [pt.lat, pt.lng] as [number, number]),
      { color: SWATCH.dogs, weight: 6, opacity: 0.8, dashArray: '10 8' },
    )
      .bindPopup(
        popupHtml({
          name: DOG_CORRIDOR.name,
          operator: DOG_CORRIDOR.operator,
          address: `${DOG_CORRIDOR.from} north to ${DOG_CORRIDOR.to}`,
          href: DOG_CORRIDOR.href,
        }),
      )
      .addTo(groups.dogs)

    // Draw order: corridor and rings under the markers so pins stay clickable.
    groups.dogs.addTo(map)
    groups.guarded.addTo(map)
    groups.ada.addTo(map)
    groups.parks.addTo(map)

    return () => {
      map.remove()
      mapRef.current = null
      groupsRef.current = null
    }
    // Data is module-constant; the map is built once. Visibility is applied
    // by the effect below without touching the layer tree.
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const groups = groupsRef.current
    if (!map || !groups) return
    for (const id of Object.keys(groups) as LayerId[]) {
      const on = visible[id]
      const has = map.hasLayer(groups[id])
      if (on && !has) groups[id].addTo(map)
      if (!on && has) map.removeLayer(groups[id])
    }
  }, [visible])

  return (
    <div
      ref={containerRef}
      className="h-[420px] w-full rounded-2xl sm:h-[520px]"
      role="application"
      aria-label="Map of Jupiter beach parks, parking lots, guarded swimming areas and the dog-friendly corridor. The same points are listed below the map."
    />
  )
}
