// Renders the hero graphic for /blog/boca-raton-vs-nearby-cities: a schematic of
// the places the article compares, placed by latitude, with the Palm Beach /
// Broward county line. It is deliberately not a map — no roads, no distances,
// no scale bar — and east–west spacing is exaggerated so labels fit.
//
//   node scripts/generate-boca-comparison-graphic.mjs
//
// Coordinates are the Wikipedia infobox points for each municipality (checked
// 2026-09-17). Coastline and county-line positions are approximate and only
// there to orient the reader. Output goes to public/images/boca-raton/ and is
// recorded in that folder's SOURCES.md.

import sharp from 'sharp'
import path from 'node:path'

const OUT = path.join(process.cwd(), 'public/images/boca-raton')

const NAVY = '#0B1929'
const OCEAN = '#10263B'
const INK = '#DCE5EE'
const MUTED = '#9FB3C8'
const BLUE = '#4AAEE8'
const SERIF = 'Georgia, serif'
const SANS = "'Segoe UI', Arial, sans-serif"

// side: which side of the dot the label sits on, chosen so no two collide.
const PLACES = [
  { name: 'Jupiter', lat: 26.925, lon: -80.127, side: 'left' },
  { name: 'Palm Beach Gardens', lat: 26.847, lon: -80.168, side: 'left' },
  { name: 'West Palm Beach', lat: 26.747, lon: -80.131, side: 'left' },
  { name: 'Ocean Ridge', lat: 26.528, lon: -80.048, side: 'right' },
  { name: 'Boynton Beach', lat: 26.51, lon: -80.087, side: 'left' },
  { name: 'Delray Beach', lat: 26.444, lon: -80.11, side: 'left' },
  { name: 'Highland Beach', lat: 26.409, lon: -80.064, side: 'right' },
  { name: 'Boca Raton', lat: 26.378, lon: -80.114, side: 'left', focus: true },
  { name: 'Parkland', lat: 26.319, lon: -80.239, side: 'left' },
  { name: 'Deerfield Beach', lat: 26.306, lon: -80.119, side: 'right' },
  { name: 'Coral Springs', lat: 26.271, lon: -80.259, side: 'left' },
  { name: 'Pompano Beach', lat: 26.235, lon: -80.126, side: 'left' },
  { name: 'Fort Lauderdale', lat: 26.141, lon: -80.144, side: 'left' },
]

// Approximate shoreline, north to south, extended past both ends of the frame.
const COAST = [
  [27.2, -80.09], [26.95, -80.072], [26.75, -80.034], [26.53, -80.04],
  [26.41, -80.058], [26.32, -80.071], [26.14, -80.098], [25.9, -80.115],
]
const COUNTY_LINE_LAT = 26.345

// Knocks the coast and county lines out from behind any label they cross.
const HALO = `stroke="${NAVY}" stroke-width="12" stroke-linejoin="round" paint-order="stroke"`

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

function render({ width, height, latTop, latBottom, yTop, yBottom, xWest, xEast, font, focusFont, notes }) {
  const lonWest = -80.259
  const lonEast = -80.048
  const y = (lat) => yTop + ((latTop - lat) / (latTop - latBottom)) * (yBottom - yTop)
  const x = (lon) => xWest + ((lon - lonWest) / (lonEast - lonWest)) * (xEast - xWest)

  // Smooth the coast with a Catmull-Rom spline, then close it off to the east.
  const pts = COAST.map(([la, lo]) => [x(lo), y(la)])
  let d = `M${pts[0][0]},${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const [p1, p2] = [pts[i], pts[i + 1]]
    const p3 = pts[i + 2] ?? p2
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`
  }
  const ocean = `${d} L${width + 10},${pts.at(-1)[1]} L${width + 10},${pts[0][1]} Z`

  const inFrame = PLACES.filter((p) => p.lat <= latTop + 0.001 && p.lat >= latBottom - 0.001)
  const cy = y(COUNTY_LINE_LAT)

  const places = inFrame
    .map((p) => {
      const px = x(p.lon)
      const py = y(p.lat)
      const size = p.focus ? focusFont : font
      const gap = p.focus ? 30 : 22
      const tx = p.side === 'left' ? px - gap : px + gap
      const anchor = p.side === 'left' ? 'end' : 'start'
      const dot = p.focus
        ? `<circle cx="${px}" cy="${py}" r="22" fill="none" stroke="${BLUE}" stroke-width="4"/><circle cx="${px}" cy="${py}" r="11" fill="${BLUE}"/>`
        : `<circle cx="${px}" cy="${py}" r="8" fill="${INK}"/>`
      return `${dot}<text ${HALO} x="${tx}" y="${py}" dominant-baseline="central" text-anchor="${anchor}" font-family="${SERIF}" font-size="${size}" font-weight="${p.focus ? 700 : 400}" fill="${p.focus ? '#FFFFFF' : INK}">${esc(p.name)}</text>`
    })
    .join('')

  const small = Math.round(font * 0.62)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${NAVY}"/>
  <path d="${ocean}" fill="${OCEAN}"/>
  <path d="${d}" fill="none" stroke="${MUTED}" stroke-width="3" stroke-opacity="0.55"/>
  <line x1="0" y1="${cy}" x2="${width}" y2="${cy}" stroke="${MUTED}" stroke-width="3" stroke-dasharray="14 12" stroke-opacity="0.8"/>
  <text ${HALO} x="${width - 36}" y="${cy - 18}" text-anchor="end" font-family="${SANS}" font-size="${small}" letter-spacing="3" fill="${MUTED}">PALM BEACH COUNTY</text>
  <text ${HALO} x="${width - 36}" y="${cy + 18 + small * 0.75}" text-anchor="end" font-family="${SANS}" font-size="${small}" letter-spacing="3" fill="${MUTED}">BROWARD COUNTY</text>
  ${places}
  ${notes}
