// Builds the North Palm Beach hero crops from the owner's source photographs.
//
// Each article gets three art-directed crops of one source photo: a 16:9 wide crop (social image and
// JSON-LD), a 4:5 panel for the desktop split hero, and a 3:2 crop for phones. The focal point is the
// crop region itself, chosen by eye per image, so nothing is centered by default. To change a hero,
// edit its regions here and re-run:  node scripts/npb-hero-crops.mjs
//
// A region is { left, top, width, height } in source pixels. Output sizes are fixed so the article
// records and the provenance manifest can state exact dimensions.

import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const DIR = 'public/images/north-palm-beach'
const SRC = {
  marina: `${DIR}/north-palm-007.jpg`, // 3024x3024
  clubhouse: `${DIR}/north-palm-006.jpg`, // 3024x3024
  golfBridge: `${DIR}/north-palm-005.jpg`, // 2592x1936
  waterPool: `${DIR}/north-palm-008.jpeg`, // 2048x1536
}
const SIZES = { hero: [1600, 900], panel: [960, 1200], mobile: [1200, 800] }

export const CROPS = {
  living: { src: 'marina', hero: [0, 1000, 3024, 1701], panel: [0, 760, 1800, 2250], mobile: [0, 900, 3024, 2016] },
  guide: { src: 'clubhouse', hero: [0, 600, 3024, 1701], panel: [557, 600, 1800, 2250], mobile: [0, 500, 3024, 2016] },
  neighborhoods: { src: 'waterPool', hero: [0, 330, 2048, 1152], panel: [480, 0, 1229, 1536], mobile: [0, 171, 2048, 1365] },
  things: { src: 'golfBridge', hero: [0, 230, 2592, 1458], panel: [450, 0, 1549, 1936], mobile: [0, 200, 2592, 1728] },
  who: { src: 'marina', hero: [1000, 1500, 2024, 1138], panel: [1200, 1000, 1600, 2000], mobile: [900, 1500, 2124, 1416] },
  proscons: { src: 'waterPool', hero: [600, 420, 1448, 815], panel: [750, 100, 1100, 1375], mobile: [500, 350, 1548, 1032] },
  cost: { src: 'clubhouse', hero: [300, 820, 2400, 1350], panel: [600, 650, 1700, 2125], mobile: [200, 650, 2600, 1733] },
  gems: { src: 'waterPool', hero: [0, 480, 1400, 787], panel: [0, 200, 960, 1200], mobile: [0, 420, 1500, 1000] },
  vs: { src: 'marina', hero: [0, 1050, 1700, 956], panel: [0, 1000, 1500, 1875], mobile: [0, 1000, 1800, 1200] },
  eat: { src: 'marina', hero: [1000, 1000, 2024, 1138], panel: [1224, 700, 1800, 2250], mobile: [1000, 900, 2024, 1349] },
}

mkdirSync(DIR, { recursive: true })
for (const [key, c] of Object.entries(CROPS)) {
  for (const variant of ['hero', 'panel', 'mobile']) {
    const [left, top, width, height] = c[variant]
    const [w, h] = SIZES[variant]
    const meta = await sharp(SRC[c.src]).metadata()
    if (left < 0 || top < 0 || left + width > meta.width || top + height > meta.height) throw new Error(`${key} ${variant}: region leaves the ${meta.width}x${meta.height} source`)
    if (Math.abs(width / height - w / h) > 0.012) throw new Error(`${key} ${variant}: region ratio ${(width / height).toFixed(3)} is not ${(w / h).toFixed(3)}, so it would distort`)
    await sharp(SRC[c.src]).rotate().extract({ left, top, width, height }).resize(w, h, { fit: 'fill' }).webp({ quality: 82 }).toFile(`${DIR}/npb-${key}-${variant}.webp`)
  }
}
console.log('wrote', Object.keys(CROPS).length * 3, 'crops')
