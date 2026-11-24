# Country club community pages: playbook

Admirals Cove (`/communities/admirals-cove`, rebuilt 2026-11-24) is the template for
every club community on the site. This file says how it is put together, how to
build the next one, and how to keep them current.

Copy for these pages follows `EDITORIAL_STYLE_GUIDE.md` (voice, banned phrases,
sources, commentary, fair housing, SEO checks). This file covers structure and
fee policy.

## The fee policy (applies to every club page)

1. **No dollar figure for initiation, dues, capital contributions, minimums or
   association fees in page copy.** Explain the structure; send the reader to the
   fee-request form. `src/lib/admiralsCove.test.ts` fails the build if a `$` figure
   appears in the copy.
2. If a figure is ever published, it comes from a record in `src/lib/clubFees.ts`
   with a community, category, amounts, effective and expiry dates, source,
   verification date and status. `publishableFees()` returns a record only when it
   is `verified` and today falls inside its dates, so an expired or unverified
   schedule drops off the page without anyone editing it.
3. Never promise membership or availability. Never say every home carries the same
   obligation. The club decides; the buyer gets it in writing.
4. Current fee sheets are gathered when a buyer asks. Keep them out of the repo's
   published copy.

## How the page is built

| Layer | File | Changes when |
|---|---|---|
| Facts, copy, sources | `src/lib/admiralsCove.ts` | A source changes |
| County counts, sales, flood summary | `src/lib/admiralsCoveData.generated.json` | The build script is re-run |
| Static map | `public/images/admirals-cove/admirals-cove-map.svg` | The build script is re-run |
| Build script | `scripts/build-admirals-cove-data.mjs` | Never, unless the county changes a layer |
| Listing scopes and search links | `src/lib/admiralsCoveScope.ts` | The MLS files homes under a new name |
| Page | `src/components/AdmiralsCoveLanding.tsx` | Layout changes |
| Reusable blocks | `src/components/clubCommunity/*` | Shared by every club page |
| Fee registry | `src/lib/clubFees.ts` | A verified schedule is added |
| Inquiry types (CRM labels) | `src/lib/clubInquiry.ts` | A new kind of request is added |

Reusable blocks in `src/components/clubCommunity/`:

- `ClubQuickFacts` — sourced quick-facts table.
- `ClubMembershipCta` — the membership fee block and its two CTAs. Takes
  `community` and `slug`. Shows registry figures only if `publishableFees()`
  returns any.
- `ClubInquiry` + `InquiryLink` — one form per page. Any `InquiryLink` scrolls to it
  with the topic preselected. Works without script (it is an in-page link).
- `RecordedSales` — segment summary plus the full table, with a "historical" banner
  when the data is old and no median for thin segments.
- `SourceRegister` — sources, last-reviewed dates and "what we could not verify".
- `ReviewedBy` — the agent block, read from `src/lib/agents.ts`.
- `ui.ts` — shared class strings.

The listings block reuses `AbacoaListings` (loading / results / verified-empty /
feed-unavailable states) through a three-line wrapper, as the Colony page does.

## Lead capture

Every CTA posts through the existing `ContactForm` → `/api/contact-requests` →
Follow Up Boss path. Nothing new talks to the CRM. The form sends an
`inquiryType` **key**; the server maps it to labels from `clubInquiry.ts`, so
free text from a browser never becomes a tag.

A membership request from Admirals Cove arrives in Follow Up Boss with:

- Tags: `Website Inquiry`, `Community Inquiry`, `Membership Fee Request`,
  `Admirals Cove — Membership Information`, plus the phone-consent tag.
- Note: inquiry type, the community page, the message, the page URL, UTM
  parameters, referrer and the consent record.

`Membership Fee Request` is the same on every club page, so one automation can
key on it. The community-named tag is for filtering.

**Testing without creating a production lead:** run `next dev` with no
`FUB_API_KEY`. The route logs the lead and returns `{ ok: true }` without calling
Follow Up Boss. Do not test against production with a real address; if a
production test is ever needed, John should send it and delete the contact after.

## Building the next club page

1. Copy `scripts/build-admirals-cove-data.mjs`. Change the plat filter, the map
   window and the landmark tests. Run it and look at the map.
2. Copy `src/lib/admiralsCoveScope.ts`. Get every location from the Ylopo
   autocomplete, page the listings API, sweep the ZIP for strays, and test each
   filter before linking it. Unreliable filters become "ask us" cards, not links.
3. Copy `src/lib/admiralsCove.ts`. Replace every fact with one read from the
   club, the association or a public record on a stated date. Conflicts are shown
   as conflicts. Unverifiable items go in `NOT_VERIFIED`.
4. Copy `AdmiralsCoveLanding.tsx`, drop the sections that do not apply (no marina,
   no boating section) and keep the order.
5. Add the slug to the dedicated-template branches in
   `src/app/communities/[slug]/page.tsx` and set `metaTitle`, `metaDescription`
   and `dateModified` on the community entry.
6. Copy the test file. Keep the "no dollar figures in copy" test.

Candidates, in rough order of fit: Jonathan's Landing (golf + marina), Frenchman's
Creek (no page yet), Mirasol (already a guide; move its fee table into
`clubFees.ts`), The Bear's Club, The Loxahatchee Club, Trump National Jupiter,
BallenIsles, Ibis, Old Palm (no page yet).

## Maintenance

| What | How often | How |
|---|---|---|
| Recorded sales, parcel counts, map | Quarterly (Feb, May, Aug, Nov) | `node scripts/build-admirals-cove-data.mjs`, then `npm test`, then read the sales section |
| Listing scopes | With each data refresh, or if the widget looks thin | Re-run the autocomplete and ZIP sweep in the scope file's header; update the fixture |
| Membership categories, amenities, dock rules | When the club or association announces a change; otherwise each November, when the club year turns | Re-read the linked pages; update `admiralsCove.ts`; change `REVIEWED.facts` |
| Membership fee schedule | When a buyer asks | Get the current sheet from the club. Do not edit the page |
| Town projects | When one is approved, built or withdrawn | Town of Jupiter "Current Major Projects" |
| Bridge data | Annually | NOAA Coast Pilot 4, chapter 12 |
| Community facts (history, counts) | Annually | Re-read the club and association pages |
| Broken links | With the site's routine link audit | `npm run audit:links` covers internal links; external sources are listed in `SOURCES` |
| Technical SEO | During scheduled site audits | Title, description, canonical, JSON-LD, sitemap |

Rules:

- `REVIEWED.facts` changes only when the sources were actually re-read.
  `REVIEWED.records` is the date the build script last ran; it cannot be typed.
- Recorded sales older than 150 days are labeled historical automatically
  (`STALE_AFTER_DAYS`). Re-run the script before that.
- Do not update a fact without a source. Do not resolve a conflict between two
  official sources by choosing one; show both.

## Known limits of the county sales data

- One sale per parcel: a home that sold twice in the window shows once.
- The county marks a sale "qualified" some months after it records, so the newest
  months are thin. The page states the date of the latest qualified sale.
- No living area, days on market or list price. Price per square foot and
  list-to-sale ratios need an MLS export; the page says so instead of estimating.
