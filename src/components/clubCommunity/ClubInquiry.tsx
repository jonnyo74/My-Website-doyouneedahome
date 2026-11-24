'use client'

import { useEffect, useState } from 'react'
import ContactForm from '@/components/ContactForm'
import { CLUB_INQUIRY_TYPES, isClubInquiryType, type ClubInquiryType } from '@/lib/clubInquiry'

/**
 * The one inquiry form on a club-community page. A topic menu sits above the
 * site's standard contact form; any InquiryLink on the page preselects it. The
 * topic goes to Follow Up Boss as an inquiry type (see lib/clubInquiry), along
 * with the community name, the page URL and the usual tracking parameters.
 */
export default function ClubInquiry({
  community,
  defaultType = 'membership-fees',
  /** Topics offered, in menu order. Leave out any that do not apply to the community. */
  types = Object.keys(CLUB_INQUIRY_TYPES) as ClubInquiryType[],
  /** Replaces a topic's menu and button label, e.g. to name the community. */
  labels = {},
}: {
  community: string
  defaultType?: ClubInquiryType
  types?: ClubInquiryType[]
  labels?: Partial<Record<ClubInquiryType, string>>
}) {
  const [type, setType] = useState<ClubInquiryType>(defaultType)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('[data-inquiry]')
      const wanted = link?.getAttribute('data-inquiry')
      if (isClubInquiryType(wanted) && types.includes(wanted)) setType(wanted)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [types])

  const label = (t: ClubInquiryType) => labels[t] ?? CLUB_INQUIRY_TYPES[t].label

  return (
    <div>
      <label htmlFor="club-inquiry-topic" className="mb-1.5 block text-xs font-medium text-slate-600">
        What would you like?
      </label>
      <select
        id="club-inquiry-topic"
        value={type}
        onChange={(e) => isClubInquiryType(e.target.value) && setType(e.target.value)}
        className="mb-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-report-gold-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-report-gold-dark"
      >
        {types.map((t) => (
          <option key={t} value={t}>
            {label(t)}
          </option>
        ))}
      </select>
      <ContactForm
        ctaPlacement="community-inline"
        pageName={community}
        idPrefix="club-inquiry"
        inquiryType={type}
        submitLabel={label(type)}
        messagePlaceholder={CLUB_INQUIRY_TYPES[type].placeholder}
      />
    </div>
  )
}
