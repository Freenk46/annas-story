'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useLanguage, type Locale } from '../lib/useLanguage'

const LANGS: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ka', label: 'KA' },
  { code: 'ru', label: 'RU' },
]

interface Props {
  textColor?: string   // pass header's computed textColor for correct contrast
}

export function LanguageSwitcher({ textColor = 'var(--text-primary)' }: Props) {
  const { locale, switchLocale } = useLanguage()
  const [open, setOpen]         = useState(false)
  const router                  = useRouter()
  const pathname                = usePathname()
  const ref                     = useRef<HTMLDivElement>(null)

  // Close when user clicks outside
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleSwitch = (newLocale: Locale) => {
    switchLocale(newLocale)                     // sync localStorage + event bus
    const segments = pathname.split('/')
    segments[1] = newLocale                     // ['', locale, ...rest]
    router.push(segments.join('/'))             // navigate to new locale URL
    setOpen(false)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>

      {/* ── Trigger button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          fontSize:      '0.75rem',
          fontWeight:    600,
          letterSpacing: '0.08em',
          background:    'none',
          border:        'none',
          cursor:        'pointer',
          color:         textColor,
          display:       'flex',
          alignItems:    'center',
          gap:           '3px',
          padding:       0,
          fontFamily:    'inherit',
          transition:    'opacity 0.2s ease',
          textTransform: 'uppercase',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.6' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
      >
        {locale.toUpperCase()}
        <span style={{
          fontSize:   '0.55rem',
          display:    'inline-block',
          transition: 'transform 0.2s ease',
          transform:  open ? 'rotate(180deg)' : 'none',
          lineHeight: 1,
        }}>▾</span>
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div style={{
          position:   'absolute',
          top:        'calc(100% + 10px)',
          right:      0,
          background: 'var(--bg)',
          border:     '0.5px solid var(--border)',
          minWidth:   '80px',
          zIndex:     200,
        }}>
          {LANGS.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => handleSwitch(code)}
              style={{
                display:       'block',
                width:         '100%',
                padding:       '0.5rem 1rem',
                textAlign:     'left',
                fontSize:      '0.75rem',
                letterSpacing: '0.08em',
                fontWeight:    locale === code ? 700 : 400,
                cursor:        'pointer',
                background:    'none',
                border:        'none',
                color:         locale === code ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontFamily:    'inherit',
                transition:    'background 0.15s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-secondary)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none' }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

    </div>
  )
}
