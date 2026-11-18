# Abacoa maps: handoff

One shared map component and one dataset, three views. Checked 2026-11-18.

| View | Page | Placement | Heading |
| --- | --- | --- | --- |
| Hub | `/communities/abacoa` | Directly above the comparison table, anchor `#abacoa-map` | Explore the Abacoa villages on the map |
| Village (10) | `/communities/<village>` | Inside "Where it sits and schools", above the existing cards, anchor `#village-map` | Where is {village} in Abacoa? |
| Dakota Drive | `/communities/dakota` | Directly below "Search the village, not the street" | Which Abacoa villages are along Dakota Drive? |

The MLS listings block is untouched and stays above the map on village pages.

## Files

- `scripts/build-abacoa-map-data.py` builds `src/lib/abacoaMapData.generated.json` from Palm Beach County GIS. Re-run it to refresh. Needs Python and shapely.
- `src/lib/abacoaMap.ts` adds names, guide links, sources and the view framing. No Leaflet import.
- `src/components/abacoaMap/AbacoaMapSection.tsx` (server: heading, legend, ordinary guide links, sources), `AbacoaMapLazy.tsx` (loads the map near the viewport, fixed height), `AbacoaMapCanvas.tsx` (Leaflet).
- Leaflet and OpenStreetMap tiles are what the site's other maps already use. No new dependency or paid service.

## What is drawn, and from what

| Feature | Geometry | Source |
| --- | --- | --- |
| Mallory Creek, Martinique, Tuscany, Valencia, Windsor Park, Charleston Court, Canterbury Place, Osceola Woods | Outline: Property Appraiser parcels filed under the village's recorded plat name, dissolved into one shape | Palm Beach County `Parcels/PARCEL_INFO` layer; abacoa.com village pages |
| Somerset, Cambridge, The Island, The Village at Abacoa | Outline, same method, shown unlinked (no guide yet) | same |
| Dakota Drive | County road centerline (2.4 km) | Palm Beach County `ENG/CENTERLINE` |
| Military Trail, Indiantown Rd, Central Blvd, Frederick Small Rd, Indian Creek Pkwy, Main St, Florida's Turnpike | County road centerlines | same |
| Downtown Abacoa, Roger Dean Stadium, Abacoa Golf Club | Pin at the centre of the county parcel (1200 Town Center Dr, 4355 Stadium Dr, 105 Barbados Dr) | county parcels |

Every feature in the JSON carries its source layer URL and the query that produced it.

## Shown as pins, not boundaries

- **Antigua.** No plat of its own: it sits inside the shared Abacoa Town Center plat. Pin is the largest parcel owned by Antigua at Town Center HOA Inc (1500 Corbison Point Pl).
- **Newhaven.** The county's plat names (`NEWHAVEN 7A`, `7B Ph 1`, `7B Ph 2`) cover only later phases; the 1998 original phases are not under a Newhaven name. Pin is the HOA office at 112 Newhaven Blvd (county owner: Newhaven at Abacoa HMO).
- **Dakota at Abacoa (rental).** Pin at the centre of the county plat named `DAKOTA`. The POA gives its leasing office as 3334 S. Bismark Lane, which the county parcel search and the Census geocoder could not place, so the pin is approximate.

## Dakota Drive check

Distance from the county centerline to each outline, measured when the data was built: Martinique 0 m, Mallory Creek 6 m, Windsor Park 6 m, Canterbury Place 10 m, Tuscany 226 m, Valencia 330 m, Charleston Court 1.2 km, Osceola Woods 1.6 km. The four within 10 m are labelled as along Dakota Drive.

## Omitted

- A Newhaven outline (no supportable plat geometry) and an Antigua outline (shared plat).
- Canterbury Place's POA address (318 Mulligan Pl): not found in county parcels.
- Somerset is not drawn on the Dakota view, although the MLS shows Dakota Drive condominium addresses. It has no guide, and its distance to the street was not measured.
- No walking times, school zones or address-level boundaries are shown or implied; the Map sources note says so.
- The Town's master site plan (jupiter.fl.us/616/Abacoa) was used as a cross-check reference and is linked, but its image was not traced. All geometry is county data.

## Behavior

- Mobile: one finger scrolls the page, never the map (dragging is off on touch devices); pinch and the +/- buttons zoom; a reset button re-frames. Labels are real `<a>` links; the guide links also appear as ordinary HTML under the map, and the sources are a `<details>` block, all server-rendered, so they work if the map never loads.
- Selected village: dark label with a star, thick dark outline and gold fill, plus a star on its link chip. Unlinked neighborhoods use dashed outlines and grey labels. Landmarks are dark squares with a dot at the true point and a leader line when a label is moved to avoid overlap.
- The Leaflet stylesheet is imported by the lazy wrapper (not the dynamic canvas); the dynamic import did not emit it in dev.

## Checks

Passed (local dev, 390 px for all 12 pages; also 1280 px for hub, Valencia, Dakota):
- Correct map, heading, placement and selected village on each of the 12 pages.
- No horizontal overflow; one-finger drag disabled on touch; map loads from a hash landing (`#abacoa-map`).
- Journey: hub map, Valencia label link, Valencia village map, "View all Abacoa villages", back at the hub map.
- Listings and the zero-inventory message still render (Valencia).
- Guide links, source list and pin notes present in the server HTML without JavaScript.
- `npm test`: 185 of 186 pass (12 new tests in `src/lib/abacoaMap.test.ts`); the one failure is the existing `the extractor finds article bodies`. `tsc` shows only the two existing `RouteContext` errors. ESLint clean on the changed files.

NOT CHECKED:
- Production build and deployed behavior (checked in `next dev` only).
- Real touch gestures and screen-reader or keyboard-only traversal beyond confirming links are focusable anchors.
- Map load time, CLS and other Core Web Vitals.
- Tile loading under OpenStreetMap's rate limits at production traffic.
- 320 px and 768 px widths.
- Search Console or any ranking effect.
