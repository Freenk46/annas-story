'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu } from 'lucide-react'
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
  const [isDark, setIsDark]     = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isHero, setIsHero]     = useState(true)

  const isHomePage       = pathname === `/${locale}` || pathname === `/${locale}/`
  const showTransparent  = isHomePage && isHero

  useEffect(() => {
    const handleScroll = () => {
      setIsHero(window.scrollY < window.innerHeight * 0.8)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observe = () => {
      const sections = document.querySelectorAll<HTMLElement>('[data-nav-theme="dark"]')
      if (!sections.length) return
      const obs = new IntersectionObserver(
        (entries) => { setIsDark(entries.some(e => e.isIntersecting)) },
        { threshold: 0.1 }
      )
      sections.forEach(el => obs.observe(el))
      return obs
    }
    let obs: IntersectionObserver | undefined
    const raf = requestAnimationFrame(() => { obs = observe() })
    return () => { cancelAnimationFrame(raf); obs?.disconnect() }
  }, [pathname])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const isUserDark  = theme === 'dark'

  const textColor   = showTransparent
    ? 'rgba(255,255,255,0.92)'
    : (isDark ? 'rgba(255,255,255,0.92)' : (isUserDark ? 'rgba(240,237,232,0.92)' : '#111111'))

  const bgColor     = showTransparent
    ? 'transparent'
    : (isDark ? 'rgba(0,0,0,0.0)' : `rgba(var(--bg-rgb), 0.92)`)

  const borderColor = showTransparent
    ? 'transparent'
    : (isDark ? 'rgba(255,255,255,0.12)' : (isUserDark ? 'rgba(240,237,232,0.12)' : '#e0ddd6'))

  const blur        = showTransparent ? 'none' : (isDark ? 'none' : 'blur(8px)')

  const dimColor    = (isAbout && !isDark && !showTransparent) ? '#aaa' : textColor
  const dimWeight   = (isAbout && !isDark && !showTransparent) ? 400    : 500
  const menuBg      = isUserDark ? '#111111'              : '#ffffff'
  const menuText    = isUserDark ? 'rgba(240,237,232,0.92)' : '#111111'

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

  const menuLinkStyle: React.CSSProperties = {
    fontFamily:     'var(--font-family-display)',
    fontSize:       'clamp(2.5rem, 10vw, 4rem)',
    fontWeight:     900,
    textTransform:  'uppercase',
    letterSpacing:  '-0.03em',
    color:          menuText,
    textDecoration: 'none',
    background:     'none',
    border:         'none',
    cursor:         'pointer',
    padding:        0,
  }

  return (
    <>
      <style>{`
        .hd-hamburger { display: none !important; }
        .hd-nav-links  { display: flex; }
        @media (max-width: 768px) {
          .hd-hamburger { display: flex !important; }
          .hd-nav-links  { display: none !important; }
        }
      `}</style>

      <header
        style={{
          position:            'fixed',
          top: 0, left: 0, right: 0,
          height:              '68px',
          display:             'flex',
          alignItems:          'center',
          justifyContent:      'space-between',
          padding:             '0 2rem',
          zIndex:              50,
          borderBottom:        `0.5px solid ${borderColor}`,
          background:          bgColor,
          backdropFilter:      blur,
          WebkitBackdropFilter:blur,
          transition:          'background 0.4s ease, border-color 0.4s ease, color 0.3s ease',
        }}
      >
        {/* ── Left: hamburger + logo ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

          <button
            className="hd-hamburger"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            style={{
              background: 'none', border: 'none',
              cursor: 'pointer', padding: '4px',
              color: textColor,
              display: 'flex', alignItems: 'center',
              transition: 'color 0.3s ease',
            }}
          >
            <Menu size={20} />
          </button>

          <Link
            href={`/${locale}`}
            style={{
              fontFamily:    'var(--font-family-display)',
              fontWeight:    900,
              fontSize:      'clamp(0.8rem, 3vw, 1.55rem)',
              letterSpacing: '-0.01em',
              textTransform: 'none',
              color:         textColor,
              textDecoration:'none',
              whiteSpace:    'nowrap',
              transition:    'color 0.3s ease',
            }}
          >
            Anna&apos;s Story
          </Link>
        </div>

        {/* ── Right: desktop nav + lang + toggle ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>

          {/* Desktop nav links */}
          <nav className="hd-nav-links" style={{ gap: '2rem', alignItems: 'center' }}>

            <Link
              href={`/${locale}#collections`}
              style={{ ...baseStyle, fontWeight: dimWeight, color: dimColor }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.5')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              {t.nav.works}
            </Link>

            {isAbout ? (
              <span style={{ display: 'flex', alignItems: 'baseline', gap: '0.25em' }}>
                <span style={{ ...baseStyle, fontWeight: 700, color: textColor }}>
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
                <span style={{ ...baseStyle, fontWeight: 700, color: textColor }}>
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

            <button
              onClick={openDrawer}
              style={{ ...baseStyle, fontWeight: dimWeight, color: dimColor }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.5')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              {t.nav.contact}
            </button>

          </nav>

          {/* Language switcher + theme toggle — always visible */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <LanguageSwitcher isDark={isDark} />

            <button
              onClick={toggle}
              aria-label="Toggle theme"
              style={{
                width:        '40px',
                height:       '22px',
                borderRadius: '11px',
                border:       showTransparent ? '1px solid rgba(255,255,255,0.5)' : `1px solid ${borderColor}`,
                background:   showTransparent || isDark || isUserDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
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

        </div>
      </header>

      {/* ══════════════ MOBILE MENU OVERLAY ══════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position:       'fixed',
              inset:          0,
              background:     menuBg,
              zIndex:         99,
              display:        'flex',
              flexDirection:  'column',
              justifyContent: 'center',
              alignItems:     'center',
              gap:            '2rem',
            }}
          >
            {/* Close */}
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              style={{
                position:   'absolute',
                top:        '1.25rem',
                right:      '2rem',
                background: 'none',
                border:     'none',
                fontSize:   '1.5rem',
                lineHeight: 1,
                cursor:     'pointer',
                color:      menuText,
              }}
            >
              ×
            </button>

            <Link
              href={`/${locale}#collections`}
              onClick={() => setMenuOpen(false)}
              style={menuLinkStyle}
            >
              {t.nav.works}
            </Link>

            <Link
              href={`/${locale}/about`}
              onClick={() => setMenuOpen(false)}
              style={menuLinkStyle}
            >
              {t.nav.about}
            </Link>

            <button
              onClick={() => { setMenuOpen(false); openDrawer() }}
              style={menuLinkStyle}
            >
              {t.nav.contact}
            </button>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
