# Loxahatchee image provenance

Status: Loxahatchee blog #1 ships with an **editorial illustration** hero, not a photograph. No Loxahatchee, Acreage, pasture or canal photography was found in the OneDrive library or Slack, and the tourism-bureau media page could not be reached from the build environment. Swap in real photography as soon as it is supplied.

| File | What it is | Source |
| --- | --- | --- |
| `loxahatchee-country-road-golden-hour-hero.webp` | 1920x1080 hero: shell-rock road, slash pines, palmettos, rail fence and canal at golden hour | Original vector artwork generated for DO Homes Group. No people, animals or vehicles. Not a photograph. |
| `loxahatchee-country-road-golden-hour-mobile.webp` | 1200x800 crop of the same artwork for phones | Same |
| `loxahatchee-what-would-you-do-with-an-acre.webp` | "What would you do with an acre?" editorial graphic | Original artwork. Illustrative only, not a site plan. |
| `loxahatchee-orientation-graphic.webp` | Orientation sketch: The Acreage, Loxahatchee Groves, Westlake, Royal Palm Beach, Wellington | Original artwork. Not a legal, municipal or survey boundary map. |

## To replace the hero with a photograph

1. Add the photo (and a phone crop) to `public/images/loxahatchee/`.
2. Add a row above with photographer, licence or written permission, and date.
3. Update `heroImage`, `heroImageAlt`, `heroImageCaption`, `heroImageCredit`, `heroImageWidth`, `heroImageHeight` and `editorial.mobileImage` on the article.
4. Never use stock cowboy, desert, mountain, Texas-ranch or generic Everglades airboat imagery.
