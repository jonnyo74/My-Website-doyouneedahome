// Asset-provenance guard for Palm Beach Gardens blog images.
//
// A file name proves nothing. A `pbg-` prefix, a `palm-beach-gardens-` prefix and a
// Palm Beach Gardens alt text have all sat on photos taken in North Palm Beach or of
// unidentifiable water. This module decides whether a Palm Beach Gardens article may
// render an image, using only the manifest in src/lib/pbgImageProvenance.json:
//
//   - the image must have a manifest entry,
//   - its locality must be exactly "Palm Beach Gardens",
//   - it must carry a source and a verification note,
//   - the hero must not also appear in the body or gallery,
//   - the dimensions the article declares must match the manifest.
//
// Pure functions only, so the test can feed them fixtures. File-system work (does the
// file exist, do the measured pixels match the manifest) lives in the audit script.

export const ALLOWED_LOCALITY = 'Palm Beach Gardens'
export const PBG_CITY_SLUG = 'palm-beach-gardens'

/**
 * Articles that still point at unverified images and have not been rebuilt yet.
 * This list may only shrink: an article that is clean must be removed from it
 * (see checkAll), so the debt can never quietly outlive the fix. Do not add to it.
 */
export const KNOWN_UNVERIFIED_ARTICLES = []

const IMAGE_PATH = /\/images\/[^'"\s)\\]+/g

/**
 * Splits articles.ts into Palm Beach Gardens article records. Parsed as text, like
 * scripts/audit-internal-links.mjs, because the file is a large TypeScript literal.
 */
export function extractArticles(src, citySlug = PBG_CITY_SLUG) {
  const text = src.replace(/\r\n/g, '\n')
  const blocks = text.split(/\n  \{\n/).slice(1)
  const out = []
  for (const raw of blocks) {
    const end = raw.search(/\n  \},?\n/)
    const block = end >= 0 ? raw.slice(0, end) : raw
    if (!new RegExp(`citySlug:\\s*['"]${citySlug}['"]`).test(block)) continue
    const slug = (block.match(/slug:\s*['"]([^'"]+)['"]/) ?? [])[1]
    if (!slug) continue
    const hero = (block.match(/heroImage:\s*['"]([^'"]+)['"]/) ?? [])[1] ?? null
    const heroW = Number((block.match(/heroImageWidth:\s*(\d+)/) ?? [])[1]) || null
    const heroH = Number((block.match(/heroImageHeight:\s*(\d+)/) ?? [])[1]) || null
    const bodyStart = block.indexOf('body: `')
    const bodyEnd = bodyStart >= 0 ? block.indexOf('`,\n', bodyStart + 7) : -1
    const body = bodyStart >= 0 ? block.slice(bodyStart, bodyEnd >= 0 ? bodyEnd : undefined) : ''
    const bodyImages = [...new Set(body.match(IMAGE_PATH) ?? [])]
    const allImages = [...new Set(block.match(IMAGE_PATH) ?? [])]
    out.push({ slug, hero, heroW, heroH, bodyImages, allImages })
  }
  return out
}

export const extractPbgArticles = (src) => extractArticles(src, PBG_CITY_SLUG)

function entryFor(manifest, p) {
  return manifest.images.find((e) => e.path === p)
}

/** Why a manifest entry cannot be used on a Palm Beach Gardens page, or null if it can. */
export function rejection(entry, locality = ALLOWED_LOCALITY) {
  if (!entry) return 'has no entry in the image provenance manifest'
  // Illustrative stock: allowed only as a labeled illustration, never as a place. It must carry a
  // credit, a licence, a source and a verification note, and it is never counted as the city.
  if (entry.stock === true) {
    if (!entry.credit || !String(entry.credit).trim()) return 'is stock but has no photographer credit'
    if (!entry.license || !String(entry.license).trim()) return 'is stock but has no licence'
    if (!entry.source || !String(entry.source).trim()) return 'has no source note'
    if (!entry.verification || !String(entry.verification).trim()) return 'has no verification note'
    return null
  }
  if (entry.locality !== locality) {
    return `is recorded as ${entry.locality}, not ${locality}${entry.rejectReason ? ` (${entry.rejectReason})` : ''}`
  }
  if (!entry.source || !String(entry.source).trim()) return 'has no source note'
  if (!entry.verification || !String(entry.verification).trim()) return 'has no verification note'
  return null
}

/** Violations for one article. Each is { slug, kind, image, message }. */
export function checkArticle(article, manifest) {
  const v = []
  const add = (kind, image, message) => v.push({ slug: article.slug, kind, image, message })

  if (!article.hero) {
    add('hero-missing', null, 'has no hero image')
  } else {
    const why = rejection(entryFor(manifest, article.hero), manifest.allowedLocality)
    if (why) add('hero-unverified', article.hero, `hero ${article.hero} ${why}`)
  }

  for (const img of article.allImages) {
    if (img === article.hero) continue
    const why = rejection(entryFor(manifest, img), manifest.allowedLocality)
    if (why) add('image-unverified', img, `${img} ${why}`)
  }

  if (article.hero && article.bodyImages.includes(article.hero)) {
    add('hero-duplicated', article.hero, `hero ${article.hero} is also used in the body or gallery`)
  }

  const heroEntry = article.hero ? entryFor(manifest, article.hero) : null
  if (heroEntry && article.heroW && article.heroH && (heroEntry.width !== article.heroW || heroEntry.height !== article.heroH)) {
    add(
      'hero-dimensions',
      article.hero,
      `heroImageWidth/Height ${article.heroW}x${article.heroH} does not match the manifest ${heroEntry.width}x${heroEntry.height}`,
    )
  }
  return v
}

/**
 * Every Palm Beach Gardens article, with the debt list applied.
 * failures: violations that must stop the build.
 * debt: violations on listed, not-yet-rebuilt articles (reported, not fatal).
 * stale: listed articles that are now clean and must be removed from the list.
 */
export function checkAll(articles, manifest, debtList = KNOWN_UNVERIFIED_ARTICLES) {
  const failures = []
  const debt = []
  const stale = []
  for (const a of articles) {
    const v = checkArticle(a, manifest)
    const listed = debtList.includes(a.slug)
    if (listed && v.length === 0) stale.push(a.slug)
    else if (listed) debt.push(...v)
    else failures.push(...v)
  }
  for (const slug of debtList) {
    if (!articles.some((a) => a.slug === slug)) stale.push(slug)
  }
  return { failures, debt, stale: [...new Set(stale)] }
}

/**
 * Images that pass only provisionally: the locality is recorded but the exact place is
 * not yet confirmed by the photographer. Reported on every audit, never silent.
 */
export function provisionalImages(articles, manifest) {
  const out = []
  for (const a of articles) {
    for (const img of a.allImages) {
      const e = entryFor(manifest, img)
      if (e && e.provisional) out.push({ slug: a.slug, image: img })
    }
  }
  return out
}

/** Manifest self-checks: shape, and every folder file covered. */
export function checkManifest(manifest, filesInFolder) {
  const problems = []
  const seen = new Set()
  for (const e of manifest.images) {
    if (seen.has(e.path)) problems.push(`duplicate manifest entry ${e.path}`)
    seen.add(e.path)
    if (!e.locality) problems.push(`${e.path} has no locality`)
    if (!Number.isInteger(e.width) || !Number.isInteger(e.height)) problems.push(`${e.path} has no dimensions`)
    if (e.stock === true && (!e.credit || !e.license || !e.source || !e.verification)) {
      problems.push(`${e.path} is stock but lacks a credit, licence, source or verification note`)
    }
    if (!e.stock && e.locality === manifest.allowedLocality && (!e.source || !e.verification || !e.landmark)) {
      problems.push(`${e.path} is marked ${manifest.allowedLocality} but lacks a landmark, source or verification note`)
    }
  }
  for (const f of filesInFolder) {
    if (!seen.has(f)) problems.push(`${f} is in the image folder but not in the manifest`)
  }
  return problems
}
