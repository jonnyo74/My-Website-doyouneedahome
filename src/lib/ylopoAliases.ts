// Extra MLS names a community's homes are filed under, keyed by the name the
// listings widget is given (a community's `ylopoLocation ?? name`). The widget
// ORs every alias in alongside the main name.
//
// Listing agents type the subdivision field by hand, so one gated community can
// appear under its marketing name, its recorded plat name, or a plat name cut
// off partway. Lotus is the worked case: John's MLS export of its sales
// (2026-09-23) showed "LOTUS", "Lotus" and eight variants of
// "BRIDGES MIZNER PUD BRIDGES SOUTH PLAT …", and "Lotus" alone returned 8 of the
// 11 actives.
//
// Kept out of communities.ts on purpose: YlopoResultsWidget is rendered from
// client templates, and importing the full communities data there would ship
// it to the browser.
//
// Only add a name after checking it returns nothing outside the community. The
// widget pins every name to the page's city, which is what keeps The Bridges
// (the Delray Beach half of the Bridges Mizner PUD) out of Lotus.

export const YLOPO_ALIASES: Record<string, string[]> = {
  // Verified 2026-09-23: the union returns exactly the 11 actives in John's
  // export, all 33496.
  Lotus: [
    'Lotus-Bridges Mizner Pud Bridges South',
    'Lotus-Bridges Mizner Pud Bridges South Plat On',
    'Bridges Mizner Pud Bridges South Plat On',
    'Bridges Mizner Pud Bridges South Plat One',
    'Bridges Mizner Pud Bridges South Plat Three',
    'Bridges Mizner Pud Bridges South Plat Five',
    'Bridges Mizner Pud Bridges South Plat Six',
    'Bridges Mizner Pud Bridges South Plat Seven',
    'Bridges Mizner Pud Bridges S',
    'Bridges Mizner Pud Bridge',
  ],
}

export function getYlopoAliases(name: string): string[] {
  return YLOPO_ALIASES[name] ?? []
}
