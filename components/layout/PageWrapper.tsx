'use client'

import { usePathname } from 'next/navigation'

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // Home pages: /ka  /en  /ru  (with optional trailing slash)
  const isHomePage = /^\/[a-z]{2}\/?$/.test(pathname ?? '')

  return (
    <div style={{ paddingTop: isHomePage ? 0 : '68px' }}>
      {children}
    </div>
  )
}
