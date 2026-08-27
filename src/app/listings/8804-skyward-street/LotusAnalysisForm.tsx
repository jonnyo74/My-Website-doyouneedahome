'use client'

import { useRef, useState } from 'react'
import { trackEvent } from '@/lib/analytics'
import { getUtmAndReferrer } from '@/lib/utm'
import FormConsent from '@/components/FormConsent'
import { CURRENT_CONSENT_VERSION } from '@/lib/consent'
import { ANALYSIS_PAGE_CATEGORY } from './analysisEvents'

interface FormValues {
  address: string
  name: string
  email: string
  phone: string
  upgrades: string
  honeypot: string
}

const EMPTY: FormValues = {
  address: '',
  name: '',
  email: '',
  phone: '',
  upgrades: '',
  honeypot: '',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values: FormValues): Partial<Record<keyof FormValues, string>> {
  const errors: Partial<Record<keyof FormValues, string>> = {}
  if (values.address.trim().length < 5) errors.address = 'Please enter your Lotus street address.'
  if (!values.name.trim()) errors.name = 'Please enter your first name.'
  if (!values.email.trim()) errors.email = 'Please enter your email address.'
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Please enter a valid email address.'
  const digits = values.phone.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 15)
    errors.phone = 'A phone number is needed to walk you through the analysis.'
  return errors
}

type Status = 'idle' | 'sending' | 'success' | 'error'

/**
 * The Lotus property-analysis request. Deliberately short, and deliberately
 * does NOT ask whether the owner is selling or when — curiosity is enough, and
 * making someone declare themselves a seller before they get anything is what
 * kills this conversion. That is also why it posts to /api/property-analysis
 * rather than /api/seller-leads, which requires a timeline.
 *
 * `onSuccess` lets the modal swap its own header once the form is submitted.
 */
export default function LotusAnalysisForm({
  ctaLocation,
  idPrefix,
  onSuccess,
}: {
  ctaLocation: string
  idPrefix: string
  onSuccess?: () => void
}) {
  const [values, setValues] = useState<FormValues>(EMPTY)
  const [phoneConsent, setPhoneConsent] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const startedRef = useRef(false)
  const submittingRef = useRef(false)

  const analytics = { cta_location: ctaLocation, page_category: ANALYSIS_PAGE_CATEGORY }

  const fieldId = (name: string) => `${idPrefix}-${name}`

  const update = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleFocus = () => {
    if (startedRef.current) return
    startedRef.current = true
    trackEvent('seller_form_start', analytics)
  }

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

    try {
      const { utmSource, utmMedium, utmCampaign, utmContent, referrer } = getUtmAndReferrer()
      const res = await fetch('/api/property-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: values.address.trim(),
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          upgrades: values.upgrades.trim(),
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
      if (!res.ok) throw new Error(`Property analysis request failed (${res.status})`)
      const data = (await res.json()) as { ok?: boolean }
      if (!data.ok) throw new Error('Property analysis request rejected')
      setStatus('success')
      trackEvent('seller_form_submit', analytics)
      onSuccess?.()
    } catch (err) {
      console.error('Property analysis request error:', err)
      setStatus('error')
      trackEvent('seller_form_error', analytics)
    } finally {
      submittingRef.current = false
    }
  }

  const labelCls = 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#93c4cb]'
  const errorCls = 'mt-1.5 text-xs text-[#e8a49a]'

  if (status === 'success') {
    return (
      <div role="status" aria-live="polite" className="pt-1">
        <p className="sky-label sky-label--dark">Requested</p>
        <h3 className="sky-display mt-3 text-2xl leading-tight text-[#f5f2eb]">
          Your Lotus property analysis is under way.
        </h3>
        <div className="mt-5 space-y-4 text-sm leading-7 text-[#f5f2eb]/75">
          <p>
            John will look at {values.address.trim()} specifically — the model, the square footage,
            where the lot sits, the water and the view, the upgrades you described, and the
            condition — and set it against the Lotus sales that actually closed and the homes
            competing right now.
          </p>
          <p>
            What comes back is a likely market range for your home and the reasoning behind it,
            rather than a generic automated estimate. Every analysis is reviewed by John Oliver
            before it is sent.
          </p>
        </div>
        <a
          href="tel:+15617863630"
          className="sky-cta mt-7 inline-flex items-center justify-center border border-[#93c4cb]/60 px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f5f2eb] transition hover:border-[#93c4cb] hover:bg-[#93c4cb]/10"
        >
          Rather talk now? (561) 786-3630
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
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

      <div>
        <label htmlFor={fieldId('address')} className={labelCls}>
          Your Lotus Address *
        </label>
        <input
          id={fieldId('address')}
          name="address"
          type="text"
          required
          autoComplete="street-address"
          value={values.address}
          onFocus={handleFocus}
          onChange={(e) => update('address', e.target.value)}
          aria-invalid={!!errors.address}
          aria-describedby={errors.address ? fieldId('address-error') : fieldId('address-hint')}
          className="sky-input"
          placeholder="8804 Skyward Street"
        />
        {errors.address ? (
          <p id={fieldId('address-error')} role="alert" className={errorCls}>
            {errors.address}
          </p>
        ) : (
          <p id={fieldId('address-hint')} className="mt-1.5 text-xs text-[#f5f2eb]/45">
            Street address is enough — Lotus, Boca Raton, FL 33496.
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={fieldId('name')} className={labelCls}>
            First Name *
          </label>
          <input
            id={fieldId('name')}
            name="name"
            type="text"
            required
            autoComplete="given-name"
            value={values.name}
            onFocus={handleFocus}
            onChange={(e) => update('name', e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? fieldId('name-error') : undefined}
            className="sky-input"
            placeholder="First name"
          />
          {errors.name && (
            <p id={fieldId('name-error')} role="alert" className={errorCls}>
              {errors.name}
            </p>
          )}
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
          inputMode="email"
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

      <div>
        <label htmlFor={fieldId('upgrades')} className={labelCls}>
          Upgrades or Improvements{' '}
          <span className="normal-case tracking-normal text-[#f5f2eb]/50">(optional)</span>
        </label>
        <textarea
          id={fieldId('upgrades')}
          name="upgrades"
          rows={3}
          maxLength={2000}
          value={values.upgrades}
          onChange={(e) => update('upgrades', e.target.value)}
          className="sky-input resize-none"
          placeholder="Pool, summer kitchen, flooring, closets, generator, landscaping…"
        />
        <p className="mt-1.5 text-xs text-[#f5f2eb]/45">
          These are exactly what an automated estimate cannot see.
        </p>
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="sky-cta w-full bg-[#f5f2eb] px-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#16140f] transition hover:bg-white disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : 'Request My Analysis'}
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
