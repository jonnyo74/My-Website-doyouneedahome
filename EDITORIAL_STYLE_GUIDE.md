# Editorial style guide

Applies to every page on DoYouNeedAHome.com, and as the starting point for
CondoWPB.com. The Admirals Cove page (`/communities/admirals-cove`) is the
benchmark. When this guide and a page disagree, fix the page.

It sits on top of, and does not replace:

- `docs/country-club-page-playbook.md`: how club pages are built, and the fee policy.
- `FAIR-HOUSING-AUDIT.md`: what the July 2026 sitewide audit changed, and why.
- `AGENTS.md`: Next.js rules for this repository.

The two sites share the voice and the rules below. They do not need identical
wording. DoYouNeedAHome covers communities, cities and relocation; CondoWPB covers
buildings and the downtown West Palm Beach market. Use each site's own vocabulary.

---

## 1. Voice

We are two experienced local agents, John Oliver and Christine Dekant, explaining a
place to someone who is about to spend a lot of money on it.

| Aim for | Avoid |
|---|---|
| Confident, not arrogant | Selling, superlatives, "the best" |
| Specific: a number, a name, a rule | Adjectives that could describe any community |
| Plain and conversational | Corporate or academic phrasing |
| Written for a buyer's decision | Written to show we did research |
| Honest about trade-offs | A brochure with no downsides |

Rules that follow from it:

1. **Show, don't announce.** A luxury buyer does not need to be told a community is
   luxurious. Name the amenity, the rule, the distance, the cost line.
2. **No invented experience.** Never write a client story, a transaction, a "we
   recently helped…" or a first-hand observation that has not been verified.
   Agent quotes need the named agent's approval.
3. **No claim of expertise in place of expertise.** "We know this market inside and
   out" is a claim. "Ask the association who dredges the canals; it isn't published"
   is knowledge.
4. **Vary the rhythm.** Mix short and long sentences. Do not force every section into
   the same shape. Use lists and tables where a reader will scan, prose where there
   is reasoning.
5. **Contractions are fine.** "Don't," "it's," "we'll." Use them where you would speak
   them.
6. **One idea per paragraph, and cut repeats.** If a point is made in the overview,
   do not make it again in a sidebar.
7. **Em dashes: almost never.** Use a period, a comma or a colon. Admirals Cove has
   none in its copy.
8. **Bold sparingly.** One bolded phrase per section at most, for the thing a skimmer
   must not miss.

## 2. Research language we do not use in consumer copy

These make a page read like a report or an AI summary. `scripts/editorial-lint.mjs`
fails the build on them.

> according to records / public records / publicly available information ·
> based on available documentation · historical records indicate · research suggests ·
> available information indicates · it is worth noting · it is important to note ·
> it should be noted · as documented by · according to various sources · based on our
> research · sources indicate · prospective purchasers should be aware · is
> characterized by · the development comprises · records reflect · our research has
> identified · as of this writing · interestingly · furthermore · moreover · in conclusion

**What to do instead:** state the verified fact. Keep attribution only when the
reader needs it to judge the claim (see section 5).

| Before | After |
|---|---|
| According to historical records, development began in 1986. | Development began in 1986. |
| According to available information, the community features 45 holes. | With 45 holes of golf, the club offers more variety than a one-course club. |
| Publicly available information indicates the marina can accommodate vessels up to 165 feet. | The club's marina takes vessels up to 165 feet. |
| Prospective purchasers should be aware that fees are subject to change. | Fees and dues change each club year. Ask us for the current schedule before you decide. |
| The community is characterized by a diverse range of property types. | Homes range from condominiums and townhomes to canal-front houses. |

## 3. Clichés we do not use

> nestled · hidden gem · unparalleled · epitome of · boasts · world-class ·
> prestigious enclave · something for everyone · where luxury meets lifestyle ·
> second to none · resort-style paradise · breathtaking · exquisite · meticulously
> designed · vibrant tapestry · seamlessly blends · unmatched sophistication ·
> a testament to · an oasis of tranquility

Do not swap one for a synonym. Replace the adjective with the fact behind it.

**Discouraged, allowed when earned:** "luxury," "exclusive," "championship,"
"prestigious." Each needs a source or a specific meaning. Do not use "luxury" or
"specialist" as our own label; it can put off buyers under $1 million.

