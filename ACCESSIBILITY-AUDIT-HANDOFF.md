# Accessibility Audit — Handoff Notes

**Snapshot taken:** 2026-08-17, against `main` @ `ebba642` plus uncommitted working-tree changes.

## Why this file exists

Two Claude Code sessions were pointed at the same WCAG 2.2 AA brief in this working
tree at the same time. The other session had already rewritten `layout.tsx`,
`Header.tsx`, `Footer.tsx`, `Breadcrumbs.tsx`, `globals.css`, the homepage and all
five `templates/*` files before this audit finished reading the codebase. To avoid
clobbering that work, this session stopped editing and wrote up its findings instead.

**Everything below was read and verified in source.** Nothing here is speculative.
Contrast ratios were computed from the actual hex values in `globals.css` and the
Tailwind palette, using the WCAG relative-luminance formula.

Because the other session is still working, some of these may already be fixed by the
time you read this. **Each item carries a one-line check** — run it first; if it
returns nothing, that item is done.

---

## 1. The one that matters most: the brand blue fails AA

`--color-gold-500` is `#1E7FC2` ([globals.css:15](src/app/globals.css:15)). It is the
primary CTA fill across the entire site — "Contact Us" in the header, "Search Homes"
in the footer, every form submit button, every gradient CTA band.

| Pairing | Ratio | AA (normal text) |
|---|---|---|
| white on `#1E7FC2` | **4.31:1** | ✗ needs 4.5:1 |
| `#1E7FC2` on white | **4.31:1** | ✗ needs 4.5:1 |

Every one of those buttons is `text-sm font-semibold` — 14px, which is *not* WCAG
"large text" (large = 18.66px bold or 24px regular), so the 3:1 allowance does not
apply.

**Suggested fix** — one token, no visible brand shift:

```css
--color-gold-500: #1A79B8;   /* was #1E7FC2 */
```

That lands at **4.70:1** in both directions. `gold-600` (`#1561A0`, 6.46:1) and
`gold-700` (`#0E4A82`) already pass and need no change.

> This session made exactly this edit, then reverted it so `globals.css` stays
> single-owner. It is the only file this session touched, and it is now back to
> containing only the other session's work. Verify with
> `git diff --stat src/app/globals.css` → should be `34 ++++`, zero deletions.

Note also that the focus-ring comment added at [globals.css:49-53](src/app/globals.css:49)
cites "4.31:1 against white" as the justification for the outline colour. For a focus
indicator that is fine (SC 1.4.11 non-text contrast needs only 3:1), but if `gold-500`
is darkened the comment's numbers should be refreshed to 4.70:1 / 3.78:1.

**Check:** `grep -n "color-gold-500:" src/app/globals.css`

---

## 2. Remaining contrast failures

All verified against the surface they actually render on.

### 2a. `text-report-gold-dark` as body text on white — 3.06:1 ✗

`#B08F47` on white. Used for section eyebrows and bullet glyphs on both market-report
landing pages.

- [DualReportCTA.tsx:48](src/components/leadMagnet/DualReportCTA.tsx:48)
- [MarketReportLanding.tsx:153](src/components/leadMagnet/MarketReportLanding.tsx:153), `:192`, `:205`, `:246`, `:253`, `:330`
- [ReportLeadForm.tsx:294](src/components/leadMagnet/ReportLeadForm.tsx:294) — selected radio label text

**Do not just darken the token.** `--color-report-gold-dark` is also the *hover
background* for gold buttons that carry `text-navy-950`; navy on `#B08F47` is 5.79:1
and passes today. Darkening it to fix the text case breaks the button case.

Add a separate text-only token instead:

```css
--color-report-gold-text: #8A6D2F;   /* 4.87:1 on white */
```

…and swap `text-report-gold-dark` → `text-report-gold-text` only where it is text on
a light background. The `aria-hidden` bullet glyphs (`:167`, `:198`, `:211`) are
decorative and can stay as-is.

**Check:** `grep -rn "text-report-gold-dark" --include=*.tsx src/`

