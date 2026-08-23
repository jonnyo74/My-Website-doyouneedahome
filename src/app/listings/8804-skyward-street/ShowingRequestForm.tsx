'use client'

import { useRef, useState } from 'react'
import { trackEvent } from '@/lib/analytics'
import { getUtmAndReferrer } from '@/lib/utm'
import FormConsent from '@/components/FormConsent'
import { CURRENT_CONSENT_VERSION } from '@/lib/consent'
import { AGENT_AFFILIATIONS, SHOWING_WINDOWS } from '@/lib/showingRequestHelpers'

interface FormValues {
  name: string
  email: string
  phone: string
  affiliation: string
  window: string
  notes: string
  honeypot: string
}

const EMPTY: FormValues = {
  name: '',
  email: '',
  phone: '',
  affiliation: '',
  window: '',
  notes: '',
  honeypot: '',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values: FormValues): Partial<Record<keyof FormValues, string>> {
  const errors: Partial<Record<keyof FormValues, string>> = {}
  if (!values.name.trim()) errors.name = 'Please enter your name.'
  if (!values.email.trim()) errors.email = 'Please enter your email address.'
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Please enter a valid email address.'
  const digits = values.phone.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 15)
    errors.phone = 'A phone number is needed to confirm the showing and clear the gate.'
  if (!values.affiliation) errors.affiliation = 'Please choose one.'
  if (!values.window) errors.window = 'Please choose a preferred window.'
  return errors
}

type Status = 'idle' | 'sending' | 'success' | 'error'

const ANALYTICS = { cta_location: 'showing-form', page_category: 'listing-8804-skyward-street' }

