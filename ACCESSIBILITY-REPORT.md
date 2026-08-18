# Accessibility Upgrade Report — DoYouNeedAHome.com

**Target standard:** WCAG 2.2 Level AA
**Date:** August 2026
**Stack:** Next.js 16.2.6 (App Router, Turbopack), React 19.2.4, Tailwind CSS v4
**Approach:** code-level remediation in shared components. No accessibility overlay, toolbar, or widget was installed, and none is recommended.

---

## 1. Executive Summary

**Before.** The site was in better shape than most real-estate sites: lead forms already had real `<label>` associations, `aria-invalid`, `aria-describedby`, `role="alert"` error text, and `autocomplete` attributes; the market-report modal already had a focus trap, Escape handling, and focus restoration. That good foundation meant the work could concentrate on genuine structural gaps rather than starting from zero.

Three problems were serious:

1. **The desktop "Sell" and "Communities" menus could not be opened without a mouse.** Both triggers were `<button>` elements with no click handler — the dropdowns opened purely on `onMouseEnter`. Every city link inside them (17 links, plus a 5-city nested Treasure Coast flyout) was unreachable by keyboard.
2. **Only the homepage had a `<main>` landmark.** Sixteen other page files rendered bare `<section>`s into a plain `<div>`, so most of the site had no main landmark and no bypass mechanism.
3. **No skip link anywhere**, so keyboard users tabbed through the full header on every page.

Alongside these, colour contrast failed in a number of places — including the primary brand-blue button, which put white text at 4.31:1, just under the AA floor.

**After.** All eleven representative page templates return **zero axe-core violations** across the WCAG 2.0/2.1/2.2 A and AA rule sets. The keyboard path through the site is complete, every page has one labelled `main` landmark and a working skip link, and every first-party text/background pair we could measure clears AA. The production build passes (312 static pages), TypeScript is clean, and `eslint-plugin-jsx-a11y` reports no violations.

The site looks essentially unchanged. The visual deltas are: three brand colour tokens nudged darker, a slightly deeper photo scrim on three hero templates, one hero eyebrow lightened, and a marginally darker gradient on the homepage's closing CTA.

---

## 2. Issues Found

### Critical

| # | Issue | Criterion |
|---|---|---|
| C1 | Desktop nav dropdowns (Sell, Communities, nested Treasure Coast) opened on hover only. Trigger `<button>`s had no `onClick`, no `aria-expanded`, no `aria-controls`. All contained links keyboard-unreachable. | 2.1.1 Keyboard, 4.1.2 Name/Role/Value |
| C2 | No `<main>` landmark on 16 of 17 page routes. | 1.3.1 Info & Relationships |
| C3 | No skip-navigation link anywhere on the site. | 2.4.1 Bypass Blocks |

### High

