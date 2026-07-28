'use client'

import { useRef, useState } from 'react'
import type { MarketReport } from '@/lib/marketReports'
import { trackEvent } from '@/lib/analytics'
import { getUtmAndReferrer } from '@/lib/utm'

export const INTEREST_OPTIONS = [
  'Buying',
  'Selling',
  'Buying and selling',
  'Just researching',
] as const

/** Set once any report is downloaded — suppresses the sticky bar + exit intent. */
export const DOWNLOADED_STORAGE_KEY = 'dhg-report-downloaded'

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

export interface ReportLeadFormProps {
  report: MarketReport
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

export default function ReportLeadForm({
  report,
  ctaLocation,
  pageCategory,
  idPrefix,
  tone = 'light',
  onSuccess,
}: ReportLeadFormProps) {
  const [values, setValues] = useState<FormValues>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [serverError, setServerError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const startedRef = useRef(false)
  const submittingRef = useRef(false)

  const analyticsParams = {
    report_type: report.type,
    report_edition: report.edition,
    cta_location: ctaLocation,
    page_category: pageCategory,
    page_url: typeof window !== 'undefined' ? window.location.pathname : undefined,
  }

  const dark = tone === 'dark'
  const labelCls = `block text-xs font-medium mb-1.5 ${dark ? 'text-white/70' : 'text-slate-600'}`
  const inputCls = `w-full rounded-xl px-4 py-3 text-sm transition focus:outline-none ${
    dark
      ? 'border border-white/20 bg-white/10 text-white placeholder-white/40 focus:border-report-gold'
      : 'border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-report-gold-dark focus:ring-1 focus:ring-report-gold-dark'
  }`
  const errorCls = 'mt-1 text-xs text-red-400'

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
    try {
      localStorage.setItem(DOWNLOADED_STORAGE_KEY, report.edition)
    } catch {
      // storage unavailable — fine
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
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
          reportType: report.type,
          sourcePageUrl: window.location.href,
          pageCategory,
          ctaPlacement: ctaLocation,
          submittedAt: new Date().toISOString(),
          utmSource,
          utmMedium,
          utmCampaign,
          utmContent,
          referrer,
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

  const fieldId = (name: string) => `${idPrefix}-${name}`

  if (status === 'success') {
    return (
      <div className="py-2 text-center" role="status" aria-live="polite">
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
          Your report is downloading now.
        </h3>
        <p className={`mt-2 text-sm leading-6 ${dark ? 'text-white/60' : 'text-slate-500'}`}>
          Thanks, {values.firstName.trim()}! &ldquo;{report.title}&rdquo; ({report.edition} edition) should be in
          your downloads. Christine or John will follow up shortly.
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
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
          Phone Number <span className={dark ? 'text-white/40' : 'text-slate-400'}>(Optional)</span>
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

      <fieldset
        aria-describedby={errors.interest ? fieldId('interest-error') : undefined}
      >
        <legend className={labelCls}>I am primarily interested in: *</legend>
        <div className="grid grid-cols-2 gap-2">
          {INTEREST_OPTIONS.map((opt) => {
            const selected = values.interest === opt
            return (
              <label
                key={opt}
                className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-2.5 text-center text-sm font-medium transition ${
                  selected
                    ? 'border-report-gold-dark bg-report-gold/15 ' + (dark ? 'text-report-gold-light' : 'text-report-gold-dark')
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
        {status === 'sending' ? 'Sending…' : 'Download the Free Report'}
      </button>

      {status === 'error' && serverError && (
        <p role="alert" aria-live="assertive" className="text-center text-xs text-red-400">
          {serverError}
        </p>
      )}

      <p className={`text-center text-xs leading-5 ${dark ? 'text-white/40' : 'text-slate-400'}`}>
        Free instant PDF download. No spam — your information is never shared or sold. By submitting,
        you agree to be contacted by DO Homes Group about this report.
      </p>
    </form>
  )
}
