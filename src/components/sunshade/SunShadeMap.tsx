'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useRef } from 'react'
import { metresPerDegree } from '@/lib/sunshade/geo'
import type { BuildingFootprint, LngLat, PoolFootprint, SolarPosition } from '@/lib/sunshade/types'
import type { MultiPolygon } from 'geojson'

/**
 * The map.
 *
 * Every layer is created once and then mutated in place with `setLatLngs`
 * rather than being torn down and rebuilt. That matters because the shadow
 * layer is redrawn on every frame of a slider drag: recreating a Leaflet layer
 * allocates a new SVG path and forces a style recalculation each time, which is
 * exactly the sort of thing that turns a smooth drag into a stuttering one on a
 * phone.
 *
 * All shadows live in a SINGLE polygon layer with multiple rings, so the
 * browser paints them as one SVG path under the default `nonzero` fill rule.
 * Overlapping shadows from neighbouring houses therefore render at one flat
 * opacity instead of stacking into darker patches that would read as deeper
 * shade and mean nothing.
 */

interface SunShadeMapProps {
  centre: { lat: number; lng: number }
  address: string
  buildings: BuildingFootprint[]
  pools: PoolFootprint[]
  parcelRing: LngLat[] | null
  shadows: MultiPolygon | null
  sun: SolarPosition
  onMoveProperty: (lat: number, lng: number) => void
}

const ringToLatLngs = (ring: LngLat[]): L.LatLngExpression[] =>
  ring.map(([lng, lat]) => [lat, lng] as L.LatLngExpression)

/** How far the sun-direction ray is drawn from the pin, in metres. */
const SUN_RAY_M = 55

function sunRayLatLngs(
  centre: { lat: number; lng: number },
  sun: SolarPosition
): L.LatLngExpression[] {
  const { perLat, perLng } = metresPerDegree(centre.lat)
  const angle = (sun.azimuthDeg * Math.PI) / 180
  return [
    [centre.lat, centre.lng],
    [
      centre.lat + (SUN_RAY_M * Math.cos(angle)) / perLat,
      centre.lng + (SUN_RAY_M * Math.sin(angle)) / perLng,
    ],
  ]
}

