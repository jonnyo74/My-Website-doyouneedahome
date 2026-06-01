# DO Homes Group - Site Architecture Documentation
## Doyouneedahome.com | Local SEO Authority for Palm Beach County

**Last Updated:** May 31, 2026
**Approach:** City → Category → Community Hierarchy
**Total Communities:** 65+ neighborhoods and developments

---

## EXECUTIVE SUMMARY

The site is organized around **buyer intent and lifestyle** rather than disconnected neighborhood pages. Each city hub serves as an authority center, with category pages organizing communities by lifestyle/amenity (Golf, Waterfront, Luxury, Gated, etc.), and community pages providing deep-dive content for individual neighborhoods and developments.

**Key Metrics:**
- 14 Major Cities/Markets
- 12-15 Lifestyle Categories per city (varies)
- 3-10 Communities per category
- 3 Master-Planned Communities with sub-community hierarchies (Abacoa, PGA National, Avenir)
- 60+ individual community/neighborhood pages

---

## PRESERVED EXISTING COMPONENTS

✓ **Ylopo Market Trends Widget** - YlopoMarketTrendsWidget.tsx (with script reload fix)
✓ **Ylopo Listings Results Widget** - YlopoResultsWidget.tsx (with script reload fix)
✓ **Agent Quote Rotation** - agentQuotes.ts (quotes rotate per community and region)
✓ **Community Data** - communities.ts (61 neighborhoods with full descriptions)
✓ **Calls to Action** - CTA components (soft CTAs on every page)
✓ **Header/Footer** - Global navigation (maintained)
✓ **Responsive Design** - Tailwind CSS (maintained)

---

## SITE STRUCTURE OVERVIEW

```
www.doyouneedahome.com/
├── /                                 [Home/Hub]
├── /{city}/                          [City Hub Page]
│   ├── /gated-communities/           [Category Page]
│   │   └── /rialto/                  [Community Page]
│   ├── /waterfront-communities/      
│   │   └── /admirals-cove/           
│   ├── /golf-communities/
│   │   └── /jonathans-landing/
│   └── /abacoa/                      [Master Community Hub]
│       ├── /mallory-creek/           [Sub-Community Page]
│       ├── /newhaven/
│       ├── /martinique/
│       └── [8 more sub-communities]
├── /team/                            [Agent Team Page]
├── /testimonials/                    [Reviews/Social Proof]
├── /blog/                            [Blog Hub]
├── /buy/ & /sell/                    [Buyer/Seller Resources]
└── /contact/                         [Contact]
```

---

## STEP 1: 14-CITY HUB PAGES

### City Hub Page Structure

Each city page is a **topical authority hub** that:
- Establishes buyer fit ("Who is this city for?")
- Overviews the city's real estate market
- Highlights major lifestyle categories
- Features top communities within that city
- Provides internal links to all category pages
- Includes Ylopo listings widget
- Soft CTA to contact agent

**URL:** `/[city]/`
**Example:** `/jupiter/`, `/palm-beach-gardens/`, `/west-palm-beach/`

**City Hub Pages:**

1. **Jupiter** — `/jupiter/`
   - Primary buyer: Families, golf enthusiasts, waterfront seekers
   - Key neighborhoods: Abacoa, Jonathan's Landing, Admiral's Cove
   - Lifestyle categories: Gated, Waterfront, Golf, Luxury
   - Master community: Abacoa (10 sub-communities)

2. **Palm Beach Gardens** — `/palm-beach-gardens/`
   - Primary buyer: Luxury buyers, golfers, country club members
   - Key communities: Mirasol, Old Palm, BallenIsles, Alton
   - Master communities: PGA National (8 sub-communities), Avenir (6 sub-communities)
   - Lifestyle categories: Golf, Luxury, New Construction

3. **North Palm Beach** — `/north-palm-beach/`
   - Primary buyer: Waterfront/boating buyers, golf buyers
   - Key neighborhoods: Sailboat Bend, Waterfront properties
   - Lifestyle categories: Waterfront, Golf & Country Club

4. **Tequesta** — `/tequesta/`
   - Primary buyer: Waterfront/boating enthusiasts, nature lovers
   - Key neighborhoods: Tequesta Waterfront, gated areas
   - Lifestyle categories: Waterfront & Boating, Gated Communities

5. **Juno Beach** — `/juno-beach/`
   - Primary buyer: Beach lifestyle seekers, oceanfront condo buyers
   - Key focus: Oceanfront living
   - Lifestyle categories: Oceanfront & Beach Communities