| # | Issue | Criterion |
|---|---|---|
| H1 | Primary brand button (`gold-500` #1E7FC2) rendered white text at **4.31:1**. Affects every "Search Homes" / "Contact Us" / form-submit button sitewide. | 1.4.3 Contrast |
| H2 | Radio groups in both lead forms hide the `<input>` with `.sr-only`, so a keyboard user focusing an option got **no visible focus indicator at all**. | 2.4.7 Focus Visible |
| H3 | Dark-variant form inputs signalled focus with a border-colour swap only — not a sufficient indicator. | 2.4.7, 1.4.11 |
| H4 | Failed form validation did not move focus. On a phone the error text rendered below the fold and the submit appeared to do nothing. | 3.3.1 Error Identification |
| H5 | `text-report-gold-dark` (#B08F47) used as body/eyebrow text on white at **3.05:1**, in 11 places across the market-report components. | 1.4.3 |
| H6 | Light-variant form error messages used `red-400` — **2.89:1** on white. | 1.4.3 |
| H7 | `brand-green-dark` (#2E9436) text at **3.88:1** on white. | 1.4.3 |
| H8 | Hero eyebrow text (`gold-400`) over the homepage hero photo fell below 4.5:1 across **~40%** of the area the line covers (measured per-pixel). | 1.4.3 |
| H9 | Hero text over community / listing / article photos: the `via-black/30` mid-scrim left accent and body text under 4.5:1 over bright frames (measured across 24–30 real site photos). | 1.4.3 |

### Medium

| # | Issue | Criterion |
|---|---|---|
| M1 | `text-slate-400` on white (**2.63:1**) used for credentials, disclaimers, photo credits, "(Optional)" hints, and nav group labels — ~30 instances. | 1.4.3 |
| M2 | `text-white/40` on navy (**3.90:1**) in the report CTAs, modal close button, and sticky bar — 7 instances, plus 2 photo credits over photos. | 1.4.3 |
| M3 | Footer legal text (`slate-500` on navy) at **3.80:1** — Equal Housing notice, disclaimer, copyright, Privacy Policy link. | 1.4.3 |
| M4 | `text-gray-400` on white in the GreatSchools card and legacy city template. | 1.4.3 |
| M5 | Blog region switcher looked like tabs but was six plain buttons — no `tablist`/`tab`/`tabpanel`, no arrow-key support, six separate tab stops. | 4.1.2, 2.1.1 |
| M6 | Six `<nav>` landmarks unlabelled; breadcrumb `/` separators exposed to screen readers; no `aria-current` on the current crumb or nav item. | 1.3.1, 2.4.8 |
| M7 | Listing cards auto-rotated photos on a timer with no reduced-motion exemption — the crossfade stood down but the images kept cutting. | 2.3.3 |
| M8 | No `prefers-reduced-motion` handling anywhere in the stylesheet. | 2.3.3 |
| M9 | Leaflet map markers are `divIcon`s with no text; Leaflet makes them keyboard-focusable, so each announced as a bare unnamed control. Map container unlabelled. | 4.1.2 |
| M10 | Legacy `/[city]/[category]/[community]` routes had **no page-specific `<title>`** — every page inherited the generic site title. | 2.4.2 Page Titled |
| M11 | Homepage CTA card links read only "Learn More" / "Search Listings" / "Request Valuation" with the heading as a sibling, not part of the link. Same pattern in two legacy templates. | 2.4.4 Link Purpose |
| M12 | Homepage agent phone/email links: 16–20px tall, ~22px apart — failing both the 24px target size and the 24px spacing exception. | 2.5.8 Target Size |

### Low

| # | Issue | Criterion |
|---|---|---|
| L1 | Rotating listing-card photos kept all three `<img>` elements in the DOM, so three alt strings landed in one link's accessible name. | 1.1.1 |
| L2 | The Premier Brokers logo appeared twice in the footer with identical alt text. | 1.1.1 |
| L3 | Leaflet's attribution links are distinguished from surrounding text by colour alone. | 1.4.1 Use of Colour |
| L4 | `role="dialog"` element carried a dead `onClick={e => e.stopPropagation()}` (the backdrop is a sibling, not an ancestor — nothing to stop). | 4.1.2 |
| L5 | Footer social icons were bare 18px targets. (Technically compliant via the spacing exception at 34px offset, but poor for limited motor control.) | 2.5.8 |
| L6 | Blog card type badge: `slate-500` on `slate-100` at **4.42:1**. | 1.4.3 |
| L7 | Legacy city gallery alt text used the word "photo" redundantly. | 1.1.1 |

---

## 3. Issues Fixed

Every item in section 2 was fixed, with these specifics worth calling out:

**Keyboard (C1).** The two hover-only dropdowns were replaced by a single `NavDropdown` component. Hover behaviour is byte-for-byte unchanged; click now toggles, `aria-expanded`/`aria-controls` reflect state, Escape closes and returns focus to the trigger, and tabbing out of the group closes it. Nested dropdowns call `stopPropagation` on a handled Escape so it closes one level at a time.

**Landmarks (C2).** Rather than adding `<main>` to seventeen files, the layout now owns it: `<main id="main-content" tabIndex={-1}>` wraps `{children}`, and the six components that previously declared their own `<main>` (the homepage and five legacy templates) render `<div>`/fragments instead. Every route now has exactly one `main`, by construction.

**Skip link (C3).** `sr-only focus:not-sr-only` anchor as the first element in `<body>`. `tabIndex={-1}` on `<main>` is what actually moves focus — without it the browser only scrolls.

**Colour (H1, H5–H9, M1–M4, L6).** Three tokens changed, all documented inline with the measured ratio and the reason:
- `--color-gold-500`: `#1E7FC2` → `#1A79B8` (white text 4.31 → **4.70**)
- `--color-brand-green-dark`: `#2E9436` → `#2A8630` (3.88 → **4.69**)
- new `--color-report-gold-text: #8A6E33` for text-on-white (3.05 → **4.83**); `report-gold-dark` is untouched so buttons keep their exact hover fill

**Text over photography (H8, H9).** This was measured, not guessed. A script composited each hero's actual Tailwind gradient stops over 24–30 real site photos and computed worst-case per-pixel contrast:

| Template | Before (worst / % of band under 4.5:1) | After |
|---|---|---|
| Homepage hero eyebrow | `gold-400` — 2.88 / 39.7% | `gold-200` — **5.14 / 0.00%** |
| Listing hero | `gold-300` — 2.90 / 0.7% | `gold-200` + `via-black/50` — **5.28 / 0.00%** |
| Community hero | `gold-400` — 1.73 / 10.8% | `gold-200` + `via-black/50` — **5.12 / 0.00%** |
| Article hero | `white/70` breadcrumb | `white/80` + `via-black/50` — **6.06 / 0.00%** |

The change is one gradient mid-stop (`via-black/30` → `via-black/50`) plus lighter accent text. The top of each photo is untouched.

**Forms (H2, H3, H4, H6).** `label:has(> input.sr-only:focus-visible)` puts the focus ring on the visible label when the hidden radio takes focus, with a `@supports not selector(:has(*))` fallback using `:focus-within`. Both dark and light inputs now get a 2px ring. `focusField()` moves focus to the first invalid control on failed submit, matching the radio group by `name` since it has no id of its own.

**Tabs (M5).** Full APG tab pattern: `tablist`/`tab`/`tabpanel`, roving `tabindex` (one tab stop instead of six), `aria-selected`, arrow keys with wrap, Home/End. The existing `?region=` deep-link behaviour is preserved.

**Motion (M7, M8).** Global `prefers-reduced-motion` block, plus `ListingCard` now checks `matchMedia` and freezes on the lead photo rather than hard-cutting between images.

---

## 4. Global Component Fixes

These changed one file and corrected many pages at once:

| Fix | Files touched | Pages corrected |
|---|---|---|
| `<main>` + skip link in `layout.tsx` | 1 (+6 unwrapped) | **every route** |
| `:focus-visible` baseline + radio-label ring + reduced-motion in `globals.css` | 1 | **every route** |
| Brand token contrast (`gold-500`, `brand-green-dark`, `report-gold-text`) | 1 | **every route** |
| `NavDropdown` keyboard support in `Header.tsx` | 1 | **every route** |
| Footer contrast, `nav` landmark, target sizes, Accessibility link | 1 | **every route** |
| `ThirdPartyFrameTitles` (names the FUB iframe) | 1 (new) | **every route** |
| `Breadcrumbs` label / `aria-current` / hidden separators | 1 | all legacy template routes |
| `ListingCard` reduced motion + alt de-duplication | 1 | homepage, listing pages, community pages |
| `ReportLeadForm` focus ring, error focus, error contrast | 1 | every market-report CTA and modal sitewide |
| `MarketReportModal` | 1 | sticky bar, exit intent, all report CTAs |
| `TransportMap` marker names | 1 | all community pages |
| `Prose` credit contrast | 1 | all 204 blog articles |

Only 8 of the 34 changed files are individual pages, and those were nearly all mechanical contrast substitutions.

---

## 5. WCAG 2.2 AA Areas Addressed

| Criterion | Status |
|---|---|
| 1.1.1 Non-text Content | Alt text audited; decorative images `alt=""`; duplicate/redundant alts removed |
| 1.3.1 Info and Relationships | One `main` per page; all `nav` landmarks labelled; legend/fieldset, lists, headings verified |
| 1.4.1 Use of Colour | Leaflet attribution links underlined |
| 1.4.3 Contrast (Minimum) | All first-party text ≥4.5:1 (≥3:1 large), verified by axe **and** per-pixel measurement over real photos |
| 1.4.4 Resize Text | Default viewport preserved (no `user-scalable=no`, no `maximum-scale`) |
| 1.4.10 Reflow | Verified at 320px: no horizontal scrollbar on homepage, blog, community, or listing templates |
| 1.4.11 Non-text Contrast | Focus indicator (`gold-500`) clears 3:1 on both white (4.70) and navy (3.87) |
| 2.1.1 Keyboard / 2.1.2 No Trap | Full keyboard path verified; modal traps intentionally and releases on Escape |
| 2.3.3 Animation from Interactions | Global reduced-motion block; card rotation freezes |
| 2.4.1 Bypass Blocks | Skip link, first focusable element on every page |
| 2.4.2 Page Titled | Unique titles verified; legacy routes given descriptive titles |
| 2.4.3 Focus Order | Roving tabindex on tabs; dropdown panels follow their trigger in DOM order |
| 2.4.4 Link Purpose | Ambiguous "Learn More"-style links given hidden context |
| 2.4.7 Focus Visible | Global `:focus-visible`; sr-only radios ring their label |
| 2.4.11 Focus Not Obscured (2.2) | Sticky header is 4.5rem; skip target and focus rings clear it |
| 2.5.8 Target Size (2.2) | Social icons 18→34px; agent contact links padded; all mobile menu targets ≥24px |
| 3.2.6 Consistent Help (2.2) | Contact route and phone number present in the global footer on every page |
| 3.3.1 / 3.3.3 Error Identification & Suggestion | Errors named, tied to fields, announced, and focused |
| 3.3.2 Labels or Instructions | Every control has a programmatic label; `autocomplete` on name/email/tel/street-address |
| 3.3.7 Redundant Entry (2.2) | Address captured in step 1 is carried into step 2, not re-asked |
| 4.1.2 Name, Role, Value | Dropdowns, accordions, tabs, dialog, icon buttons, map markers, third-party iframe all named |

---

## 6. Automated Testing Results

**Tooling added (dev dependencies only — nothing ships to production):**
- `eslint-plugin-jsx-a11y`, wired into `eslint.config.mjs` at its full recommended rule set. `eslint-config-next` already registers the plugin but enables only a handful of rules, so the config widens the rule set rather than re-declaring the plugin.
- `axe-core` for local page testing.

**`eslint-plugin-jsx-a11y`:** 7 findings initially → **0** after fixes. (Three were duplicates from a stale agent worktree, now excluded from linting.) The 50 remaining lint errors in `src` are all pre-existing and unrelated to accessibility — `@typescript-eslint/no-explicit-any`, `react/no-unescaped-entities`, `react-hooks/set-state-in-effect`, `@next/next/no-img-element`. None were introduced by this work and none were suppressed.

**axe-core (4.10.2 / 4.13.0), WCAG 2.0/2.1/2.2 A + AA tags:**

| Page | Template | Result |
|---|---|---|
| `/` | Homepage | **0 violations** |
| `/team` | Standard content | **0 violations** |
| `/accessibility` | New statement page | **0 violations** |
| `/blog` | Index + region tabs | **0 violations** |
| `/blog/what-its-really-like-living-in-jupiter-florida` | Article | **0 violations** |
| `/communities/jupiter` | Community (21,770px, Ylopo + Leaflet) | 0 first-party |
| `/listings/8804-skyward-street` | Listing detail | **0 violations** |
| `/sell/john` | Agent valuation form | **0 violations** |
| `/buy` | Buyer landing | **0 violations** |
| `/palm-beach-county-single-family-home-market-report` | Market-report landing | **0 violations** |
| `/jupiter/gated-communities` | Legacy category template | **0 violations** |

> **Methodological note.** axe resolves an element's background by hit-testing, so anything below the fold falls back to white and produces phantom contrast failures — the first homepage scan reported 20 "failures" in the footer that were actually white-on-navy misreads. All contrast scans were therefore run in viewport-sized slices with the page scrolled, and cross-checked with an independent auditor that composites background layers by walking the ancestor chain. The footer failures disappeared; the four real ones did not.

**Build:** `next build` compiles successfully and prerenders 312 static pages. `tsc --noEmit` is clean.

---

## 7. Manual Testing

All exercised against the running dev server.

**Keyboard navigation**
- Skip link is focusable index 0 on every page; `#main-content` resolves to `<main tabindex="-1">` and accepts focus.
- Desktop dropdowns: click toggles, `aria-expanded` tracks, 17 links reachable in the Communities panel and 5 in the nested Treasure Coast flyout. Escape on the nested panel closes only that level (`nested=false, outer=true`); a second Escape closes the outer.
- Mobile menu at 320px: hamburger 38×38 with a state-appropriate label, focus moves into the panel on open, three accordions with `aria-expanded`/`aria-controls`, Escape closes and **returns focus to the hamburger**, body scroll lock applied and released. All 8 targets ≥24px tall.
- Blog tabs: ArrowRight moved selection 0→1, roving tabindex followed (`0,-1,…` → `-1,0,…`), panel content changed, `?region=central-county` written. Home/End and wrap-around confirmed.
- No keyboard traps found.

**Focus behaviour**
- Modal: `aria-modal="true"`, `aria-labelledby` resolves to the visible heading, initial focus lands on the **first form field rather than the close button**, close button named "Close dialog", body scroll locked, Escape closes, **focus returns to the triggering button**, scroll restored.
- Focus-ring CSS verified present in the cascade. Note: `:focus` state could not be visually confirmed because the automation pane runs without system focus (`document.hasFocus() === false`), which makes `:focus` unmatchable by definition. The selector's structural half was verified to match all 5 radio labels, and `:has(> input:focus-visible)` support was confirmed.

**Form testing** (`/sell/john`, both steps)
- Empty step 1 → focus moves to the address field, `aria-invalid="true"`, `aria-describedby` points at the error, `role="alert"` announces "Please enter the property address."
- Empty step 2 → focus lands on the first invalid field (name); all three errors announced.
- Name + email filled, timeline missing → focus lands on the radio group's first `<input type="radio">`.
- Every control resolves to a label and carries an appropriate `autocomplete`.

**Zoom / responsive**
- 320px viewport (equivalent to 400% zoom at 1280px): `documentElement.scrollWidth === 320` with no horizontal scrollbar on homepage, blog, community, and listing templates. The only elements exceeding the viewport are Leaflet's own map tiles, clipped inside the map's `overflow-hidden` box — normal slippy-map behaviour that produces no page scroll.
- No `viewport` export exists, so Next.js emits the default `width=device-width, initial-scale=1`. Pinch zoom is not disabled.

**Not performed:** testing with an actual screen reader (NVDA/JAWS/VoiceOver), and visual screenshot confirmation — the automation browser pane was not compositing frames during this session, so focus-ring appearance and the post-change look of the heroes were verified by computed style and measurement rather than by eye. **A quick visual pass over the three hero templates and the homepage CTA is worth doing before deploy.**

---

## 8. Remaining First-Party Issues

| Priority | Item |
|---|---|
| Medium | **Legacy city gallery alt text is generic.** `CityHub.tsx` renders up to six photos with `alt="{City}, Florida"`. The redundant "photo N" wording is gone, but these need real per-image descriptions, which only someone who knows the photos can write. Affects noindex legacy routes only. |
| Medium | **Blog and community hero images use the article/community title as alt text**, duplicating the adjacent `<h1>`. Ideally these describe the photograph. |
| Low | "Click any photo to view it full-size" on listing pages is mouse-centric phrasing. The mechanism works with a keyboard (real `<a>` links); only the wording assumes a mouse. |
| Low | External links opening in new tabs carry no advance warning. This is WCAG **AAA** (3.2.5), not required at AA, but a visually-hidden "(opens in a new tab)" is a cheap improvement if applied consistently. |
| Low | `Prose` renders markdown tables without `<caption>` or scope attributes. Simple two-column tables read acceptably; complex ones would benefit. |
| Low | Two pre-existing `react-hooks/set-state-in-effect` errors (`Header.tsx:81`, `BlogRegionTabs.tsx:28`). Not accessibility defects, but they are lint failures. |
| Low | 48 other pre-existing lint errors (`no-explicit-any`, unescaped entities) predate this work. `npm run lint` does not currently exit clean, and did not before either. |

---

## 9. Third-Party Accessibility Concerns

The property search at **search.doyouneedahome.com is a Ylopo-hosted system**, not part of this repository. It appears on this site in two forms: outbound links (the "Search Homes" buttons), and injected widgets (`YLOPO_resultsWidget`, `YLOPO_marketTrendsWidget`, `YLOPO_searchWidget`) loaded from `search.doyouneedahome.com/build/js/widgets-1.0.0.js`. **We cannot verify or fix the accessibility of anything Ylopo renders, and this report makes no claim that it conforms.**

Confirmed issues inside vendor markup — **these require vendor review**:

| Vendor | Issue | Evidence |
|---|---|---|
| **Ylopo** (results widget) | 6 unnamed buttons per page. `<button class="card-icon">` containing only `aria-hidden` icon spans → announced as unlabelled controls. DOM path: `.YLOPO_resultsWidget > .YLOPO-widget > … > button.card-icon` | axe `button-name`, ×6 on `/communities/jupiter` |
| **Ylopo** (results widget) | "New" status badge: white on `rgb(228,90,74)` = **3.59:1**, below AA. | Independent contrast audit |
| **Ylopo** (market trends widget) | Selected trend control renders `rgb(26,58,95)` against a dark fill at **1.81:1**. | Independent contrast audit |
| **Ylopo** | The entire search experience at `search.doyouneedahome.com` is unaudited. | Out of repository scope |
| **Follow Up Boss** (`widgetbe.com/agent`) | Injects a **visible 310×186 fixed-position CTA iframe** onto `<body>` with `z-index: 2147483647` and no `title`. | axe `frame-title`, on every page |

**What we did about the Follow Up Boss iframe.** Because it lands in our DOM, we can name it even though we can't change what the vendor injects. `ThirdPartyFrameTitles.tsx` sets `title="Contact DO Homes Group"` on it via a single `MutationObserver` on `document.body`'s child list. Only the title attribute is touched — position, behaviour, and tracking are untouched, and the widget was confirmed still rendering at 310×186 afterwards. **The iframe's *contents* remain vendor-controlled and unaudited.**

**Leaflet / OpenStreetMap.** Map tiles and controls are library code loaded from unpkg. We fixed what we could reach from our own stylesheet (attribution links now underlined, markers given `title`/`alt`, container given an `aria-label`). Leaflet's internal controls are otherwise as shipped.

**Recommended vendor action:** send Ylopo the `button-name` and contrast findings above, and ask for their VPAT or accessibility conformance statement for the search portal. That portal is where buyers actually search listings, so its conformance matters more than any single page in this repository.

---

## 10. Files Modified

**New (3)**
- `src/app/accessibility/page.tsx` — the accessibility statement
- `src/components/ThirdPartyFrameTitles.tsx` — names the Follow Up Boss iframe
- `.claude/launch.json` — dev-server config for preview testing

**Global infrastructure (4)**
- `src/app/globals.css` — focus-visible baseline, radio-label focus ring (+ `:has()` fallback), reduced-motion block, Leaflet attribution underline, three brand token corrections
- `src/app/layout.tsx` — skip link, single `<main id="main-content" tabIndex={-1}>`, frame-titles mount
- `eslint.config.mjs` — jsx-a11y recommended rules, worktree ignore
- `package.json` — `eslint-plugin-jsx-a11y`, `axe-core` (both dev-only)

**Shared components (12)**
`Header.tsx` (new `NavDropdown`, nav labels, `aria-current`, mobile focus management) · `Footer.tsx` (contrast, `nav` landmark, target sizes, Accessibility link, decorative logo) · `Breadcrumbs.tsx` · `BlogRegionTabs.tsx` (full tab pattern) · `ListingCard.tsx` (reduced motion, alt de-dup) · `TransportMap.tsx` (marker names, legend list) · `Prose.tsx` · `GreatSchoolsCard.tsx` · `SellerValuationForm.tsx` (error focus) · `leadMagnet/ReportLeadForm.tsx` (focus ring, error focus, error contrast) · `leadMagnet/MarketReportModal.tsx` · `leadMagnet/{SiteLeadMagnets,MarketReportCTA,DualReportCTA,MarketReportLanding}.tsx`

**Templates (5)** — `CategoryPage`, `CityHub`, `CommunityPage`, `MasterHub`, `SubCommunity`: `<main>` unwrapped, link text, alt text, contrast.

**Pages (9)** — `page.tsx` (hero eyebrow, CTA gradient, link context, target sizes), `[...slug]/page.tsx` (descriptive titles, `noindex` preserved), `blog/page.tsx`, `blog/[slug]`, `buy`, `communities/[slug]`, `listings/[slug]`, `sell/[agent]`, `team`, `sitemap.ts`.

**Not modified:** `next.config.ts`, all API routes, all `src/lib/*` data modules, `robots.ts`. No redirects, canonicals, schema blocks, Open Graph data, meta descriptions, analytics, or tracking pixels were touched.

> `src/lib/communities.ts` also shows as modified in git status. That change came from a concurrent editing session, not from this work.

---

## 11. Recommended Ongoing Process

**Automatic, already in place.** `eslint-plugin-jsx-a11y` now runs with `npm run lint` and will fail on missing alt text, unlabelled controls, click handlers on non-interactive elements, invalid ARIA, and positive tabindex. Worth wiring into CI so regressions can't merge.

**Per-change checklist** — three things that catch most regressions:
1. **Tab through it.** If you can't reach or operate it with Tab / Enter / Space / Escape, it isn't done. This is what caught the biggest problem in this audit.
2. **Check contrast before picking a colour**, not after. New text on white needs ≥4.5:1 (≥3:1 at 24px, or 18.7px bold). The tokens in `globals.css` are already verified — prefer them over new one-off colours.
3. **New image? Write the alt text as you add it.** Describe the photo, not the filename. Decorative or repeated images get `alt=""`.

**Quarterly, ~30 minutes.** Run axe DevTools over the homepage, one community page, one listing, one article, and one form page. Use the browser extension rather than a script — it handles the below-the-fold background problem described in section 6 correctly.

**When photography changes.** Hero contrast depends on the actual photograph. The measurement script pattern used in this audit (composite the gradient over the image, compute worst-case per-pixel contrast) is worth re-running if the hero images or scrim values change.

**When a vendor script changes.** If Ylopo or Follow Up Boss ship an update, re-check that the `widgetCta` iframe is still the right selector in `ThirdPartyFrameTitles.tsx`, and re-run axe on a community page.

**Annually.** Re-read `/accessibility` and update the "Last updated" date. If a user reports a barrier, fix it and note it — a statement that reflects real, ongoing effort is worth considerably more than one that overclaims.