export default function SunShadeMap({
  centre,
  address,
  buildings,
  pools,
  parcelRing,
  shadows,
  sun,
  onMoveProperty,
}: SunShadeMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const shadowRef = useRef<L.Polygon | null>(null)
  const buildingRef = useRef<L.Polygon | null>(null)
  const poolRef = useRef<L.Polygon | null>(null)
  const parcelRef = useRef<L.Polygon | null>(null)
  const rayRef = useRef<L.Polyline | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  // Held in a ref so the map-init effect never needs the callback in its deps:
  // re-running that effect would destroy and rebuild the whole map on every
  // parent render. The ref is seeded at mount and kept current in an effect
  // rather than during render, which React forbids.
  const onMoveRef = useRef(onMoveProperty)
  useEffect(() => {
    onMoveRef.current = onMoveProperty
  }, [onMoveProperty])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: [centre.lat, centre.lng],
      zoom: 19,
      zoomControl: true,
      // Two-finger drag on touch keeps the page scrollable when the map fills
      // most of a phone screen.
      dragging: !L.Browser.mobile,
    })
    mapRef.current = map

    // Aerial imagery comes from a source we can point at a licence for.
    //
    // Esri's World Imagery was used here originally. It is the obvious free
    // high-resolution layer and plenty of sites rely on it, but its terms tie
    // that basemap to ArcGIS licensing rather than granting it openly — an
    // avoidable risk on a brokerage site.
    //
    // USGS/USDA NAIP is 30cm and public domain, and covers the whole state,
    // which matters here: this site spans Palm Beach, Martin, St Lucie and
    // beyond. Palm Beach County's own six-inch survey is sharper but stops at
    // the county line, and the layer is chosen once when the map is created —
    // so preferring it would leave the wrong imagery in place as soon as
    // someone searched an address in the next county.
    //
    // NAIP is an ImageServer rather than a tile cache, so it has no
    // {z}/{x}/{y} endpoint: each tile coordinate is converted into the Web
    // Mercator bounding box its exportImage endpoint expects.
    const MERCATOR_SHIFT = 20037508.342789244
    const NaipLayer = L.TileLayer.extend({
      getTileUrl(coords: { x: number; y: number; z: number }) {
        const res = (2 * MERCATOR_SHIFT) / (256 * 2 ** coords.z)
        const minX = -MERCATOR_SHIFT + coords.x * 256 * res
        const maxX = -MERCATOR_SHIFT + (coords.x + 1) * 256 * res
        const maxY = MERCATOR_SHIFT - coords.y * 256 * res
        const minY = MERCATOR_SHIFT - (coords.y + 1) * 256 * res
        const bbox = [minX, minY, maxX, maxY].map((v) => v.toFixed(3)).join(',')
        return (
          'https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPImagery' +
          `/ImageServer/exportImage?bbox=${bbox}&bboxSR=3857&imageSR=3857` +
          '&size=256,256&format=jpgpng&transparent=false&f=image'
        )
      },
    })

    const aerial = new (NaipLayer as unknown as new (
      url: string,
      opts: Record<string, unknown>
    ) => L.TileLayer)('', {
      maxZoom: 21,
      maxNativeZoom: 20,
      attribution:
        'Imagery courtesy of USGS / USDA NAIP (public domain) — buildings © OpenStreetMap contributors',
    })
    aerial.addTo(map)

    const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 21,
      maxNativeZoom: 19,
      attribution: '© OpenStreetMap contributors',
    })

    L.control.layers({ Aerial: aerial, Street: street }, undefined, { position: 'topright' }).addTo(map)

    // Mobile gets a one-finger drag once the user opts in by touching the map,
    // so the first scroll past the map still scrolls the page.
    if (L.Browser.mobile) {
      map.once('click', () => map.dragging.enable())
    }

    parcelRef.current = L.polygon([], {
      color: '#FFFFFF',
      weight: 2,
      dashArray: '6 5',
      fill: false,
      interactive: false,
    }).addTo(map)

    shadowRef.current = L.polygon([], {
      color: '#0B1929',
      weight: 0,
      fillColor: '#0B1929',
      fillOpacity: 0.45,
      interactive: false,
    }).addTo(map)

    buildingRef.current = L.polygon([], {
      color: '#F8FAFC',
      weight: 1.5,
      fillColor: '#F8FAFC',
      fillOpacity: 0.15,
      interactive: false,
    }).addTo(map)

    poolRef.current = L.polygon([], {
      color: '#4AAEE8',
      weight: 1.5,
      fillColor: '#4AAEE8',
      fillOpacity: 0.5,
      interactive: false,
    }).addTo(map)

    rayRef.current = L.polyline([], {
      color: '#C9A961',
      weight: 3,
      opacity: 0.95,
      dashArray: '8 6',
      interactive: false,
    }).addTo(map)

    const icon = L.divIcon({
      html: '<div style="background:#1A79B8;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.5)"></div>',
      className: '',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    })

    markerRef.current = L.marker([centre.lat, centre.lng], {
      icon,
      draggable: true,
      title: `${address} — drag to correct the position`,
      alt: address,
    })
      .addTo(map)
      .on('dragend', (event) => {
        const { lat, lng } = (event.target as L.Marker).getLatLng()
        onMoveRef.current(lat, lng)
      })

    return () => {
      map.remove()
      mapRef.current = null
    }
    // Runs once. `centre` and `address` are read for the initial view only;
    // later changes are handled by the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Recentre when a new address is searched or the pin is moved.
  useEffect(() => {
    const map = mapRef.current
    const marker = markerRef.current
    if (!map || !marker) return
    marker.setLatLng([centre.lat, centre.lng])
    if (map.distance(map.getCenter(), [centre.lat, centre.lng]) > 40) {
      map.setView([centre.lat, centre.lng], Math.max(map.getZoom(), 19))
    }
  }, [centre.lat, centre.lng])

  useEffect(() => {
    markerRef.current?.setTooltipContent?.(address)
  }, [address])

  useEffect(() => {
    buildingRef.current?.setLatLngs(buildings.map((b) => ringToLatLngs(b.ring)))
  }, [buildings])

  useEffect(() => {
    poolRef.current?.setLatLngs(pools.map((p) => ringToLatLngs(p.ring)))
  }, [pools])

  useEffect(() => {
    parcelRef.current?.setLatLngs(parcelRing ? [ringToLatLngs(parcelRing)] : [])
  }, [parcelRing])

  useEffect(() => {
    const layer = shadowRef.current
    if (!layer) return
    if (!shadows) {
      layer.setLatLngs([])
      return
    }
    layer.setLatLngs(
      shadows.coordinates.map((poly) =>
        poly.map((ring) => ringToLatLngs(ring as LngLat[]))
      )
    )
  }, [shadows])

  useEffect(() => {
    const layer = rayRef.current
    if (!layer) return
    layer.setLatLngs(sun.isDaylight ? sunRayLatLngs(centre, sun) : [])
  }, [centre, sun])

  return (
    <div
      ref={containerRef}
      role="application"
      aria-label={`Aerial map of ${address} showing estimated building shadows and the sun's direction`}
      className="h-full w-full"
    />
  )
}
