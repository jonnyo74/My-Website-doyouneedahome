# Fair Housing, REALTOR® Ethics & Editorial Compliance Audit
**Doyouneedahome.com** — DO Homes Group at Premier Brokers International
Audit date: July 30, 2026 · Reviewed by: Senior Managing Editor / Fair Housing Compliance / SEO Director

---

## 1. Executive Summary

Every published page on the site was reviewed — **298 URLs** across blogs, city guides, neighborhood
and community pages, lifestyle pages, buyer/seller guides, market reports, and active listings.

**159 pages were modified.** All edits were minimum-necessary. **Zero URLs, H1s, primary keywords,
secondary keywords, meta titles, or internal links were changed.** Only four H2 subheadings changed,
each because the heading itself contained familial-status language ("Family-first…").

The most significant exposure was not isolated word choice — it was a **structural pattern**: the site
systematically described *who lives in* each community rather than *what the housing is*. This appeared
in four recurring content structures, all of which have been re-pointed at objective property and
community characteristics:

| Structure | Instances | Nature of exposure |
|---|---|---|
| "Who lives in [City]?" FAQ blocks | 19 | Described residents by age, familial status, sexual orientation, national origin |
| "Best for" community quick-facts | 35 | Ranked communities by the *types of people* who live there |
| Community `lifestyle` narrative fields | 23 | Opened by profiling buyers demographically |
| Agent-attributed quotes | 16 | **Named licensees** recommending communities to protected classes |

The agent quotes were the highest-risk items on the site: a named REALTOR® stating "I recommend it to
families who want top schools" is direct steering attributable to the individual licensee, not just
the website.

**Two sitewide compliance gaps were closed:** the site previously carried **no Equal Housing Opportunity
statement anywhere**, and **no school-verification disclaimer** on community pages.

---

## 2. Methodology

1. **Inventory** — enumerated all routes from `sitemap.ts`, `articles.ts` (201), `communities.ts` (85),
   `listings.ts` (2), and 11 static pages.
2. **Term scan** — regex sweep for the full flagged-term list, plus protected-class proxies not on the
   original list (`diverse`, `LGBTQ`, national-origin references, `affluent`, `elite`, occupation-based
   descriptors).
3. **Sentence-level scan** — a co-occurrence scan flagging any sentence containing both a *people term*
   (family, retiree, young, professional, affluent, ethnicity, orientation…) and an *affinity verb*
   (draws, attracts, thrives, ideal for, popular with, built for…), while allow-listing lawful contexts
   (55+/age-restricted housing, "single-family" as a property type, "family room" as a room name,
   school proper nouns). This caught **35 items the keyword scan missed** — including the single
   highest-risk sentence on the site.
4. **Rendered-output verification** — pages were rendered in a live browser and re-read, which surfaced
   items that source-level scanning missed (e.g. a `Top Public Schools` UI category label).
5. **Every edit applied through a verified exact-match harness** that fails loudly on a missing or
   ambiguous match — no edit landed silently. **342 replacement rules, 342 applied.**
6. **Verification** — TypeScript typecheck clean; full production build clean (**306/306 pages**);
   structural diff confirms zero SEO-critical fields changed.

---

## 3. Findings by Category

### 3.1 "Who lives in [City]?" — 19 FAQ blocks · HIGH PRIORITY

**Issue.** Each answer profiled residents by protected characteristics. The Lake Worth Beach entry
referenced sexual orientation; several referenced national origin via "diverse"; nearly all referenced
age and familial status.

**Approach.** The *questions* were preserved verbatim — they are genuine high-volume search queries and
carry FAQPage schema. Only the answers changed, re-pointed at housing stock, price tiers, and ownership
patterns. This preserves search intent while removing the demographic claim.

> **Before —** *Who lives in Lake Worth Beach?*
> "A diverse, creative mix — artists, young professionals, a strong LGBTQ community, longtime locals,
> and value-minded buyers drawn to character and walkability."

> **After —**
> "Lake Worth Beach housing is largely historic — 1920s Mediterranean Revival and mission-style
> bungalows, small-lot cottages, and duplexes — concentrated in walkable districts near downtown and
> the beach. Price points are among the lowest of the county's beach cities, and the downtown corridor
> has a high concentration of independent, non-chain businesses."

**Why.** Sexual orientation, national origin, familial status, and age are protected characteristics.
Describing who lives somewhere invites the inference that others do not belong there.

