import type { ClubInquiryType } from '@/lib/clubInquiry'
import { CLUB_INQUIRY_TYPES } from '@/lib/clubInquiry'
import { INQUIRY_ID, btnPrimary } from './ui'

/**
 * A call to action that takes the reader to the page's one inquiry form with
 * the right topic already chosen. It is a plain in-page link, so it works
 * without script; ClubInquiry reads `data-inquiry` to preselect the topic.
 */
export default function InquiryLink({
  type,
  children,
  className = btnPrimary,
}: {
  type: ClubInquiryType
  /** Defaults to the topic's own label. */
  children?: React.ReactNode
  className?: string
}) {
  return (
    <a href={`#${INQUIRY_ID}`} data-inquiry={type} className={className}>
      {children ?? CLUB_INQUIRY_TYPES[type].label}
    </a>
  )
}
