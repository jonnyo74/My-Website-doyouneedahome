// Paths of the blog posts that carry Discover The Palm Beaches photos.
//
// Kept apart from discoverPhotos.json so the sitewide offer layer (a client component) does not
// bundle the whole photo manifest. scripts/discover-photos.test.mjs fails if this list and the
// manifest ever disagree. On these paths the sticky bar and exit-intent offer stay off.

export const DISCOVER_POST_PATHS: string[] = [
  '/blog/best-places-to-eat-drink-hang-out-in-boca-raton-florida',
  '/blog/best-places-to-eat-drink-hang-out-in-delray-beach-florida',
  '/blog/best-places-to-eat-drink-hang-out-in-jupiter-florida',
  '/blog/best-things-to-do-in-boca-raton-florida',
  '/blog/best-things-to-do-in-delray-beach-florida',
  '/blog/best-things-to-do-in-juno-beach-florida',
  '/blog/best-things-to-do-in-jupiter-florida',
  '/blog/best-things-to-do-in-lake-worth-beach-florida',
  '/blog/best-things-to-do-in-north-palm-beach-florida',
  '/blog/best-things-to-do-in-singer-island-florida',
  '/blog/hidden-gems-in-boca-raton-florida',
  '/blog/hidden-gems-in-juno-beach-florida',
  '/blog/hidden-gems-in-north-palm-beach-florida',
  '/blog/hidden-gems-in-singer-island-florida',
  '/blog/local-guide-to-boca-raton-florida',
  '/blog/local-guide-to-delray-beach-florida',
  '/blog/local-guide-to-juno-beach-florida',
  '/blog/local-guide-to-north-palm-beach-florida',
]