> **Before —** *Who lives in Boca Raton?*
> "A mix of families, executives and professionals, country-club retirees, active-adult residents, and
> affluent buyers — generally a polished, upscale community."

> **After —**
> "Boca Raton housing includes country-club and golf communities, gated single-family neighborhoods,
> oceanfront and Intracoastal condominiums, and age-restricted communities west of the city. Boca has
> one of the largest concentrations of private clubs and private schools in Palm Beach County, with
> price points running from entry-level condos to oceanfront estates."

**SEO impact.** Keyword targeting preserved (city name + "housing"/"communities"); search intent
preserved; the replacements are *more* specific on property-type terms (condominium, gated,
age-restricted, dockage), which broadens long-tail coverage. Internal links untouched.

---

### 3.2 "Best for" Quick-Facts — 35 entries · HIGH PRIORITY

**Issue.** Every community page ranked itself by resident type — the exact practice the brief prohibits.

> **Before —** `Best for: Retirees, snowbirds, families seeking top private schools, professionals commuting to Fort Lauderdale or Miami`
> **After —** `Best for: Country-club and golf communities, private school corridor, oceanfront and Intracoastal condos, I-95 and Tri-Rail access to Fort Lauderdale and Miami`

> **Before —** `Best for: Ultra-high-net-worth buyers, estate collectors, private club members, generational wealth buyers, global second-home seekers`
> **After —** `Best for: Oceanfront and lakefront estates, landmarked historic architecture, Worth Avenue, private clubs, the highest price tier in Palm Beach County`

**Why.** Ranking communities by who lives there is steering. The label "Best for" was retained — it
reads naturally with features and preserves the UI pattern; only the values changed.

**SEO impact.** Net positive. These fields now carry indexable property and amenity terms
(deep-water dockage, lock-and-leave, age-restricted, HOA-managed) instead of demographic nouns.

---

### 3.3 Agent-Attributed Quotes — 16 quotes · HIGH PRIORITY

**Issue.** Named licensees recommending communities to protected classes. This is the most legally
exposed content on the site because it is attributable to an individual REALTOR®.

> **Before — Christine Dekant, Royal Palm Beach:**
> "Royal Palm Beach is the right call for **families who want great schools**, community parks, and a
> sense of belonging — without coastal pricing…"

> **After —**
> "Royal Palm Beach is the right call for **buyers who want school access**, community parks, and larger
> lots — without coastal pricing. It's a market I recommend confidently to buyers who prioritize square
> footage and amenities over a coastal ZIP code."

> **Before — John Oliver, Wellington:**
> "Wellington works for two completely different buyer profiles — equestrian buyers who need the show
> grounds and barn infrastructure, and **families who want great schools** and suburban space…"

> **After —**
> "Wellington works for two completely different **needs** — barn and paddock infrastructure near the show
> grounds, and standard master-planned neighborhoods with **A-rated school zones** and suburban space…"

**Why.** A licensee directing a protected class toward or away from a community is textbook steering
under §804(a) and NAR Article 10. Recommendations were re-pointed from *people* to *priorities*.

---

### 3.4 Schools — 24 community overviews + ~90 article references · HIGH PRIORITY

**Rule applied.** Official Florida DOE ratings are **factual public information and were preserved**
("Jupiter High School — A-rated, medical & engineering academies"). Subjective superlatives were
removed: *top schools, top-rated, top-ranked, best, great, excellent, most sought-after, perfect.*

> **Before —** "Palm Beach Gardens is known for its top-ranked schools — one of the strongest drivers of
> demand in the area. **Families often choose Gardens for the schools alone**, and prices stay strong
> because of it."

> **After —** "Palm Beach Gardens is served by Palm Beach County public schools, including Palm Beach
> Gardens Community High School, along with charter and private options. School access is frequently
> cited by buyers as a factor in the area's housing demand. Buyers should review current Florida
> Department of Education school grades and confirm attendance boundaries for any specific address."

> **Before —** "Martin County Public Schools are a genuine buyer draw — the district consistently ranks
> among the top-performing in Florida…"
> **After —** "Stuart is served by Martin County Public Schools, a district that has historically
> received high marks in the Florida Department of Education's annual grading system and reports
> smaller average class sizes than several neighboring counties. Buyers should review current district
> grades and confirm attendance boundaries directly with Martin County Public Schools."

