export interface UtmAndReferrer {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  referrer?: string
}

const STORAGE_KEY = 'dhg-first-touch-utm'

/**
 * Read UTM params from the current URL, falling back to first-touch values
 * captured earlier in the session — a visitor who lands from an ad and then
 * browses to a community page before converting should still carry the
 * campaign attribution.
 */
export function getUtmAndReferrer(): UtmAndReferrer {
  if (typeof window === 'undefined') return {}

  const params = new URLSearchParams(window.location.search)
  const current: UtmAndReferrer = {
    utmSource: params.get('utm_source') ?? undefined,
    utmMedium: params.get('utm_medium') ?? undefined,
    utmCampaign: params.get('utm_campaign') ?? undefined,
    utmContent: params.get('utm_content') ?? undefined,
    referrer: document.referrer || undefined,
  }

  try {
    if (current.utmSource || current.utmMedium || current.utmCampaign) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current))
      return current
    }
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) {
      const first = JSON.parse(stored) as UtmAndReferrer
      return { ...first, referrer: current.referrer ?? first.referrer }
    }
  } catch {
    // sessionStorage unavailable (private mode) — current values are fine
  }
  return current
}

/** Capture first-touch UTMs as soon as any lead-magnet component mounts. */
export function captureFirstTouchUtm(): void {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  if (!params.get('utm_source') && !params.get('utm_medium') && !params.get('utm_campaign')) return
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        utmSource: params.get('utm_source') ?? undefined,
        utmMedium: params.get('utm_medium') ?? undefined,
        utmCampaign: params.get('utm_campaign') ?? undefined,
        utmContent: params.get('utm_content') ?? undefined,
        referrer: document.referrer || undefined,
      }),
    )
  } catch {
    // ignore
  }
}
