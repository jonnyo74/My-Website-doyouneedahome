// Fact-checked content for the Abacoa village pages.
//
// Source: the village fact sheets researched 2026-10-17 (kept in
// "Claude outputs/village-facts/"). The abacoa.com pages are the Abacoa
// Property Owners' Assembly (APOA) and count as official; builder names and
// build years mostly come from public listings and brokerage pages, so the copy
// says "listings credit" / "per public listings" rather than stating them flat.
//
// Re-checked 2026-11-18 against the POA, village HOA sites, Florida Sunbiz and county
// records (see docs/abacoa-fact-check-2026-11-18.md for what is still unconfirmed).
//
// Never add: fee amounts, rental/pet/age rules, school ratings, or a
// "walking distance" claim without a source. The old copy in communities.ts
// had all of those wrong in places; see the fact sheets for the conflicts.

export type VillageFact = { label: string; value: string }
export type VillageFaq = { q: string; a: string }

export interface VillageContent {
  slug: string
  /** Short line under the H1 and on cards; also the meta description lead. */
  tagline: string
  metaTitle: string
  metaDescription: string
  story: string[]
  living: string
  highlights: string[]
  facts: VillageFact[]
  /** How the village sits inside the master association. */
  association: string
  /** Streets, boundaries and what's next to it. */
  location: string[]
  faqs: VillageFaq[]
  related: string[]
  /** Heading over the listings feed. The feed itself comes from lib/abacoaScopes. */
  listingsHeading?: string
  /** Hero H1 override. */
  heading?: string
  /** Set when this page is a street guide instead of describing a village. It shows no listings. */
  nameExplainer?: boolean
}

const ASSOC_NOTE =
  "Ask for the master association and village association documents (dues, rental and pet rules, parking, reserves, any assessments) for the exact address before you write an offer."

