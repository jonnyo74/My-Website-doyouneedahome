// Post-build check: every DTPB photo that actually rendered carries its visible credit.
// Run after `next build`:  node scripts/check-discover-credits.mjs
//
// Reads the prerendered HTML, so it tests what a visitor gets, not what the data says.
//  1. each blog post in the manifest renders every gallery photo inside a <figure> with the credit
//  2. its hero (if any) renders the credit as visible text
//  3. no DTPB image appears on any other page (city, community, listing, other posts)
//  4. those posts carry no commercial blocks: no report offer, market trends, listings
//     widget, search/CTA block or contact-card hook (DTPB terms: no commercial gain)

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const data = JSON.parse(readFileSync('src/lib/discoverPhotos.json', 'utf8'))

// Text/markup that only the commercial blocks produce (the sitewide header's "Search Homes"
// link is chrome, so it is deliberately not listed).
const BANNED_ON_DTPB_POSTS = [
  '/images/reports/', // report-offer cover art
  'Send Me the Numbers',
  'Market Trends',
  'Homes for Sale in',
  'Single-Family Homes for Sale',
  'Explore Homes in',
  'Thinking about',
  'Want the numbers for your own search',
]
const ROOT = '.next/server/app'
if (!existsSync(ROOT)) {
  console.error('FAIL - no build output found. Run `npm run build` first.')
  process.exit(1)
}

const htmlFiles = []
;(function walk(d) {
  for (const n of readdirSync(d)) {
    const p = join(d, n)
    if (statSync(p).isDirectory()) walk(p)
    else if (p.endsWith('.html')) htmlFiles.push(p)
  }
})(ROOT)

const slugOf = (file) => file.replace(/\\/g, '/').match(/\/blog\/([^/]+)\.html$/)?.[1]
const placed = new Set([...Object.keys(data.galleries), ...Object.keys(data.heroPlacements)])
const problems = []
let checkedPosts = 0
let checkedImages = 0

for (const file of htmlFiles) {
  const raw = readFileSync(file, 'utf8')
  const slug = slugOf(file)
  const mentions = raw.includes('/images/discover/') || raw.includes('%2Fimages%2Fdiscover%2F')

  if (!slug || !placed.has(slug)) {
    if (mentions) problems.push(`${file}: DTPB image on a page that should not carry it`)
    continue
  }

  checkedPosts++
  const visible = raw.replace(/<script[\s\S]*?<\/script>/g, '')

  // 4. no commercial blocks on a post that carries DTPB photos
  for (const marker of BANNED_ON_DTPB_POSTS) {
    if (visible.includes(marker)) problems.push(`${slug}: commercial block still rendered (found "${marker}")`)
  }
  const figures = visible.match(/<figure[\s\S]*?<\/figure>/g) ?? []
  const withDiscover = figures.filter((f) => f.includes('/images/discover/'))

  // 1. gallery photos
  const expected = (data.galleries[slug] ?? []).flatMap((g) => g.photos)
  for (const id of expected) {
    const src = data.photos[id].src
    const fig = withDiscover.find((f) => f.includes(src))
    checkedImages++
    if (!fig) problems.push(`${slug}: gallery photo ${id} did not render`)
    else if (!fig.includes('<figcaption') || !fig.includes(data.photos[id].credit)) problems.push(`${slug}: ${id} rendered without its credit`)
    else if (!fig.includes(data.photos[id].caption.split(' ').slice(0, 3).join(' '))) problems.push(`${slug}: ${id} rendered without its caption`)
  }
  if (withDiscover.length !== expected.length) {
    problems.push(`${slug}: expected ${expected.length} gallery figures, found ${withDiscover.length}`)
  }

  // 2. hero
  const heroId = data.heroPlacements[slug]
  if (heroId) {
    checkedImages++
    const hero = data.heroes[heroId]
    const enc = encodeURIComponent(hero.src)
    if (!visible.includes(enc) && !visible.includes(hero.src)) problems.push(`${slug}: hero ${heroId} did not render`)
    const count = visible.split(hero.credit).length - 1
    if (count < expected.length + 1) problems.push(`${slug}: hero credit text not visible (credit appears ${count}x, need ${expected.length + 1})`)
  }
}

if (checkedPosts < placed.size) problems.push(`only ${checkedPosts} of ${placed.size} placed posts were found in the build output`)

if (problems.length) {
  console.error(`FAIL - ${problems.length} problem(s):\n  ` + problems.join('\n  '))
  process.exit(1)
}
console.log(`OK - ${checkedImages} DTPB images across ${checkedPosts} posts all render their credit; none appear anywhere else.`)
