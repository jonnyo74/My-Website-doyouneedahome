// Run:  npm test
// Integrity checks for the Tequesta comparison data: every community states its
// jurisdiction, links only to pages that exist, and the selector logic is sound.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { COMMUNITIES, FIT_TAGS, matchCommunities, partialMatches } from '../src/lib/nearbyCommunities.ts'

const articles = readFileSync(new URL('../src/lib/articles.ts', import.meta.url), 'utf8')
const communities = readFileSync(new URL('../src/lib/communities.ts', import.meta.url), 'utf8')

test('every community is complete and links to existing pages', () => {
  const ids = new Set()
  for (const c of COMMUNITIES) {
    assert.ok(!ids.has(c.id))
    ids.add(c.id)
    for (const k of ['name', 'jurisdiction', 'housing', 'water', 'character', 'assoc', 'costs', 'convenience', 'verify']) {
      assert.ok(c[k] && c[k].length > 5, `${c.id}.${k}`)
    }
    if (c.guideHref) assert.ok(communities.includes(`slug: '${c.guideHref.replace('/communities/', '')}'`), `${c.id} guide page missing`)
    if (c.compareHref) {
      const slug = c.compareHref.replace('/blog/', '')
      assert.ok(articles.includes(`slug: '${slug}'`) || articles.includes(`slug: "${slug}"`), `${c.id} compare page missing`)
    }
    for (const [tag, why] of Object.entries(c.tags)) {
      assert.ok(FIT_TAGS.some((t) => t.key === tag), `${c.id} has unknown tag ${tag}`)
      assert.ok(why.length > 10)
    }
  }
})

test('municipal status is stated plainly where it is easy to get wrong', () => {
  const by = Object.fromEntries(COMMUNITIES.map((c) => [c.id, c]))
  assert.match(by['hobe-sound'].jurisdiction, /Unincorporated.*not a municipality/)
  assert.match(by['palm-city'].jurisdiction, /Unincorporated.*not a municipality/)
  assert.match(by['jupiter-island'].jurisdiction, /Martin County/)
  assert.match(by['jupiter-island'].jurisdiction, /Separate from Jupiter Inlet Colony/)
  assert.match(by['jupiter-inlet-colony'].jurisdiction, /Palm Beach County/)
  assert.match(by['jupiter-inlet-colony'].jurisdiction, /Separate from Jupiter Island/)
  assert.match(by.tequesta.jurisdiction, /Incorporated Village/)
})

test('no prices, drive times or rankings appear in the data', () => {
  const blob = JSON.stringify(COMMUNITIES.map(({ guideHref, compareHref, ...text }) => text))
  assert.ok(!/\$\s?\d/.test(blob), 'dollar figure found')
  assert.ok(!/\b\d+\s*(minutes?|mins?|miles?)\b/i.test(blob), 'drive time or distance found')
  assert.ok(!/\b(best|cheapest|most expensive|top-rated|#1)\b/i.test(blob), 'ranking language found')
})

test('selector returns communities that carry every selected tag', () => {
  assert.deepEqual(matchCommunities([]), [])
  assert.ok(matchCommunities(['acreage']).every((c) => c.tags.acreage))
  const both = matchCommunities(['beach', 'boating'])
  assert.ok(both.length > 0 && both.every((c) => c.tags.beach && c.tags.boating))
  assert.equal(matchCommunities(['acreage', 'beach']).length, 0)
  const partial = partialMatches(['acreage', 'beach'])
  assert.ok(partial.every((m) => m.count >= 1) && partial[0].count >= partial[partial.length - 1].count)
})
