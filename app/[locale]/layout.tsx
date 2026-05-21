import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import Header from '../../components/layout/Header'
import ContactPanel from '../../components/layout/ContactPanel'
import ContactDrawer from '../../components/ContactDrawer'
import Footer from '../../components/Footer'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  void locale
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <Header />
      <ContactPanel />
      <ContactDrawer />
      <div style={{ paddingTop: '68px' }}>
        {children}
        <Footer />
      </div>
    </NextIntlClientProvider>
  )
}
