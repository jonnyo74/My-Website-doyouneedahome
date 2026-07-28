// Thin wrapper around the GA4 gtag() global already loaded in src/app/layout.tsx.
// Never pass name/email/phone or any other PII as an event param here.

type GtagParams = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function trackEvent(event: string, params?: GtagParams): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', event, params)
}