## 4. Pages answer buyer questions

Every section should answer a question a buyer actually has. For a community or club
page, cover what applies of:

- What makes it different from the communities next to it?
- Which parts of it differ, and how (sections, sides, buildings)?
- Property types, and which are waterfront or golf-front.
- Membership: what is required, what is optional, what to ask.
- Recurring costs, line by line.
- Location, access and getting around.
- Water, boats and docks, where relevant, including what a lot will not take.
- Who it suits, in terms of **property and lifestyle preferences** (see section 8).
- Trade-offs and drawbacks.

Close with one clear reason to get in touch: the thing we can get that the buyer
cannot easily get alone (the current fee schedule, a boat-fit check, the closed
sales on specific streets).

## 5. Research and citation standards

1. **Primary sources first:** the club or association's own site, the county property
   appraiser and GIS layers, the Town, state corporate records, NOAA, FDOT, recorded
   documents. Brokerage and competitor pages are never evidence for a fact. Use them
   only to find questions to ask.
2. **Date every source.** Each page carries a "last reviewed" date that changes only
   when the sources were actually re-read.
3. **State verified facts plainly.** No "according to" in front of a fact that stands
   on its own.
4. **Keep attribution when it matters:**
   - the figure is the association's, not the county's, and the two differ;
   - the claim is the club's own description ("just two miles from the inlet");
   - the fact is our own measurement, said once, where it appears;
   - a source says something surprising (NOAA on the inlet).
5. **When sources disagree, show both.** Never average them or quietly pick one.
6. **Put the evidence in one place.** Consumer paragraphs read cleanly; the sources
   section ("Community Information & Sources" on community pages) lists every
   source, what it was used for, the review dates, and what is still unconfirmed.
7. **Say what you could not confirm, once, where it matters.** Write it as the
   buyer's question ("Ask the marina office who may rent a slip"), not as our
   research diary. Do not open three paragraphs in a row with "we could not confirm."
8. **Do not flag a phrase as wrong before you know why it is there.** Admirals Cove
   explains once that its official name has no apostrophe while state records keep
   one. That is deliberate.

## 6. Changing financial information

Fees, dues, initiation, capital contributions, assessments, tax rates, insurance
quotes, and market statistics all change.

1. **No dollar figure for a club or association charge in page copy.** A test fails
   the build if one appears. The reader gets the structure (which lines exist, who
   bills them) and a way to ask for the current schedule.
2. If a figure is published, it comes from `src/lib/clubFees.ts` with its effective
   dates, source and verification date. It drops off the page when it expires.
3. **Recorded sales** carry their period and their source, and are labeled
   historical once they age past the limit set in code.
4. Place the "figures change" note where it is most relevant, once or twice per page.
   Do not repeat the disclaimer in every section.
5. Suggested language: "Membership and ownership costs vary depending on the
   property, the membership category and the club's current requirements. Our team
   can help you obtain current information and understand the total cost of
   ownership before you make a decision."
6. Never trade accuracy for confidence. If a figure is uncertain, say what is
   uncertain.
7. Never state our fees, commissions or "no cost to you."

## 7. Expert commentary

Commentary from DO Homes Group must teach something the facts above it do not.

| It does | It does not |
|---|---|
| Names what to investigate before buying | Says the community is wonderful |
| Explains why two similar properties differ | Repeats the paragraph above it |
| Flags a trade-off or a question buyers do not know to ask | Promises availability, membership or a price |
| Compares with named alternatives, fairly | Ranks communities as more or less "exclusive" |

Model paragraph (from the Admirals Cove boating section):

> When you compare two waterfront homes, look past the house. Dock configuration,
> canal depth, room to turn, seawall condition and the run to the Intracoastal can
> matter more to a boat owner than square footage.

Topics to draw on: what to check before contract, differences by location inside the
community, waterfront and boating limits, resale considerations, membership
obligations, total cost of ownership, comparison with competing communities.

Do not invent anecdotes. Do not say we have represented buyers or sellers in a
specific community unless that is verified and John or Christine has approved the
line.

## 8. Fair housing

Describe the property and the community's features, never the people.