### 2b. `text-blue-100` / `text-blue-200` on the gold gradient CTAs — 3.03–3.53:1 ✗

The CTA bands are `bg-gradient-to-br from-gold-700 to-gold-500`, so the worst case is
the `gold-500` end.

| Class | On `gold-500` | Verdict |
|---|---|---|
| `text-blue-200` (`#bfdbfe`) | 3.03:1 | ✗ |
| `text-blue-100` (`#dbeafe`) | 3.53:1 | ✗ |
| `text-white` | 4.31:1 today, **4.70:1** if §1 lands | ✗ → ✓ |

Fourteen occurrences, all the same pattern (an uppercase eyebrow `<p>` and a body
`<p>`):

- [page.tsx:327](src/app/page.tsx:327), `:331`
- [buy/page.tsx:156](src/app/buy/page.tsx:156), `:160`
- [sell/page.tsx:158](src/app/sell/page.tsx:158), `:162`, `:178`
- [sell/[agent]/page.tsx:236](src/app/sell/[agent]/page.tsx:236)
- [canadahomeseller/page.tsx:207](src/app/canadahomeseller/page.tsx:207), `:211`
- [communities/[slug]/page.tsx:1037](src/app/communities/[slug]/page.tsx:1037), `:1043`
- [listings/[slug]/page.tsx:980](src/app/listings/[slug]/page.tsx:980), `:986`

**Fix:** `text-blue-100`/`text-blue-200` → `text-white`. Visually near-identical
(both are within a few percent of white), and it only clears AA once §1 lands — the
two fixes are coupled.

**Check:** `grep -rn "text-blue-100\|text-blue-200" --include=*.tsx src/`

### 2c. Form error text — 2.77:1 ✗

[ReportLeadForm.tsx:84](src/components/leadMagnet/ReportLeadForm.tsx:84) hardcodes
`text-red-400` (`#f87171`) for *both* tones. On the white/light form variant that is
2.77:1. On the navy modal it is 6.41:1 and fine.

[ReportLeadForm.tsx:330](src/components/leadMagnet/ReportLeadForm.tsx:330) has the
same problem for the server-error message.

**Fix:** make it tone-aware — `dark ? 'text-red-300' : 'text-red-600'`
(`#dc2626` = 4.83:1 on white). `SellerValuationForm.tsx` already uses `text-red-600`
correctly, so this is just bringing the report form in line with it.

**Check:** `grep -rn "text-red-400" --include=*.tsx src/`

### 2d. `text-slate-400` on light backgrounds — 2.56:1 ✗

`#94a3b8` on white. Note `slate-400` is *correct* on the navy footer (6.91:1) and on
`bg-gray-900` in `CityHub` (6.92:1) — only the light-background uses are broken.
`text-slate-500` (`#64748b`, 4.76:1 on white) is the drop-in fix.

The other session has already swept several of these. Survivors as of this snapshot
include [page.tsx:182](src/app/page.tsx:182) ("Explore communities →"),
[buy/page.tsx:146](src/app/buy/page.tsx:146) (city region labels), and a run inside
[listings/[slug]/page.tsx](src/app/listings/[slug]/page.tsx) at `:343`, `:348`, `:427`,
`:515`, `:601`, `:607`, `:893`, `:947`, `:1041`.

**Check:**
```bash
grep -rn "text-slate-400\|text-gray-400" --include=*.tsx src/
```
Then hand-filter: keep the hits in `Footer.tsx` and `CityHub.tsx:87` (dark
backgrounds), fix the rest.

---

## 3. Motion — `ListingCard` keeps animating under `prefers-reduced-motion`

[ListingCard.tsx:29](src/components/ListingCard.tsx:29) runs a `setInterval` that
crossfades between up to three photos on every listing card, on the homepage and
`/sell`.

Line 51 adds `motion-reduce:transition-none`, which removes the *fade* — but the
interval still fires and the images still hard-swap. A reduced-motion user gets a
photo that jumps abruptly every few seconds, which is arguably worse than the
crossfade. This is **SC 2.2.2 Pause, Stop, Hide** (auto-updating content lasting more
than five seconds, presented in parallel with other content).

