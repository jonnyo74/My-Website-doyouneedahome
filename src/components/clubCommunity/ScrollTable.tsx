import { tableWrap } from './ui'

/**
 * Wraps a wide table so it scrolls sideways on a phone instead of widening the
 * page. The region is focusable and named, so a keyboard user can scroll it
 * (WCAG 2.1.1) and a screen reader announces what it is.
 */
export default function ScrollTable({
  label,
  className = '',
  children,
}: {
  /** What the table is, for assistive technology. */
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    // A scrollable region must be keyboard-focusable (WCAG 2.1.1).
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <div role="region" aria-label={label} tabIndex={0} className={`${tableWrap} focus-visible:outline focus-visible:outline-2 focus-visible:outline-report-gold-dark ${className}`}>
      {children}
    </div>
  )
}