**Disclaimer added at template level** (one edit, covers all 85 community pages — no content churn):

> "School assignments, boundaries, and ratings may change. Buyers should verify all school information
> directly with the appropriate school district."

Also added to the blog disclaimer (all 201 articles), the GreatSchools card, and the site footer.
Listing pages already carried a school-verification note; it was left in place.

**SEO impact.** "A-rated schools" and "[District] school district" are equally strong ranking targets
and are defensible. Zero school-related keyword loss.

---

### 3.5 Crime & Safety — 81 references reviewed · HIGH PRIORITY

**Issue.** Communities were characterized as "safe," "safer," "low crime." One page claimed a specific
municipality had "the lowest crime rate of any municipal community in the central Palm Beach County
area."

Every "Is [City] safe?" FAQ now points to official sources rather than making a characterization:

> **Before —** *Is Boca Raton safe?* "Boca is generally known as one of the safer, well-kept cities in
> the region, though as always it's wise to research specific neighborhoods."

> **After —** "Crime statistics vary by neighborhood. Buyers should review Boca Raton Police Services
> Department data and the FDLE Uniform Crime Reports for the specific area they are considering."

> **Before —** "**Safety and order.** Master-planned and organized, with low crime rates and well-kept
> neighborhoods. Families and retirees value this consistently."

> **After —** "**Planning and upkeep.** Master-planned and organized, with consistent architectural
> standards and well-maintained streetscapes and public spaces. For crime statistics, consult the Palm
> Beach Gardens Police Department and FDLE Uniform Crime Reports."

The North Palm Beach crime-rate claim was replaced with a verifiable, non-safety metric
(owner-occupancy and turnover rates) plus a pointer to official crime resources.

**Why.** Crime characterizations correlate with protected-class demographics and function as proxy
steering; they also carry independent misrepresentation risk.

**SEO impact.** "Is [city] safe" queries are still answered — the pages remain responsive to the query
and now cite named authorities, which supports E-E-A-T rather than harming it.

---

### 3.6 Familial Status — 162 references reviewed · HIGH PRIORITY

Removed from all housing and community contexts: *family-friendly, built for families, great for
families, perfect for families, family neighborhoods, family-first, family value, a place built for
raising kids.*

> **Before —** "It's **safe, green, and built for families**, with some of the most sought-after schools
> in the county." *(Wellington)*
> **After —** "Green space, bridle trails, and preserve acreage are built into the layout, and the
> village is zoned to Palm Beach County schools."

> **Before —** *funFact:* "Westlake was designed specifically to attract **young families** — the lot
> sizes, floor plans, and amenity focus are **calibrated for 30-something buyers with kids**."
> **After —** "Westlake was master-planned from scratch around its amenities — the lot sizes, floor
> plans, and the Adventure Park were designed together rather than added to an existing town."

That Westlake sentence was the single highest-risk line on the site: explicit age *and* familial-status
targeting stated as deliberate design intent. It was found only by the sentence-level scan.

**Deliberately retained:** the FAQ *questions* "Is [City] good for families?" (3 remain by name) — these
are legitimate consumer queries and high-volume search terms. Every corresponding *answer* now lists
objective amenities (parks, recreation facilities, school districts) with a verification note, which is
how a compliant brokerage answers the question rather than refusing it.

**Also retained:** descriptions of *attractions* — a children's museum, a nature center's hands-on
exhibits, a calm-water lagoon. These describe venue features, not dwellings, and are outside the scope
of housing advertising. Several were still softened where the change cost nothing.

---

### 3.7 Age — 140 references reviewed · MODERATE

**Preserved as lawful:** all `55+`, `active adult`, and `age-restricted` references. These describe
genuine HOPA-exempt housing (Valencia, Regency at Avenir, Riverland, Indian Spring, Leisureville,
Hunters Run) and are explicitly permitted.

**Removed:** age-affinity claims about *non-restricted* housing.

> **Before —** "It's a favorite of **snowbirds, retirees, and second-home buyers** who want the beach as
> their backyard…" *(Singer Island)*
> **After —** "Inventory is weighted toward seasonal and second-home ownership, drawn by direct beach
> access without the exterior upkeep of a single-family home."

> **Before —** *Is Palm Beach Gardens good for retirees?* "Yes — its golf, gated communities, club life,
> healthcare, and convenience make it **popular with retirees and snowbirds**."
> **After —** "Palm Beach Gardens offers extensive golf and country-club communities, single-level and
> lock-and-leave options, the deepest concentration of medical facilities in northern Palm Beach County,
> and PBI airport 20 minutes away."

