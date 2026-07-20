import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [

      // ── YLOPO TOOLS PAGE ──────────────────────────────────────────────
      // Ylopo hosts the branded-site tools page on its own subdomain
      // (tools.doyouneedahome.com, DNS set up via Ylopo case #00446128),
      // not this Next.js app — forward /tools there instead of 404ing.
      { source: '/tools', destination: 'https://tools.doyouneedahome.com', permanent: false },

      // ── TEAM ──────────────────────────────────────────────────────────
      // /team is canonical; /team-page is the old Squarespace duplicate
      { source: '/team-page', destination: '/team', permanent: true },
      // Old Squarespace agent sub-pages — no /team/[slug] route in new build
      { source: '/team/john-oliver', destination: '/team', permanent: true },
      { source: '/team/christine-dekant', destination: '/team', permanent: true },

      // ── CONTACT ───────────────────────────────────────────────────────
      { source: '/contact-us', destination: '/contact', permanent: true },

      // ── SELL ──────────────────────────────────────────────────────────
      { source: '/why-list-with-us', destination: '/sell', permanent: true },

      // ── /communities/[city]-real-estate → /communities/[slug] ─────────
      { source: '/communities/north-palm-beach-real-estate', destination: '/communities/north-palm-beach', permanent: true },
      { source: '/communities/jupiter-real-estate', destination: '/communities/jupiter', permanent: true },
      { source: '/communities/lake-worth-real-estate', destination: '/communities/lake-worth-beach', permanent: true },
      { source: '/communities/palm-beach-gardens-real-estate', destination: '/communities/palm-beach-gardens', permanent: true },
      { source: '/communities/port-saint-lucie-real-estate', destination: '/communities/port-st-lucie', permanent: true },
      { source: '/communities/west-palm-beach-real-estate', destination: '/communities/west-palm-beach', permanent: true },
      { source: '/communities/boca-raton-real-estate', destination: '/communities/boca-raton', permanent: true },
      { source: '/communities/delray-beach-real-estate', destination: '/communities/delray-beach', permanent: true },
      { source: '/communities/wellington-real-estate', destination: '/communities/wellington', permanent: true },
      { source: '/communities/singer-island-real-estate', destination: '/communities/singer-island', permanent: true },
      { source: '/communities/tequesta-real-estate', destination: '/communities/tequesta', permanent: true },
      { source: '/communities/juno-beach-real-estate', destination: '/communities/juno-beach', permanent: true },

      // ── /new-communities listing ───────────────────────────────────────
      { source: '/new-communities', destination: '/communities', permanent: true },

      // ── /new-communities/[slug]-real-estate → /communities/[slug] ─────
      { source: '/new-communities/avenir-real-estate', destination: '/communities/avenir', permanent: true },
      { source: '/new-communities/avenier-real-estate', destination: '/communities/avenir', permanent: true }, // typo Google indexed
      { source: '/new-communities/pga-national-real-estate', destination: '/communities/pga-national', permanent: true },
      { source: '/new-communities/canterbury-place-real-estate', destination: '/communities/canterbury-place', permanent: true },
      { source: '/new-communities/abacoa-real-estate', destination: '/communities/abacoa', permanent: true },
      { source: '/new-communities/ballenisles-real-estate', destination: '/communities/ballen-isles', permanent: true },
      { source: '/new-communities/ibis-golf-and-country-club-real-estate', destination: '/communities/ibis', permanent: true },
      { source: '/new-communities/trump-national-golf-club-real-estate', destination: '/communities/trump-national-jupiter', permanent: true },
      { source: '/new-communities/jonathans-landing-real-estate', destination: '/communities/jonathans-landing', permanent: true },
      { source: '/new-communities/jupiter-country-club-real-estate', destination: '/communities/jupiter-country-club', permanent: true },
      { source: '/new-communities/the-loxahatchee-club-real-estate', destination: '/communities/loxahatchee-club', permanent: true },
      { source: '/new-communities/sonoma-isles-real-estate', destination: '/communities/sonoma-isles', permanent: true },
      { source: '/new-communities/alton-real-estate', destination: '/communities/alton', permanent: true },
      // No-match communities (Mirabella, Jupiter Farms, Old Port Cove, Artistry,
      // Jupiter Yacht Club) will be built as neighborhood sections inside city pages.
      { source: '/new-communities/mirabella-real-estate', destination: '/communities/palm-beach-gardens', permanent: true },
      { source: '/new-communities/jupiter-farms-real-estate', destination: '/communities/jupiter', permanent: true },
      { source: '/new-communities/old-port-cove-real-estate', destination: '/communities/north-palm-beach', permanent: true },
      { source: '/new-communities/artistry-real-estate', destination: '/communities/palm-beach-gardens', permanent: true },
      { source: '/new-communities/jupiter-yacht-club-real-estate', destination: '/communities/jupiter', permanent: true },

      // ── BLOG — old Squarespace date-based paths ────────────────────────
      // Two posts with matching relocation content in the new build:
      { source: '/blog/2024/11/5/why-juno-beach-florida-might-be-your-new-home', destination: '/blog/who-should-move-to-juno-beach-florida', permanent: true },
      { source: '/blog/2025/2/28/living-in-the-village-of-north-palm-beach-florida', destination: '/blog/what-its-really-like-living-in-north-palm-beach-florida', permanent: true },
      // Remaining old posts (tips/events/PR) — no equivalent content; send to /blog
      { source: '/blog/2025/2/28/exciting-march-events-in-northern-palm-beach-county', destination: '/blog', permanent: true },
      { source: '/blog/2026/4/15/understanding-cash-to-close-in-real-estate', destination: '/blog', permanent: true },
      { source: '/blog/2026/1/20/simple-but-effective-habits-for-a-cleaner-and-tidier-home-all-year', destination: '/blog', permanent: true },
      { source: '/blog/2026/2/23/5-ways-your-neighbors-can-affect-your-homes-value', destination: '/blog', permanent: true },
      { source: '/blog/2026/2/10/from-date-nights-to-mortgage-payments-tips-for-couples-buying-their-first-home-together', destination: '/blog', permanent: true },
      { source: '/blog/2024/2/16/score-clients-with-these-top-rated-realtor-review-websites', destination: '/blog', permanent: true },
      { source: '/blog/2026/1/7/why-you-should-list-your-home-at-the-beginning-of-the-year', destination: '/blog', permanent: true },
      { source: '/blog/2025/2/23/celebrating-johns-achievement-elevating-real-estate-excellence', destination: '/blog', permanent: true },

    ]
  },
};

export default nextConfig;
