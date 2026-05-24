import { type NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'
import { locales, defaultLocale } from './i18n.config'

const intlMiddleware = createIntlMiddleware({ locales, defaultLocale })

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── Admin routes auth guard ─────────────────────
  if (pathname.startsWith('/admin')) {
    // Login page is always accessible
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }

    // Check Supabase session
    const res = NextResponse.next()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    return res
  }

  // ── next-intl for public routes ─────────────────
  return intlMiddleware(req)
}

export const config = {
  matcher: ['/((?!_next|api|favicon|images|videos|icons|.*\\..*).*)'],
}
