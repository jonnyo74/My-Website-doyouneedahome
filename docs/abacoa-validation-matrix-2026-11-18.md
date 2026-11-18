# Abacoa listing scope: validation matrix

Checked 2026-11-18 against the public Ylopo endpoints the site already uses
(`portal.ylopo.com` listings and autocomplete, partyWebsite `search.doyouneedahome.com`).
Inventory is time-sensitive: re-run `node scripts/abacoa-live-qa.mjs` for a current
copy of the first table. Unit tests use the pinned snapshot in
`scripts/fixtures/abacoa-ylopo-2026-11-18.json`, never the network.

Source of truth for every scope: `src/lib/abacoaScopes.ts`. The widget
(`AbacoaScopeWidget`), the "open the full search" link, the empty-state probe and
the alert request all read it, so they cannot disagree.

## What was wrong, as measured

| Finding in the audit | What the provider showed |
| --- | --- |
| Martinique and Windsor Park blank | No listing carries the bare names. Homes are filed as `Martinique At Abacoa 1` and `Windsor Park At Abacoa Pl` / `... No 3`. With those names: 1 and 3 active. |
| Hub vs full search differ | Locations are OR'd (a union returns exactly the union). The name-only hub query returned 25; the master scope is 41 to 42. Sixteen homes were invisible to it: nine village homes plus Somerset, Village at Abacoa, Cambridge and Greenwich. |
| $400K floor | Removed from this cluster only. Somerset and Village at Abacoa condos list at $280K to $500K. Sitewide search defaults are untouched. |
| Newhaven missed 198 Poinciana Drive | Filed as `Newhaven 07b Ph 01 At Abacoa`, a phase the widget never asked for. `Newhaven 7b Ph 1` was missing too. Neither is a feed-timing problem. |
| Dakota showed Canterbury Place | It reused Canterbury Place's filter. Dakota at Abacoa is a 190-unit rental community on South Bismark Lane (Abacoa POA). Dakota Drive crosses Canterbury Place, Somerset and, per the POA, Martinique. |

## 12-route matrix

"Old" is what the page asked before this change (name plus aliases, three keys,
$400K floor, six cards). "Now" is the new scope with no floor. Rows are provider
rows across all pages; "Active" is strict `displayStatus == "Active"`.

| Route | Scope (provider entries, all pinned Jupiter, FL) | Old | Now | Active | Positive example | Negative example | Widget = full search | Alert |
| --- | --- | ---: | ---: | ---: | --- | --- | --- | --- |
| `/abacoa` | 43 entries: `Abacoa` community and neighborhood plus every village subdivision plus Somerset, Village at Abacoa, Cambridge, Greenwich, Island, San Palermo, Abacoa Pl 1 | 6 | 42 | 40 | 183 Edenberry Ave (Canterbury Place) | none outside Jupiter or off-list | yes (same locations) | "Request Abacoa listing alerts" |
| `/antigua` | 6: Antigua names plus `Abacoa Town Center 3` | 1 | 3 | 3 | 4106 Greenway Dr | any Mallory Creek home | yes | request form |
| `/canterbury-place` | 4: Canterbury Place neighborhood, community, subdivision | 3 | 3 | 3 | 599 Dakota Dr, 143 Killarney Ct | Somerset condo at 776 Dakota Dr | yes | request form |
| `/charleston-court` | 4: includes truncated `Charleston Court At Abaco` | 2 | 2 | 2 | 332 Legare Ct | Tuscany homes | yes | request form |
| `/dakota` | none, by design: a street guide | n/a | n/a | n/a | n/a | Canterbury Place homes no longer shown here | n/a | no feed; links to Canterbury Place and the hub |
| `/mallory-creek` | 10: phases `01`, `1`, `2`, `2 1`, `2 2` | 3 | 4 | 4 | 1421 Windley Key Way (phase `01`) | Martinique home | yes | request form |
| `/martinique` | 5: `Martinique At Abacoa` 1, 2, Pl 2 | 0 | 1 | 1 | 3277 E Community Dr | Martinique (Coconut Creek) filtered by city | yes | request form |
| `/newhaven` | 12: phases 7A, 7B Ph 1, 7B Ph 2, `07b Ph 01`, `New Haven` | 2 | 5 | 4 | 172 Satin Leaf Dr | Tuscany homes | yes | request form |
| `/osceola-woods` | 3 | 3 | 3 | 3 | 163 Apalachee Ln | Canterbury Place homes | yes | request form |
| `/tuscany` | 3: `... At Abacoa` and `... At Abacoa 2` only | 5 | 5 | 5 | 310 San Remo Dr | bare "Tuscany" lookalike | yes | request form |
| `/valencia` | 3: `... At Abacoa` and `Abacoa - Valencia` only | 1 | 1 | 0 | none Active | bare "Valencia" lookalike | yes | verified empty: "No active homes for sale in Valencia right now" |
| `/windsor-park` | 5: Pl, Pl No 1, Pl No 3, `Windsor Park Abacoa` | 0 | 3 | 3 | 2695 Lamarville Dr | Windsor Park (North Palm Beach) | yes | request form |

Sibling check across all ten villages: no listing appears under two villages, and
every village listing is inside the hub scope.

## Provider behavior learned (affects how to trust any number)

- Locations are OR'd. No fallback to nearby results was observed; the probe still
  treats any out-of-scope row as "cannot verify" and never claims a count then.
- The API returns 10 rows per page whatever `limit` says. `page` paginates;
  `offset` and `statuses` are ignored. Total counts above come from paging.
