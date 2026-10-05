// Run:  npm test
// Focused tests for the Palm Beach Gardens image-provenance guard. Uses Node's built-in
// test runner, so there is no new dependency.

import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import {
  extractPbgArticles,
  checkArticle,
  checkAll,
  checkManifest,
  rejection,
  KNOWN_UNVERIFIED_ARTICLES,
} from './lib/pbg-image-guard.mjs'

const manifest = JSON.parse(readFileSync('src/lib/pbgImageProvenance.json', 'utf8'))
const articles = extractPbgArticles(readFileSync('src/lib/articles.ts', 'utf8'))

const verified = '/images/palm-beach-gardens/macarthur-marker.webp'
const verifiedHero = '/images/palm-beach-gardens/gardens-mirasol-lake-reeds-hero.webp'
const fixture = (over = {}) => ({
  slug: 'fixture',
  hero: verifiedHero,
  heroW: 1600,
  heroH: 900,
  bodyImages: [verified],
  allImages: [verifiedHero, verified],
  ...over,
})

test('the parser finds every Palm Beach Gardens article', () => {
  assert.ok(articles.length >= 10, `parsed ${articles.length}`)
  assert.ok(articles.every((a) => a.hero), 'every article has a hero')
})

test('real articles: nothing outside the debt list has an unverified image', () => {
  const { failures, stale } = checkAll(articles, manifest)
  assert.deepEqual(failures, [])
  assert.deepEqual(stale, [])
})

test('the manifest covers every file in the folder and is well formed', () => {
  const files = readdirSync('public/images/palm-beach-gardens')
    .filter((f) => !f.endsWith('.md'))
    .map((f) => `/images/palm-beach-gardens/${f}`)
  assert.deepEqual(checkManifest(manifest, files), [])
})

test('a verified hero and gallery pass', () => {
  assert.deepEqual(checkArticle(fixture(), manifest), [])
})

test('the old hero pbg-002.jpg is rejected: a filename is not verification', () => {
  const a = fixture({ hero: '/images/palm-beach-gardens/pbg-002.jpg', allImages: ['/images/palm-beach-gardens/pbg-002.jpg', verified] })
  const v = checkArticle(a, manifest)
  assert.equal(v[0].kind, 'hero-unverified')
  assert.match(v[0].message, /Unverified/)
})

test('a North Palm Beach frame is rejected even though its file name says palm-beach-gardens', () => {
  const nonpbg = '/images/palm-beach-gardens/palm-beach-gardens-007.jpg'
  const v = checkArticle(fixture({ allImages: [verifiedHero, nonpbg], bodyImages: [nonpbg] }), manifest)
  assert.ok(v.some((x) => x.kind === 'image-unverified' && /North Palm Beach/.test(x.message)))
})

test('an image with no manifest entry is rejected', () => {
  const ghost = '/images/palm-beach-gardens/brand-new-photo.webp'
  const v = checkArticle(fixture({ allImages: [verifiedHero, ghost], bodyImages: [ghost] }), manifest)
  assert.ok(v.some((x) => /no entry/.test(x.message)))
})

test('a Palm Beach Gardens entry without a verification note is rejected', () => {
  const broken = { images: [{ path: verified, locality: 'Palm Beach Gardens', source: 'John', verification: '', width: 1, height: 1 }] }
  assert.match(rejection(broken.images[0]), /verification/)
})

test('the hero may not be reused in the gallery', () => {
  const v = checkArticle(fixture({ bodyImages: [verifiedHero, verified] }), manifest)
  assert.ok(v.some((x) => x.kind === 'hero-duplicated'))
})

test('declared hero dimensions must match the manifest', () => {
  const v = checkArticle(fixture({ heroW: 2048, heroH: 1152 }), manifest)
  assert.ok(v.some((x) => x.kind === 'hero-dimensions'))
})

test('an unverified article outside the debt list fails the build', () => {
  const bad = fixture({ slug: 'newly-added-article', hero: '/images/palm-beach-gardens/pbg-002.jpg', allImages: ['/images/palm-beach-gardens/pbg-002.jpg'], bodyImages: [] })
  const { failures } = checkAll([bad], manifest, [])
  assert.ok(failures.length > 0)
})

test('the debt list only shrinks: a clean listed article must be removed from it', () => {
  const clean = fixture({ slug: 'listed-but-fixed' })
  const { stale, failures } = checkAll([clean], manifest, ['listed-but-fixed'])
  assert.deepEqual(stale, ['listed-but-fixed'])
  assert.deepEqual(failures, [])
})

test('every article on the debt list really does still have a violation', () => {
  for (const slug of KNOWN_UNVERIFIED_ARTICLES) {
    const a = articles.find((x) => x.slug === slug)
    assert.ok(a, `${slug} exists`)
    assert.ok(checkArticle(a, manifest).length > 0, `${slug} is clean and should leave the debt list`)
  }
})

// ---------------------------------------------------------------------------
// Article 9, palm-beach-gardens-vs-nearby-cities: hero, gallery, and the preserved
// North Palm Beach photograph by Joey Love.
// ---------------------------------------------------------------------------

import { existsSync } from 'node:fs'

const VS = 'palm-beach-gardens-vs-nearby-cities'
const JOEY = '/images/palm-beach-gardens/palm-beach-gardens-002.jpg'
const BOAT = '/images/palm-beach-gardens/pbg-006.jpg'
const vsArticle = () => articles.find((a) => a.slug === VS)