**Fix:** gate the interval itself, not just the CSS.

```js
useEffect(() => {
  if (photos.length <= 1) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const id = setInterval(() => setActive((i) => (i + 1) % photos.length), intervalMs)
  return () => clearInterval(id)
}, [photos.length, intervalMs])
```

Same file, separate issue: all three photos sit in the DOM simultaneously, each with
its own `alt`, inside a single `<Link>`. A screen reader reads the card's accessible
name as three photo descriptions plus the address. Give index `0` the real alt and
`alt=""` to the rest.

**Check:** `grep -n "matchMedia" src/components/ListingCard.tsx` — no output means unfixed.

---

## 4. `BlogRegionTabs` — tabs with no tab semantics

[BlogRegionTabs.tsx](src/components/BlogRegionTabs.tsx) renders six region buttons
that swap the panel below them. They are plain `<button>`s: no `role="tablist"`,
`role="tab"`, `role="tabpanel"`, no `aria-selected`, no `aria-controls`, and no
arrow-key navigation. A screen-reader user gets six unlabelled buttons with no
indication that one is active or that they control the region below.

This is the only genuine tab widget on the site. The APG tabs pattern applies:
roles + `aria-selected` + roving `tabIndex` + Left/Right arrow keys + Home/End.

**Check:** `grep -n "role=" src/components/BlogRegionTabs.tsx` — no output means unfixed.

---

## 5. Star ratings are invisible to screen readers

Both testimonial surfaces render five `<svg aria-hidden="true">` stars with **no text
equivalent anywhere**. The rating is real information and it is currently conveyed to
sighted users only — SC 1.1.1.

- [testimonials/page.tsx:158](src/app/testimonials/page.tsx:158) — ~60 review cards
- [page.tsx:302](src/app/page.tsx:302) — homepage testimonial cards

**Fix:** keep the SVGs hidden, add one visually-hidden line per card:

```jsx
<span className="sr-only">Rated 5 out of 5 stars.</span>
```

Same file, second issue: each review card repeats a small agent thumbnail with
`alt={name}` ([testimonials/page.tsx:610](src/app/testimonials/page.tsx:610)). Across
both agents that is ~60 images all announcing "Christine Dekant" / "John Oliver" —
pure noise, since the agent is already named in the section heading above. Should be
`alt=""`.

**Check:** `grep -n "sr-only" src/app/testimonials/page.tsx`

---

## 6. Alt text that needs a human

### Numbered gallery alts — still live

[communities/[slug]/page.tsx:438](src/app/communities/[slug]/page.tsx:438), `:447`,
`:463`, `:478` produce alt text reading literally "Jupiter 1", "Jupiter 2",
"Jupiter 3"… The brief calls this out explicitly as the bad pattern.

The honest constraint: **nobody can write good alt text for these without seeing the
photos.** A machine-generated `— photo 2 of 6` suffix is a marginal improvement, not
a fix. Recommend either (a) an authoring pass where the photos are viewed and
described, or (b) treating the gallery as decorative (`alt=""`) under its existing
"{City} in Photos" heading, which is defensible and honest, and noting it as
outstanding.

Same shape in [CityHub.tsx:121](src/components/templates/CityHub.tsx:121)
(`… real estate — photo {i+1}`).

### Redundant alts inside links

Where an image sits inside a link whose text already names the thing, repeating the
name in `alt` makes the link's accessible name read twice. Prefer `alt=""`:

- [CommunityCard.tsx](src/components/CommunityCard.tsx) — `alt={community.name}`, and the `<h2>`
  directly below it is the same string
- [BlogRegionTabs.tsx](src/components/BlogRegionTabs.tsx) + [blog/page.tsx](src/app/blog/page.tsx) — `alt={post.h1}` on the card hero,
  with `post.h1` also rendered as the card title
