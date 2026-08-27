'use client'

// Minimal pub/sub, same pattern as lightboxBus.ts: the seller CTAs scattered
// through the page's server-rendered sections open the single mounted
// LotusAnalysisModal without threading a React context through every section.
//
// `origin` is the CTA that opened it — it becomes the cta_location on every
// GA4 event fired from inside the modal, so John can see which of the two
// placements actually converts.

type Listener = (origin: string) => void

let listener: Listener | null = null

export function openAnalysis(origin: string) {
  listener?.(origin)
}

export function onOpenAnalysis(fn: Listener): () => void {
  listener = fn
  return () => {
    if (listener === fn) listener = null
  }
}