test('article 9: the hero is a verified Palm Beach Gardens image and is not reused in the gallery', () => {
  const a = vsArticle()
  assert.ok(a, `${VS} exists`)
  assert.equal(rejection(manifest.images.find((e) => e.path === a.hero)), null)
  assert.ok(!a.bodyImages.includes(a.hero), 'hero is not in the body or gallery')
  assert.deepEqual(checkArticle(a, manifest), [])
})

test('article 9: the gallery holds 4 to 6 images and every one is verified Palm Beach Gardens', () => {
  const a = vsArticle()
  assert.ok(a.bodyImages.length >= 4 && a.bodyImages.length <= 6, `gallery has ${a.bodyImages.length}`)
  for (const img of a.bodyImages) {
    const e = manifest.images.find((x) => x.path === img)
    assert.equal(rejection(e), null, `${img} must be verified`)
    assert.equal(e.locality, 'Palm Beach Gardens')
  }
})

test("article 9: Joey Love's North Palm Beach photo and the unverified boat frame appear nowhere in it", () => {
  const a = vsArticle()
  assert.ok(!a.allImages.includes(JOEY), 'Joey Love frame is not referenced')
  assert.ok(!a.allImages.includes(BOAT), 'pbg-006 boat frame is not referenced')
})

test("Joey Love's photo is preserved and recorded as North Palm Beach, credited to him", () => {
  const e = manifest.images.find((x) => x.path === JOEY)
  assert.ok(e, 'it still has a manifest entry')
  assert.equal(e.locality, 'North Palm Beach')
  assert.equal(e.photographer, 'Joey Love')
  assert.match(e.note, /North Palm Beach/)
  assert.match(e.note, /Preserve/i)
  assert.ok(existsSync(`public${JOEY}`), 'the file is still on disk')
  assert.match(rejection(e), /North Palm Beach/, 'and the guard still rejects it for Palm Beach Gardens content')
})

test('the pre-rewrite article 9 (Joey Love hero + boat inline) would be blocked, and a filename cannot bypass it', () => {
  const old = fixture({
    slug: VS,
    hero: JOEY,
    heroW: null,
    heroH: null,
    bodyImages: [BOAT],
    allImages: [JOEY, BOAT],
  })
  const v = checkArticle(old, manifest)
  assert.ok(v.some((x) => x.kind === 'hero-unverified' && /North Palm Beach/.test(x.message)), 'hero blocked as North Palm Beach')
  assert.ok(v.some((x) => x.kind === 'image-unverified' && x.image === BOAT), 'boat frame blocked as unverified')
  // The file name says palm-beach-gardens; the manifest is what counts.
  assert.match(JOEY, /palm-beach-gardens-002/)
})

// ---------------------------------------------------------------------------
// Article 10, best-places-to-eat-drink-hang-out-in-palm-beach-gardens-florida,
// and the end of the debt list.
// ---------------------------------------------------------------------------

const EAT = 'best-places-to-eat-drink-hang-out-in-palm-beach-gardens-florida'
const OLD_EAT_HERO = '/images/palm-beach-gardens/palm-beach-gardens-004.jpg'
const eatArticle = () => articles.find((a) => a.slug === EAT)
// Frames considered for article 10 and rejected because their location is not established.
const CONSIDERED = ['pbg-001.jpg', 'pbg-003.jpg', 'pbg-005.jpg'].map((f) => `/images/palm-beach-gardens/${f}`)

test('the series is complete: every Palm Beach Gardens article is verified and the debt list is empty', () => {
  assert.deepEqual(KNOWN_UNVERIFIED_ARTICLES, [])
  assert.deepEqual(checkAll(articles, manifest).failures, [])
})

test('article 10: the hero is verified Palm Beach Gardens, and is not the old unverified fairway frame', () => {
  const a = eatArticle()
  assert.ok(a, `${EAT} exists`)
  assert.notEqual(a.hero, OLD_EAT_HERO)
  assert.equal(rejection(manifest.images.find((e) => e.path === a.hero)), null)
  assert.ok(!a.bodyImages.includes(a.hero), 'hero is not reused in the gallery')
  assert.deepEqual(checkArticle(a, manifest), [])
})

test('article 10: the gallery has 4 to 6 verified Palm Beach Gardens images', () => {
  const a = eatArticle()
  assert.ok(a.bodyImages.length >= 4 && a.bodyImages.length <= 6, `gallery has ${a.bodyImages.length}`)
  for (const img of a.bodyImages) {
    assert.equal(rejection(manifest.images.find((x) => x.path === img)), null, `${img} must be verified`)
  }
})

test('article 10: the old hero and the frames considered but unverified appear nowhere in it', () => {
  const a = eatArticle()
  for (const bad of [OLD_EAT_HERO, ...CONSIDERED]) {
    assert.ok(!a.allImages.includes(bad), `${bad} must not be referenced`)
    assert.notEqual(rejection(manifest.images.find((e) => e.path === bad)), null, `${bad} must stay rejected`)
  }
})

test('article 10: the old dark-fairway hero would be blocked', () => {
  const old = fixture({ slug: EAT, hero: OLD_EAT_HERO, heroW: null, heroH: null, bodyImages: [], allImages: [OLD_EAT_HERO] })
  const v = checkArticle(old, manifest)
  assert.equal(v[0].kind, 'hero-unverified')
  assert.match(v[0].message, /Unverified/)
})
