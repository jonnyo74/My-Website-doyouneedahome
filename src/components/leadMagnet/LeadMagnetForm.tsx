'use client'

import { useRef, useState } from 'react'
import type { LeadMagnet } from '@/lib/leadMagnets'
import { markDownloaded } from '@/lib/leadMagnetState'
import { trackEvent } from '@/lib/analytics'
import { getUtmAndReferrer } from '@/lib/utm'
import FormConsent from '@/components/FormConsent'
import { CURRENT_CONSENT_VERSION } from '@/lib/consent'

export const INTEREST_OPTIONS = [
  'Buying',
  'Selling',
  'Buying and selling',
  'Just researching',
] as const

/** Mirrors AREA_OPTIONS / TIMELINE_OPTIONS in src/lib/leadHelpers.ts. */
const AREA_OPTIONS = [
  'Northern Palm Beach County',
  'Central Palm Beach County',
  'Southern Palm Beach County',
  'Western Palm Beach County',
  'Martin County / Treasure Coast',
  'St. Lucie County',
  'Still deciding',
] as const

const TIMELINE_OPTIONS = [
  'Within 3 months',
  '3 to 6 months',
  '6 to 12 months',
  'More than a year',
  'No specific timeline',
] as const

interface FormValues {
  firstName: string
  email: string
  phone: string
  interest: string
  honeypot: string
}

const EMPTY: FormValues = { firstName: '', email: '', phone: '', interest: '', honeypot: '' }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values: FormValues): Partial<Record<keyof FormValues, string>> {
  const errors: Partial<Record<keyof FormValues, string>> = {}
  if (!values.firstName.trim()) errors.firstName = 'Please enter your first name.'
  if (!values.email.trim()) errors.email = 'Please enter your email address.'
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Please enter a valid email address.'
  if (!values.interest) errors.interest = 'Please select an option.'
  return errors
}

