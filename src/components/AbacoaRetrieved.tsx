'use client'

import { useSyncExternalStore } from 'react'

/**
 * The market widget is a live Ylopo feed with no data date of its own, so the
 * only honest date we can show is when this page pulled it: today, in the
 * visitor's browser. The server snapshot is empty to avoid a hydration mismatch.
 */
const subscribe = () => () => {}
const today = () =>
  new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

export default function AbacoaRetrieved() {
  const label = useSyncExternalStore(subscribe, today, () => '')
  return <span>{label ? `Live feed retrieved ${label}` : 'Live feed'}</span>
}
