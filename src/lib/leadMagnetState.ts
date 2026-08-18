// Client-side record of which lead magnets this visitor has already downloaded.
//
// The old behaviour stored a single flag and suppressed every future offer
// after one download — so a visitor who took the single-family report never saw
// the relocation guide or the condo checklist. This stores a map of
// magnet key → edition instead, so suppression is per magnet and per edition:
// a new month's market report is a new offer, an evergreen guide you already
// have is not.

import type { LeadMagnetKey } from '@/lib/leadMagnets'

const STORAGE_KEY = 'dhg-lead-magnet-downloads'
/** Fired on this tab when a download is recorded — 'storage' only fires on others. */
const CHANGE_EVENT = 'dhg-lead-magnet-download'
/** Pre-registry key. Its presence means the visitor took a PBC market report. */
const LEGACY_STORAGE_KEY = 'dhg-report-downloaded'

type DownloadMap = Partial<Record<LeadMagnetKey, string>>

function read(): DownloadMap {
  if (typeof window === 'undefined') return {}
  let map: DownloadMap = {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') map = parsed as DownloadMap
    }
    // Migrate the legacy flag on read rather than with a one-off script: its
    // value was the edition string of whichever report was downloaded.
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacy && !map['single-family'] && !map['condo-townhome']) {
      map = { ...map, 'single-family': legacy, 'condo-townhome': legacy }
    }
  } catch {
    // storage unavailable (private mode) — treat as nothing downloaded
  }
  return map
}

/** Record a successful download so this magnet stops being re-offered. */
export function markDownloaded(key: LeadMagnetKey, edition: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...read(), [key]: edition }))
  } catch {
    // ignore
  }
  // Let any CTA on this page swap itself for its next-step variant immediately,
  // rather than waiting for the next navigation.
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

/**
 * Subscribe to download-state changes. Paired with useSyncExternalStore so a
 * component can read localStorage without a setState-in-effect.
 */
export function subscribeToDownloads(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(CHANGE_EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}

/**
 * True when this visitor already has this exact edition. A new edition of a
 * monthly report reads as false, which is the point — it is a new offer.
 */
export function hasDownloaded(key: LeadMagnetKey, edition: string): boolean {
  return read()[key] === edition
}

/** True when the visitor has downloaded anything at all. */
export function hasDownloadedAny(): boolean {
  return Object.keys(read()).length > 0
}
