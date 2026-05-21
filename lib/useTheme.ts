'use client'

import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const stored = localStorage.getItem('prototype-theme') as Theme | null
    const initial = stored === 'dark' ? 'dark' : 'light'
    setTheme(initial)
  }, [])

  const toggle = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('prototype-theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  return { theme, toggle }
}