- **Identical queries are cached for a few minutes.** A brand-new Canterbury Place
  listing showed under `limit 9` while `limit 10` still returned the old answer.
  The probe is byte-identical to the widget's query so the two share one cache entry.
- Status: Ylopo files **Coming Soon** under `ylopoStatus: ACTIVE`, and the widget
  card labels it "New". There is no status filter the widget honors.

## Browser checks (local dev, real widths)

| Check | Result |
| --- | --- |
| H1 count, canonical, robots meta | 12 routes: one H1; canonical is the route; no robots meta |
| Structured data | BreadcrumbList on all 12; FAQPage on the 11 neighborhood pages, built from the same data as the visible FAQ |
| Sitemap, robots | 12 of 12 routes in `/sitemap.xml`; robots allows `/communities/`, blocks `/api/` and `/r/` |
| Overflow at 320, 390, 768 | No horizontal page overflow. 320 and 390: all 12 routes; 768: hub, Newhaven, Osceola Woods, Tuscany. `innerWidth` reported the emulated width each time. The comparison table scrolls inside its own focusable region. Not every route was loaded at every width. |
| Widget states | results (Martinique 1, Windsor Park 3, Mallory Creek 4, Newhaven 5, others), verified empty (Valencia), unavailable (provider requests blocked; first measured at about 22 s, then the widget wait was cut to 6 s and not re-timed) |
| Client navigation | Valencia (empty) to Mallory Creek: state reset to loading, then its own result. One Ylopo script copy after navigation. Fixed a duplicate-key warning from sibling `key` props. |
| Card links | Each photo link now has an address-based `aria-label`; the map image alt is empty; the unnamed map/photo button is labelled. Ylopo also appends the full location set to each card's detail link, so "back to results" keeps the scope. |
| Alert form | Opens inline with the exact scope pre-filled. **Not submitted**: it posts to Follow Up Boss. |

Not measured: field Core Web Vitals, mobile LCP, INP and CLS, and Search Console
coverage and Google's selected canonical. No speed or indexing claim is made.

## Tests

`npm test` runs 172 tests; 171 pass. The one failure, `the extractor finds article
bodies` in `scripts/content-integrity.test.mjs`, fails identically on the untouched
main working tree and is unrelated. The 43 new tests are in
`src/lib/abacoaScopes.test.ts` and cover: scope shape and Jupiter pin; hub covers
every village; no price floor; widget, full search and probe send the same
locations; every fixture listing in scope; no overlap between villages; sibling and
similar-name negatives (Coconut Creek, North Palm Beach, `Tuscany Isles`,
`Valencia Lakes`); multiple phases and spellings; condos and sub-$400K homes; status
and type exclusion; alias dedupe by MLS number; six-card limit applied after
filtering; confirmed zero, timeout, error, malformed and out-of-scope probe
outcomes; and alert scope. Component behavior (states, form, labels) was verified in
the browser, not by unit tests, because the repo has no DOM test harness.

`npx tsc --noEmit` shows only the two existing `RouteContext` errors in files this
change does not touch.

## Open items that need a person

1. **Coming Soon.** 198 Poinciana Drive (Newhaven) and 136 Santiago Drive (Valencia)
   are Coming Soon, not Active. Valencia shows the empty state with a Coming Soon
   note. Newhaven's card still shows 198 Poinciana as "New", because the widget
   cannot exclude it. Strict Active in the widget needs Ylopo to confirm a status
   filter, or a provider-managed saved search.
2. **Alerts are a request, not a registration.** No Ylopo saved-search or
   registration endpoint was verified for an exact scope, so "Request {community}
   listing alerts" goes through the existing contact flow (Follow Up Boss) with the
   scope in the message. Nothing claims a subscription was created.
3. **Martinique B26088730 (3416 W Community Dr).** Not in the Ylopo feed under any
   Martinique subdivision. Ask BeachesMLS for its status and IDX eligibility; the
   filter is not the cause.
4. **Antigua** relies on the shared plat `Abacoa Town Center 3`. Confirm it holds
   no other Town Center residential. Live/work eligibility is not filterable.
5. **Windsor Park `Pl No 2`** was not found in the provider; add it if the MLS uses it.
6. **Dakota Drive listings.** No reliable street-plus-Abacoa filter exists, so the
   page carries no feed. If a street filter is ever verified, add a labelled scope.
7. **Windsor Park, Mallory Creek, Martinique descriptions** still contain
   listing-derived facts (builders, years, amenities) from the October 2026 pass.
   Not re-verified here.

## Backlog: not published, no pages created

The POA lists Cambridge, San Palermo, Somerset, The Island at Abacoa, The Village at
Abacoa and Greenwich. None has a route; `src/lib/siteMap.json` lists `san-palermo`
as a planned sub-community with no page. For-sale inventory exists today for
Somerset (7), The Village at Abacoa condominiums (3, a 413-condo mixed-use building
per the POA), Cambridge (1) and Greenwich (1). The hub counts them; none is linked.
The Island and San Palermo have no active listings. Dakota at Abacoa and senior
living stay out of the for-sale inventory.

## Changed

`src/lib/abacoaScopes.ts` (new), `AbacoaScopeWidget.tsx` (new), `AbacoaListings.tsx`
(rewritten), `AbacoaLanding.tsx`, `AbacoaVillageLanding.tsx`, `abacoaVillages.ts`,
`communities.ts` (Abacoa and Dakota entries only), `MarketTrendsBlock.tsx` (optional
heading level), `ContactForm.tsx` (optional prefilled message), `[slug]/page.tsx`
(hub metadata), `package.json` (test list), plus tests, fixture and the live QA script.
