'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type AdminTheme = 'dark' | 'light'

type ThemeCtx = {
  theme: AdminTheme
  toggle: () => void
  isDark: boolean
}

const Ctx = createContext<ThemeCtx>({ theme: 'dark', toggle: () => {}, isDark: true })

export function AdminThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<AdminTheme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('admin-theme') as AdminTheme | null
    if (stored === 'dark' || stored === 'light') setTheme(stored)
    setMounted(true)
  }, [])

  const toggle = () => {
    setTheme(t => {
      const next: AdminTheme = t === 'dark' ? 'light' : 'dark'
      localStorage.setItem('admin-theme', next)
      return next
    })
  }

  // suppress flash on mount
  if (!mounted) return null

  return (
    <Ctx.Provider value={{ theme, toggle, isDark: theme === 'dark' }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAdminTheme(): ThemeCtx {
  return useContext(Ctx)
}

// ── Shared style helpers ─────────────────────────────────────────────────────

export function themeStyles(isDark: boolean) {
  return {
    input: {
      width: '100%',
      padding: '0.65rem 0.75rem',
      background: isDark ? '#111' : '#fff',
      border: `1px solid ${isDark ? '#2a2a2a' : '#ddd'}`,
      borderRadius: '8px',
      color: isDark ? '#f0ede8' : '#2c2c2c',
      fontSize: '0.875rem',
      outline: 'none',
      boxSizing: 'border-box' as const,
    },
    card: {
      background: isDark ? '#1a1a1a' : '#ffffff',
      border: `1px solid ${isDark ? '#2a2a2a' : '#e8e0d5'}`,
      borderRadius: '12px',
      padding: '1.5rem',
    },
    cardSm: {
      background: isDark ? '#1a1a1a' : '#ffffff',
      border: `1px solid ${isDark ? '#2a2a2a' : '#e8e0d5'}`,
      borderRadius: '12px',
      padding: '1.25rem',
    },
    label: {
      display: 'block' as const,
      fontSize: '0.75rem',
      color: isDark ? '#666' : '#888',
      marginBottom: '0.4rem',
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
    },
    text: {
      primary: isDark ? '#f0ede8' : '#2c2c2c',
      secondary: isDark ? '#888' : '#666',
      muted: isDark ? '#555' : '#999',
    },
    tabsBar: {
      background: isDark ? '#111' : '#f0ede8',
      borderRadius: '8px',
      padding: '3px',
    },
    tabActive: {
      background: isDark ? '#2a2a2a' : '#fff',
      color: isDark ? '#f0ede8' : '#2c2c2c',
    },
    tabInactive: {
      background: 'transparent',
      color: isDark ? '#555' : '#999',
    },
  }
}
