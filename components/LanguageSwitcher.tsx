'use client'

import { useLanguage, type Locale } from '../lib/useLanguage'

const LANGS: Locale[] = ['en', 'ru', 'ka']

interface Props {
  isDark?: boolean
}

export function LanguageSwitcher({ isDark = false }: Props) {
  const { locale, switchLocale } = useLanguage()

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      {LANGS.map(lang => {
        const isActive = locale === lang
        return (
          <button
            key={lang}
            onClick={() => switchLocale(lang)}
            style={{
              fontSize:       '0.9rem',
              fontWeight:     isActive ? 700 : 500,
              letterSpacing:  '0.06em',
              textTransform:  'uppercase',
              background:     'none',
              border:         'none',
              borderBottom:   isActive ? `1px solid ${isDark ? 'white' : 'var(--text-primary)'}` : '1px solid transparent',
              cursor:         'pointer',
              padding:        '0.1rem 0.3rem',
              color:          isDark
                ? (isActive ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.5)')
                : (isActive ? 'var(--text-primary)' : 'var(--text-muted)'),
              transition:     'color 0.2s, border-color 0.2s',
            }}
          >
            {lang.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
