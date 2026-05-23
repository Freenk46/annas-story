import type { ReactNode } from 'react'

// Root layout is a minimal pass-through.
// <html>, <body>, fonts and metadata all live in app/[locale]/layout.tsx
// so that lang={locale} and data-locale={locale} can be set directly.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
