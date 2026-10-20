// Photos supplied by Discover The Palm Beaches (DTPB), used on blog posts only.
//
// Everything lives in discoverPhotos.json: each photo carries its own `credit`, so the
// credit travels with the image wherever it is placed. Nothing here edits articles.ts;
// a blog post picks up its photos at render time, by slug:
//   - `heroPlacements` swaps a post's hero (and its mobile crop, for editorial heroes)
//   - `galleries` adds a `::: gallery` block after a named "## " section, which <Prose />
//     already renders with the caption and the credit line underneath each photo.
//
// The credit line is attribution only. It must never suggest affiliation with, or
// endorsement by, DTPB, a venue or a photographer. Usage is limited to blog posts that
// promote The Palm Beaches (their Brandfolder terms: promotion of the destination,
// no commercial resale, no paid ads) -- do not wire these into city, community,
// listing or any IDX page.

import data from './discoverPhotos.json'
import type { Article } from './articles'
import { SITE_URL } from './site'

type Photo = { src: string; width: number; height: number; alt: string; caption: string; credit: string; source: string }
type Hero = Photo & { mobile?: { src: string; width: number; height: number } }
type Gallery = { afterSection: string; photos: string[] }

const photos = data.photos as Record<string, Photo>
const heroes = data.heroes as Record<string, Hero>
const galleries = data.galleries as Record<string, Gallery[]>
const heroPlacements = data.heroPlacements as Record<string, string>

const heading = (s: string) => s.replace(/\s+/g, ' ').trim()

// Markdown line for <Prose />: ![alt](src "caption || credit"). The credit is read from the
// photo's own record, so a placement can never render without one.
function imageLine(id: string): string {
  const p = photos[id]
  if (!p || !p.credit) throw new Error(`discoverPhotos: "${id}" is missing or has no credit`)
  return `![${p.alt}](${p.src} "${p.caption} || ${p.credit}")`
}

function insertGalleries(slug: string, body: string, placements: Gallery[]): string {
  const lines = body.split('\n')
  const inserts: Array<{ at: number; block: string[] }> = []
  for (const g of placements) {
    const start = lines.findIndex((l) => l.startsWith('## ') && heading(l.slice(3)).startsWith(heading(g.afterSection)))
    if (start < 0) throw new Error(`discoverPhotos: section "${g.afterSection}" not found in ${slug}`)
    let end = lines.findIndex((l, i) => i > start && l.startsWith('## '))
    if (end < 0) end = lines.length
    inserts.push({ at: end, block: ['', '::: gallery', ...g.photos.map(imageLine), ':::', ''] })
  }
  // Bottom-up, so earlier insertion points stay valid.
  for (const { at, block } of inserts.sort((a, b) => b.at - a.at)) lines.splice(at, 0, ...block)
  return lines.join('\n')
}

/** Returns the article with its DTPB hero and/or galleries applied. Unlisted slugs pass through untouched. */
export function withDiscoverPhotos(article: Article | undefined): Article | undefined {
  if (!article) return article
  const heroId = heroPlacements[article.slug]
  const gal = galleries[article.slug]
  if (!heroId && !gal) return article
  let out: Article = { ...article }
  if (heroId) {
    const h = heroes[heroId]
    if (!h || !h.credit) throw new Error(`discoverPhotos: hero "${heroId}" is missing or has no credit`)
    out = {
      ...out,
      heroImage: h.src,
      heroImageWidth: h.width,
      heroImageHeight: h.height,
      heroImageAlt: h.alt,
      heroImageCaption: h.caption,
      heroImageCredit: h.credit,
      heroImagePosition: undefined,
      editorial: out.editorial && h.mobile ? { ...out.editorial, mobileImage: h.mobile } : out.editorial,
    }
  }
  if (gal) out = { ...out, body: insertGalleries(article.slug, out.body, gal) }
  return out
}

/** Absolute image URLs for a post's DTPB photos, for the image sitemap. */
export function discoverImageUrls(slug: string): string[] {
  const ids = new Set<string>()
  for (const g of galleries[slug] ?? []) g.photos.forEach((i) => ids.add(i))
  const srcs = [...ids].map((i) => photos[i]?.src)
  const hero = heroPlacements[slug] ? heroes[heroPlacements[slug]]?.src : undefined
  return [hero, ...srcs].filter((s): s is string => Boolean(s)).map((s) => encodeURI(`${SITE_URL}${s}`))
}