</svg>`
}

async function write(svg, file, w, h) {
  await sharp(Buffer.from(svg)).resize(w, h).webp({ quality: 90 }).toFile(path.join(OUT, file))
  console.log(`wrote ${file} (${w}x${h})`)
}

// Desktop panel for the split hero — the full comparison set.
const PANEL = { width: 1200, height: 1500 }
function panelSvg() {
  const small = 24
  return render({
    ...PANEL,
    latTop: 26.925, latBottom: 26.141, yTop: 150, yBottom: 1360,
    xWest: 390, xEast: 880, font: 40, focusFont: 52,
    notes: `
    <text x="60" y="78" font-family="${SANS}" font-size="${small}" letter-spacing="4" fill="${BLUE}">THE PLACES THIS GUIDE COMPARES</text>
    <text x="60" y="560" font-family="${SERIF}" font-size="30" font-style="italic" fill="${MUTED}">Other towns in between are</text>
    <text x="60" y="600" font-family="${SERIF}" font-size="30" font-style="italic" fill="${MUTED}">not part of this comparison.</text>
    <text x="1140" y="78" text-anchor="end" font-family="${SANS}" font-size="${small}" letter-spacing="3" fill="${MUTED}">N ↑</text>
    <text ${HALO} x="60" y="1450" font-family="${SANS}" font-size="${small}" fill="${MUTED}">Schematic, not to scale. North–south order by latitude; east–west spacing exaggerated.</text>`,
  })
}

// Narrow screens: the stretch around Boca, with the rest named at the edges.
const MOBILE = { width: 1200, height: 800 }
function mobileSvg() {
  const small = 28
  return render({
    ...MOBILE,
    latTop: 26.444, latBottom: 26.141, yTop: 120, yBottom: 700,
    xWest: 420, xEast: 900, font: 42, focusFont: 54,
    notes: `
    <text ${HALO} x="48" y="54" font-family="${SANS}" font-size="${small}" fill="${MUTED}">↑ North: Boynton Beach, Ocean Ridge, West Palm Beach, Palm Beach Gardens, Jupiter</text>
    <text x="48" y="772" font-family="${SANS}" font-size="${small - 4}" fill="${MUTED}">Schematic, not to scale</text>`,
  })
}

// Open Graph / Twitter / BlogPosting image: title left, full panel right.
async function social() {
  const W = 2400
  const H = 1257
  const panelW = Math.round((H * PANEL.width) / PANEL.height)
  const panel = await sharp(Buffer.from(panelSvg())).resize(panelW, H).png().toBuffer()
  const text = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="${NAVY}"/>
    <text x="140" y="420" font-family="${SANS}" font-size="40" letter-spacing="7" fill="${BLUE}">SOUTH FLORIDA RELOCATION GUIDE</text>
    <text x="140" y="580" font-family="${SERIF}" font-size="120" font-weight="700" fill="#FFFFFF">Boca Raton vs</text>
    <text x="140" y="720" font-family="${SERIF}" font-size="120" font-weight="700" fill="#FFFFFF">Nearby Cities</text>
    <text x="140" y="840" font-family="${SERIF}" font-size="56" fill="${INK}">How to choose</text>
  </svg>`
  await sharp(Buffer.from(text))
    .composite([{ input: panel, left: W - panelW, top: 0 }])
    .webp({ quality: 90 })
    .toFile(path.join(OUT, 'boca-raton-nearby-cities-social.webp'))
  console.log(`wrote boca-raton-nearby-cities-social.webp (${W}x${H})`)
}

await write(panelSvg(), 'boca-raton-nearby-cities-panel.webp', PANEL.width, PANEL.height)
await write(mobileSvg(), 'boca-raton-nearby-cities-mobile.webp', MOBILE.width, MOBILE.height)
await social()