6. **West Palm Beach** — `/west-palm-beach/`
   - Primary buyer: Urban professionals, second-home buyers, art enthusiasts
   - Key neighborhoods: El Cid, Ibis, Downtown, Northwood Village
   - Lifestyle categories: Luxury & Waterfront, Downtown & Urban, Historic Neighborhoods

7. **Lake Worth Beach** — `/lake-worth-beach/`
   - Primary buyer: Waterfront/boating buyers, walkable community seekers
   - Key neighborhoods: Lake Worth Waterfront, Historic Downtown
   - Lifestyle categories: Waterfront & Boating, Historic & Downtown

8. **Boynton Beach** — `/boynton-beach/`
   - Primary buyer: Value-conscious families, waterfront seekers
   - Key focus: Waterfront, golf communities
   - Lifestyle categories: Waterfront & Intracoastal, Golf & Gated

9. **Wellington** — `/wellington/`
   - Primary buyer: Equestrian buyers, polo enthusiasts, luxury buyers
   - Key feature: Equestrian & polo lifestyle
   - Lifestyle categories: Equestrian & Polo, Gated Luxury Communities

10. **Royal Palm Beach** — `/royal-palm-beach/`
    - Primary buyer: Family buyers, value-conscious buyers
    - Key focus: Master-planned, family-friendly communities
    - Lifestyle categories: Family-Friendly, Master-Planned Communities

11. **Delray Beach** — `/delray-beach/`
    - Primary buyer: Urban lifestyle seekers, waterfront buyers, culture enthusiasts
    - Key neighborhoods: Atlantic Avenue Downtown, Pineapple Grove
    - Lifestyle categories: Downtown & Urban, Waterfront & Boating, Luxury Communities

12. **Boca Raton** — `/boca-raton/`
    - Primary buyer: Luxury buyers, golf/country club members, waterfront seekers
    - Key communities: Royal Palm Yacht & Country Club, Boca West, Prado
    - Lifestyle categories: Country Club & Golf, Waterfront & Boating, Luxury Gated

13. **Port St. Lucie** — `/port-st-lucie/`
    - Primary buyer: New construction buyers, master-planned community seekers
    - Master communities: Tradition, St. Lucie West (large PUDs)
    - Lifestyle categories: Master-Planned, New Construction

14. **Stuart** — `/stuart/`
    - Primary buyer: Waterfront/boating buyers, luxury seekers
    - Key communities: Sailfish Point (ultra-luxury), Hutchinson Island
    - Lifestyle categories: Waterfront & Boating, Historic & Downtown

---

## STEP 2: CATEGORY PAGES (BY CITY)

### Category Page Philosophy

Category pages are **SEO magnets** for lifestyle searches:
- "Golf Communities in Jupiter"
- "Waterfront Condos in West Palm Beach"
- "New Construction Homes in Palm Beach Gardens"

Each category page features 5-10 communities with short summaries and links to full community pages.

### Categories by City