**Retained:** references to Florida's lack of state income tax being relevant to retirement
distributions. This is a statement about tax law, not about who should live in a neighborhood.

---

### 3.8 Race, National Origin & Sexual Orientation — MODERATE

- **"Diverse" describing a *population*** → removed (proxy for race/national origin).
- **"Diverse" describing *cuisines, food halls, or home types*** → retained; not a protected-class
  reference.
- **LGBTQ references** (3) → removed.
- **National-origin population claims** → converted to descriptions of the businesses themselves.

> **Before —** "The city has a strong **Dominican, Haitian, and Caribbean cultural community** that makes
> the dining and cultural scene more diverse than many Palm Beach County neighbors."
> **After —** "The dining scene spans an unusually wide range of cuisines for a city this size,
> including Caribbean and Latin American kitchens along the Federal Highway and Congress corridors."

> **Before —** "Palm Beach draws a global buyer — **European and Latin American families with
> generational wealth**…"
> **After —** "Palm Beach is a global luxury market, routinely compared against Greenwich, Beverly
> Hills, and Aspen by buyers shopping at the highest price tier. What distinguishes the island is its
> inventory: landmarked historic estates, oceanfront and lakefront parcels that cannot be replicated,
> and a level of privacy that comes from strict zoning and limited land."

**Retained:** school proper nouns (Donna Klein Jewish Academy, Jupiter Christian School, Trinity
Christian School) — these are institution names in factual directory lists.

---

### 3.9 Wealth & Status Descriptors — MODERATE

Per the brief, luxury *property* language is permitted and was retained: luxury homes, private club,
country club, golf membership, custom estates, high-end finishes, resort-style amenities.

Removed where it described **people** or made an unverifiable status claim:

| Before | After |
|---|---|
| "the buyer profile here skews **affluent**, discerning, and repeat" | "the inventory skews toward the higher end of the countywide price range" |
| "Boca's **most prestigious** address" | "Boca's **highest-priced** address" |
| "an **affluent** peninsula" (Sewall's Point) | "a peninsula … with Stuart's **highest price per square foot**" |
| "historically attracts **executives and professional athletes**" | "private roads, controlled access, and a long-standing culture of privacy and discretion" |
| "The privacy appeals to some of the country's **wealthiest families**" | "Much of the island's inventory is seasonally occupied, and the town's zoning, private roads, and limited public access are the reason its privacy is so often cited" |

"Upscale" describing **shopping, dining, architecture, or finishes** was retained — that is product
description, not people description.

---

### 3.10 Privacy — MINOR

A named private individual's home community was identified in two places ("home to notable residents
including Jack Nicklaus"). Removed and replaced with property facts (private golf club, deep-water
dockage, highest price per square foot). Naming residents of a specific community is a privacy concern
independent of Fair Housing.

---

### 3.11 Editorial Consistency

- 4 H2 headings rewritten (all contained "Family-first").
- 26 FAQ question texts revised where the question itself presupposed a demographic answer
  (e.g. "Where do families live in Boca Raton?" → "What are the main residential areas in Boca Raton?").
  **FAQ count unchanged: 803 before, 803 after** — no schema entries were dropped.
- UI label `Top Public Schools` → `Public Schools`; `Family Attractions` → `Attractions & Recreation`;
  `quiet streets` → `low-traffic interior streets`.
- Repetitive "who thrives in…" metaDescriptions were left alone except where paired with a protected
  term — rewriting them would have risked CTR for no compliance gain.
- No typos, broken headings, broken internal links, or duplicate paragraphs were found.

---

## 4. Sitewide Additions

| Addition | Scope | Placement |
|---|---|---|
| **Equal Housing Opportunity statement** (full HUD affirmative-marketing language) | All 298 pages | `Footer.tsx` |
| Information-reliability + school + crime-verification disclaimer | All 298 pages | `Footer.tsx` |
| School boundary/rating verification note | 85 community pages | `communities/[slug]/page.tsx` template |
| Buyer-verification + Equal Housing note | 85 community pages | `communities/[slug]/page.tsx` |
| Ranking-basis + "best community depends on your goals" note | 20 "Best Neighborhoods" articles | `blog/[slug]/page.tsx`, conditional on `article.type` |
| School + crime verification + Equal Housing added to existing article disclaimer | All 201 articles | `blog/[slug]/page.tsx` |

