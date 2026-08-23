'use client'

// Minimal pub/sub so the photo frames scattered through the page's server-
// rendered sections can open the single Lightbox instance without threading a
// React context through every section boundary.

type Listener = (index: number) => void

let listener: Listener | null = null

export function openLightbox(index: number) {
  listener?.(index)
}

export function onOpenLightbox(fn: Listener): () => void {
  listener = fn
  return () => {
    if (listener === fn) listener = null
  }
}
