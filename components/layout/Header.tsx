'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '../../lib/useTheme'
import { useLanguage } from '../../lib/useLanguage'
import { LanguageSwitcher } from '../LanguageSwitcher'

const openDrawer = () => {
  window.dispatchEvent(new CustomEvent('open-contact-drawer'))
}

export default function Header() {
  const pathname              = usePathname()
  const isAbout               = pathname?.includes('/about') ?? false
  const { theme, toggle }     = useTheme()
  const { locale, t }         = useLanguage()

  // Nav dark mode: true when a [data-nav-theme="dark"] section is in viewport
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const observe = () => {
      const sections = document.querySelectorAll<HTMLElement>('[data-nav-theme="dark"]')
      if (!sections.length) return

      const obs = new IntersectionObserver(
        (entries) => {
          const anyVisible = entries.some(e => e.isIntersecting)
          setIsDark(anyVisible)
        },
        { threshold: 0.1 }
      )
      sections.forEach(el => obs.observe(el))
      return obs
    }

    let obs: IntersectionObserver | undefined
    const raf = requestAnimationFrame(() => { obs = observe() })
    return () => {
      cancelAnimationFrame(raf)
      obs?.disconnect()
    }
  }, [pathname])

  const isUserDark  = theme === 'dark'
  const textColor   = isDark ? 'rgba(255,255,255,0.92)'  : (isUserDark ? 'rgba(240,237,232,0.92)' : '#111111')
  const bgColor     = isDark ? 'rgba(0,0,0,0.0)'         : (isUserDark ? 'rgba(17,17,17,0.95)'    : 'rgba(255,255,255,0.92)')
  const borderColor = isDark ? 'rgba(255,255,255,0.12)'   : (isUserDark ? 'rgba(240,237,232,0.12)' : '#e0ddd6')
  const blur        = isDark ? 'none'                     : 'blur(8px)'

  // On About page non-active items dim; language/toggle stays full
  const dimColor  = (isAbout && !isDark) ? '#aaa'    : textColor
  const dimWeight = (isAbout && !isDark) ? 400       : 500

  const baseStyle: React.CSSProperties = {
    fontSize:       '0.95rem',
    letterSpacing:  '0.08em',
    textTransform:  'uppercase',
    textDecoration: 'none',
    cursor:         'pointer',
    background:     'none',
    border:         'none',
    padding:        0,
    fontFamily:     'inherit',
    transition:     'opacity 0.2s ease, color 0.3s ease',
  }

  return (
    <header
      style={{
        position:            'fixed',
        top: 0, left: 0, right: 0,
        height:              '68px',
        display:             'flex',
        alignItems:          'center',
        justifyContent:      'space-between',
        padding:             '0 2rem',
        zIndex:              100,
        borderBottom:        `0.5px solid ${borderColor}`,
        background:          bgColor,
        backdropFilter:      blur,
        WebkitBackdropFilter:blur,
        transition:          'background 0.4s ease, border-color 0.4s ease',
      }}
    >
      {/* Logo */}
      <Link
        href={`/${locale}`}
        style={{
          fontFamily:     'var(--font-family-display)',
          fontWeight:     900,
          fontSize:       '1.55rem',
          letterSpacing:  '-0.02em',
          textTransform:  'none',
          color:          textColor,
          textDecoration: 'none',
          transition:     'color 0.3s ease',
        }}
      >
        Anna&apos;s Story
      </Link>

      {/* Nav */}
      <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>

        {/* WORKS */}
        <Link
          href={`/${locale}#collections`}
          style={{ ...baseStyle, fontWeight: dimWeight, color: dimColor }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.5')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          {t.nav.works}
        </Link>

        {/* ABOUT — on About page: localized "ABOUT our BRAND" variant */}
        {isAbout ? (
          <span style={{ display: 'flex', alignItems: 'baseline', gap: '0.25em' }}>
            <span style={{ ...baseStyle, fontWeight: 700, color: textColor, fontSize: '0.95rem', letterSpacing: '0.08em' }}>
              {t.nav.aboutBrand}
            </span>
            <span style={{
              fontFamily:    'var(--font-family-serif)',
              fontStyle:     'italic',
              fontWeight:    300,
              fontSize:      '0.95rem',
              color:         textColor,
              textTransform: 'none',
              letterSpacing: '0.01em',
              transition:    'color 0.3s ease',
            }}>
              {t.nav.our}
            </span>
            <span style={{ ...baseStyle, fontWeight: 700, color: textColor, fontSize: '0.95rem', letterSpacing: '0.08em' }}>
              {t.nav.brand}
            </span>
          </span>
        ) : (
          <Link
            href={`/${locale}/about`}
            style={{ ...baseStyle, fontWeight: 500, color: textColor }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.5')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {t.nav.about}
          </Link>
        )}

        {/* CONTACT */}
        <button
          onClick={openDrawer}
          style={{ ...baseStyle, fontWeight: dimWeight, color: dimColor }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.5')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          {t.nav.contact}
        </button>

        {/* Language switcher + theme toggle */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <LanguageSwitcher isDark={isDark} />

          {/* Theme toggle pill */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            style={{
              width:        '40px',
              height:       '22px',
              borderRadius: '11px',
              border:       `1px solid ${borderColor}`,
              background:   isDark || isUserDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
              position:     'relative',
              cursor:       'pointer',
              padding:      0,
              flexShrink:   0,
            }}
          >
            <span style={{
              position:     'absolute',
              top:          '50%',
              left:         isUserDark ? 'calc(100% - 17px)' : '3px',
              transform:    'translateY(-50%)',
              width:        '14px',
              height:       '14px',
              borderRadius: '50%',
              background:   textColor,
              display:      'block',
              transition:   'left 0.25s ease',
            }} />
          </button>
        </div>

      </nav>
    </header>
  )
}
