// Authorized live QA for the Abacoa listing scopes. Read-only: it asks the same
// public Ylopo endpoints the site's widget and autocomplete use, and prints a
// markdown matrix. Not part of `npm test` because inventory changes daily.
//
//   node scripts/abacoa-live-qa.mjs            prints the matrix
//   node scripts/abacoa-live-qa.mjs --json     prints raw rows as JSON
//
// For each route it compares the NEW verified scope with what the site asked
// before this change (the plain name, three keys, $400K floor, six cards).

import {
  ABACOA_SCOPES,
  inScope,
  isStrictActive,
  scopeFullSearchUrl,
  selectCards,
} from '../src/lib/abacoaScopes.ts'

const BASE = 'https://portal.ylopo.com/api/1.0/listings?partyWebsite=search.doyouneedahome.com&callback=cb&s='

async function listings(search) {
  const res = await fetch(BASE + encodeURIComponent(JSON.stringify(search)))
  const text = await res.text()
  return JSON.parse(text.slice(text.indexOf('(') + 1, text.lastIndexOf(')')))
}

async function allPages(locations) {
  const seen = new Map()
  for (let page = 1; page <= 12; page++) {
    const batch = await listings({ locations, limit: 10, page, sortBy: 'listdate' })
    if (!Array.isArray(batch) || batch.length === 0) break
    let fresh = 0
    for (const r of batch) if (!seen.has(r.mlsNumber)) (seen.set(r.mlsNumber, r), fresh++)
    if (!fresh) break
  }
  return [...seen.values()]
}

const oldLocations = (name, aliases = []) =>
  [name, ...aliases].flatMap((n) => [
    { community: n, city: 'Jupiter', state: 'FL' },
    { neighborhood: n, city: 'Jupiter', state: 'FL' },
    { subdivision: n, city: 'Jupiter', state: 'FL' },
  ])
const OLD_NAME = { abacoa: 'Abacoa', 'canterbury-place': 'Canterbury Place', 'charleston-court': 'Charleston Court' }
const OLD_ALIASES = { newhaven: ['Newhaven At Abacoa', 'Newhaven 7a', 'Newhaven 7a At Abacoa', 'Newhaven 7b Ph 2'] }
const title = (slug) => OLD_NAME[slug] ?? ABACOA_SCOPES[slug].name

const sub = (r) => (r.listingAttribute?.subdivisionInfo ?? []).join('/')
const line = (r) => `${r.address?.fullStreetAddress} (${r.mlsNumber}, ${r.listingStatus?.displayStatus}, ${sub(r)})`

const out = []
for (const [slug, scope] of Object.entries(ABACOA_SCOPES)) {
  const rows = await allPages(scope.locations)
  const oldRows = await listings({
    locations: oldLocations(title(slug), OLD_ALIASES[slug]),
    limit: 6,
    minPrice: 400000,
    sortBy: 'listdate',
  })
  const stray = rows.filter((r) => !inScope(r, scope))
  const cards = selectCards(rows, scope, 50)
  out.push({ slug, scope, rows, oldRows, stray, cards })
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(out.map((o) => ({ slug: o.slug, rows: o.rows.length, old: o.oldRows.length })), null, 2))
} else {
  console.log(`# Abacoa live QA, ${new Date().toISOString()}\n`)
  console.log('| Route | Locations | Rows now | Strict Active | Old widget rows | Out-of-scope rows | Positive example | Negative check |')
  console.log('| --- | ---: | ---: | ---: | ---: | ---: | --- | --- |')
  for (const o of out) {
    const pos = o.cards[0] ? line(o.cards[0]) : o.rows[0] ? `none Active; ${line(o.rows[0])}` : 'none (verified empty)'
    const neg = o.slug === 'abacoa' ? 'all villages ⊆ hub' : `siblings excluded: ${out.filter((x) => x.slug !== o.slug && x.slug !== 'abacoa').every((x) => x.rows.every((r) => !inScope(r, o.scope))) ? 'yes' : 'NO'}`
    console.log(`| ${o.slug} | ${o.scope.locations.length} | ${o.rows.length} | ${o.rows.filter(isStrictActive).length} | ${o.oldRows.length} | ${o.stray.length} | ${pos} | ${neg} |`)
  }
  const hub = new Set(out.find((o) => o.slug === 'abacoa').rows.map((r) => r.mlsNumber))
  const missing = out.filter((o) => o.slug !== 'abacoa').flatMap((o) => o.rows).filter((r) => !hub.has(r.mlsNumber))
  console.log(`\nVillage homes missing from the hub scope: ${missing.length}`)
  console.log('\nFull-search URLs (same locations as the widget):')
  for (const o of out) console.log(`- ${o.slug}: ${scopeFullSearchUrl(o.scope)}`)
}
