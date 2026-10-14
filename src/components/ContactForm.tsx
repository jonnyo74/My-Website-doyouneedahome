'use client'

import { useRef, useState } from 'react'
import FormConsent from '@/components/FormConsent'
import { trackEvent } from '@/lib/analytics'
import { CURRENT_CONSENT_VERSION } from '@/lib/consent'
import { getUtmAndReferrer } from '@/lib/utm'

interface FormValues {
  name: string
  email: string
  phone: string
  message: string
  honeypot: string
}

const EMPTY: FormValues = { name: '', email: '', phone: '', message: '', honeypot: '' }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Status = 'idle' | 'sending' | 'success' | 'error'

function validate(values: FormValues): Partial<Record<keyof FormValues, string>> {
  const errors: Partial<Record<keyof FormValues, string>> = {}
  if (!values.name.trim()) errors.name = 'Please enter your name.'
  if (!values.email.trim()) errors.email = 'Please enter your email address.'
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Please enter a valid email address.'
  if (values.phone.trim() && values.phone.replace(/\D/g, '').length < 10) {
    errors.phone = 'Please enter a 10-digit phone number, or leave it blank.'
  }
  return errors
}

const inputCls =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-500 transition focus:border-report-gold-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-report-gold-dark'
const labelCls = 'mb-1.5 block text-xs font-medium text-slate-600'

/**
 * General "send us a message" form for /contact. Name and email are the only
 * required fields — same soft ask as the lead-magnet form. Posts to
 * /api/contact-requests, which sends it to Follow Up Boss.
 */
export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(EMPTY)
  const [phoneConsent, setPhoneConsent] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const startedRef = useRef(false)
  const submittingRef = useRef(false)

  const analyticsParams = { form_type: 'contact', cta_location: 'contact-page' }

  const update = (field: keyof FormValues, value: string) =>
    setValues((prev) => ({ ...prev, [field]: value }))

  const handleFocus = () => {
    if (startedRef.current) return
    startedRef.current = true
    trackEvent('contact_form_start', analyticsParams)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    const firstError = Object.keys(nextErrors)[0]
    if (firstError) {
      document.getElementById(`contact-${firstError}`)?.focus()
      return
    }
    if (submittingRef.current) return
    submittingRef.current = true
    setStatus('sending')
    trackEvent('contact_form_submit', analyticsParams)

    try {
      const { utmSource, utmMedium, utmCampaign, utmContent, referrer } = getUtmAndReferrer()
      const res = await fetch('/api/contact-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          message: values.message.trim(),
          honeypot: values.honeypot,
          sourcePageUrl: window.location.href,
          submittedAt: new Date().toISOString(),
          utmSource,
          utmMedium,
          utmCampaign,
          utmContent,
          referrer,
          consentVersion: CURRENT_CONSENT_VERSION,
          // undefined when no number was given — nothing to consent to.
          phoneConsent: values.phone.trim() ? phoneConsent : undefined,
        }),
      })
      if (!res.ok) throw new Error(`Contact request failed (${res.status})`)
      const data = (await res.json()) as { ok?: boolean }
      if (!data.ok) throw new Error('Contact request rejected')
      setStatus('success')
      trackEvent('contact_form_success', analyticsParams)
      trackEvent('generate_lead', { ...analyticsParams, phone_provided: !!values.phone.trim() })
    } catch (err) {
      console.error('Contact request error:', err)
      setStatus('error')
      trackEvent('contact_form_error', analyticsParams)
    } finally {
      submittingRef.current = false
    }
  }

  if (status === 'success') {
    return (
      <div role="status" aria-live="polite" className="py-4 text-center">
        <h3 className="font-serif text-xl font-semibold text-slate-900">
          Thanks, {values.name.trim().split(/\s+/)[0]}. We have your message.
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Christine or John will reply, usually the same day. If it is urgent, call (561) 783-7733.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Honeypot — hidden from sighted users, left open for bots */}
      <div
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}
      >
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.honeypot}
          onChange={(e) => update('honeypot', e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="contact-name" className={labelCls}>
          Name *
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          value={values.name}
          onFocus={handleFocus}
          onChange={(e) => update('name', e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          className={inputCls}
        />
        {errors.name && (
          <p id="contact-name-error" role="alert" className="mt-1 text-xs text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-email" className={labelCls}>
          Email Address *
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={values.email}
          onFocus={handleFocus}
          onChange={(e) => update('email', e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          className={inputCls}
          placeholder="you@example.com"
        />
        {errors.email && (
          <p id="contact-email-error" role="alert" className="mt-1 text-xs text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-phone" className={labelCls}>
          Phone Number <span className="text-slate-500">(Optional)</span>
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onFocus={handleFocus}
          onChange={(e) => update('phone', e.target.value)}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
          className={inputCls}
          placeholder="(561) 555-0100"
        />
        {errors.phone && (
          <p id="contact-phone-error" role="alert" className="mt-1 text-xs text-red-600">
            {errors.phone}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-message" className={labelCls}>
          How can we help? <span className="text-slate-500">(Optional)</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          maxLength={2000}
          value={values.message}
          onFocus={handleFocus}
          onChange={(e) => update('message', e.target.value)}
          className={inputCls}
          placeholder="The area or building you are looking at, your timing, or a question."
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-full bg-report-gold px-6 py-3.5 text-sm font-semibold text-navy-950 transition hover:bg-report-gold-dark disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : 'Send Message'}
      </button>

      {status === 'error' && (
        <p role="alert" aria-live="assertive" className="text-center text-xs text-red-600">
          Something went wrong. Please try again, or email us at info@doyouneedahome.com.
        </p>
      )}

      <FormConsent
        phoneEntered={!!values.phone.trim()}
        phoneConsent={phoneConsent}
        onPhoneConsentChange={setPhoneConsent}
      />
    </form>
  )
}