- [blog/[slug]/page.tsx:133](src/app/blog/[slug]/page.tsx:133) — hero `alt={article.h1}`, with the `<h1>`
  overlaid on the same image
- [CommunityVideo.tsx](src/components/CommunityVideo.tsx) — poster `alt` duplicates the button's own `aria-label`

---

## 7. Forms — error handling and focus

Both lead forms validate correctly and wire `aria-invalid` / `aria-describedby` /
`role="alert"` properly. Two gaps:

**Focus does not move to the first invalid field.** `handleSubmit` in
[ReportLeadForm.tsx:111](src/components/leadMagnet/ReportLeadForm.tsx:111) and
`validateStep2` in [SellerValuationForm.tsx:81](src/components/SellerValuationForm.tsx:81)
both `setErrors(...)` and `return`. A keyboard user pressing Enter on the submit
button gets no indication anything happened — focus stays on the button, and the
error text is above it, off-screen on a phone. The brief asks for this explicitly
("keyboard focus moves appropriately when errors occur").

**`SellerValuationForm` step transition is silent.** Step 1 → step 2 swaps the entire
form and the `<h2>` ([SellerValuationForm.tsx:162](src/components/SellerValuationForm.tsx:162)),
but focus stays on the now-removed button. Focus should move to the new heading
(`tabIndex={-1}` + `.focus()`), or the step change should be announced.

**Already handled, no action needed** — worth knowing so you don't redo it:
`MarketReportModal` is genuinely well built. Focus trap, Escape, return-focus via
`returnFocusRef`, `aria-modal`, `aria-labelledby`, labelled close button, body scroll
lock, and it deliberately skips the close button when choosing initial focus. Leave
it alone.

---

## 8. Third-party / vendor — cannot be fixed from this repo

Per the brief's Phase 20, these are **third-party issues requiring vendor review**,
not first-party defects:

| Vendor | Where | Status |
|---|---|---|
| **Ylopo IDX** (`search.doyouneedahome.com`) | `YlopoResultsWidget`, `YlopoMarketTrendsWidget`, `.YLOPO_searchWidget` on the homepage | Widgets are empty `<div>`s that Ylopo's script fills at runtime ([YlopoInit.tsx](src/components/YlopoInit.tsx) injects `widgets-1.0.0.js`). The rendered markup is entirely vendor-controlled and **its accessibility is unverified**. The search site itself is a separate Ylopo-hosted property, not in this repo. |
| **Leaflet / OpenStreetMap** | [TransportMap.tsx](src/components/TransportMap.tsx) | Loads Leaflet from unpkg CDN and builds markers as `divIcon` HTML. The map container has no accessible name and the marker glyphs (`✈`, `▶`, `◆`) carry meaning conveyed only by colour + shape. Fixable from our side: label the region and add a text list of the same hubs. |
| **YouTube** | [CommunityVideo.tsx](src/components/CommunityVideo.tsx) | Click-to-load facade is good practice. **Captions cannot be verified or authored from here** — flag for manual review on the YouTube channel. Do not fabricate captions. |
| **GreatSchools** | [GreatSchoolsCard.tsx](src/components/GreatSchoolsCard.tsx) | Outbound link only, no embed. No exposure. |

Do not claim any of these are accessible in the final report.

---

## 9. Things that are already fine — don't "fix" them

Verified good, listed so nobody burns time on them:

- `<html lang="en">` is set correctly ([layout.tsx:52](src/app/layout.tsx:52)).
- **No viewport override anywhere.** No `user-scalable=no`, no `maximum-scale`. Next's
  default `width=device-width, initial-scale=1` applies, so pinch-zoom works and
  SC 1.4.4 is satisfied. Confirmed by `grep -rn "user-scalable\|maximum-scale" src/ next.config.ts` → no hits.
- Every page has a unique `<title>` and `alternates.canonical`. Schema (BlogPosting,
  FAQPage, BreadcrumbList, VideoObject, RealEstateAgent) is intact and should stay.
