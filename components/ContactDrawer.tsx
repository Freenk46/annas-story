'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { MessageCircle, Mail, X } from 'lucide-react'
import { useLanguage } from '../lib/useLanguage'

function IconInstagram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function ContactDrawer() {
  const [open, setOpen] = useState(false)
  const { locale, t } = useLanguage()
  const cd = t.contactDrawer
  const panel = t.contact_panel

  useEffect(() => {
    const handle = () => setOpen(true)
    window.addEventListener('open-contact-drawer', handle)
    return () => window.removeEventListener('open-contact-drawer', handle)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const links = [
    { label: 'WhatsApp',      href: 'https://wa.me/',                  Icon: MessageCircle as React.ComponentType<{ size?: number }>, accent: '#25D366' },
    { label: 'Instagram',     href: 'https://instagram.com/prototype', Icon: IconInstagram as React.ComponentType<{ size?: number }>, accent: 'var(--text-primary)' },
    { label: panel.email,     href: 'mailto:hello@annastory.ge',       Icon: Mail as React.ComponentType<{ size?: number }>,          accent: 'var(--text-primary)' },
  ]

  return (
    <>
      <style>{`
        .cd-panel { width: 380px; }
        @media (max-width: 768px) { .cd-panel { width: 100vw; } }
      `}</style>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="cd-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.3)',
                zIndex: 300,
              }}
            />

            {/* Drawer */}
            <motion.div
              key="cd-panel"
              className="cd-panel"
              initial={{ x: 420 }}
              animate={{ x: 0 }}
              exit={{ x: 420 }}
              transition={{ duration: 0.45, ease: EASE }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                background: 'var(--bg)',
                borderLeft: '0.5px solid var(--border)',
                zIndex: 301,
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
              }}
            >
              {/* Top bar */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1.25rem 2rem',
                borderBottom: '0.5px solid var(--border)',
                flexShrink: 0,
              }}>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                }}>
                  Anna&apos;s Story
                </span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  style={{
                    background: 'none', border: 'none',
                    cursor: 'pointer', padding: '4px',
                    color: 'var(--text-primary)',
                    display: 'flex', alignItems: 'center',
                    lineHeight: 1,
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

                {/* Heading */}
                <h2 style={{
                  fontFamily: 'var(--font-family-display)',
                  fontWeight: 900,
                  fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}>
                  {cd.heading}
                </h2>

                {/* Contact links */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {links.map(({ label, href, Icon, accent }) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '1rem',
                        padding: '1.1rem 0',
                        borderBottom: '0.5px solid var(--border)',
                        textDecoration: 'none',
                        color: 'var(--text-primary)',
                        transition: 'opacity 0.2s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.5' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
                    >
                      <span style={{ color: accent, display: 'flex', flexShrink: 0 }}>
                        <Icon size={16} />
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-family-display)',
                        fontWeight: 700,
                        fontSize: '1.35rem',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}>
                        {label}
                      </span>
                      <span style={{ marginLeft: 'auto', opacity: 0.35, fontSize: '0.95rem' }}>→</span>
                    </a>
                  ))}
                </div>

                {/* Info block */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                  {/* Working hours */}
                  <div>
                    <div style={{
                      fontSize: '0.8rem', fontWeight: 700,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: 'var(--text-muted)', marginBottom: '0.45rem',
                    }}>
                      {panel.hours_label}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-family-serif)',
                      fontStyle: 'italic',
                      fontSize: '1.1rem',
                      color: 'var(--text-primary)',
                      lineHeight: 1.6,
                    }}>
                      {panel.hours}<br />
                      {cd.sundayClosed}
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <div style={{
                      fontSize: '0.8rem', fontWeight: 700,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: 'var(--text-muted)', marginBottom: '0.45rem',
                    }}>
                      {panel.location_label}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-family-serif)',
                      fontStyle: 'italic',
                      fontSize: '1.1rem',
                      color: 'var(--text-primary)',
                      lineHeight: 1.6,
                    }}>
                      {panel.location}<br />
                      <span style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                        {panel.delivery}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Footer */}
              <div style={{
                padding: '1.5rem 2rem',
                borderTop: '0.5px solid var(--border)',
                display: 'flex', flexDirection: 'column', gap: '0.75rem',
                flexShrink: 0,
              }}>
                <Link
                  href={`/${locale}/contact`}
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'block',
                    padding: '0.9rem 1rem',
                    background: 'var(--text-primary)',
                    color: 'var(--bg)',
                    textAlign: 'center',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-family-display)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.75' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
                >
                  {cd.viewFull} →
                </Link>

                <div style={{
                  fontSize: '0.8rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                }}>
                  {cd.copyright}
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
