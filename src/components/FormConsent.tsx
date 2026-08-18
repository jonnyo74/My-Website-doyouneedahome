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
  className?: string
}

/**
 * Contact-permission disclaimer shown under every lead form's submit button.
 * The wording lives in src/lib/consent.ts so that what is displayed here and
 * what the lead routes record against the lead stay identical.
 */
export default function FormConsent({ dark = false, prefix, className = '' }: FormConsentProps) {
  const copy = CONSENT_VERSIONS[CURRENT_CONSENT_VERSION]

  return (
    <p
      className={`text-center text-xs leading-5 ${dark ? 'text-white/55' : 'text-slate-500'} ${className}`}
    >
      {prefix ? `${prefix} ` : ''}
      {copy.intro} {copy.body} {PRIVACY_PROMPT}{' '}
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
  )
}
