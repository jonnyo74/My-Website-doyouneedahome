'use client'

import { useId } from 'react'
import {
  CONSENT_VERSIONS,
  CURRENT_CONSENT_VERSION,
  PRIVACY_LINK_LABEL,
  PRIVACY_PROMPT,
} from '@/lib/consent'

interface FormConsentProps {
  /** Renders light text for placement on a dark panel. */
  dark?: boolean
  /** Optional lead-in sentence shown before the consent language. */
  prefix?: string
  /**
   * Whether a phone number has actually been typed. The checkbox appears only
   * then — there is nothing to consent to for calls or texts without a number,
   * and the phone field is optional on every form.
   */
  phoneEntered?: boolean
  phoneConsent?: boolean
  onPhoneConsentChange?: (checked: boolean) => void
  className?: string
}

/**
 * Contact-permission disclaimer shown under every lead form's submit button.
 * The wording lives in src/lib/consent.ts so that what is displayed here and
 * what the lead routes record against the lead stay identical.
 *
 * The checkbox is never required to submit. Gating a free guide on call/text
 * permission would make consent a condition of getting it, which is exactly
 * what "consent is not a condition" is meant to rule out.
 */
export default function FormConsent({
  dark = false,
  prefix,
  phoneEntered = false,
  phoneConsent = false,
  onPhoneConsentChange,
  className = '',
}: FormConsentProps) {
  const copy = CONSENT_VERSIONS[CURRENT_CONSENT_VERSION]
  const uid = useId()
  const checkboxId = `consent-${uid}`
  const showCheckbox = phoneEntered && !!copy.phoneCheckbox
  const muted = dark ? 'text-white/55' : 'text-slate-500'

  return (
    <div className={`space-y-3 ${className}`}>
      {showCheckbox && (
        <div className="flex items-start gap-2.5 text-left">
          <input
            id={checkboxId}
            name="phoneConsent"
            type="checkbox"
            checked={phoneConsent}
            onChange={(e) => onPhoneConsentChange?.(e.target.checked)}
            className={`mt-0.5 h-4 w-4 flex-shrink-0 rounded accent-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/60 ${
              dark ? 'border-white/30 bg-white/10' : 'border-slate-300'
            }`}
          />
          <label htmlFor={checkboxId} className={`text-xs leading-5 ${muted}`}>
            {copy.phoneCheckbox}
          </label>
        </div>
      )}

      <p className={`text-center text-xs leading-5 ${muted}`}>
        {prefix ? `${prefix} ` : ''}
        {copy.base} {PRIVACY_PROMPT}{' '}
        <a
          href="/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className={`underline underline-offset-2 transition ${dark ? 'hover:text-white' : 'hover:text-slate-700'}`}
        >
          {PRIVACY_LINK_LABEL}
        </a>
        .
      </p>
    </div>
  )
}