export default function ShowingRequestForm() {
  const [values, setValues] = useState<FormValues>(EMPTY)
  const [phoneConsent, setPhoneConsent] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const startedRef = useRef(false)
  const submittingRef = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)

  const update = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleFocus = () => {
    if (startedRef.current) return
    startedRef.current = true
    trackEvent('showing_form_start', ANALYTICS)
  }

  const fieldId = (name: string) => `showing-${name}`

  /** Focus the first failed field (WCAG 3.3.1) so errors aren't silent. */
  const focusField = (field: string) => {
    document.getElementById(fieldId(field))?.focus()
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
    trackEvent('showing_form_submit', ANALYTICS)

    try {
      const { utmSource, utmMedium, utmCampaign, utmContent, referrer } = getUtmAndReferrer()
      const res = await fetch('/api/showing-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingKey: '8804-skyward-street',
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          affiliation: values.affiliation,
          window: values.window,
          notes: values.notes.trim(),
          honeypot: values.honeypot,
          sourcePageUrl: window.location.href,
          submittedAt: new Date().toISOString(),
          utmSource,
          utmMedium,
          utmCampaign,
          utmContent,
          referrer,
          consentVersion: CURRENT_CONSENT_VERSION,
          phoneConsent,
        }),
      })
      if (!res.ok) throw new Error(`Showing request failed (${res.status})`)
      const data = (await res.json()) as { ok?: boolean }
      if (!data.ok) throw new Error('Showing request rejected')
      setStatus('success')
    } catch (err) {
      console.error('Showing request error:', err)
      setStatus('error')
      trackEvent('showing_form_error', ANALYTICS)
    } finally {
      submittingRef.current = false
    }
  }

  const labelCls = 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#93c4cb]'
  const errorCls = 'mt-1.5 text-xs text-[#e8a49a]'

  if (status === 'success') {
    return (
      <div role="status" aria-live="polite" className="border border-[#f5f2eb]/25 p-8 sm:p-10">
        <p className="sky-label sky-label--dark">Request received</p>
        <h3 className="sky-display mt-3 text-2xl text-[#f5f2eb]">
          Thank you, {values.name.trim().split(' ')[0]}.
        </h3>
        <p className="mt-4 text-sm leading-7 text-[#f5f2eb]/75">
          John Oliver will contact you directly to confirm a time. Showings are by appointment with
          24 hours&rsquo; notice, and every guest must be pre-registered at the Lotus guard gate —
          so the gate will only have your name once your showing is confirmed.
        </p>
        <a
          href="tel:+15617863630"
          className="mt-6 inline-block border border-[#93c4cb]/60 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f5f2eb] transition hover:border-[#93c4cb] hover:bg-[#93c4cb]/10"
        >
          Sooner? Call (561) 786-3630
        </a>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Honeypot — hidden from sighted users, left open for bots */}
      <div
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}
      >
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

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={fieldId('name')} className={labelCls}>
            Name *
          </label>
          <input
            id={fieldId('name')}
            name="name"
            type="text"
            required
            autoComplete="name"
            value={values.name}
            onFocus={handleFocus}
            onChange={(e) => update('name', e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? fieldId('name-error') : undefined}
            className="sky-input"
            placeholder="Full name"
          />
          {errors.name && (
            <p id={fieldId('name-error')} role="alert" className={errorCls}>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={fieldId('email')} className={labelCls}>
            Email *
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
            className="sky-input"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p id={fieldId('email-error')} role="alert" className={errorCls}>
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor={fieldId('phone')} className={labelCls}>
          Phone *
        </label>
        <input
          id={fieldId('phone')}
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          value={values.phone}
          onFocus={handleFocus}
          onChange={(e) => update('phone', e.target.value)}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? fieldId('phone-error') : undefined}
          className="sky-input"
          placeholder="(561) 555-0100"
        />
        {errors.phone && (
          <p id={fieldId('phone-error')} role="alert" className={errorCls}>
            {errors.phone}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={fieldId('affiliation')} className={labelCls}>
          Agent Representation *
        </label>
        <select
          id={fieldId('affiliation')}
          name="affiliation"
          required
          value={values.affiliation}
          onFocus={handleFocus}
          onChange={(e) => update('affiliation', e.target.value)}
          aria-invalid={!!errors.affiliation}
          aria-describedby={errors.affiliation ? fieldId('affiliation-error') : undefined}
          className="sky-input"
        >
          <option value="" disabled>
            Select one…
          </option>
          {AGENT_AFFILIATIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.affiliation && (
          <p id={fieldId('affiliation-error')} role="alert" className={errorCls}>
            {errors.affiliation}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={fieldId('window')} className={labelCls}>
          Preferred Window *
        </label>
        <select
          id={fieldId('window')}
          name="window"
          required
          value={values.window}
          onFocus={handleFocus}
          onChange={(e) => update('window', e.target.value)}
          aria-invalid={!!errors.window}
          aria-describedby={errors.window ? fieldId('window-error') : undefined}
          className="sky-input"
        >
          <option value="" disabled>
            Select a window…
          </option>
          {SHOWING_WINDOWS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.window && (
          <p id={fieldId('window-error')} role="alert" className={errorCls}>
            {errors.window}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={fieldId('notes')} className={labelCls}>
          Anything Else <span className="normal-case tracking-normal text-[#f5f2eb]/50">(optional)</span>
        </label>
        <textarea
          id={fieldId('notes')}
          name="notes"
          rows={3}
          value={values.notes}
          onChange={(e) => update('notes', e.target.value)}
          className="sky-input resize-none"
          placeholder="Timing, questions, financing…"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-[#f5f2eb] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#16140f] transition hover:bg-white disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : 'Request a Private Showing'}
      </button>

      {status === 'error' && (
        <p role="alert" aria-live="assertive" className="text-center text-xs text-[#e8a49a]">
          Something went wrong. Please try again, or email{' '}
          <a href="mailto:john@doyouneedahome.com" className="underline">
            john@doyouneedahome.com
          </a>{' '}
          directly.
        </p>
      )}

      <FormConsent
        dark
        phoneEntered={!!values.phone.trim()}
        phoneConsent={phoneConsent}
        onPhoneConsentChange={setPhoneConsent}
      />
    </form>
  )
}