- Listing photo galleries are plain `<a href={photo.src}>` links, not a JS lightbox —
  already keyboard-operable, no modal work needed
  ([listings/[slug]/page.tsx:388](src/app/listings/[slug]/page.tsx:388)).
- FAQ accordions use native `<details>`/`<summary>` — keyboard-accessible for free.
- Honeypot fields in both forms are correctly `aria-hidden` + `tabIndex={-1}`.
- Social icons in the footer already have `aria-label` via the `SocialLink` wrapper.
- `CitySearchButtons` already marks its magnifier icon `aria-hidden`.

One nit on the "Click any photo to view it full-size" copy at
[listings/[slug]/page.tsx:427](src/app/listings/[slug]/page.tsx:427) — mouse-specific
wording; "Select any photo" covers keyboard and touch too.

---

## 10. Tooling (Phase 21) — read this before installing anything

**`eslint-plugin-jsx-a11y@6.10.2` is already installed** as a transitive dependency of
`eslint-config-next`. It does not need adding to `package.json`; it just needs
enabling, because `core-web-vitals` only turns on a handful of its rules
(`alt-text`, `aria-props`, `aria-proptypes`, `aria-unsupported-elements`,
`role-has-required-aria-props`, `role-supports-aria-props`).

**Important — `npm run lint` already fails on `main`, before any accessibility work.**
Baseline measured at the start of this session:

| Rule | Count |
|---|---|
| `react/no-unescaped-entities` | 74 |
| `@typescript-eslint/no-explicit-any` | 14 |
| `@typescript-eslint/no-unused-vars` | 4 |
| `react-hooks/set-state-in-effect` | 4 |
| `@next/next/no-img-element` | 4 |
| `@next/next/no-html-link-for-pages` | 2 |
| **Total** | **102 (94 errors, 8 warnings)** |

None are accessibility-related. The 74 unescaped-entity errors are all apostrophes in
marketing copy. **Do not mass-fix these as part of the accessibility work** — it would
churn hundreds of lines of copy and bury the real changes in the diff. Report the
baseline as pre-existing and leave it.

`npx tsc --noEmit` passes clean (exit 0) — keep it that way.

For axe: rather than adding Playwright and a browser download to devDependencies,
inject `axe-core` from a CDN into the running dev server via the browser tools and
call `axe.run()` per template. Same results, zero dependency footprint, nothing
shipped to production.

---

## 11. Page templates worth testing, one per shape

The site has more routes than templates. Testing one of each covers everything:

| Template | Representative URL |
|---|---|
| Homepage | `/` |
| City hub (flat) | `/communities/jupiter` |
| Legacy hub (catch-all, `noindex`) | `/jupiter` |
| Blog index (tabs) | `/blog` |
| Blog article | any `/blog/[slug]` |
| Listing detail | any `/listings/[slug]` |
| Market-report landing (form) | `/palm-beach-county-condo-townhome-market-report` |
| Agent valuation (2-step form) | `/sell/john-oliver` |
| Contact | `/contact` |
| Testimonials | `/testimonials` |

---

## 12. Still to build

`/accessibility` **does not exist yet**, but [Footer.tsx](src/components/Footer.tsx)
already links to it — so `main` currently ships a broken link in the global footer.
This should either land or the footer link should come out.

Contact details for the statement, taken from what is already in the codebase — do not
invent any others:

- **Business:** DO Homes Group at Premier Brokers International
- **Address:** 9123 North Military Trail, Suite 104, Palm Beach Gardens, FL 33410
- **Main phone:** (561) 783-7733 — `tel:+15617837733`
- **Email:** info@doyouneedahome.com

Per the brief: state a WCAG 2.2 Level AA *goal*, acknowledge accessibility as ongoing,
tell users how to report a barrier (asking for the page URL and a description of the
problem), and offer information by an alternative method where reasonably possible.
**Do not claim "100% ADA compliant"** or guarantee conformance — particularly given
the unverified Ylopo IDX surface in §8.

Add `/accessibility` to [sitemap.ts](src/app/sitemap.ts) at low priority (`0.3`,
`yearly`) alongside `/privacy-policy`.