export interface LeadMagnetFormProps {
  magnet: LeadMagnet
  /** Where the CTA lives, e.g. 'sidebar', 'inline', 'exit-intent', 'landing-hero' */
  ctaLocation: string
  /** Page bucket for analytics/CRM, e.g. 'community', 'blog', 'landing-page' */
  pageCategory: string
  idPrefix: string
  /** Light form (landing pages, white background) vs dark (navy modal) */
  tone?: 'light' | 'dark'
  onSuccess?: () => void
}

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function LeadMagnetForm({
  magnet,
  ctaLocation,
  pageCategory,
  idPrefix,
  tone = 'light',
  onSuccess,
}: LeadMagnetFormProps) {
  const [values, setValues] = useState<FormValues>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [serverError, setServerError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  // Optional second step — asked only after the download has been handed over.
  const [area, setArea] = useState('')
  const [timeline, setTimeline] = useState('')
  const [followUpSent, setFollowUpSent] = useState(false)
  const startedRef = useRef(false)
  const submittingRef = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)

  const analyticsParams = {
    magnet_key: magnet.key,
    magnet_id: magnet.id,
    magnet_kind: magnet.kind,
    magnet_edition: magnet.edition,
    // Kept as an alias of magnet_key so GA4 reports built on the original
    // two-report event schema keep working.
    report_type: magnet.key,
    report_edition: magnet.edition,
    cta_location: ctaLocation,
    page_category: pageCategory,
    page_url: typeof window !== 'undefined' ? window.location.pathname : undefined,
  }

  const dark = tone === 'dark'
  const labelCls = `block text-xs font-medium mb-1.5 ${dark ? 'text-white/70' : 'text-slate-600'}`
  // The dark variant previously signalled focus with a border-colour swap only,
  // which is far too subtle to serve as a focus indicator. Both tones now get a
  // 2px ring (report-gold clears 3:1 on navy, report-gold-dark on white).
  const inputCls = `w-full rounded-xl px-4 py-3 text-sm transition focus:outline-none focus-visible:ring-2 ${
    dark
      ? 'border border-white/20 bg-white/10 text-white placeholder-white/60 focus:border-report-gold focus-visible:ring-report-gold'
      : 'border border-slate-300 bg-white text-slate-900 placeholder-slate-500 focus:border-report-gold-dark focus-visible:ring-report-gold-dark'
  }`
  // red-400 reads at 2.89:1 on the white form and 6.3:1 on the navy modal, so
  // the error colour has to follow the tone rather than being fixed.
  const errorTone = dark ? 'text-red-400' : 'text-red-600'
  const errorCls = `mt-1 text-xs ${errorTone}`

  const update = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleFocus = () => {
    if (startedRef.current) return
    startedRef.current = true
    trackEvent('lead_magnet_form_start', analyticsParams)
  }

  const triggerDownload = (url: string) => {
    const a = document.createElement('a')
    a.href = url
    a.rel = 'nofollow'
    document.body.appendChild(a)
    a.click()
    a.remove()
    trackEvent('lead_magnet_download', analyticsParams)
    markDownloaded(magnet.key, magnet.edition)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      focusField(Object.keys(nextErrors)[0])
      return
    }
    if (submittingRef.current) return
    submittingRef.current = true
    setStatus('sending')
    trackEvent('lead_magnet_submit', analyticsParams)

    try {
      const { utmSource, utmMedium, utmCampaign, utmContent, referrer } = getUtmAndReferrer()
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: values.firstName.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          interest: values.interest,
          honeypot: values.honeypot,
          magnetKey: magnet.key,
          magnetEdition: magnet.edition,
          sourcePageUrl: window.location.href,
          pageCategory,
          ctaPlacement: ctaLocation,
          submittedAt: new Date().toISOString(),
          utmSource,
          utmMedium,
          utmCampaign,
          utmContent,
          referrer,
          consentVersion: CURRENT_CONSENT_VERSION,
        }),
      })
      if (!res.ok) throw new Error(`Lead submission failed (${res.status})`)
      const data = (await res.json()) as { ok?: boolean; downloadUrl?: string }
      if (!data.ok) throw new Error('Lead submission rejected')

      setStatus('success')
      if (data.downloadUrl) {
        setDownloadUrl(data.downloadUrl)
        triggerDownload(data.downloadUrl)
      }
      onSuccess?.()
    } catch (err) {
      console.error('Lead magnet submission error:', err)
      setStatus('error')
      setServerError('Something went wrong. Please try again, or email us at info@doyouneedahome.com.')
      trackEvent('lead_magnet_error', analyticsParams)
    } finally {
      submittingRef.current = false
    }
  }

  const submitFollowUp = async () => {
    if (!area && !timeline) return
    setFollowUpSent(true)
    trackEvent('lead_magnet_followup_submit', analyticsParams)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          followUp: true,
          firstName: values.firstName.trim(),
          email: values.email.trim(),
          magnetKey: magnet.key,
          magnetEdition: magnet.edition,
          areaOfInterest: area || undefined,
          timeline: timeline || undefined,
          sourcePageUrl: window.location.href,
          submittedAt: new Date().toISOString(),
        }),
      })
    } catch (err) {
      // The visitor already has their download — a failed enrichment call is
      // logged and swallowed rather than shown as an error.
      console.error('Lead magnet follow-up error:', err)
    }
  }

  const fieldId = (name: string) => `${idPrefix}-${name}`

  /**
   * Put focus on the first field that failed validation (WCAG 3.3.1 / 3.3.3).
   * Without it a failed submit is silent: the message renders below the fold on
   * a phone, and a screen-reader user gets no signal the button did anything.
   * The radio group has no id of its own, so it's matched by name.
   */
  const focusField = (field: string) => {
    const el =
      document.getElementById(fieldId(field)) ??
      formRef.current?.querySelector<HTMLElement>(`input[name="${fieldId(field)}"]`)
    el?.focus()
  }

  if (status === 'success') {
    const selectCls = `${inputCls} appearance-none`
    return (
      <div className="py-2" role="status" aria-live="polite">
        <div className="text-center">
          <div
            className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border ${
              dark ? 'border-report-gold/50 bg-report-gold/10' : 'border-report-gold bg-report-gold/10'
            }`}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 13l4 4L19 7" stroke="#B08F47" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className={`font-serif text-xl font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>
            Your download is starting now.
          </h3>
          <p className={`mt-2 text-sm leading-6 ${dark ? 'text-white/60' : 'text-slate-500'}`}>
            Thanks, {values.firstName.trim()}! &ldquo;{magnet.title}&rdquo; should be in your
            downloads. Christine or John will follow up shortly.
          </p>
          {downloadUrl && (
            <a
              href={downloadUrl}
              rel="nofollow"
              onClick={() => trackEvent('lead_magnet_download', analyticsParams)}
              className="mt-5 inline-flex items-center justify-center rounded-full bg-report-gold px-6 py-3 text-sm font-semibold text-navy-950 transition hover:bg-report-gold-dark"
            >
              Didn&rsquo;t start? Download again
            </a>
          )}
        </div>

        {/* Optional second step — never required, never blocks the download. */}
        {!followUpSent ? (
          <div className={`mt-7 border-t pt-6 ${dark ? 'border-white/15' : 'border-slate-200'}`}>
            <p className={`text-sm font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>
              Two optional questions
            </p>
            <p className={`mt-1 text-xs leading-5 ${dark ? 'text-white/60' : 'text-slate-500'}`}>
              Answer these and we&rsquo;ll tailor what we send you next. Skip them and nothing
              changes.
            </p>
            <div className="mt-4 space-y-3">
              <div>
                <label htmlFor={fieldId('area')} className={labelCls}>
                  Where are you looking?
                </label>
                <select
                  id={fieldId('area')}
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className={selectCls}
                >
                  <option value="">Select an area (optional)</option>
                  {AREA_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={fieldId('timeline')} className={labelCls}>
                  When are you hoping to move?
                </label>
                <select
                  id={fieldId('timeline')}
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className={selectCls}
                >
                  <option value="">Select a timeline (optional)</option>
                  {TIMELINE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={submitFollowUp}
                disabled={!area && !timeline}
                className={`w-full rounded-full px-6 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  dark
                    ? 'border border-report-gold/60 text-report-gold-light hover:bg-white/10'
                    : 'border border-report-gold-dark text-report-gold-text hover:bg-report-gold/10'
                }`}
              >
                Send These Answers
              </button>
            </div>
          </div>
        ) : (
          <p
            className={`mt-6 border-t pt-5 text-center text-xs ${
              dark ? 'border-white/15 text-white/60' : 'border-slate-200 text-slate-500'
            }`}
          >
            Thanks — that helps. We&rsquo;ll keep it in mind when we follow up.
          </p>
        )}
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Honeypot — hidden from sighted users, left open for bots */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor={fieldId('company')}>Company</label>
        <input
          id={fieldId('company')}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.honeypot}
          onChange={(e) => update('honeypot', e.target.value)}
        />
      </div>

      <div>
        <label htmlFor={fieldId('firstName')} className={labelCls}>
          First Name *
        </label>
        <input
          id={fieldId('firstName')}
          name="firstName"
          type="text"
          required
          autoComplete="given-name"
          value={values.firstName}
          onFocus={handleFocus}
          onChange={(e) => update('firstName', e.target.value)}
          aria-invalid={!!errors.firstName}
          aria-describedby={errors.firstName ? fieldId('firstName-error') : undefined}
          className={inputCls}
          placeholder="First name"
        />
        {errors.firstName && (
          <p id={fieldId('firstName-error')} role="alert" className={errorCls}>
            {errors.firstName}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={fieldId('email')} className={labelCls}>
          Email Address *
        </label>
        <input
          id={fieldId('email')}
          name="email"
          type="email"
          required
          autoComplete="email"
          value={values.email}
          onFocus={handleFocus}
          onChange={(e) => update('email', e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? fieldId('email-error') : undefined}
          className={inputCls}
          placeholder="you@example.com"
        />
        {errors.email && (
          <p id={fieldId('email-error')} role="alert" className={errorCls}>
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={fieldId('phone')} className={labelCls}>
          Phone Number <span className={dark ? 'text-white/60' : 'text-slate-500'}>(Optional)</span>
        </label>
        <input
          id={fieldId('phone')}
          name="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onFocus={handleFocus}
          onChange={(e) => update('phone', e.target.value)}
          className={inputCls}
          placeholder="(561) 555-0100"
        />
      </div>

      <fieldset aria-describedby={errors.interest ? fieldId('interest-error') : undefined}>
        <legend className={labelCls}>I am primarily interested in: *</legend>
        <div className="grid grid-cols-2 gap-2">
          {INTEREST_OPTIONS.map((opt) => {
            const selected = values.interest === opt
            return (
              <label
                key={opt}
                className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-2.5 text-center text-sm font-medium transition ${
                  selected
                    ? 'border-report-gold-dark bg-report-gold/15 ' + (dark ? 'text-report-gold-light' : 'text-report-gold-text')
                    : dark
                      ? 'border-white/20 text-white/70 hover:border-white/40'
                      : 'border-slate-300 text-slate-600 hover:border-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name={fieldId('interest')}
                  value={opt}
                  checked={selected}
                  onFocus={handleFocus}
                  onChange={() => update('interest', opt)}
                  className="sr-only"
                />
                {opt}
              </label>
            )
          })}
        </div>
        {errors.interest && (
          <p id={fieldId('interest-error')} role="alert" className={errorCls}>
            {errors.interest}
          </p>
        )}
      </fieldset>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-full bg-report-gold px-6 py-3.5 text-sm font-semibold text-navy-950 transition hover:bg-report-gold-dark disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : magnet.ctaButtonLabel}
      </button>

      {status === 'error' && serverError && (
        <p role="alert" aria-live="assertive" className={`text-center text-xs ${errorTone}`}>
          {serverError}
        </p>
      )}

      <FormConsent dark={dark} prefix="Free instant PDF download." />
    </form>
  )
}
