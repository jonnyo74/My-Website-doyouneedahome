'use client'

import { useId, useRef, useState } from 'react'
import FormConsent from '@/components/FormConsent'
import { CURRENT_CONSENT_VERSION } from '@/lib/consent'
import { trackEvent } from '@/lib/analytics'
import { getUtmAndReferrer } from '@/lib/utm'
import { fieldProblem, OFFERS, type OfferField, type OfferKey } from '@/lib/offerRequests'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Status = 'idle' | 'sending' | 'success' | 'error'

/**
 * A call-to-action card that opens a short form inline. One component serves
 * all four "personal reply" offers; what each one asks lives in
 * src/lib/offerRequests.ts and is validated again by /api/offer-requests.
 *
 * Analytics (GA4, via the site's trackEvent): `offer_cta_click` when the card's
 * button is pressed, `offer_form_success` only after the server accepts the
 * request, `offer_form_error` when it does not. Every event carries `offer`,
 * `cta_location` and `page_path`, and nothing the visitor typed.
 *
 * Values stay in state when a submit fails, so a retry never means retyping.
 */
export default function OfferRequest({
  offer,
  ctaLocation,
  initialEmail = '',
  className = '',
}: {
  offer: OfferKey
  /** Where this card sits, e.g. 'article', 'download-confirmation', 'community-page'. */
  ctaLocation: string
  /** Prefill when the visitor has just typed their email elsewhere on the page. */
  initialEmail?: string
  className?: string
}) {
  const def = OFFERS[offer]
  const uid = useId()
  const id = (name: string) => `${uid}-${name}`

  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState(initialEmail)
  const [details, setDetails] = useState<Record<string, string>>({})
  const [honeypot, setHoneypot] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [serverError, setServerError] = useState<string | null>(null)
  const submittingRef = useRef(false)
  const startedRef = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)

  const analyticsParams = () => ({
    offer,
    cta_location: ctaLocation,
    page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
  })

  const openForm = () => {
    trackEvent('offer_cta_click', analyticsParams())
    setOpen(true)
    // The form mounts on the next render; move focus to its first field so
    // keyboard and screen-reader users land inside it.
    requestAnimationFrame(() => {
      document.getElementById(id(initialEmail ? def.fields[0].id : 'email'))?.focus()
    })
  }

  const focusField = (field: string) => document.getElementById(id(field))?.focus()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!email.trim()) nextErrors.email = 'Please enter your email address.'
    else if (!EMAIL_RE.test(email.trim())) nextErrors.email = 'Please enter a valid email address.'
    for (const f of def.fields) {
      const problem = fieldProblem(f, details[f.id])
      if (problem) nextErrors[f.id] = problem
    }
    setErrors(nextErrors)
    const firstBad = ['email', ...def.fields.map((f) => f.id)].find((k) => nextErrors[k])
    if (firstBad) {
      focusField(firstBad)
      return
    }
    if (submittingRef.current) return
    submittingRef.current = true
    setStatus('sending')
    setServerError(null)

    try {
      const { utmSource, utmMedium, utmCampaign, utmContent, referrer } = getUtmAndReferrer()
      const res = await fetch('/api/offer-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offer,
          email: email.trim(),
          details,
          honeypot,
          sourcePageUrl: window.location.href,
          ctaLocation,
          submittedAt: new Date().toISOString(),
          utmSource,
          utmMedium,
          utmCampaign,
          utmContent,
          referrer,
          consentVersion: CURRENT_CONSENT_VERSION,
        }),
      })
      if (res.status === 400) {
        const bad = (await res.clone().json().catch(() => null)) as {
          error?: string
          field?: string
        } | null
        if (bad?.field && bad.error) {
          setErrors({ [bad.field]: bad.error })
          setStatus('idle')
          focusField(bad.field)
          return
        }
      }
      if (!res.ok) throw new Error(`Offer request failed (${res.status})`)
      const data = (await res.json()) as { ok?: boolean }
      if (!data.ok) throw new Error('Offer request rejected')

      // Server confirmed (res.ok && data.ok). submittingRef blocks re-entry, so
      // this fires once per accepted request.
      setStatus('success')
      trackEvent('offer_form_success', analyticsParams())
    } catch (err) {
      console.error('Offer request error:', err)
      // Values are kept; only the status changes.
      setStatus('error')
      setServerError(
        'Something went wrong and your request was not sent. Your answers are still here. Please try again, or email info@doyouneedahome.com.',
      )
      trackEvent('offer_form_error', analyticsParams())
    } finally {
      submittingRef.current = false
    }
  }

  const labelCls = 'block text-xs font-medium mb-1.5 text-white/75'
  const inputCls =
    'w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/60 transition focus:border-report-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-report-gold'
  const errorCls = 'mt-1 text-xs text-red-300'

  const shell = `rounded-3xl border border-report-gold/40 bg-navy-950 p-6 text-left sm:p-8 ${className}`

  if (status === 'success') {
    return (
      <div className={shell} role="status" aria-live="polite">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-report-gold/60 bg-report-gold/10">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 13l4 4L19 7" stroke="#C9A961" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-white">{def.successTitle}</h3>
            <p className="mt-1.5 text-sm leading-6 text-white/75">
              {def.successBody} We will send it to {email.trim()}.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={shell} data-offer={offer}>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-report-gold">{def.eyebrow}</p>
      <h3 className="mt-2 font-serif text-xl font-semibold leading-snug text-white">{def.headline}</h3>
      <p className="mt-2 text-sm leading-6 text-white/75">{def.description}</p>

      {!open && (
        <button
          type="button"
          onClick={openForm}
          aria-expanded={false}
          aria-controls={id('form')}
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-report-gold px-6 py-3 text-sm font-semibold text-navy-950 transition hover:bg-report-gold-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950 sm:w-auto"
        >
          {def.buttonLabel}
        </button>
      )}

      {open && (
        <form
          id={id('form')}
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 space-y-4"
          aria-label={def.buttonLabel}
        >
          {/* Honeypot — hidden from sighted users, left open for bots */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
            <label htmlFor={id('company')}>Company</label>
            <input
              id={id('company')}
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor={id('email')} className={labelCls}>
              Email Address *
            </label>
            <input
              id={id('email')}
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onFocus={() => {
                if (startedRef.current) return
                startedRef.current = true
                trackEvent('offer_form_start', analyticsParams())
              }}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? id('email-error') : undefined}
              className={inputCls}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p id={id('email-error')} role="alert" className={errorCls}>
                {errors.email}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {def.fields.map((f) => (
              <FieldInput
                key={f.id}
                field={f}
                inputId={id(f.id)}
                value={details[f.id] ?? ''}
                error={errors[f.id]}
                onChange={(v) => setDetails((prev) => ({ ...prev, [f.id]: v }))}
                labelCls={labelCls}
                inputCls={inputCls}
                errorCls={errorCls}
                wide={f.kind === 'text' && def.fields.length <= 2}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full rounded-full bg-report-gold px-6 py-3.5 text-sm font-semibold text-navy-950 transition hover:bg-report-gold-dark disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
          >
            {status === 'sending' ? 'Sending…' : def.submitLabel}
          </button>
          <p className="text-center text-xs text-white/65">{def.reassurance}</p>

          {status === 'error' && serverError && (
            <p role="alert" aria-live="assertive" className="text-center text-xs text-red-300">
              {serverError}
            </p>
          )}

          {/* No phone field on these forms, so no call/text checkbox appears. */}
          <FormConsent dark />
        </form>
      )}
    </div>
  )
}

function FieldInput({
  field,
  inputId,
  value,
  error,
  onChange,
  labelCls,
  inputCls,
  errorCls,
  wide,
}: {
  field: OfferField
  inputId: string
  value: string
  error?: string
  onChange: (v: string) => void
  labelCls: string
  inputCls: string
  errorCls: string
  wide: boolean
}) {
  const hintId = `${inputId}-hint`
  const errId = `${inputId}-error`
  const describedBy = [field.hint ? hintId : null, error ? errId : null].filter(Boolean).join(' ') || undefined
  // Wide = text fields that read better full-width on tablet/desktop.
  const wrapCls = wide || field.kind === 'text' ? 'sm:col-span-2' : ''
  const common = {
    id: inputId,
    name: field.id,
    value,
    required: true,
    'aria-invalid': !!error,
    'aria-describedby': describedBy,
    className: inputCls,
  }
  return (
    <div className={wrapCls}>
      <label htmlFor={inputId} className={labelCls}>
        {field.label} *
      </label>
      {field.kind === 'select' ? (
        <select {...common} onChange={(e) => onChange(e.target.value)} className={`${inputCls} appearance-none`}>
          <option value="">Select one</option>
          {field.options?.map((o) => (
            <option key={o} value={o} className="text-slate-900">
              {o}
            </option>
          ))}
        </select>
      ) : field.kind === 'number' ? (
        <input
          {...common}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : field.kind === 'date' ? (
        <input
          {...common}
          type="date"
          min={new Date().toISOString().slice(0, 10)}
          autoComplete="off"
          onChange={(e) => onChange(e.target.value)}
          style={{ colorScheme: 'dark' }}
        />
      ) : (
        <input
          {...common}
          type="text"
          autoComplete={field.autoComplete ?? 'off'}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {field.hint && (
        <p id={hintId} className="mt-1 text-xs text-white/60">
          {field.hint}
        </p>
      )}
      {error && (
        <p id={errId} role="alert" className={errorCls}>
          {error}
        </p>
      )}
    </div>
  )
}
