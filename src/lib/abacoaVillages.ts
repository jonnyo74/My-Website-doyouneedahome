// Fact-checked content for the Abacoa village pages.
//
// Source: the village fact sheets researched 2026-10-17 (kept in
// "Claude outputs/village-facts/"). The abacoa.com pages are the Abacoa
// Property Owners' Assembly (APOA) and count as official; builder names and
// build years mostly come from public listings and brokerage pages, so the copy
// says "listings credit" / "per public listings" rather than stating them flat.
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
  /** Listings widget filter, when the MLS files the homes under another name. */
  listingsLocation?: string
  listingsHeading?: string
  listingsNote?: string
  /** Hero H1 override. */
  heading?: string
  /** Set when this page explains a name instead of describing a village. */
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
      "Mallory Creek is a Key West–inspired Abacoa village of single-family homes and townhomes in Jupiter. See live listings, what the village offers, and what to check with the association.",
    story: [
      "Mallory Creek is one of Abacoa’s larger villages: about 581 homes, made up of roughly 267 single-family homes and 314 townhomes. The Abacoa Property Owners’ Assembly names DiVosta Homes as the builder, and public listings show homes finished from about 2009 into the mid-2010s, though sources differ on the exact years.",
      "The styling is Key West–inspired, and the streets carry the theme: Islamorada Drive, Key Largo Street, Windley Key Way. There are more than twenty floor plans, from about 1,500 to 4,800 square feet and from three to six bedrooms, so the village works for very different buyers under one roof.",
    ],
    living:
      "Life here centers on the village clubhouse (with an on-site management office), two heated pools and a playground, with several lakes running through the neighborhood. It sits just south of Indian Creek Parkway between Florida’s Turnpike and Military Trail. One honest note on walkability: the village scores low on Walk Score, so plan on a short bike ride or drive to Abacoa Town Center rather than a stroll.",
    highlights: [
      "About 267 single-family homes and 314 townhomes in one village",
      "Clubhouse, two heated pools and a playground",
      "Key West–inspired styling; 3–6 bedrooms across 20+ floor plans",
      "Streets named for the Keys, with lakes through the village",
      "Managed by Triton Property Management inside the master Abacoa association",
    ],
    facts: [
      { label: "Home types", value: "Single-family homes and townhomes (about 267 and 314)" },
      { label: "Builder", value: "DiVosta Homes (per the Abacoa association)" },
      { label: "Built", value: "Roughly 2009–2014 per public listings; sources vary" },
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
      { q: "Is Mallory Creek single-family or townhomes?", a: "Both. Public sources count roughly 267 single-family homes and 314 townhomes, so check the property type on any listing." },
      { q: "Who built Mallory Creek?", a: "The Abacoa Property Owners’ Assembly names DiVosta Homes as the builder." },
      { q: "Can I walk to Abacoa Town Center from Mallory Creek?", a: "It’s a short bike ride or drive for most addresses. The village’s Walk Score is low, so walk the route yourself before relying on it." },
      { q: "What amenities does Mallory Creek have?", a: "A clubhouse, two heated pools and a playground, managed on site by Triton Property Management." },
      { q: "What should I ask about the HOA?", a: ASSOC_NOTE },
    ],
    related: ["newhaven", "windsor-park", "martinique"],
  },

  newhaven: {
    slug: "newhaven",
    tagline:
      "Abacoa’s first neighborhood: about 500 homes begun in 1998, tree-lined streets, two clubhouses and two pools.",
    metaTitle: "Newhaven at Abacoa, Jupiter FL | Homes for Sale & Village Guide",
    metaDescription:
      "Newhaven is the first neighborhood built in Abacoa, Jupiter: single-family homes and townhomes on tree-lined streets with two clubhouses and pools. Live listings and a buyer’s guide.",
    story: [
      "Newhaven is where Abacoa began. The village association describes it as the first of Abacoa’s communities, with DiVosta completing the first homes in 1998. The Abacoa association counts 505 homes: 405 single-family residences and 100 townhomes, spread across about 114 acres in two sections. Building ran roughly 1998 to 2001.",
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
      { label: "Built", value: "About 1998–2001" },
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
      { q: "What should I ask about the HOA?", a: ASSOC_NOTE },
    ],
    related: ["mallory-creek", "windsor-park", "tuscany"],
  },

  antigua: {
    slug: "antigua",
    tagline:
      "Antigua at Town Center: about 280 live/work townhomes by Main Street, with a clubhouse, resort-style pool and central green.",
    metaTitle: "Antigua at Abacoa Town Center, Jupiter FL | Townhomes for Sale",
    metaDescription:
      "Antigua at Town Center is Abacoa’s live/work townhome village, with walkable access to Main Street. See live listings, what to know about commercial-use units, and the association checklist.",
    story: [
      "Antigua, officially Antigua at Town Center, is the Abacoa village closest to the Main Street shops and restaurants. It’s a townhome community of roughly 280 units built around 2004–2006, two or three stories each. Listings credit Town & Country Builders, though no official builder statement turned up.",
      "The distinctive feature is live/work: according to the Abacoa association, select units on Main Street, West Main, East Main and Cades Bay allow commercial use on the first floor with living space above. The rest of the village is residential only, so confirm the zoning and use for any specific unit.",
    ],
    living:
      "Antigua has a clubhouse, a resort-style pool and a central green, and the Abacoa association describes it as walkable along Main Street to Downtown Abacoa. Public listings put Roger Dean Stadium within walking distance, and one Walk Score source rates the village in the 60s. A typical unit is a three-bedroom of about 1,900 square feet with a two-car garage. Realtime Property Management handles the village.",
    highlights: [
      "Live/work option on Main Street, West Main, East Main and Cades Bay",
      "Walkable to Downtown Abacoa along Main Street",
      "Clubhouse, resort-style pool and central green",
      "Roughly 280 townhomes, two to three stories",
    ],
    facts: [
      { label: "Home types", value: "Townhomes, some live/work (about 280)" },
      { label: "Builder", value: "Listings credit Town & Country Builders" },
      { label: "Built", value: "About 2004–2006 per listings" },
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
      { q: "How many homes are in Antigua?", a: "Roughly 280 townhomes, though brokerage sources give slightly different counts." },
      { q: "What amenities does Antigua have?", a: "A clubhouse, a resort-style pool and a central green." },
      { q: "What should I ask about the HOA?", a: ASSOC_NOTE },
    ],
    related: ["tuscany", "valencia", "martinique"],
  },

  "windsor-park": {
    slug: "windsor-park",
    tagline:
      "Abacoa’s newest village: about 380 DiVosta-built single-family homes and townhomes, 3–5 bedrooms, with a clubhouse, pool and fire pit.",
    metaTitle: "Windsor Park at Abacoa, Jupiter FL | Newer Homes for Sale",
    metaDescription:
      "Windsor Park is the newest village in Abacoa, Jupiter: DiVosta-built single-family homes and townhomes from roughly 2013 to 2018 with a clubhouse, heated pool and fire pit. Live listings and a buyer’s guide.",
    story: [
      "Windsor Park at Abacoa is the community’s final and youngest residential village. Public listings credit DiVosta Homes, with construction from about 2013 to 2018 and roughly 380 homes in all. That makes it a newer-construction option inside an otherwise early-2000s community.",
      "There are about 16 floor plans, mixing single-family homes and townhomes, from three to five bedrooms (one source says up to six) and roughly 1,500 to 3,800 square feet, in one- and two-story layouts with up to three-car garages. Sources describe the look as Old Florida bungalow in one place and Mediterranean-inspired in another, so judge the exteriors in person.",
    ],
    living:
      "Village amenities per listings are a clubhouse with fitness and club rooms, a heated pool, a fire-pit picnic area, a playground and lighted sidewalks and bike paths. Because the homes are newer, buyers typically get features like high-impact windows and lanais, though the trees and landscaping are young compared with older Abacoa villages. Note that MLS records file it as “Windsor Park At Abacoa”; it is not the Windsor Park in North Palm Beach.",
    highlights: [
      "The newest and final residential village in Abacoa",
      "Single-family homes and townhomes, 3–5 bedrooms",
      "Clubhouse with fitness, heated pool, fire pit and playground",
      "Built about 2013–2018 by DiVosta, per listings",
    ],
    facts: [
      { label: "Home types", value: "Single-family homes and townhomes (about 380)" },
      { label: "Builder", value: "DiVosta Homes, per listings" },
      { label: "Built", value: "About 2013–2018 per listings" },
      { label: "Size and bedrooms", value: "About 1,500–3,800 sq ft; 3–5 bedrooms; up to 3-car garage" },
      { label: "Village amenities", value: "Clubhouse with fitness, heated pool, fire pit, playground" },
    ],
    association:
      "Windsor Park sits within the master Abacoa Property Owners’ Assembly. We did not find the village association’s name or management company, so we will pull the documents for any address you’re considering. " + ASSOC_NOTE,
    location: [
      "Streets include Prescott Drive, Sweet Hill Drive, Wymberly Drive, Avalon Way and Turnbridge Drive",
      "Listings place it west of Military Trail, south of Indian Creek Parkway",
    ],
    faqs: [
      { q: "Is Windsor Park new construction?", a: "It’s the newest village in Abacoa, with homes built from roughly 2013 to 2018. Resale only, so ask about the specific home’s year." },
      { q: "Is it the same as Windsor Park in North Palm Beach?", a: "No. That is a different community. Search for Windsor Park At Abacoa, Jupiter." },
      { q: "What types of homes are there?", a: "Single-family homes and townhomes, 3–5 bedrooms across about 16 plans." },
      { q: "Does the HOA cover exterior maintenance?", a: "One listing says it covers lawn care and exterior painting, but that is a single source. Confirm with the association for the specific home." },
      { q: "What should I ask about the HOA?", a: ASSOC_NOTE },
    ],
    related: ["mallory-creek", "newhaven", "tuscany"],
  },

  valencia: {
    slug: "valencia",
    tagline:
      "Abacoa’s custom-home village: about 137 Mediterranean single-family estates, 3–6 bedrooms, many with private pools.",
    metaTitle: "Valencia at Abacoa, Jupiter FL | Custom Mediterranean Homes for Sale",
    metaDescription:
      "Valencia is Abacoa’s custom-home village in Jupiter: about 137 Mediterranean single-family estates, many with pools, near lakes and a nature preserve. Live listings and a buyer’s guide.",
    story: [
      "Valencia at Abacoa is a village of custom-built single-family homes, about 137 of them, finished around 2003–2004. Listing pages name several builders, including Frankel-Paone, Issa, Delcrest and The Spear Group, but we have not confirmed that list at the page level. This is not a condo or townhome village.",
      "Homes run from about 2,300 to over 5,000 square feet under air, three to six bedrooms, in a Mediterranean style: stucco, arched doorways or iron gates and terra-cotta tile roofs, with private pools and lanais common. Of the Abacoa villages we checked, this is the one that skews highest in size and price.",
    ],
    living:
      "Per listings, the village has a clubhouse, fitness center, heated pool and a mini-park maintained by the HOA, with two large lakes, trails and a nature preserve along its southeast edge. It sits at the northeast corner of Frederick Small Road and Central Boulevard, west of Military Trail. We did not find a source for walking distance to Town Center, so test the route yourself.",
    highlights: [
      "About 137 custom single-family homes, 3–6 bedrooms",
      "Mediterranean styling, private pools and lanais common",
      "Two lakes, trails and a nature preserve edge",
      "Village clubhouse, fitness center, heated pool and mini-park",
    ],
    facts: [
      { label: "Home types", value: "Custom single-family homes (about 137)" },
      { label: "Builders", value: "Listings name Frankel-Paone, Issa, Delcrest and The Spear Group" },
      { label: "Built", value: "About 2003–2004 per listings" },
      { label: "Size and bedrooms", value: "About 2,300–5,000+ sq ft; 3–6 bedrooms" },
      { label: "Village amenities", value: "Clubhouse, fitness center, heated pool, mini-park (per listings)" },
    ],
    association:
      "Valencia sits within the master Abacoa Property Owners’ Assembly. We did not find the village association’s name or management company, so we will pull the documents for any address you’re considering. " + ASSOC_NOTE,
    location: [
      "Streets: Santiago Drive, Avila Way, Segovia Way",
      "Northeast corner of Frederick Small Road and Central Boulevard, west of Military Trail",
    ],
    faqs: [
      { q: "Is Valencia condos or townhomes?", a: "No. Public sources describe custom single-family homes. If you saw condo language elsewhere, it was wrong." },
      { q: "What styles are the homes?", a: "Mediterranean: stucco, tile roofs and arched details, with private pools common." },
      { q: "How big are the homes?", a: "Roughly 2,300 to over 5,000 square feet, three to six bedrooms." },
      { q: "What should I ask about the HOA?", a: ASSOC_NOTE },
    ],
    related: ["mallory-creek", "newhaven", "tuscany"],
  },

  martinique: {
    slug: "martinique",
    tagline:
      "A Caribbean-style Abacoa village of townhomes and single-family homes, with a Village Green, heated pool and Civic Center.",
    metaTitle: "Martinique at Abacoa, Jupiter FL | Townhomes & Homes for Sale",
    metaDescription:
      "Martinique at Abacoa is a Caribbean-style village of townhomes and single-family homes in Jupiter, with a Village Green, heated pool and Civic Center. Live listings and a buyer’s guide.",
    story: [
      "Martinique at Abacoa is a Caribbean-style village of townhomes and single-family houses in the north-west part of Abacoa; MLS records split it into Martinique At Abacoa 1 and 2. DiVosta built most of the homes, with townhomes from about 2005 and single-family around 2006, and custom homes by builders including Frankel-Paone and Issa. Sources do not agree on the exact count of homes.",
      "Townhomes are three-bedroom units in two- and three-story layouts, while the houses run three to five bedrooms. We found no condos here, despite older wording elsewhere. Note that this is not the Martinique in Coconut Creek.",
    ],
    living:
      "The village’s amenities center on a Village Green with a heated pool, cabana and playground, plus a Civic Center; listings add a clubhouse, fitness center, basketball court, tennis and trails. The east edge borders a nature preserve, and Roger Dean Stadium is described as a few minutes away, which means a short drive or bike ride rather than a verified walk.",
    highlights: [
      "Townhomes and single-family houses, not condos",
      "Caribbean-style architecture",
      "Village Green with heated pool, cabana and playground; Civic Center",
      "East edge borders a nature preserve",
    ],
    facts: [
      { label: "Home types", value: "Townhomes and single-family homes" },
      { label: "Builders", value: "DiVosta (most homes); custom homes by Frankel-Paone and Issa" },
      { label: "Built", value: "About 2005–2007 per listings" },
      { label: "Bedrooms", value: "Townhomes 3; houses 3–5" },
      { label: "Village amenities", value: "Village Green, heated pool, cabana, playground, Civic Center" },
    ],
    association:
      "Martinique sits within the master Abacoa Property Owners’ Assembly. We did not confirm whether Martinique 1 and 2 have separate associations, so ask which one governs the address. " + ASSOC_NOTE,
    location: [
      "Streets: Soriano Drive, Lagrange Way, Greenway Drive, West Community Drive",
      "North-west part of Abacoa, with a nature preserve on the east edge",
    ],
    faqs: [
      { q: "Is Martinique a condo community?", a: "No. We found townhomes and single-family houses, no condo buildings." },
      { q: "Is it the same as Martinique in Coconut Creek?", a: "No. This one is in Abacoa, Jupiter." },
      { q: "What are the amenities?", a: "A Village Green with a heated pool, cabana and playground, plus a Civic Center." },
      { q: "What should I ask about the HOA?", a: ASSOC_NOTE },
    ],
    related: ["antigua", "tuscany", "canterbury-place"],
  },

  "canterbury-place": {
    slug: "canterbury-place",
    tagline:
      "A lake-view village of 144 single-family homes and 173 townhomes in a Tuscan and French country style, with a pool and clubhouse.",
    metaTitle: "Canterbury Place at Abacoa, Jupiter FL | Homes & Townhomes for Sale",
    metaDescription:
      "Canterbury Place at Abacoa has 144 single-family homes and 173 townhomes around a lake, with a heated pool and clubhouse. Includes the Dakota Drive townhomes. Live listings and a buyer’s guide.",
    story: [
      "Canterbury Place is a mixed village of 144 single-family homes and 173 townhomes, according to the Abacoa Property Owners’ Assembly. The architecture is Tuscan and French country; listing pages add barrel clay tile roofs, arched entries and louvered shutters. Listings credit Centex Homes, mostly about 2006–2007, though individual homes range from about 2005 to 2010.",
      "The homes surround a natural lake with tropical landscaping, and the Abacoa association says residents can walk or bike to Abacoa restaurants and shops. If you’ve seen townhomes advertised on Dakota Drive, many of them are part of Canterbury Place in the MLS.",
    ],
    living:
      "Amenities are a heated pool and a clubhouse with a grand room, fitness center and aerobics studio. Townhomes on Dakota Drive are typically two-story, three-bedroom units; the single-family homes go up to five bedrooms. Canterbury Place has its own management company, Triton Property Management, under the master association.",
    highlights: [
      "144 single-family homes and 173 townhomes",
      "Tuscan and French country architecture around a lake",
      "Heated pool, clubhouse, fitness center and aerobics studio",
      "Includes many Dakota Drive townhomes",
    ],
    facts: [
      { label: "Home types", value: "Single-family homes (144) and townhomes (173)" },
      { label: "Builder", value: "Listings credit Centex Homes" },
      { label: "Built", value: "Mostly about 2006–2007; some 2005–2010" },
      { label: "Style", value: "Tuscan and French country" },
      { label: "Village amenities", value: "Lake, heated pool, clubhouse, fitness center, aerobics studio" },
      { label: "Management", value: "Triton Property Management" },
    ],
    association:
      "Canterbury Place sits under the master Abacoa Property Owners’ Assembly and has its own management company. An APOA estoppel is required on sales. " + ASSOC_NOTE,
    location: [
      "Association address: 318 Mulligan Place",
      "Dakota Drive townhomes in roughly the 500–700 block are filed under Canterbury Place",
    ],
    faqs: [
      { q: "Are there condos in Canterbury Place?", a: "No. The village is 144 single-family homes and 173 townhomes." },
      { q: "Are the Dakota Drive townhomes part of Canterbury Place?", a: "Many are, per MLS records. Dakota Drive runs through several Abacoa villages, so check the subdivision on the listing." },
      { q: "What amenities does it have?", a: "A lake, a heated pool, a clubhouse with a grand room, a fitness center and an aerobics studio." },
      { q: "What should I ask about the HOA?", a: ASSOC_NOTE },
    ],
    related: ["charleston-court", "martinique", "antigua"],
  },

  "charleston-court": {
    slug: "charleston-court",
    tagline:
      "Victorian-style three-bedroom townhomes overlooking Abacoa Golf Club, a short walk to Downtown Abacoa and Roger Dean Stadium.",
    metaTitle: "Charleston Court at Abacoa, Jupiter FL | Townhomes for Sale",
    metaDescription:
      "Charleston Court is a Victorian-style Abacoa townhome community overlooking the golf club in Jupiter. Three-bedroom townhomes near Downtown Abacoa. Live listings and a buyer’s guide.",
    story: [
      "Charleston Court is a townhome community that, per the Abacoa association, overlooks Abacoa Golf Club and is a short walk to Downtown Abacoa and Roger Dean Stadium. Listings describe Victorian styling, built in two phases around 1999 and 2000, with roughly 190 units. Listings credit DiVosta, but we could not confirm that.",
      "There are two floor plans, both three bedrooms: about 1,600 and 1,825 square feet, and the larger plan has a detached garage and private patio. We found no pool or clubhouse listed for the village, so don’t assume one.",
    ],
    living:
      "The draw is the location: golf-course views on one side and the Town Center and stadium on the other, in one of the older parts of Abacoa. The village is managed by Harbor Management of South Florida under the master association.",
    highlights: [
      "Overlooks Abacoa Golf Club",
      "Short walk to Downtown Abacoa and Roger Dean Stadium",
      "Victorian styling, a distinct look in South Florida",
      "Three-bedroom townhomes in two floor plans",
    ],
    facts: [
      { label: "Home types", value: "Townhomes (about 190)" },
      { label: "Built", value: "About 1999–2000 per listings" },
      { label: "Floor plans", value: "Two, both 3 bedrooms (about 1,600 and 1,825 sq ft)" },
      { label: "Style", value: "Victorian" },
      { label: "Management", value: "Harbor Management of South Florida" },
    ],
    association:
      "Charleston Court has its own management company under the master Abacoa Property Owners’ Assembly, and an APOA estoppel is required on sales. We found no village pool or clubhouse listed. " + ASSOC_NOTE,
    location: [
      "Overlooks Abacoa Golf Club",
      "Short walk to Downtown Abacoa and Roger Dean Stadium, per the Abacoa association",
    ],
    faqs: [
      { q: "What types of homes are in Charleston Court?", a: "Three-bedroom townhomes in two floor plans, about 1,600 and 1,825 square feet." },
      { q: "Is Charleston Court on the golf course?", a: "Per the Abacoa association it overlooks Abacoa Golf Club, with many homes facing the course." },
      { q: "Does it have a pool?", a: "We didn’t find one listed for the village. Ask the association." },
      { q: "What should I ask about the HOA?", a: ASSOC_NOTE },
    ],
    related: ["canterbury-place", "osceola-woods", "antigua"],
  },

  "osceola-woods": {
    slug: "osceola-woods",
    tagline:
      "About 146 three-story townhomes near Downtown Abacoa, with a clubhouse, pool and nature preserve behind them.",
    metaTitle: "Osceola Woods at Abacoa, Jupiter FL | Townhomes for Sale",
    metaDescription:
      "Osceola Woods is a three-story townhome village in Abacoa, Jupiter, a short walk to Downtown Abacoa, with a clubhouse, pool and nature preserve. Live listings and a buyer’s guide.",
    story: [
      "Osceola Woods is a village of roughly 146 three-story townhomes built about 2002–2003, in a coastal Mediterranean style. The Abacoa association says it is within easy walking distance of Abacoa Plaza and Downtown Abacoa. The builder is uncertain: search summaries name New Urban Communities, while listings that say “CBS” are describing block-and-stucco construction, not a builder.",
      "These are not single-level homes. The floor plans stack three stories, which suits buyers who want space and a garage in a townhome but may not suit anyone avoiding stairs.",
    ],
    living:
      "Per listings, residents share a clubhouse and pool, a playground and trails, and the homes back onto a nature preserve rather than a lake. The village is managed by Community ACE under the master association, with its association address on Apalachee Lane.",
    highlights: [
      "Short walk to Abacoa Plaza and Downtown Abacoa",
      "Three-story townhomes, about 146 homes",
      "Clubhouse, pool, playground and trails (per listings)",
      "Backs onto a nature preserve",
    ],
    facts: [
      { label: "Home types", value: "Three-story townhomes (about 146)" },
      { label: "Built", value: "About 2002–2003 per listings" },
      { label: "Style", value: "Coastal Mediterranean" },
      { label: "Village amenities", value: "Clubhouse, pool, playground, trails (per listings)" },
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
      { q: "What amenities does it have?", a: "Per listings, a clubhouse, pool, playground and trails." },
      { q: "What should I ask about the HOA?", a: ASSOC_NOTE },
    ],
    related: ["charleston-court", "antigua", "canterbury-place"],
  },

  tuscany: {
    slug: "tuscany",
    tagline:
      "A Mediterranean-style DiVosta village of 453 single-family homes and townhomes, with a clubhouse, pool and playground.",
    metaTitle: "Tuscany at Abacoa, Jupiter FL | Homes & Townhomes for Sale",
    metaDescription:
      "Tuscany at Abacoa is a Mediterranean-style village of 453 single-family homes and townhomes in Jupiter, built around 2004, with a clubhouse and pool. Live listings and a buyer’s guide.",
    story: [
      "Tuscany at Abacoa is a DiVosta-built village of 453 single-family homes and townhomes, finished around 2004. The look is Mediterranean: stucco, barrel tile roofs and arched entryways. Single-family plans run from two to five bedrooms, and the townhomes are roughly 1,800 square feet.",
      "Streets include San Remo Drive and Community Drive, and several others appear in listings. Because it is a large village with different home types, always check which part you are looking at.",
    ],
    living:
      "Residents share a reservable clubhouse with a pool, a playground and trails. The village has its own homeowners association, active since 2001 and shown as managed by Triton Property Management in a 2025 state-index mirror; one source says it covers lawn care and basic cable, which we have not confirmed.",
    highlights: [
      "453 single-family homes and townhomes",
      "Mediterranean architecture with barrel tile roofs",
      "Clubhouse with pool, playground and trails",
      "Own homeowners association within Abacoa",
    ],
    facts: [
      { label: "Home types", value: "Single-family homes and townhomes (453)" },
      { label: "Builder", value: "DiVosta Homes" },
      { label: "Built", value: "About 2004" },
      { label: "Size and bedrooms", value: "Single-family 2–5 bedrooms; townhomes about 1,800 sq ft" },
      { label: "Village amenities", value: "Reservable clubhouse, pool, playground, trails" },
    ],
    association:
      "Tuscany at Abacoa Homeowners Association sits within the master Abacoa Property Owners’ Assembly. Confirm exactly what the village dues cover, since one source mentions lawn care and basic cable. " + ASSOC_NOTE,
    location: [
      "Streets include San Remo Drive and Community Drive",
    ],
    faqs: [
      { q: "What types of homes are in Tuscany?", a: "Single-family homes (2–5 bedrooms) and townhomes of about 1,800 square feet." },
      { q: "Who built Tuscany?", a: "Listings credit DiVosta Homes, with homes finished around 2004." },
      { q: "What does the HOA cover?", a: "One source says lawn care and basic cable, but we haven’t confirmed it. Ask for the current documents." },
      { q: "What should I ask about the HOA?", a: ASSOC_NOTE },
    ],
    related: ["newhaven", "windsor-park", "antigua"],
  },

  dakota: {
    slug: "dakota",
    heading: "Dakota Drive Homes in Abacoa",
    nameExplainer: true,
    tagline:
      "Dakota Drive runs through several Abacoa villages. Many of its townhomes are listed under Canterbury Place.",
    metaTitle: "Dakota Drive in Abacoa, Jupiter FL | Townhomes & Where to Search",
    metaDescription:
      "Dakota Drive runs through several Abacoa villages. Many of its townhomes are part of Canterbury Place. Here is how to search Abacoa homes on and near Dakota Drive.",
    story: [
      "“Dakota” in Abacoa is a street name more than a village. Dakota Drive is a long road that runs through several Abacoa neighborhoods. Homes on it are filed in different subdivisions, so searching for “Dakota” alone misses most of them or returns the wrong community. The MLS’s only “Dakota” community is in Delray Beach, a different place entirely.",
      "In the roughly 500–700 block, the Dakota Drive townhomes are part of Canterbury Place, with two-story, three-bedroom townhomes that listings credit to Centex Homes, built around 2006–2007. Other Dakota Drive addresses belong to Somerset at Abacoa, Mallory Creek and Martinique. A separate rental community called Dakota at Abacoa also exists; it is not a for-sale village.",
    ],
    living:
      "If you’re looking at a Dakota Drive townhome, the village it belongs to is what determines the association, amenities and rules. For the Canterbury Place townhomes that means a heated pool, clubhouse and fitness center. Treat any other Dakota Drive address individually and confirm its subdivision on the listing.",
    highlights: [
      "Dakota Drive passes through several Abacoa villages",
      "Many townhomes in the 500–700 block are part of Canterbury Place",
      "Other addresses belong to Somerset at Abacoa, Mallory Creek and Martinique",
      "Dakota at Abacoa is a separate rental community",
    ],
    facts: [
      { label: "What it is", value: "A street running through several Abacoa villages" },
      { label: "Dakota Drive townhomes", value: "Many filed under Canterbury Place (Centex, about 2006–2007 per listings)" },
      { label: "Not to confuse with", value: "Dakota at Abacoa, a rental community; and Dakota in Delray Beach" },
    ],
    association:
      "The association depends on the subdivision the home belongs to. " + ASSOC_NOTE,
    location: [
      "Dakota Drive crosses several Abacoa villages",
      "Canterbury Place listings below include the Dakota Drive townhomes in that village",
    ],
    faqs: [
      { q: "Is Dakota an Abacoa village?", a: "Not as a for-sale village. Dakota Drive is a street that runs through several villages." },
      { q: "Why do Dakota Drive townhomes show up under Canterbury Place?", a: "Many of them are part of Canterbury Place in the MLS." },
      { q: "What is Dakota at Abacoa?", a: "A separate rental community, not the for-sale townhomes." },
      { q: "How should I search?", a: "Search by the village name, or ask us to confirm the subdivision of any Dakota Drive address." },
    ],
    related: ["canterbury-place", "mallory-creek", "martinique"],
    listingsLocation: "Canterbury Place",
    listingsHeading: "Canterbury Place homes, including many on Dakota Drive",
    listingsNote:
      "These are Canterbury Place listings. Homes on other parts of Dakota Drive belong to other villages.",
  },
}

export const VILLAGE_SLUGS = Object.keys(VILLAGES)
