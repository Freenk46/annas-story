'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, Package, Tag, Archive, ShoppingBag, LogOut } from 'lucide-react'
import { createClient } from '../../lib/supabase/client'
import { useRouter } from 'next/navigation'
import { cn } from '../../lib/utils'

const nav = [
  { href: '/admin/products',   label: 'პროდუქტები',  icon: Package },
  { href: '/admin/categories', label: 'კატეგორიები', icon: Tag },
  { href: '/admin/bundles',    label: 'ნაკრებები',   icon: Archive },
  { href: '/admin/orders',     label: 'შეკვეთები',   icon: ShoppingBag },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router   = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside style={{
      width: '240px',
      minHeight: '100vh',
      background: '#1a1a1a',
      borderRight: '1px solid #2a2a2a',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 0',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '0 1.5rem 1.5rem',
        borderBottom: '1px solid #2a2a2a',
        marginBottom: '1rem',
      }}>
        <Link href="/admin/products" style={{ textDecoration: 'none' }}>
          <div style={{
            fontFamily: 'var(--font-family-display)',
            fontWeight: 700,
            fontSize: '1.1rem',
            color: '#f0ede8',
            letterSpacing: '-0.01em',
          }}>
            Anna&apos;s Story
          </div>
          <div style={{ fontSize: '0.7rem', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Admin Panel
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 0.75rem' }}>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                marginBottom: '2px',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: active ? 600 : 400,
                color: active ? '#f0ede8' : '#888',
                background: active ? '#2a2a2a' : 'transparent',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={16} strokeWidth={active ? 2 : 1.5} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #2a2a2a' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#666',
            fontSize: '0.875rem',
            padding: '0.5rem 0',
            width: '100%',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f0ede8')}
          onMouseLeave={e => (e.currentTarget.style.color = '#666')}
        >
          <LogOut size={16} />
          გამოსვლა
        </button>
      </div>
    </aside>
  )
}
