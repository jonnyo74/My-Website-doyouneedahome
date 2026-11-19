'use client'

import L from 'leaflet'
import { useEffect, useRef } from 'react'
import {
  DAKOTA_DRIVE,
  DAKOTA_RENTAL,
  DAKOTA_VILLAGES,
  MAP_LANDMARKS,
  MAP_ROADS,
  MAP_VILLAGES,
  viewBounds,
  type LngLat,
  type MapView,
  type MapVillage,
} from '@/lib/abacoaMap'

/**
 * The Leaflet half of the Abacoa maps. Follows the site's other maps: Leaflet
 * from node_modules with its CSS imported here, OpenStreetMap tiles, divIcon
 * markers, and a fixed-height box owned by the parent.
 *
 * Mobile: one finger scrolls the page, never the map (dragging is off on touch
 * devices); two fingers pinch-zoom and the +/- buttons work. Village labels are
 * real <a> links, so they are keyboard-focusable and work without the map.
 */

const GOLD = '#a8832d'
const INK = '#0f2233'
const MUTED = '#8a97a6'

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)
const ll = (p: LngLat): [number, number] => [p[1], p[0]]
const FONT_BASE = 'var(--font-sans, system-ui, sans-serif)'
const font = (narrow: boolean) => `font:600 ${narrow ? 11 : 12}px/1.2 ${FONT_BASE}`

function labelIcon(html: string, anchor: [number, number] = [0, 0]) {
  return L.divIcon({ html, className: '', iconSize: undefined, iconAnchor: anchor })
}

/** Village label: a rounded pill. Selected: dark fill, star and thick border, so it never relies on colour alone. */
function villageLabel(v: MapVillage, opts: { selected: boolean; muted: boolean; narrow: boolean }): string {
  const base = `${font(opts.narrow)};display:inline-block;white-space:nowrap;transform:translate(calc(-50% + var(--dx,0px)),calc(-50% + var(--dy,0px)));padding:${opts.narrow ? '3px 8px' : '4px 10px'};border-radius:9999px;box-shadow:0 1px 4px rgba(0,0,0,.3);`
  if (opts.selected) {
    return `<span aria-current="true" style="${base}background:${INK};color:#fff;border:3px solid ${GOLD};font-size:13px">&#9733; ${esc(v.name)}</span>`
  }
  const pin = v.outline ? '' : `<span aria-hidden="true" style="display:inline-block;width:8px;height:8px;border-radius:9999px;background:${GOLD};border:1px solid ${INK};margin-right:6px"></span>`
  if (v.guide) {
    const style = `${base}background:#fff;color:${INK};border:2px solid ${opts.muted ? MUTED : GOLD};text-decoration:none;${opts.muted ? 'opacity:.9;' : ''}`
    return `<a href="/communities/${esc(v.slug)}" style="${style}" aria-label="${esc(v.name)} guide">${pin}${esc(v.name)}</a>`
  }
  return `<span style="${base}background:#f1f5f9;color:#475569;border:2px dashed ${MUTED}">${esc(v.name)}</span>`
}

function landmarkLabel(name: string, kind: 'landmark' | 'rental', narrow: boolean): string {
  const base = `${font(narrow)};display:inline-block;white-space:nowrap;transform:translate(calc(-50% + var(--dx,0px)),calc(-50% + var(--dy,0px)));padding:3px 7px;box-shadow:0 1px 4px rgba(0,0,0,.3);`
  if (kind === 'rental') {
    return `<span style="${base}background:#fff7ed;color:#7c2d12;border:2px dashed #c2410c;border-radius:3px">&#9650; ${esc(name)}</span>`
  }
  return `<span style="${base}background:${INK};color:#fff;border-radius:3px;font-weight:500">&#9670; ${esc(name)}</span>`
}

function roadLabel(name: string): string {
  return `<span style="font:italic 500 11px/1 var(--font-sans, system-ui, sans-serif);color:#475569;white-space:nowrap;transform:translate(calc(-50% + var(--dx,0px)),calc(-50% + var(--dy,0px)));display:inline-block;text-shadow:0 0 3px #fff,0 0 3px #fff,0 0 3px #fff">${esc(name)}</span>`
}

/** Midpoint of the longest segment whose midpoint is inside the current frame. */
function labelPoint(lines: LngLat[][], bounds: L.LatLngBounds): [number, number] | null {
  let best: { len: number; p: [number, number] } | null = null
  for (const line of lines) {
    if (line.length < 2) continue
    let len = 0
    for (let i = 1; i < line.length; i++) len += Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1])
    const mid = line[Math.floor(line.length / 2)]
    const p = ll(mid)
    if (!bounds.contains(p)) continue
    if (!best || len > best.len) best = { len, p }
  }
  return best ? best.p : null
}

interface Props {
  view: MapView
  description: string
}