All disclaimers were added at the **template** level rather than injected into content, which means zero
content churn and zero risk to indexed copy.

---

## 5. SEO Impact Statement

| Element | Status |
|---|---|
| URLs / slugs | **0 changed** — verified by diff |
| H1 headings | **0 changed** — verified by diff |
| Meta titles / SEO titles | **0 changed** — verified by diff |
| Primary & secondary keywords | **0 changed** — verified by diff |
| Internal links (`internalLinks`) | **0 changed** — verified by diff |
| H2 / H3 subheadings | 4 changed (all contained familial-status language) |
| Meta descriptions | 21 changed (only where they contained flagged terms) |
| FAQ schema entries | 803 → 803 — none dropped |
| Sitemap entries | Unchanged |
| Build | 306/306 pages generate; TypeScript clean |

**Rankings should not be negatively impacted.** Replacements were substitutions of equal or greater
specificity — subjective adjectives were exchanged for concrete, indexable property nouns (deep-water
dockage, age-restricted, HOA-managed, lock-and-leave, A-rated, attendance boundaries). Search intent is
preserved on every page; consumer questions are still answered rather than deflected. The added
disclaimers strengthen E-E-A-T signals for a YMYL-adjacent real estate site.

---

## 6. Final Report

| Metric | Result |
|---|---|
| **Total pages reviewed** | **298** (201 blog · 85 community/city/neighborhood · 2 listings · 11 static/market-report) |
| **Total pages modified** | **159** (111 articles · 48 community pages) + 6 sitewide template/component files |
| **High-risk pages** | **7** (8+ edits each) |
| **Medium-risk pages** | **76** (3–7 edits each) |
| **Low-risk pages** | **76** (1–2 edits each) |
| **Pages passing unchanged** | **139** |
| **Fair Housing concerns removed** | **342 verified replacements** across steering (familial status, age, race/national origin, sexual orientation), crime/safety characterization, school superlatives, and wealth/status descriptors |
| **Compliance gaps closed** | Equal Housing Opportunity statement (was absent sitewide); school-verification disclaimer on community pages (was absent) |

### Remaining Concerns

1. **`/[...slug]` legacy hierarchy** — legacy URLs (`/jupiter/gated-communities/...`) render from
   `siteMap.json`, which was **not** audited. These pages are `noindex, nofollow` and are being phased
   out, so they are low priority — but they are still publicly reachable. Recommend auditing
   `src/lib/siteMap.json` or completing the redirect/removal.
2. **Ylopo IDX widgets** — live MLS listing content is injected by a third party at runtime. Listing
   remarks originate from the MLS and are outside this codebase; they should be covered by broker
   policy on listing-input language.
3. **Testimonials** — retained verbatim as authentic client statements. None contain protected-class
   language. Client quotes should not be edited; if one ever did contain such language, the correct
   remedy is removal, not rewriting.
4. **Hospital "Top-rated" notes** — retained. These describe medical facilities (several citing
   "top 10% nationally" rankings), not housing or schools, and are outside Fair Housing scope.
5. **Ongoing governance** — the sentence-level scanner used here (`deep-scan`) found 35 items the
   keyword list missed. Recommend running an equivalent check before publishing new community or blog
   content.

### Scores

| Score | Before | After |
|---|---|---|
| **Overall Fair Housing / REALTOR® compliance** | 42 / 100 | **95 / 100** |
| **Overall editorial quality** | 84 / 100 | **92 / 100** |

**Compliance — 95.** All identified steering language, protected-class references, crime
characterizations, and school superlatives have been removed or made objective, and the two structural
gaps (Equal Housing statement, school disclaimer) are closed. Held short of 100 because the legacy
`siteMap.json` hierarchy is unaudited and third-party IDX content is outside this codebase.

**Editorial — 92.** The site's voice, local specificity, and topical authority are intact; the
replacements are generally more concrete than what they replaced. Held short of higher because the
"who thrives in…" metaDescription pattern repeats across 18 pages and the "pros and cons / who should
move to" article template produces some formulaic phrasing — both stylistic, neither a compliance issue,
and neither worth the ranking risk of a broad rewrite.

---

*Appendix A (per-URL blog status) and Appendix B (per-URL community status) are in `AUDIT-APPENDIX.md`.*