**JUPITER**
- Gated Communities (Rialto, Sonoma Isles, Abacoa)
- Waterfront Communities (Admiral's Cove, Jupiter Inlet, Seabrook, Jupiter Island)
- Golf Communities (Jonathan's Landing, Jupiter Country Club, Trump National)
- Luxury Communities (Jupiter Island, Trump National)

**PALM BEACH GARDENS**
- Golf Communities (PGA National, BallenIsles, Mirasol)
- Luxury Communities (Old Palm, Mirasol, Alton, Bears Club)
- New Construction Communities (Avenir, Alton)

**NORTH PALM BEACH**
- Waterfront Communities (Sailboat Bend, North Palm Waterfront, North Palm Country Club)
- Gated Communities (North Palm Waterfront)

**TEQUESTA**
- Waterfront & Boating (Tequesta Waterfront)
- Gated Communities (Tequesta Gated Area)

**JUNO BEACH**
- Oceanfront & Beach Communities (Juno Beach Condos)

**WEST PALM BEACH**
- Luxury & Waterfront (El Cid, Ibis, Seagate, Palm Beach Lakes)
- Downtown & Urban Living (Downtown WPB, Hammock Park, Northwood Village)
- Historic Neighborhoods (Flamingo Park, Poinciana Park)

**LAKE WORTH BEACH**
- Waterfront & Boating (Lake Worth Waterfront, Lake Worth Estates)
- Historic & Downtown (Downtown Lake Worth, Lake Worth Gardens)

**BOYNTON BEACH**
- Waterfront & Intracoastal (Boynton Waterfront, Boynton Beach Gardens)
- Golf & Gated Communities (Ocean Ridge)

**WELLINGTON**
- Equestrian & Polo Communities (Wellington Estates, Wellington Country Club)
- Gated Luxury Communities (Seven Bridges, Olympia, Shelborne)

**ROYAL PALM BEACH**
- Family-Friendly Communities (Royal Palm Estates, Pomelo Park)
- Master-Planned Communities (Royal Palm Beach)

**DELRAY BEACH**
- Downtown & Urban (Atlantic Avenue, Pineapple Grove)
- Waterfront & Boating (Delray Harbor/Marina)
- Luxury Communities (Delray Beach Country Club)

**BOCA RATON**
- Country Club & Golf (Royal Palm Yacht & CC, Boca Raton CC, Boca West)
- Waterfront & Boating (Spanish River, Ocean Side)
- Luxury Gated (Prado, Broken Sound)

**PORT ST. LUCIE**
- Master-Planned Communities (Tradition, St. Lucie West)
- New Construction (Tradition)

**STUART**
- Waterfront & Boating (Sailfish Point, Hutchinson Island)
- Historic & Downtown (Downtown Stuart)

---

## STEP 3: COMMUNITY PAGES (BY CATEGORY)

Every community page includes:
- Lifestyle overview
- Location & access
- Home styles & price ranges
- Amenities & HOA info
- Schools & proximity
- Dining & entertainment
- Similar communities
- Internal links to category page
- Internal links to city hub
- Ylopo market trends widget
- Agent quote (rotates per community)
- Soft CTA

**Example Community Page URL Structure:**
- `/jupiter/gated-communities/rialto/`
- `/jupiter/waterfront-communities/admirals-cove/`
- `/palm-beach-gardens/golf-communities/mirasol/`
- `/west-palm-beach/luxury-waterfront/el-cid/`

**Total Community Pages: 50+**

---

## STEP 4: MASTER-PLANNED COMMUNITIES WITH SUB-HIERARCHIES

### Abacoa (Jupiter)

**Hub Page:** `/jupiter/abacoa/`

**Sub-Community Pages:**
- `/jupiter/abacoa/mallory-creek/`
- `/jupiter/abacoa/newhaven/`
- `/jupiter/abacoa/martinique/`
- `/jupiter/abacoa/tuscany/`
- `/jupiter/abacoa/canterbury-place/`
- `/jupiter/abacoa/san-palermo/`
- `/jupiter/abacoa/valencia/`
- `/jupiter/abacoa/osceola-woods/`
- `/jupiter/abacoa/antigua/`
- `/jupiter/abacoa/charleston-court/`

**Total: 11 pages (1 hub + 10 sub-communities)**

### PGA National (Palm Beach Gardens)

**Hub Page:** `/palm-beach-gardens/pga-national/`

**Sub-Community Pages:**
- `/palm-beach-gardens/pga-national/eagleton/`
- `/palm-beach-gardens/pga-national/preston/`
- `/palm-beach-gardens/pga-national/barclay-club/`
- `/palm-beach-gardens/pga-national/masters/`
- `/palm-beach-gardens/pga-national/ryder-cup-villas/`
- `/palm-beach-gardens/pga-national/club-cottages/`
- `/palm-beach-gardens/pga-national/patio-homes/`
- `/palm-beach-gardens/pga-national/monterey-pointe/`

**Total: 9 pages (1 hub + 8 sub-communities)**

### Avenir (Palm Beach Gardens)

**Hub Page:** `/palm-beach-gardens/avenir/`

**Sub-Community Pages:**
- `/palm-beach-gardens/avenir/avondale/`
- `/palm-beach-gardens/avenir/apex/`
- `/palm-beach-gardens/avenir/coral-isles/`
- `/palm-beach-gardens/avenir/regency/`
- `/palm-beach-gardens/avenir/la-terre/`
- `/palm-beach-gardens/avenir/panther-national/`

**Total: 7 pages (1 hub + 6 sub-communities)**

---

## STEP 5: REUSABLE PAGE TEMPLATES

### Template 1: City Hub Page

**URL Pattern:** `/{city}/`

**Components:**
- Hero section with city image
- SEO Title & Meta Description
- City overview (lifestyle, who it's for, why buy here)
- Key statistics & market overview
- Featured lifestyle categories (with links)
- Featured communities (2-3 per category)
- Testimonial/quote section
- Local attractions & dining section
- Schools overview
- Ylopo market trends widget
- Ylopo listings widget ($600k+)
- Agent quote
- Soft CTA to contact

**SEO Elements:**
- H1: "[City] Homes & Real Estate | Palm Beach County"
- Meta Title (60 chars): "[City], FL Real Estate | DO Homes Group"
- Meta Description (160 chars): "Browse homes in [City]. Explore [X] unique neighborhoods and lifestyle communities. [Year] market data, expert guidance."
- Schema: LocalBusiness, RealEstateAgent, Place

**Example Title/Meta:**

- **Jupiter:** "Jupiter, FL Real Estate | Premier North Palm Beach County Homes & Communities"
- **Palm Beach Gardens:** "Palm Beach Gardens, FL Homes | Golf, Luxury & New Construction Communities"
- **West Palm Beach:** "West Palm Beach Homes | Urban Living, Waterfront & Historic Neighborhoods"

---

### Template 2: Category Page

**URL Pattern:** `/{city}/{category}/`

**Components:**
- Hero section (category imagery)
- Category overview (what it is, who it appeals to)
- Featured communities (5-10 with thumbnail summaries)
- Each community includes:
  - Name & image
  - 1-2 sentence description
  - Price range indicator
  - Link to full community page
- FAQ section (3-5 questions)
- Market data/trends
- Similar categories in the city (cross-links)
- City hub link
- Ylopo listings widget
- CTA

**SEO Elements:**
- H1: "[Category] in [City], FL"
- Meta Title (60 chars): "[Category] in [City] | [X] Communities & Neighborhoods"
- Meta Description: "Discover [X] top [category] in [City]. Browse golf communities, waterfront neighborhoods, luxury homes with full neighborhood guides and market data."
- Schema: BreadcrumbList, Thing (multiple)

**Example Title/Meta:**

- **Golf Communities in Jupiter:** "Golf Communities in Jupiter, FL | Premier Golf Course Homes"
- **Waterfront Communities in West Palm Beach:** "Waterfront Homes in West Palm Beach | Intracoastal Living"
- **New Construction in Palm Beach Gardens:** "New Construction Homes in Palm Beach Gardens | Builder Communities"

---

### Template 3: Community Page (Standard)

**URL Pattern:** `/{city}/{category}/{community}/`

**Components:**
- Hero image (community/neighborhood photo)
- Quick facts sidebar (price range, HOA, lot sizes, etc.)
- Community overview section
- Lifestyle description
- Location & proximity section
- Home styles & price ranges (table with ranges)
- Amenities section
- HOA/Governance info (when applicable)
- Schools section (with links)
- Dining & entertainment (local highlights)
- Nearby attractions
- Similar communities (cross-links)
- Breadcrumb navigation
- Internal links to category & city pages
- Ylopo market trends widget
- Ylopo listings widget
- Agent quote (rotates)
- FAQ (3-5 community-specific questions)
- CTA

**SEO Elements:**
- H1: "[Community] Homes for Sale in [City], FL"
- Meta Title (60 chars): "[Community] - Homes for Sale in [City] | Real Estate Guide"
- Meta Description: "Explore [Community] homes in [City], FL. [Price range], [home types], [key amenity]. Neighborhood guide, market data, and agent insights."
- Schema: RealEstateAgent, Place, LocalBusiness, BreadcrumbList

**Example Title/Meta:**

- **Rialto (Jupiter):** "Rialto Homes for Sale in Jupiter, FL | Gated Community Guide"
- **Mirasol (PBG):** "Mirasol Luxury Homes in Palm Beach Gardens | Championship Golf Community"
- **El Cid (WPB):** "El Cid Waterfront Homes in West Palm Beach | Historic Neighborhood"

---

### Template 4: Master Community Hub Page

**URL Pattern:** `/{city}/{master-community}/`

**Components:**
- Master community hero section
- Master community overview
- Strategic location & developer info
- Total build-out scope & timeline
- Sub-community showcase (all sub-communities featured):
  - Name, image, brief description
  - Link to sub-community page
  - Price range indicator
- Available home styles across all neighborhoods
- Amenities & lifestyle benefits
- Market position & investment overview
- Builder information (if applicable)
- Breadcrumb navigation
- Links to category pages
- Links to city hub page
- Similar master communities (cross-links)
- Ylopo market trends widget
- Agent quote
- FAQ (Master community specific)
- CTA

**SEO Elements:**
- H1: "[Master Community] Homes | [Subtext about scale/amenities]"
- Meta Title (70 chars): "[Master Community] - [X] Sub-Communities in [City] | Real Estate"
- Meta Description: "[Master Community] is a [X]-acre master-planned community in [City] with [X] neighborhoods offering homes from $[low] to $[high]. Full development guide and market data."
- Schema: RealEstateAgent, Place, Residence (multiple)

**Example Title/Meta:**

- **Abacoa (Jupiter):** "Abacoa - Premier Master-Planned Community in Jupiter, FL | 10 Neighborhoods"
- **PGA National (PBG):** "PGA National - Championship Golf Community in Palm Beach Gardens | 8 Sub-Communities"
- **Avenir (PBG):** "Avenir - Luxury Master-Planned Community in Palm Beach Gardens | 6 Neighborhoods"

---

### Template 5: Sub-Community Page

**URL Pattern:** `/{city}/{master-community}/{sub-community}/`

**Components:**
- Sub-community hero image
- Quick facts (price range, lot sizes, HOA, builder(s))
- Sub-community overview
- Specific lifestyle/positioning within master
- Home styles available in this sub-community
- Price range (specific to sub-community)
- Amenities accessible from this sub-community
- Retail & dining nearby
- Schools
- Breadcrumb navigation
- Link back to Master Community Hub
- Links to similar sub-communities
- Links to city category pages
- Ylopo market trends widget
- Agent quote
- FAQ (Sub-community specific)
- CTA

**SEO Elements:**
- H1: "[Sub-Community] in [Master Community], [City]"
- Meta Title (70 chars): "[Sub-Community] Homes | [Master Community] in [City], FL"
- Meta Description: "[Sub-Community] in [Master Community], [City]. Homes starting at $[X], [X] sq ft, [home types]. Neighborhood guide with amenities, schools, and agent insights."
- Schema: BreadcrumbList, Place, RealEstateAgent

**Example Title/Meta:**

- **Martinique (Abacoa, Jupiter):** "Martinique Homes | Abacoa, Jupiter FL | Luxury Townhomes"
- **Eagleton (PGA National, PBG):** "Eagleton at PGA National | Palm Beach Gardens Golf Community"
- **Avondale (Avenir, PBG):** "Avondale at Avenir | Luxury Homes in Palm Beach Gardens"

---

## INTERNAL LINKING RULES

### From City Hub to:
- ✓ Category pages within city (primary nav)
- ✓ Top 2-3 community pages within each category
- ✓ Master community hubs (if applicable)
- ✓ Category breadcrumb navigation

### From Category Page to:
- ✓ City hub page (breadcrumb)
- ✓ All featured community pages (featured list)
- ✓ Related categories in same city (see also)
- ✓ Master community hubs (if applicable to category)

### From Community Page to:
- ✓ City hub page (breadcrumb + footer)
- ✓ Category page (breadcrumb + footer)
- ✓ Similar communities in category (see also)
- ✓ Related communities in same city (see also)

### From Master Community Hub to:
- ✓ All sub-community pages (showcase section)
- ✓ City hub page (breadcrumb)
- ✓ Category pages (footer links)

### From Sub-Community Page to:
- ✓ Master community hub (breadcrumb + footer)
- ✓ City hub page (breadcrumb)
- ✓ Related categories (footer)
- ✓ Similar sub-communities (see also)

---

## SEO METADATA STRATEGY

### Keyword Framework

**Level 1 (City):** "[City] homes" + "real estate in [City]" + "[City], FL"

**Level 2 (Category):** "[Category] in [City]" + "[Category], [City], FL" + "[Amenity] communities [City]"

**Level 3 (Community):** "[Community] homes" + "[Community] for sale" + "[Community] [City]" + "[Home type] in [Community]"

**Level 4 (Master/Sub):** "[Sub-community] in [Master]" + "[Master community] [City]" + "[Amenity] in [Master]"

### Schema Markup by Template

**City Hub:** LocalBusiness, Place, RealEstateAgent, Breadcrumb
**Category:** Breadcrumb, Thing (multiple communities)
**Community:** RealEstateAgent, Place, Residence, Breadcrumb
**Master Hub:** Place, RealEstateAgent, Residence (multiple)
**Sub-Community:** Place, RealEstateAgent, Breadcrumb

---

## CONTENT VOICE & STYLE

**Tone:** Expert, authoritative, human, lifestyle-focused

**Avoid:**
- Generic real estate language
- Overuse of marketing clichés
- Disconnected listings/MLS copy
- Hype without substance

**Focus On:**
- Lifestyle & community personality
- Buyer fit ("Who is this community for?")
- Real-world tradeoffs (location, commute, schools)
- Amenity context (not just listing them)
- Comparative positioning (why [community] over [similar]?)

---

## PRESERVED COMPONENTS & FEATURES

✓ **Ylopo Market Trends Widget**
- City-specific market data
- Appears on every city hub page
- Appears on category pages
- Appears on community pages

✓ **Ylopo Listings Results Widget**
- $600k+ minimum price filter
- 6 listing limit per page
- Features latest MLS listings
- Search-enabled for buyer engagement

✓ **Agent Quote Rotation**
- John Oliver's quotes (by region/community)
- Rotates per community page
- Appears in sidebar on each page
- Links to John's profile/contact

✓ **Call-to-Action (CTA)**
- Soft CTA buttons (contact agent, learn more)
- Appear in sidebar on community pages
- Appear at bottom of city/category pages
- Phone: 561-783-7733

✓ **Testimonials & Social Proof**
- Rotating agent photos on testimonial page
- Community reviews
- Buyer testimonials (where available)

---

## ROUTING STRUCTURE (Next.js App Router)

```
/                                    page.tsx (home)
/jupiter                             MasterHub.tsx
/jupiter/gated-communities           CategoryPage.tsx
/jupiter/gated-communities/rialto    CommunityPage.tsx
/jupiter/abacoa                      MasterHub.tsx (master community)
/jupiter/abacoa/mallory-creek        SubCommunity.tsx
/palm-beach-gardens                  MasterHub.tsx
/palm-beach-gardens/pga-national     MasterHub.tsx (master community)
/palm-beach-gardens/[...slug]        Dynamic routing for all paths
/team                                Team page
/testimonials                        Testimonials
/blog                                Blog hub
/buy, /sell                          Buyer/seller resources
/contact                             Contact page
```

---

## NEXT STEPS FOR IMPLEMENTATION

1. **Phase 1:** Update dynamic routing in `[...slug]/page.tsx` to handle:
   - City pages: `/[city]`
   - Category pages: `/[city]/[category]`
   - Community pages: `/[city]/[category]/[community]`
   - Master community pages: `/[city]/[masterCommunity]`
   - Sub-community pages: `/[city]/[masterCommunity]/[subCommunity]`

2. **Phase 2:** Create/update page templates:
   - CityHub.tsx (category listings, featured communities)
   - CategoryPage.tsx (community showcase, FAQs)
   - CommunityPage.tsx (lifestyle, amenities, listings widget)
   - MasterHub.tsx (sub-community showcase)
   - SubCommunity.tsx (existing template - refine)

3. **Phase 3:** Populate content & SEO metadata:
   - Generate page metadata (title, description, canonical)
   - Populate community descriptions from communities.ts
   - Add category copy
   - Generate FAQ content

4. **Phase 4:** Internal linking & breadcrumbs:
   - Implement breadcrumb component
   - Add category/community links throughout
   - Add "similar communities" sections
   - Cross-link master communities

5. **Phase 5:** Testing & Launch:
   - Test all URL patterns
   - Verify widget loading on each page type
   - Verify agent quotes rotate
   - Test CTAs
   - Mobile responsiveness
   - Lighthouse scores

---

## BUSINESS INFO (For CTA/Footer/Schema)

**Agent:** John Oliver
**Brokerage:** Premier Brokers International  
**Website:** doyouneedahome.com
**Phone:** 561-783-7733
**Email:** Available in contact form
**Region:** Palm Beach County, Florida

---

## FILES TO UPDATE/CREATE

- [ ] `src/app/[...slug]/page.tsx` — Update routing logic
- [ ] `src/components/templates/CityHub.tsx` — Refine city hub template
- [ ] `src/components/templates/CategoryPage.tsx` — Create category template
- [ ] `src/components/templates/CommunityPage.tsx` — Refine community template
- [ ] `src/components/templates/MasterHub.tsx` — Create master community template
- [ ] `src/lib/siteMap.json` — ✓ Already updated
- [ ] `src/lib/communities.ts` — Already comprehensive
- [ ] `src/components/Breadcrumbs.tsx` — Create breadcrumb component
- [ ] `src/app/layout.tsx` — Already has widgets & scripts

---

**Document Version:** 1.0
**Status:** Architecture Complete | Ready for Development
**Last Updated:** May 31, 2026
