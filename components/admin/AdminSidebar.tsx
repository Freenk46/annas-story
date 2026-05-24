'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, Tag, Archive, ShoppingBag, LogOut, Sun, Moon } from 'lucide-react'
import { createClient } from '../../lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useAdminTheme } from '../../lib/adminTheme'

const nav = [
  { href: '/admin/products',   label: 'პროდუქტები',  icon: Package },
  { href: '/admin/categories', label: 'კატეგორიები', icon: Tag },
  { href: '/admin/bundles',    label: 'ნაკრებები',   icon: Archive },
  { href: '/admin/orders',     label: 'შეკვეთები',   icon: ShoppingBag },
]

export default function AdminSidebar() {
  const pathname         = usePathname()
  const router           = useRouter()
  const { theme, toggle, isDark } = useAdminTheme()

  const bg         = isDark ? '#141414' : '#ffffff'
  const border     = isDark ? '#2a2a2a' : '#e8e0d5'
  const logoColor  = isDark ? '#f0ede8' : '#2c2c2c'
  const subColor   = isDark ? '#444' : '#bbb'
  const activeText = isDark ? '#f0ede8' : '#2c2c2c'
  const activeBg   = isDark ? '#2a2a2a' : '#f0ede8'
  const inactiveText = isDark ? '#666' : '#999'

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const btnBase: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.6rem 0.75rem',
    borderRadius: '8px',
    marginBottom: '2px',
    textDecoration: 'none',
    fontSize: '0.875rem',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    width: '100%',
    textAlign: 'left' as const,
  }

  return (
    <aside style={{
      width: '220px',
      minHeight: '100vh',
      background: bg,
      borderRight: `1px solid ${border}`,
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 0',
      flexShrink: 0,
      transition: 'background 0.2s, border-color 0.2s',
    }}>

      {/* Logo */}
      <div style={{
        padding: '0 1.25rem 1.25rem',
        borderBottom: `1px solid ${border}`,
        marginBottom: '1rem',
      }}>
        <Link href="/admin/products" style={{ textDecoration: 'none' }}>
          <div style={{
            fontFamily: 'var(--font-family-display, Georgia, serif)',
            fontWeight: 700,
            fontSize: '1.05rem',
            color: logoColor,
            letterSpacing: '-0.01em',
            transition: 'color 0.2s',
          }}>
            Anna&apos;s Story
          </div>
          <div style={{
            fontSize: '0.65rem',
            color: subColor,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginTop: '1px',
          }}>
            Admin Panel
          </div>
        </Link>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '0 0.625rem' }}>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              style={{
                ...btnBase,
                fontWeight: active ? 600 : 400,
                color: active ? activeText : inactiveText,
                background: active ? activeBg : 'transparent',
              }}
            >
              <Icon size={15} strokeWidth={active ? 2 : 1.5} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div style={{
        padding: '0.75rem 0.625rem 0',
        borderTop: `1px solid ${border}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
      }}>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          style={{
            ...btnBase,
            color: inactiveText,
            opacity: 0.7,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.opacity = '1'
            e.currentTarget.style.color = activeText
          }}
          onMouseLeave={e => {
            e.currentTarget.style.opacity = '0.7'
            e.currentTarget.style.color = inactiveText
          }}
        >
          {isDark
            ? <><Sun size={15} /> ღია თემა</>
            : <><Moon size={15} /> მუქი თემა</>
          }
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            ...btnBase,
            color: inactiveText,
            opacity: 0.7,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.opacity = '1'
            e.currentTarget.style.color = '#f87171'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.opacity = '0.7'
            e.currentTarget.style.color = inactiveText
          }}
        >
          <LogOut size={15} />
          გამოსვლა
        </button>
      </div>
    </aside>
  )
}