export default function AbacoaMapCanvas({ view, description }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const narrow = window.innerWidth < 640
    const touch = L.Browser.mobile || L.Browser.touch
    const map = L.map(el, {
      scrollWheelZoom: false,
      dragging: !touch,
      keyboard: true,
      zoomSnap: 0.5,
      maxZoom: 18,
      minZoom: 12,
    })

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors · Parcels and roads: Palm Beach County GIS',
    }).addTo(map)

    const b = viewBounds(view)
    map.fitBounds(b, { padding: [28, 28], maxZoom: view.view === 'hub' ? 15 : 16, animate: false })
    const frame = map.getBounds().pad(0.05)

    const selectedSlug = view.view === 'village' ? view.slug : null
    const onDakota = (slug: string) => DAKOTA_VILLAGES.includes(slug)

    // Roads first, under everything.
    for (const r of MAP_ROADS) {
      for (const line of r.lines) {
        L.polyline(line.map(ll), { color: MUTED, weight: 2, opacity: 0.85, interactive: false }).addTo(map)
      }
    }

    // Village outlines.
    for (const v of MAP_VILLAGES) {
      if (!v.outline) continue
      const selected = v.slug === selectedSlug
      let style: L.PathOptions
      if (view.view === 'village') {
        style = selected
          ? { color: INK, weight: 4, fillColor: GOLD, fillOpacity: 0.45 }
          : { color: MUTED, weight: 1.5, fillColor: MUTED, fillOpacity: 0.1 }
      } else if (view.view === 'dakota') {
        style = onDakota(v.slug)
          ? { color: GOLD, weight: 3, fillColor: GOLD, fillOpacity: 0.3 }
          : { color: MUTED, weight: 1, fillColor: MUTED, fillOpacity: 0.06 }
      } else {
        style = v.guide
          ? { color: GOLD, weight: 2, fillColor: GOLD, fillOpacity: 0.22 }
          : { color: MUTED, weight: 2, dashArray: '6 5', fillColor: MUTED, fillOpacity: 0.12 }
      }
      L.geoJSON({ type: 'Feature', properties: {}, geometry: v.outline as never } as never, { style: () => style, interactive: false }).addTo(map)
    }

    // Dakota Drive.
    if (view.view === 'dakota') {
      for (const line of DAKOTA_DRIVE.lines) {
        L.polyline(line.map(ll), { color: '#ffffff', weight: 10, opacity: 0.9, interactive: false }).addTo(map)
        L.polyline(line.map(ll), { color: '#b45309', weight: 6, opacity: 1, interactive: false }).addTo(map)
      }
      const p = labelPoint(DAKOTA_DRIVE.lines, frame)
      if (p) L.marker(p, { icon: labelIcon(`<span style="${font(narrow)};display:inline-block;transform:translate(-50%,-150%);white-space:nowrap;background:#b45309;color:#fff;padding:3px 8px;border-radius:3px">Dakota Drive</span>`), interactive: false, keyboard: false }).addTo(map)
    }

    // Road names (not on the Dakota view, where the street is the subject).
    if (view.view !== 'dakota') {
      for (const r of MAP_ROADS) {
        const p = labelPoint(r.lines, frame)
        if (p) L.marker(p, { icon: labelIcon(roadLabel(r.name)), interactive: false, keyboard: false }).addTo(map)
      }
    }

    const labelMarkers: { m: L.Marker; priority: number; anchor?: L.LatLng; leader?: L.Polyline }[] = []

    // Village labels.
    for (const v of MAP_VILLAGES) {
      if (view.view === 'dakota' && !onDakota(v.slug)) continue
      const selected = v.slug === selectedSlug
      const muted = (view.view === 'village' && !selected) || (view.view === 'dakota' && !onDakota(v.slug))
      const m = L.marker(ll(v.position), {
        icon: labelIcon(villageLabel(v, { selected, muted, narrow })),
        keyboard: false,
        riseOnHover: true,
        zIndexOffset: selected ? 1000 : 0,
      }).addTo(map)
      labelMarkers.push({ m, priority: selected ? 0 : v.guide ? 1 : 3 })
    }

    // Landmarks. On a village map only Town Center is needed for orientation.
    for (const lm of MAP_LANDMARKS) {
      if (view.view === 'village' && lm.id !== 'town-center') continue
      if (view.view === 'dakota') continue
      const anchor = L.latLng(ll(lm.position))
      L.circleMarker(anchor, { radius: 5, color: '#fff', weight: 2, fillColor: INK, fillOpacity: 1, interactive: false }).addTo(map)
      const leader = L.polyline([], { color: INK, weight: 1.5, interactive: false }).addTo(map)
      const m = L.marker(anchor, { icon: labelIcon(landmarkLabel(narrow ? lm.short : lm.name, 'landmark', narrow)), interactive: false, keyboard: false }).addTo(map)
      labelMarkers.push({ m, priority: 2, anchor, leader })
    }
    if (view.view === 'dakota') {
      L.marker(ll(DAKOTA_RENTAL.position), { icon: labelIcon(landmarkLabel(narrow ? DAKOTA_RENTAL.short : DAKOTA_RENTAL.name, 'rental', narrow)), interactive: false, keyboard: false }).addTo(map)
    }

    // The container is a plain region with a text description; the same links
    // appear as ordinary HTML below the map.
    el.setAttribute('role', 'region')
    el.setAttribute('aria-label', description)

    // Greedy label de-cluttering: most important labels stay put, the rest slide
    // up or down until they stop overlapping. Runs after every zoom or pan.
    const OFFSETS: [number, number][] = []
    for (const dy of [0, 22, -22, 44, -44, 66, -66, 88, -88]) {
      for (const dx of [0, 60, -60, 120, -120]) OFFSETS.push([dx, dy])
    }
    OFFSETS.sort((p, q) => Math.abs(p[0]) + Math.abs(p[1]) - (Math.abs(q[0]) + Math.abs(q[1])))
    const declutter = () => {
      const placed: DOMRect[] = []
      const ordered = [...labelMarkers].sort((a, b) => a.priority - b.priority)
      const box = el.getBoundingClientRect()
      for (const { m, priority, anchor, leader } of ordered) {
        const inner = m.getElement()?.firstElementChild as HTMLElement | null
        if (!inner) continue
        inner.style.visibility = ''
        leader?.setLatLngs([])
        let done = false
        // Labels for places that have a pin stay close to it; neighborhoods may drift further.
        const maxShift = priority <= 2 ? 70 : 100
        for (const [dx, dy] of OFFSETS) {
          if (Math.abs(dx) > maxShift || Math.abs(dy) > maxShift) continue
          inner.style.setProperty('--dx', `${dx}px`)
          inner.style.setProperty('--dy', `${dy}px`)
          const r = inner.getBoundingClientRect()
          const hit = placed.some((p) => !(r.right < p.left - 2 || r.left > p.right + 2 || r.bottom < p.top - 2 || r.top > p.bottom + 2))
          const inside = r.left >= box.left && r.right <= box.right && r.top >= box.top + 4 && r.bottom <= box.bottom - 24
          if (!hit && inside) {
            placed.push(r)
            done = true
            if (anchor && leader && (dx !== 0 || dy !== 0)) {
              const pt = map.latLngToContainerPoint(anchor)
              leader.setLatLngs([anchor, map.containerPointToLatLng(pt.add([dx, dy]))])
            }
            break
          }
        }
        if (!done) {
          inner.style.setProperty('--dx', '0px')
          inner.style.setProperty('--dy', '0px')
          // A neighborhood without a guide is the first label to give way.
          if (priority >= 3) inner.style.visibility = 'hidden'
          else placed.push(inner.getBoundingClientRect())
        }
      }
    }
    let declutterTimer: ReturnType<typeof setTimeout> | undefined
    const scheduleDeclutter = () => {
      clearTimeout(declutterTimer)
      declutterTimer = setTimeout(declutter, 30)
    }
    map.on('zoomend moveend resize', scheduleDeclutter)
    scheduleDeclutter()

    // Labels can overlap on a phone-sized frame; give the user a way back.
    const reset = new L.Control({ position: 'topleft' })
    reset.onAdd = () => {
      const a = L.DomUtil.create('a', 'leaflet-bar')
      a.href = '#'
      a.role = 'button'
      a.title = 'Reset map view'
      a.setAttribute('aria-label', 'Reset map view')
      a.style.cssText = 'display:flex;align-items:center;justify-content:center;width:34px;height:34px;background:#fff;color:#0f2233;font:700 16px/1 system-ui;text-decoration:none'
      a.innerHTML = '&#8634;'
      L.DomEvent.on(a, 'click', (e) => {
        L.DomEvent.preventDefault(e)
        map.fitBounds(b, { padding: [28, 28], maxZoom: view.view === 'hub' ? 15 : 16, animate: false })
      })
      L.DomEvent.disableClickPropagation(a)
      return a
    }
    reset.addTo(map)

    // If the box had no size when the map was built (a hidden pane, a collapsed
    // tab), the first real size has to re-frame the view, not just resize it.
    let lastWidth = el.clientWidth
    const ro = new ResizeObserver(() => {
      map.invalidateSize({ animate: false })
      const w = el.clientWidth
      if (lastWidth === 0 && w > 0) {
        map.fitBounds(b, { padding: [28, 28], maxZoom: view.view === 'hub' ? 15 : 16, animate: false })
        scheduleDeclutter()
      }
      lastWidth = w
    })
    ro.observe(el)

    return () => {
      clearTimeout(declutterTimer)
      ro.disconnect()
      map.remove()
    }
  }, [view, description])

  return <div ref={ref} className="h-full w-full" />
}