export const VILLAGES: Record<string, VillageContent> = {
  "mallory-creek": {
    slug: "mallory-creek",
    tagline:
      "A Key West–inspired DiVosta village of about 580 homes, townhomes and single-family, with a clubhouse and two heated pools.",
    metaTitle: "Mallory Creek at Abacoa, Jupiter FL | Homes for Sale & Village Guide",
    metaDescription:
      "Mallory Creek is a Key West–inspired Abacoa village of single-family homes and townhomes in Jupiter. See what the village offers and what to check with the association.",
    story: [
      "Mallory Creek is one of Abacoa’s larger villages: 581 homes, made up of 267 single-family homes and 314 townhomes, according to the village association. The Abacoa Property Owners’ Assembly names DiVosta Homes as the builder. Town of Jupiter records show the site plan approved in 2005, and homes went up in phases after that, so the year varies by address.",
      "The styling is Key West–inspired, and the streets carry the theme: Islamorada Drive, Key Largo Street, Windley Key Way. There are more than twenty floor plans, from about 1,500 to 4,800 square feet and from three to six bedrooms, so the village works for very different buyers under one roof.",
    ],
    living:
      "Life here centers on the village clubhouse (with an on-site management office), two heated pools and a playground, with several lakes running through the neighborhood. It sits just south of Indian Creek Parkway between Florida’s Turnpike and Military Trail. One honest note on walkability: the village scores low on Walk Score, so plan on a short bike ride or drive to Abacoa Town Center rather than a stroll.",
    highlights: [
      "267 single-family homes and 314 townhomes in one village",
      "Clubhouse, two heated pools and a playground",
      "Key West–inspired styling; 3–6 bedrooms across 20+ floor plans",
      "Streets named for the Keys, with lakes through the village",
      "Managed by Triton Property Management inside the master Abacoa association",
    ],
    facts: [
      { label: "Home types", value: "Single-family homes and townhomes (267 and 314)" },
      { label: "Builder", value: "DiVosta Homes" },
      { label: "Built", value: "Built in phases after a 2005 site-plan approval; the year varies by address" },
      { label: "Size and bedrooms", value: "About 1,500–4,800 sq ft; 3–6 bedrooms" },
      { label: "Village amenities", value: "Clubhouse, two heated pools, playground" },
      { label: "Management", value: "Triton Property Management" },
    ],
    association:
      "Mallory Creek has its own homeowners association, which sits inside the master Abacoa Property Owners’ Assembly. An APOA estoppel is required on sales. " + ASSOC_NOTE,
    location: [
      "Main streets: South and North Jeaga Drive, Windley Key Way, Islamorada Drive, Key Largo Street, Hemingway Drive",
      "Clubhouse: 1221 S Jeaga Drive",
      "South of Indian Creek Parkway, between Florida’s Turnpike and Military Trail",
    ],
    faqs: [
      { q: "Is Mallory Creek single-family or townhomes?", a: "Both. The village association counts 267 single-family homes and 314 townhomes, 581 in all, so check the property type on any listing." },
      { q: "Who built Mallory Creek?", a: "The Abacoa Property Owners’ Assembly names DiVosta Homes as the builder." },
      { q: "Can I walk to Abacoa Town Center from Mallory Creek?", a: "It’s a short bike ride or drive for most addresses. The village’s Walk Score is low, so walk the route yourself before relying on it." },
      { q: "What amenities does Mallory Creek have?", a: "A clubhouse, two heated pools and a playground, managed on site by Triton Property Management." },
    ],
    related: ["newhaven", "windsor-park", "martinique"],
  },

  newhaven: {
    slug: "newhaven",
    tagline:
      "Abacoa’s first neighborhood: about 500 homes begun in 1998, tree-lined streets, two clubhouses and two pools.",
    metaTitle: "Newhaven at Abacoa, Jupiter FL | Homes for Sale & Village Guide",
    metaDescription:
      "Newhaven is the first neighborhood built in Abacoa, Jupiter: single-family homes and townhomes on tree-lined streets with two clubhouses and pools. A buyer’s guide.",
    story: [
      "Newhaven is where Abacoa began. The village association describes it as the first of Abacoa’s communities, with DiVosta completing the first homes in 1998. The Abacoa association counts 505 homes: 405 single-family residences and 100 townhomes, spread across about 114 acres in two sections. Building began in 1998.",
      "Single-family homes run from about 1,300 to 3,500 square feet, three to five bedrooms, each with a private patio, and include one-story courtyard plans alongside two-story homes. The townhomes are three bedrooms with two-car garages. Exteriors vary even where interior plans are similar.",
    ],
    living:
      "Because it’s one of the oldest parts of Abacoa, the landscaping has had time to grow in: the HOA describes narrow streets lined with magnolia, live oak, holly and maple. The village has two resident clubhouses, two pools and a playground at each, and listings also mention tennis and pickleball courts. It is managed by Castle Group.",
    highlights: [
      "The first neighborhood built in Abacoa, begun in 1998",
      "405 single-family homes and 100 townhomes",
      "Two clubhouses, two pools and playgrounds",
      "Narrow, tree-lined streets with varied exteriors",
      "One-story courtyard plans and two-story homes",
    ],
    facts: [
      { label: "Home types", value: "Single-family homes (405) and townhomes (100)" },
      { label: "Builder", value: "DiVosta Homes" },
      { label: "Built", value: "Began in 1998" },
      { label: "Size and bedrooms", value: "Single-family about 1,300–3,500 sq ft, 3–5 bedrooms; townhomes 3 bedrooms" },
      { label: "Village amenities", value: "Two clubhouses, two pools, playgrounds; tennis and pickleball per listings" },
      { label: "Management", value: "Castle Group" },
    ],
    association:
      "Newhaven has its own HOA within the master Abacoa Property Owners’ Assembly, and an APOA estoppel is required on sales. " + ASSOC_NOTE,
    location: [
      "Main streets: Newhaven Boulevard, Poinciana Drive, Sweet Bay Circle, Honeysuckle Drive",
      "HOA office: 112 New Haven Boulevard",
      "The village is split into two sections by other parcels",
    ],
    faqs: [
      { q: "Is Newhaven the oldest part of Abacoa?", a: "It’s described as the first neighborhood built in Abacoa, with the first homes completed in 1998." },
      { q: "What kinds of homes are in Newhaven?", a: "About 405 single-family homes (3–5 bedrooms) and 100 three-bedroom townhomes." },
      { q: "Are the streets wide?", a: "No. The village’s own HOA site describes narrow, tree-lined streets." },
      { q: "What are the amenities?", a: "Two resident clubhouses and two pools, with a playground at each clubhouse." },
    ],
    related: ["mallory-creek", "windsor-park", "tuscany"],
  },

  antigua: {
    slug: "antigua",
    tagline:
      "Antigua at Town Center: live/work and residential townhomes by Main Street, with a clubhouse, resort-style pool and central green.",
    metaTitle: "Antigua at Abacoa Town Center, Jupiter FL | Townhomes for Sale",
    metaDescription:
      "Antigua at Town Center is Abacoa’s live/work townhome village, with walkable access to Main Street. What to know about commercial-use units, plus the association checklist.",
    story: [
      "Antigua, officially Antigua at Town Center, is the Abacoa village closest to the Main Street shops and restaurants. It’s a townhome community of two- and three-story units built in the early 2000s; its homeowners association was incorporated in 2002. County permit records show Town & Country Builders as the builder on part of the village.",
      "The distinctive feature is live/work: according to the Abacoa association, select units on Main Street, West Main, East Main and Cades Bay allow commercial use on the first floor with living space above. The rest of the village is residential only, so confirm the zoning and use for any specific unit.",
    ],
    living:
      "Antigua has a clubhouse, a resort-style pool and a central green, and the Abacoa association describes it as walkable along Main Street to Downtown Abacoa. Public listings put Roger Dean Stadium within walking distance, and one Walk Score source rates the village in the 60s. A typical unit is a three-bedroom of about 1,900 square feet with a two-car garage. Realtime Property Management handles the village.",
    highlights: [
      "Live/work option on Main Street, West Main, East Main and Cades Bay",
      "Walkable to Downtown Abacoa along Main Street",
      "Clubhouse, resort-style pool and central green",
      "Two- and three-story townhomes",
    ],
    facts: [
      { label: "Home types", value: "Townhomes, some live/work" },
      { label: "Builder", value: "Town & Country Builders (per county permits, for part of the village)" },
      { label: "Built", value: "Early 2000s; the HOA was incorporated in 2002" },
      { label: "Typical unit", value: "3 bedrooms, about 1,900 sq ft, two-car garage (listing examples)" },
      { label: "Village amenities", value: "Clubhouse, resort-style pool, central green" },
      { label: "Management", value: "Realtime Property Management" },
    ],
    association:
      "Antigua at Town Center has its own HOA inside the master Abacoa Property Owners’ Assembly, and an APOA estoppel is required on sales. Ask whether a specific unit is approved for commercial use. " + ASSOC_NOTE,
    location: [
      "Live/work frontage: Main Street, West Main, East Main and Cades Bay",
      "Other streets include Parkside Drive and Blowing Point Place",
      "Next to Downtown Abacoa; Abacoa Golf Club and Abacoa Community Park nearby per listings",
    ],
    faqs: [
      { q: "What does live/work mean in Antigua?", a: "Select units on Main Street, West Main, East Main and Cades Bay allow first-floor commercial use with living space above. Most of the village is residential only." },
      { q: "Is Antigua walkable to Town Center?", a: "The Abacoa association describes it as walkable along Main Street to Downtown Abacoa. It’s the most walkable of the villages we researched." },
      { q: "Who manages Antigua?", a: "Realtime Property Management, per the Abacoa Property Owners’ Assembly." },
      { q: "What amenities does Antigua have?", a: "A clubhouse, a resort-style pool and a central green." },
    ],
    related: ["tuscany", "valencia", "martinique"],
  },

  "windsor-park": {
    slug: "windsor-park",
    tagline:
      "Abacoa’s newest village: DiVosta-built single-family homes and townhomes, 3–5 bedrooms, with a clubhouse, pool and fire pit.",
    metaTitle: "Windsor Park at Abacoa, Jupiter FL | Homes & Townhomes for Sale",
    metaDescription:
      "Windsor Park is the newest village in Abacoa, Jupiter: DiVosta-built single-family homes and townhomes from the mid-2010s, with a clubhouse, heated pool and fire pit.",
    story: [
      "Windsor Park at Abacoa is the community’s final and youngest residential village. DiVosta built it, and its parent PulteGroup was marketing it as an active community in 2015, so most homes date from the mid-2010s. That makes it a newer-construction option inside an otherwise early-2000s community.",
      "There are about 16 floor plans, mixing single-family homes and townhomes, from three to five bedrooms (one source says up to six) and roughly 1,500 to 3,800 square feet, in one- and two-story layouts with up to three-car garages. Sources describe the look as Old Florida bungalow in one place and Mediterranean-inspired in another, so judge the exteriors in person.",
    ],
    living:
      "The Abacoa association lists a clubhouse with a fitness center, a heated pool and a fire pit. Listings add a playground and lighted sidewalks and bike paths. Because the homes are newer, buyers typically get features like high-impact windows and lanais, though the trees and landscaping are young compared with older Abacoa villages. Note that MLS records file it as “Windsor Park At Abacoa”; it is not the Windsor Park in North Palm Beach.",
    highlights: [
      "The newest and final residential village in Abacoa",
      "Single-family homes and townhomes, 3–5 bedrooms",
      "Clubhouse with fitness center, heated pool and fire pit",
      "Built by DiVosta in the mid-2010s",
    ],
    facts: [
      { label: "Home types", value: "Single-family homes and townhomes" },
      { label: "Builder", value: "DiVosta Homes" },
      { label: "Built", value: "Mid-2010s (DiVosta was selling here in 2015)" },
      { label: "Size and bedrooms", value: "About 1,500–3,800 sq ft; 3–5 bedrooms; up to 3-car garage" },
      { label: "Village amenities", value: "Clubhouse with fitness center, heated pool, fire pit" },
    ],
    association:
      "Windsor Park sits within the master Abacoa Property Owners’ Assembly. The homeowners association is Windsor Park Abacoa Homeowners Association, Inc., managed by Capital Realty Advisors. " + ASSOC_NOTE,
    location: [
      "Streets include Prescott Drive, Sweet Hill Drive, Wymberly Drive, Avalon Way and Turnbridge Drive",
      "Listings place it west of Military Trail, south of Indian Creek Parkway",
    ],
    faqs: [
      { q: "Is Windsor Park new construction?", a: "It’s the newest village in Abacoa, with most homes built in the mid-2010s. Resale only, so ask about the specific home’s year." },
      { q: "Is it the same as Windsor Park in North Palm Beach?", a: "No. That is a different community. Search for Windsor Park At Abacoa, Jupiter." },
      { q: "What types of homes are there?", a: "Single-family homes and townhomes, 3–5 bedrooms across about 16 plans." },
      { q: "Does the HOA cover exterior maintenance?", a: "Listings for individual homes mention lawn care and exterior painting, but we have not confirmed what the association covers for each home type. Ask for the maintenance responsibility schedule for the specific home." },
    ],
    related: ["mallory-creek", "newhaven", "tuscany"],
  },

  valencia: {
    slug: "valencia",
    tagline:
      "Abacoa’s custom-home village: about 137 Mediterranean single-family estates, 3–6 bedrooms, many with private pools.",
    metaTitle: "Valencia at Abacoa, Jupiter FL | Custom Mediterranean Homes for Sale",
    metaDescription:
      "Valencia is Abacoa’s custom-home village in Jupiter: about 137 Mediterranean single-family estates, many with pools, near lakes and a nature preserve. A buyer’s guide.",
    story: [
      "Valencia at Abacoa is a village of custom-built single-family homes, about 137 of them (the village association’s own pages give both 136 and 137), with homes recorded as built as early as 2003. Builders include Frankel-Paone and The Spear Group, which reports building 52 of the homes. This is not a condo or townhome village.",
      "Homes run from about 2,300 to over 5,000 square feet under air, three to six bedrooms, in a Mediterranean style: stucco, arched doorways or iron gates and terra-cotta tile roofs, with private pools and lanais common. Of the Abacoa villages we checked, this is the one that skews highest in size and price.",
    ],
    living:
      "The village association lists a clubhouse, fitness center, heated pool, playground and green space. Listings describe two large lakes, trails and a nature preserve along its southeast edge. It sits at the northeast corner of Frederick Small Road and Central Boulevard, west of Military Trail. We did not find a source for walking distance to Town Center, so test the route yourself.",
    highlights: [
      "About 137 custom single-family homes, 3–6 bedrooms",
      "Mediterranean styling, private pools and lanais common",
      "Two lakes, trails and a nature preserve edge",
      "Village clubhouse, fitness center, heated pool and playground",
    ],
    facts: [
      { label: "Home types", value: "Custom single-family homes (about 137)" },
      { label: "Builders", value: "Frankel-Paone and The Spear Group, among others" },
      { label: "Built", value: "From about 2003" },
      { label: "Size and bedrooms", value: "About 2,300–5,000+ sq ft; 3–6 bedrooms" },
      { label: "Village amenities", value: "Clubhouse, fitness center, heated pool, playground, green space" },
      { label: "Management", value: "Harbor Management of South Florida" },
    ],
    association:
      "Valencia sits within the master Abacoa Property Owners’ Assembly. The homeowners association is Valencia at Abacoa Homeowners Association, Inc., managed by Harbor Management of South Florida. " + ASSOC_NOTE,
    location: [
      "Streets: Santiago Drive, Avila Way, Segovia Way",
      "Northeast corner of Frederick Small Road and Central Boulevard, west of Military Trail",
    ],
    faqs: [
      { q: "Is Valencia condos or townhomes?", a: "No. Public sources describe custom single-family homes. If you saw condo language elsewhere, it was wrong." },
      { q: "What styles are the homes?", a: "Mediterranean: stucco, tile roofs and arched details, with private pools common." },
      { q: "How big are the homes?", a: "Roughly 2,300 to over 5,000 square feet, three to six bedrooms." },
      { q: "Where is Valencia?", a: "At the northeast corner of Frederick Small Road and Central Boulevard, west of Military Trail. We did not find a source for walking distance to Town Center, so test the route yourself." },
    ],
    related: ["mallory-creek", "newhaven", "tuscany"],
  },

  martinique: {
    slug: "martinique",
    tagline:
      "A Caribbean-style Abacoa village of townhomes and single-family homes, with a clubhouse, pool, fitness center and picnic pavilion.",
    metaTitle: "Martinique at Abacoa, Jupiter FL | Townhomes & Homes for Sale",
    metaDescription:
      "Martinique at Abacoa is a Caribbean-style village of townhomes and single-family homes in Jupiter, with a clubhouse, pool and fitness center. A buyer’s guide.",
    story: [
      "Martinique at Abacoa is a Caribbean-style village of townhomes and single-family houses in the north-west part of Abacoa; MLS records split it into Martinique At Abacoa 1 and 2. DiVosta built most of the homes, with custom homes along Greenway Drive. The village association counts 456 homes and lots: 200 townhomes, 220 single-family homes and 36 custom homes or lots. County records show a Plat 2 home built in 2006.",
      "Townhomes are three-bedroom units in two- and three-story layouts, while the houses run three to five bedrooms. We found no condos here, despite older wording elsewhere. Note that this is not the Martinique in Coconut Creek.",
    ],
    living:
      "The village association lists a clubhouse, pool, picnic pavilion, fitness center and tot lot; listings also mention a Village Green, a Civic Center, tennis and trails. The east edge borders a nature preserve, and Roger Dean Stadium is described as a few minutes away, which means a short drive or bike ride rather than a verified walk.",
    highlights: [
      "Townhomes and single-family houses, not condos",
      "Caribbean-style architecture",
      "Clubhouse, pool, picnic pavilion, fitness center and tot lot",
      "East edge borders a nature preserve",
    ],
    facts: [
      { label: "Home types", value: "200 townhomes, 220 single-family homes and 36 custom homes or lots (456 in all)" },
      { label: "Builders", value: "DiVosta (most homes); custom homes along Greenway Drive" },
      { label: "Built", value: "Mid-2000s (a 2006 home is recorded on Plat 2)" },
      { label: "Bedrooms", value: "Townhomes 3; houses 3–5" },
      { label: "Village amenities", value: "Clubhouse, pool, picnic pavilion, fitness center, tot lot" },
      { label: "Management", value: "Triton Property Management" },
    ],
    association:
      "Martinique sits within the master Abacoa Property Owners’ Assembly. One homeowners association, Martinique Homeowners Association, Inc., is managed by Triton Property Management. The county records two plats, Martinique 1 and 2, so confirm which recorded documents apply to the address. " + ASSOC_NOTE,
    location: [
      "Streets: Soriano Drive, Lagrange Way, Greenway Drive, West Community Drive",
      "North-west part of Abacoa, with a nature preserve on the east edge",
    ],
    faqs: [
      { q: "Is Martinique a condo community?", a: "No. We found townhomes and single-family houses, no condo buildings." },
      { q: "Why does searching “Martinique” miss homes?", a: "The MLS files them as Martinique At Abacoa 1 and 2, and the name “Martinique” also exists in other Florida cities. The search on this page covers both Abacoa sections and only Jupiter." },
      { q: "What are the amenities?", a: "A clubhouse, pool, picnic pavilion, fitness center and tot lot, per the village association." },
    ],
    related: ["antigua", "tuscany", "canterbury-place"],
  },

  "canterbury-place": {
    slug: "canterbury-place",
    tagline:
      "A lake-view village of 144 single-family homes and 173 townhomes in a Tuscan and French country style, with a pool and clubhouse.",
    metaTitle: "Canterbury Place at Abacoa, Jupiter FL | Homes & Townhomes for Sale",
    metaDescription:
      "Canterbury Place at Abacoa has 144 single-family homes and 173 townhomes around a lake, with a heated pool and clubhouse. Includes some Dakota Drive townhomes.",
    story: [
      "Canterbury Place is a mixed village of 144 single-family homes and 173 townhomes, according to the Abacoa Property Owners’ Assembly. The architecture is Tuscan and French country; listing pages add barrel clay tile roofs, arched entries and louvered shutters. Centex Homes built it, mostly about 2006–2007, though individual homes in listing records range from about 2005 to 2010.",
      "The homes surround a natural lake with tropical landscaping, and the Abacoa association says residents can walk or bike to Abacoa restaurants and shops. If you’ve seen townhomes advertised on Dakota Drive, some of them are filed under Canterbury Place in the MLS; others on the same street are not.",
    ],
    living:
      "Amenities are a heated pool and a clubhouse with a grand room, fitness center and aerobics studio. Townhomes on Dakota Drive are typically two-story, three-bedroom units; the single-family homes go up to five bedrooms. Canterbury Place has its own management company, Triton Property Management, under the master association.",
    highlights: [
      "144 single-family homes and 173 townhomes",
      "Tuscan and French country architecture around a lake",
      "Heated pool, clubhouse, fitness center and aerobics studio",
      "Includes some Dakota Drive townhomes; the street also serves other villages",
    ],
    facts: [
      { label: "Home types", value: "Single-family homes (144) and townhomes (173)" },
      { label: "Builder", value: "Centex Homes" },
      { label: "Built", value: "About 2006–2007" },
      { label: "Style", value: "Tuscan and French country" },
      { label: "Village amenities", value: "Lake, heated pool, clubhouse, fitness center, aerobics studio" },
      { label: "Management", value: "Triton Property Management" },
    ],
    association:
      "Canterbury Place sits under the master Abacoa Property Owners’ Assembly and has its own management company. An APOA estoppel is required on sales. " + ASSOC_NOTE,
    location: [
      "Neighborhood address (Abacoa POA): 318 Mulligan Place",
      "Some Dakota Drive townhomes, in the 500s block among the MLS records we checked, are filed under Canterbury Place. Confirm the subdivision on the listing.",
    ],
    faqs: [
      { q: "Are there condos in Canterbury Place?", a: "No. The village is 144 single-family homes and 173 townhomes." },
      { q: "Are the Dakota Drive townhomes part of Canterbury Place?", a: "Some are. Dakota Drive runs through several Abacoa villages, so the subdivision on the listing decides, not the street name. Our Dakota Drive guide explains how to tell them apart." },
      { q: "What amenities does it have?", a: "A lake, a heated pool, a clubhouse with a grand room, a fitness center and an aerobics studio." },
    ],
    related: ["charleston-court", "martinique", "antigua"],
  },

  "charleston-court": {
    slug: "charleston-court",
    tagline:
      "Victorian-style three-bedroom townhomes overlooking Abacoa Golf Club, a short walk to Downtown Abacoa and Roger Dean Stadium.",
    metaTitle: "Charleston Court at Abacoa, Jupiter FL | Townhomes for Sale",
    metaDescription:
      "Charleston Court is a Victorian-style Abacoa townhome community overlooking the golf club in Jupiter. Three-bedroom townhomes near Downtown Abacoa. A buyer’s guide.",
    story: [
      "Charleston Court is a townhome community that, per the Abacoa association, overlooks Abacoa Golf Club and is a short walk to Downtown Abacoa and Roger Dean Stadium. The village association counts 188 townhomes in a Victorian style, built in two phases between 1999 and 2000, and credits Abacoa Homes, a DiVosta company, as the builder.",
      "There are two floor plans, both three bedrooms: about 1,600 and 1,825 square feet, and the larger plan has a detached garage and private patio. The association confirms a community pool with a bathhouse; we have not confirmed whether there is a separate clubhouse.",
    ],
    living:
      "The draw is the location: golf-course views on one side and the Town Center and stadium on the other, in one of the older parts of Abacoa. The village is managed by Harbor Management of South Florida under the master association.",
    highlights: [
      "Overlooks Abacoa Golf Club",
      "Short walk to Downtown Abacoa and Roger Dean Stadium",
      "Victorian styling, a distinct look in South Florida",
      "Three-bedroom townhomes in two floor plans",
      "Community pool with bathhouse",
    ],
    facts: [
      { label: "Home types", value: "Townhomes (188)" },
      { label: "Builder", value: "Abacoa Homes, a DiVosta company" },
      { label: "Built", value: "1999–2000, in two phases" },
      { label: "Floor plans", value: "Two, both 3 bedrooms (about 1,600 and 1,825 sq ft)" },
      { label: "Style", value: "Victorian" },
      { label: "Village amenities", value: "Community pool with bathhouse" },
      { label: "Management", value: "Harbor Management of South Florida" },
    ],
    association:
      "Charleston Court has its own management company under the master Abacoa Property Owners’ Assembly, and an APOA estoppel is required on sales. The village has a community pool with a bathhouse. " + ASSOC_NOTE,
    location: [
      "Overlooks Abacoa Golf Club",
      "Short walk to Downtown Abacoa and Roger Dean Stadium, per the Abacoa association",
    ],
    faqs: [
      { q: "What types of homes are in Charleston Court?", a: "Three-bedroom townhomes in two floor plans, about 1,600 and 1,825 square feet." },
      { q: "Is Charleston Court on the golf course?", a: "Per the Abacoa association it overlooks Abacoa Golf Club, with many homes facing the course." },
      { q: "Does it have a pool?", a: "Yes. The village association confirms a community pool with a bathhouse. Ask whether there is also a separate clubhouse." },
    ],
    related: ["canterbury-place", "osceola-woods", "antigua"],
  },

  "osceola-woods": {
    slug: "osceola-woods",
    tagline:
      "About 146 three-story townhomes near Downtown Abacoa, with a community pool and a nature preserve behind them.",
    metaTitle: "Osceola Woods at Abacoa, Jupiter FL | Townhomes for Sale",
    metaDescription:
      "Osceola Woods is a three-story townhome village in Abacoa, Jupiter, a short walk to Downtown Abacoa, with a community pool and a nature preserve. A buyer’s guide.",
    story: [
      "Osceola Woods is a village of 146 three-story townhomes built in the early 2000s, in a coastal Mediterranean style. The Abacoa association says it is within easy walking distance of Abacoa Plaza and Downtown Abacoa. New Urban Communities developed it; listings that say “CBS” are describing block-and-stucco construction, not a builder.",
      "These are not single-level homes. The floor plans stack three stories, which suits buyers who want space and a garage in a townhome but may not suit anyone avoiding stairs.",
    ],
    living:
      "Residents share a community pool, and the homes back onto a nature preserve rather than a lake. The village is managed by Community ACE under the master association, with its association address on Apalachee Lane.",
    highlights: [
      "Short walk to Abacoa Plaza and Downtown Abacoa",
      "Three-story townhomes, 146 homes",
      "Community pool",
      "Backs onto a nature preserve",
    ],
    facts: [
      { label: "Home types", value: "Three-story townhomes (146)" },
      { label: "Developer", value: "New Urban Communities" },
      { label: "Built", value: "Early 2000s" },
      { label: "Style", value: "Coastal Mediterranean" },
      { label: "Village amenities", value: "Community pool" },
      { label: "Management", value: "Community ACE" },
    ],
    association:
      "Osceola Woods has its own management company under the master Abacoa Property Owners’ Assembly, and an APOA estoppel is required on sales. " + ASSOC_NOTE,
    location: [
      "Association address: Apalachee Lane",
      "Within easy walking distance of Abacoa Plaza and Downtown Abacoa, per the Abacoa association",
      "Backs onto a nature preserve",
    ],
    faqs: [
      { q: "How many stories are the Osceola Woods townhomes?", a: "Three. These are not single-level homes." },
      { q: "Can I walk to Downtown Abacoa?", a: "The Abacoa association says it is within easy walking distance of Abacoa Plaza and Downtown Abacoa." },
      { q: "What amenities does it have?", a: "A community pool, which is the village’s main amenity." },
    ],
    related: ["charleston-court", "antigua", "canterbury-place"],
  },

  tuscany: {
    slug: "tuscany",
    tagline:
      "A Mediterranean-style DiVosta village of 446 single-family homes and townhomes, with a clubhouse, pool and playground.",
    metaTitle: "Tuscany at Abacoa, Jupiter FL | Homes & Townhomes for Sale",
    metaDescription:
      "Tuscany at Abacoa is a Mediterranean-style village of 446 single-family homes and townhomes in Jupiter, with a clubhouse and heated pool. A buyer’s guide.",
    story: [
      "Tuscany at Abacoa is a DiVosta-built village of 446 single-family homes and townhomes, according to the village association, with homes recorded as built as early as 2003. The look is Mediterranean: stucco, barrel tile roofs and arched entryways. Single-family plans run from two to five bedrooms, and the townhomes are roughly 1,800 square feet.",
      "Streets include San Remo Drive and Community Drive, and several others appear in listings. Because it is a large village with different home types, always check which part you are looking at.",
    ],
    living:
      "Residents share a reservable clubhouse with a heated pool, a playground and trails. The village has its own homeowners association, incorporated in 2001 and managed by Triton Property Management.",
    highlights: [
      "446 single-family homes and townhomes",
      "Mediterranean architecture with barrel tile roofs",
      "Clubhouse with heated pool, playground and trails",
      "Own homeowners association within Abacoa",
    ],
    facts: [
      { label: "Home types", value: "Single-family homes and townhomes (446)" },
      { label: "Builder", value: "DiVosta Homes" },
      { label: "Built", value: "From about 2003" },
      { label: "Size and bedrooms", value: "Single-family 2–5 bedrooms; townhomes about 1,800 sq ft" },
      { label: "Village amenities", value: "Reservable clubhouse, heated pool, playground, trails" },
      { label: "Management", value: "Triton Property Management" },
    ],
    association:
      "Tuscany at Abacoa Homeowners Association sits within the master Abacoa Property Owners’ Assembly. Ask exactly what the village dues cover for your home type, including lawn care and cable. " + ASSOC_NOTE,
    location: [
      "Streets include San Remo Drive and Community Drive",
    ],
    faqs: [
      { q: "What types of homes are in Tuscany?", a: "Single-family homes (2–5 bedrooms) and townhomes of about 1,800 square feet." },
      { q: "Who built Tuscany?", a: "The village association credits DiVosta Homes, with homes built from about 2003." },
      { q: "What does the HOA cover?", a: "The association does not publish a coverage schedule. Ask for the current documents, including the landscape scope and any bulk cable service, for your home type." },
    ],
    related: ["newhaven", "windsor-park", "antigua"],
  },

  dakota: {
    slug: "dakota",
    heading: "Dakota Drive in Abacoa: Which Village Is Your Address In?",
    nameExplainer: true,
    tagline:
      "Dakota Drive runs through several Abacoa villages, and Dakota at Abacoa is a rental community. Here is how to tell which one an address belongs to.",
    metaTitle: "Dakota Drive in Abacoa, Jupiter FL | Which Village Is Your Address In?",
    metaDescription:
      "Dakota Drive runs through several Abacoa villages, and Dakota at Abacoa is a separate rental community. See how to tell a Canterbury Place townhome from a Somerset condo before you search.",
    story: [
      "In Abacoa, “Dakota” means two different things, and neither is a for-sale village. Dakota Drive is a long street that passes through several neighborhoods. Dakota at Abacoa is a rental community: the Abacoa Property Owners’ Assembly describes it as 190 luxury apartments and townhomes at 3334 South Bismark Lane. Its leasing office is on South Bismark Lane, and Town of Jupiter records place part of the development on the south side of Dakota Drive. It is a rental community, not for sale.",
      "A home on Dakota Drive is filed in the MLS under its village, not its street. In the records we checked on November 18, 2026, townhomes in the 500s block were listed under Canterbury Place, while condominiums in the 700s block were listed under Somerset at Abacoa. The Abacoa association lists Martinique at 1812 Dakota Drive, and Town records show Mallory Creek bordering the street. Searching for “Dakota” alone finds none of this: the Ylopo search index has no Jupiter area by that name, and its only Dakota community is in Delray Beach.",
    ],
    living:
      "Which village a Dakota Drive address belongs to decides everything that matters to an owner: the association, its dues and rules, the amenities and, for Canterbury Place, the heated pool and clubhouse. Treat each address on its own. Look at the subdivision on the listing, then ask for the association documents for that exact village.",
    highlights: [
      "Dakota Drive passes through several Abacoa villages",
      "Some townhomes in the 500s block are filed under Canterbury Place",
      "Somerset at Abacoa condominiums also have Dakota Drive addresses",
      "Dakota at Abacoa is a rental community with its leasing office on South Bismark Lane and frontage on Dakota Drive",
    ],
    facts: [
      { label: "What it is", value: "A street running through several Abacoa villages" },
      { label: "Filed in the MLS as", value: "The village name on each listing, such as Canterbury Place or Somerset at Abacoa" },
      { label: "Dakota at Abacoa", value: "A rental community of 190 apartments and townhomes per the Abacoa POA; leasing office at 3334 S. Bismark Lane, with frontage on Dakota Drive" },
      { label: "Not to confuse with", value: "Dakota in Delray Beach, the only Dakota community in the Ylopo search index" },
    ],
    association:
      "There is no Dakota Drive association. The association depends on the village the home belongs to. " + ASSOC_NOTE,
    location: [
      "Dakota Drive crosses several Abacoa villages",
      "Dakota at Abacoa: leasing office at 3334 South Bismark Lane, with frontage on Dakota Drive; a rental community",
      "For Canterbury Place homes, see the Canterbury Place page",
    ],
    faqs: [
      { q: "Is Dakota an Abacoa village?", a: "Not as a for-sale village. Dakota Drive is a street that runs through several villages, and Dakota at Abacoa is a rental community." },
      { q: "Why do some Dakota Drive townhomes show up under Canterbury Place?", a: "Because the MLS files homes by village. Some townhomes on the street belong to Canterbury Place; others on the same street do not." },
      { q: "What is Dakota at Abacoa?", a: "A rental community of 190 apartments and townhomes, per the Abacoa Property Owners’ Assembly. Its leasing office is on South Bismark Lane and the development also fronts Dakota Drive. It is not part of the for-sale inventory." },
      { q: "How should I search?", a: "Search by village name, then check the subdivision on any Dakota Drive listing. We can confirm the village and association for a specific address." },
    ],
    related: ["canterbury-place", "martinique", "mallory-creek"],
  },
}

export const VILLAGE_SLUGS = Object.keys(VILLAGES)