- No "who lives here," no "ideal for families / retirees / young professionals."
- "Who it suits" means **preferences about the property or lifestyle** ("a boat at
  your own dock," "golf as the main reason to join"), not types of people.
- No school quality claims or superlatives. Link the district's address lookup.
- Attribute a developer's own positioning to the developer.
- No steering through agent quotes. A quote from a named licensee that recommends a
  community to a group of people is steering.
- Equal Housing Opportunity statement stays in the page footer block.

Full rules and the audit's findings: `FAIR-HOUSING-AUDIT.md`.

## 9. Balanced ownership

We are advisors, not a marketing department. Where the facts support it, name the
cost or constraint, plainly and without alarm:

membership expense · association obligations · insurance · flood exposure ·
maintenance · renovation requirements · architectural review · dock and seawall
upkeep · differences by location · property-specific restrictions.

"None of this rules a home out. It is the reason to price the whole of ownership
before you compare homes" is the tone.

## 10. SEO preservation

An editorial rewrite must not cost rankings. Before and after, confirm unchanged:

- URL, canonical, `<title>`, meta description
- H1 and the heading hierarchy (a heading may be reworded only when it is documented)
- Primary and secondary keywords still appear naturally in headings and the opening
- Internal links, community navigation, and links other sites point to
- Structured data, and that it matches the visible page (FAQ answers are the
  `FAQPage` text)
- Image alt text
- FAQs that match real search intent. Add FAQs; do not delete them to shorten a page.
- Market report and lead-magnet links

Do not cut content just to cut words. Cut repetition. Fix keyword stuffing by
rewriting the sentence, not by deleting the topic.

## 11. Functionality that must survive any edit

IDX and listing widgets and their scoped search links, static maps, price-range
cards, similar-community blocks, lead forms and CRM tags, consent language, market
data components, community navigation, responsive layout, and design-system
components. A copy edit touches the strings, not these.

If you find a functional problem while editing, write it down separately instead of
fixing it inside a copy change.

## 12. Verification before publishing a claim

1. Is there a primary source, and did we read it on a stated date?
2. Does any other primary source disagree? Show both.
3. Is it a number, a distance, a count or a rule? Re-check it from the source, not
   from memory or the previous draft.
4. Is it a superlative ("largest," "only," "first," "most")? Source it or cut it.
5. Is it about a person, a business or a transaction? Cut it unless verified.
6. Will it be wrong in six months? Date it, route it to the schedule, or leave it out.

## 13. Quality-control checklist

Run before every community, club, building, city, neighborhood or blog change.

**Automatic**

- [ ] `node scripts/editorial-lint.mjs --strict` returns no banned phrases
- [ ] `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`
- [ ] No fee or dues figure in copy (the club-fee test)

**By reading the page aloud**

- [ ] Does it sound like an experienced local agent talking?
- [ ] Is every paragraph doing a job a buyer needs?
- [ ] Did we demonstrate expertise rather than announce it?
- [ ] Does any sentence sound like a summary of a document?
- [ ] Is the same fact or disclaimer stated twice?
- [ ] Are the differences between parts of the community clear?
- [ ] Are trade-offs stated, and are changing costs qualified?
- [ ] Is there one clear reason to contact us?
- [ ] Fair housing: any sentence describing residents rather than property?
- [ ] SEO: title, description, canonical, H1, JSON-LD and FAQs unchanged or documented?

Do a second pass after the first. The first fixes the sentences; the second fixes
what the page is trying to say.

## 14. Applying it to other content types

| Type | Add to the above |
|---|---|
| Community and country club pages | Follow the club playbook. Membership questions and cost lines are mandatory. |
| Condominium building pages (CondoWPB) | Lead with what makes the building unique. Sourced developer numbers only; no placeholder sales progress. Association, reserve and rental-policy lines where known. |
| City, neighborhood, relocation guides | Describe housing and place, not residents. Cost-of-living claims need a dated source. |
| Market reports | Every statistic has a period and a source. Never call a seasonal dip a trend. |
| Blogs and comparison articles | Name a real decision the reader faces. Compare on structure and cost, not on who is "better." |
| New construction pages | Attribute the developer's claims to the developer. Dates and status come from the developer or the permit record. |
| FAQs | Answer first, in the first sentence. One question per entry. No duplicate questions. |
