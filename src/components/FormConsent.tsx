interface FormConsentProps {
  /** Renders light text for placement on a dark panel. */
  dark?: boolean
  /** Optional lead-in sentence shown before the consent language. */
  prefix?: string
  className?: string
}

/**
 * Contact-permission disclaimer shown under every lead form's submit button.
 * Every form on this site collects a phone number, so the phone/text consent
 * language applies everywhere.
 */
export default function FormConsent({ dark = false, prefix, className = '' }: FormConsentProps) {
  return (
    <p
      className={`text-center text-xs leading-5 ${dark ? 'text-white/55' : 'text-slate-500'} ${className}`}
    >
      {prefix ? `${prefix} ` : ''}No spam — your information is never shared or sold. By submitting,
      you agree that DO Homes Group and Premier Brokers International may contact you at the phone
      number and email address you provided — including by phone, text message, and automated or
      prerecorded means — about your inquiry and Palm Beach County real estate. Consent is not a
      condition of any purchase. Message and data rates may apply. Reply STOP to opt out of texts.
      See our{' '}
      <a
        href="https://www.premierbrokersinternational.com/privacy-policy/"
        target="_blank"
        rel="noopener noreferrer"
        className={`underline underline-offset-2 transition ${dark ? 'hover:text-white' : 'hover:text-slate-700'}`}
      >
        Privacy Policy
      </a>
      .
    </p>
  )
}
