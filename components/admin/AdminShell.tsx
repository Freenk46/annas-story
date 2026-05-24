'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { AdminThemeProvider, useAdminTheme } from '../../lib/adminTheme'
import AdminSidebar from './AdminSidebar'

function ShellInner({ children }: { children: ReactNode }) {
  const { isDark } = useAdminTheme()
  const pathname   = usePathname()
  const isLogin    = pathname === '/admin/login'

  const bg    = isDark ? '#0f0f0f' : '#f5f0e8'
  const color = isDark ? '#f0ede8' : '#2c2c2c'

  if (isLogin) {
    return (
      <div style={{
        minHeight: '100vh',
        background: bg,
        color,
        fontFamily: 'Inter, system-ui, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.2s, color 0.2s',
      }}>
        {children}
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: bg,
      color,
      fontFamily: 'Inter, system-ui, sans-serif',
      transition: 'background 0.2s, color 0.2s',
    }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <AdminThemeProvider>
      <ShellInner>{children}</ShellInner>
    </AdminThemeProvider>
  )
}
