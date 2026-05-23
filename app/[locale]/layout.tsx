import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter, Noto_Sans_Georgian } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import Header from '../../components/layout/Header'
import ContactPanel from '../../components/layout/ContactPanel'
import ContactDrawer from '../../components/ContactDrawer'
import PageWrapper from '../../components/layout/PageWrapper'
import Footer from '../../components/Footer'
import '../globals.css'

// ── Fonts ─────────────────────────────────────────────────────────────────────

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

const bodyFont = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '900'],
  variable: '--font-body',
  display: 'swap',
})

const georgian = Noto_Sans_Georgian({
  subsets: ['georgian'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-georgian',
  display: 'swap',
})

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Anna's Story — Premium Bedding",
  description: 'Premium bedding from Batumi, Georgia. Natural materials, exceptional quality.',
}

// ── Layout ────────────────────────────────────────────────────────────────────

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      data-locale={locale}
      data-theme="light"
      suppressHydrationWarning
      className={`${display.variable} ${serif.variable} ${bodyFont.variable} ${georgian.variable}`}
    >
      <head>
        {/* No-flash theme script — runs before paint */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('prototype-theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();` }} />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <ContactPanel />
          <ContactDrawer />
          <PageWrapper>
            {children}
            <Footer />
          </PageWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
