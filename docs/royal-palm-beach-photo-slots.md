# Royal Palm Beach photography slots

Status: **no images installed.** RPB articles have no `heroImage`, so the blog page renders the standard text layout. No substitute or stock photography is in the repo.

## Blog #1 — What It's Really Like Living in Royal Palm Beach

| Slot | Size | Subject | Placement |
| --- | --- | --- | --- |
| Hero | 1600x900 (16:9) | Wide, daytime view of a Village park, lake or a residential street | Full-width above the opening |
| Park | 960x1200 (4:5) | Commons Park lake, trail or pavilion | Beside "Parks Are Part of the Lifestyle" |
| Street | 1200x800 | Residential street scene, no identifiable people, plates or house numbers | "Housing Feels Different Block by Block" |
| Weekend | 1200x800 | Event or recreation scene, no identifiable faces | "Weekends and Recreation" |

3–5 supporting visuals in total.

## Source policy

- Photos taken by John / DO Homes Group in the Village (preferred), or licensed images that genuinely show Royal Palm Beach.
- Generic stock (including Unsplash) is allowed only if it is not captioned, alt-texted or placed as if it shows Royal Palm Beach. Use decorative alt text, no place names, and never in a slot that implies a specific park or street.
- Every image needs an entry in a new manifest (`src/lib/royalPalmBeachImageProvenance.json`) with source, license, photographer and URL, and a city entry in `scripts/audit-city-images.mjs`, before it is wired to `heroImage`.
- No people's faces, license plates or house numbers without a release.

## To wire up once assets exist

1. Add files to `public/images/royal-palm-beach/`.
2. Add manifest entries and the guard config.
3. Set `heroImage`, width and height on the article; the page builds the editorial layout from them.

## Blog #2 — A Local's Guide to Royal Palm Beach

Status: illustrative stock hero only (a street-view crop of the FilterGrade photo, credited and captioned as not showing a specific Royal Palm Beach location). No supporting images are installed on this article.

| Slot | Size | Subject | Placement |
| --- | --- | --- | --- |
| Hero | 1600x900 (16:9) | Park path, lake edge or public recreation setting in the Village | Full-width above the opening |
| Park | 1200x800 | Commons Park trail, pavilion or lake | "The Everyday Map" |
| Streetscape | 1200x800 | A main road or residential street, no identifiable people, plates or house numbers | "Get Your Bearings" |
| Public space | 1200x800 | Pavilion, trailhead or Village public-space detail | "Community Calendar and Getting Involved" |

An accurate map graphic is optional and only if it can be checked against the Village's own map.

The same source policy applies as blog #1. The illustrative stock images already in `public/images/royal-palm-beach/` (street, neighborhood aerial) are credited and captioned as not showing a Royal Palm Beach location; reusing them here as a second hero would repeat the same image across the cluster, so this article stays text-only until original Village photography exists.

## Blog #3 — Best Neighborhoods in Royal Palm Beach: How to Choose

Status: illustrative stock only. Hero is a 16:9 crop of the neighborhood aerial; one supporting image (detached homes) sits under "The Main Royal Palm Beach Housing Patterns". Both are credited to the photographers on Unsplash and captioned as not showing a specific Royal Palm Beach location.

Still open (needs original or properly licensed Royal Palm Beach photography): a park-adjacent or lake-edge scene, a golf-adjacent or amenity-community setting that can be verified as such, an established residential street, and an optional comparison graphic. The article names only Madison Green, so any community-setting image must be verified for that community.

## Blog #4 — Best Things to Do in Royal Palm Beach

Status: illustrative stock hero only (a crop of the Lesia aerial showing trees and lawn beside a neighborhood street, credited and captioned as not showing a specific Royal Palm Beach location). It is not a park photo, and this is the article that most needs real photography.

Needed (original or properly licensed Royal Palm Beach photography): a Commons Park hero (lake edge, path or pavilion), a Village program or community-event setting, a second Village park (for example Veterans Park or Preservation Park), and a nearby-outing image that is clearly labeled with its real location (for example a county park or natural area). An accurate local-and-nearby activity map is optional.

## Blog #5 — Is Royal Palm Beach a Practical Fit for Your Day-to-Day Priorities?

Status: illustrative stock hero only (a crop of the FilterGrade street photo showing homes and a driveway, credited and captioned as not showing a specific Royal Palm Beach location). No supporting images yet.

Needed (original or properly licensed Royal Palm Beach photography): a Village park or lake-edge scene for the hero, a residential street verified as inside the Village, a public-space or recreation detail, and optionally a visual version of the priorities table.

## Blog #6 — The Real Pros and Cons of Living in Royal Palm Beach

Status: illustrative stock hero only (a crop of the Lesia aerial showing rooftops and yards, credited and captioned as not showing a specific Royal Palm Beach location). The decision matrix and the exact-address checklist are built as on-page tables and lists, not images.

Needed (original or properly licensed Royal Palm Beach photography): a recognizable public setting such as Commons Park for the hero, a verified public-recreation image, and an optional streetscape that can be verified as inside the Village. An orientation map graphic is only worth adding if it can be checked against the Village's own map.

## Blog #7 — Cost of Living in Royal Palm Beach: What to Budget For

Status: illustrative stock hero only (a crop of the Lesia aerial showing rooftops and a street, credited and captioned as not showing a specific Royal Palm Beach location, a listing or an address). The cost framework table, worksheet and checklist are on-page content.

Needed (original or properly licensed Royal Palm Beach photography): a genuine Village public setting for the hero, an established streetscape that does not show a private home's address, and optionally an orientation map that is checked against the Village's own map.
