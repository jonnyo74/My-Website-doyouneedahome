'use client'

import { usePathname } from 'next/navigation'

// Routes that are standalone marketing microsites: they carry their own footer
// (brokerage, disclaimers, contact) and the site Header/Footer must not wrap
// them. Children are server-rendered as usual; this wrapper only decides
// whether they appear.
const STANDALONE_ROUTES = ['/listings/8804-skyward-street']

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const standalone = STANDALONE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
  if (standalone) return null
  return <>{children}</>
}
