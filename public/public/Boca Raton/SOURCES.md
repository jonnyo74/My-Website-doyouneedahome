# Boca Raton imagery (`public/public/Boca Raton/`) — provenance

This folder had no `SOURCES.md` until 2026-09-13. It was written while auditing
`what-its-really-like-living-in-boca-raton-florida`, which uses two of these files.

⚠️ **This folder is off-convention.** Every other city lives at `public/images/<slug>/`. This
one is `public/public/Boca Raton/` — a nested `public`, and a space in the directory name, so
it serves from `/public/Boca%20Raton/`. Same shape as `public/public/Delray Beach/`; see that
folder's `SOURCES.md` for the fuller write-up. Two consequences that bite immediately:

- Markdown image syntax **cannot** take the raw space. Inline images in `articles.ts` must
  write `/public/Boca%20Raton/...`; `heroImage` strings take the **literal** space, because
  `next/image` encodes its own optimizer URL from that value.
- Anything that builds an **absolute** URL from `heroImage` — the `BlogPosting` JSON-LD
  `image`, the Open Graph `images` — must percent-encode it. Before 2026-09-13 both emitted a
  raw space. Fixed with the `absoluteImage()` helper in `src/app/blog/[slug]/page.tsx`.

## ⚠️ Provenance is NOT established for any file in this folder

The credits below exist only as bare strings in `src/lib/communities.ts` (`photoCredits`) and
`src/lib/articles.ts` (`heroImageCredit`). **There is no recorded Unsplash photo-page URL, no
CDN URL, no licence record, and no download date for any of them.** They predate this note and
nobody wrote down where they came from.

| File | Credit string in the repo | Status |
|---|---|---|
| `boca-mizner-park.jpg` | Photo by Alexander Donev / Unsplash | **Unverified** — no source URL on record |
| `boca-oceanfront.jpg` | Photo by Nigel Sarrag / Unsplash | **Unverified** — no source URL on record |
| `boca-mizner-plaza.jpg` | Photo by Valeriia Neganova / Unsplash | **Unverified** — no source URL on record |
| `boca-luxury-pool.jpg` | Photo by Brian Zajac / Unsplash | **Unverified** — no source URL on record |

**To fix:** find each on Unsplash by subject, confirm it is the same shot, and record the photo
page URL here alongside the credit. Until then, treat these as in-place legacy images — safe to
keep where they already run, but **do not** promote one into a new slot, a listing page, or an
OG image for a new page on the strength of the credit string alone.

## What the two images used by the "living in" article actually show

Subject descriptions below are from looking at the files, not from any caption:

- **`boca-mizner-park.jpg`** — portrait, 1365x2048. A pastel-pink Mediterranean-style building
  several storeys high with balconies and teal awnings, palm trees along a paved street, cars
  parked at the kerb. Used as the article hero, with alt text
  `Palm trees beside pastel Mediterranean-style buildings in Boca Raton`.
  **Note it is a portrait file in a full-bleed landscape hero**, so `object-cover` crops it
  hard top and bottom. A landscape frame would serve this slot better.
  The building is **not** identified as any specific named property, and nothing on record
  confirms the shot was taken in Boca Raton — the alt text describes the visual, and the
  article does not present it as documentary evidence of a place or a period.
- **`boca-oceanfront.jpg`** — landscape, 2048x1152. Aerial along a coastline: open water, surf
  line, beach, and a low-rise condominium line behind planting. Runs inline in the article,
  captioned by subject and credited to Nigel Sarrag per `communities.ts`.

**Captions must stay subject-based.** Do not caption either as a named neighbourhood, a
specific building, a historic Mizner structure, or as evidence of prices — the article's
earlier caption asserted "the highest prices in the city" off this aerial, which was removed on
2026-09-13 as an unsupported market claim.
