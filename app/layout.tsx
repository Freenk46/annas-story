import type { Metadata } from 'next'
import { Bebas_Neue, Cormorant_Garamond, Inter, Noto_Sans_Georgian } from 'next/font/google'
import './globals.css'

const display = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
})

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
})

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

const georgian = Noto_Sans_Georgian({
  subsets: ['georgian'],
  weight: ['900'],
  variable: '--font-georgian',
})

export const metadata: Metadata = {
  title: "Anna's Story — Premium Bedding",
  description: 'Premium bedding from Batumi, Georgia. Natural materials, exceptional quality.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      data-theme="light"
      suppressHydrationWarning
      className={`${display.variable} ${serif.variable} ${body.variable} ${georgian.variable}`}
    >
      <head>
        {/* No-flash theme script — runs before paint */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('prototype-theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();` }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
