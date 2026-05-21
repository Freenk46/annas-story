'use client'

import React from 'react'
import Link from 'next/link'
import { MessageCircle, Phone } from 'lucide-react'

function IconInstagram() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}
import { useLanguage } from '../lib/useLanguage'

export default function Footer() {
  const { locale, t } = useLanguage()
  const f = t.footer
  const n = t.nav

  return (
    <div style={{ background: 'var(--bg)' }}>
      <style>{`
        /* ── Micro-bar ── */
        .ft-bar {
          border-top: 0.5px solid var(--border);
          padding: 0.75rem 2rem;
          display: flex;
          align-items: center;
        }
        /* ── Main grid ── */
        .ft-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          border-top: 0.5px solid var(--border);
          background: var(--bg);
          min-height: 280px;
          position: relative;
          overflow: hidden;
        }
        /* ── Column 1: reel ── */
        .ft-col1 {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          min-height: 280px;
        }
        /* ── Column 2: decorative ── */
        .ft-col2 {
          border-left: 0.5px solid var(--border);
          position: relative;
        }
        /* ── Column 3: contact ── */
        .ft-col3 {
          border-left: 0.5px solid var(--border);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 1.5rem;
        }
        /* ── Column 4: nav ── */
        .ft-col4 {
          border-left: 0.5px solid var(--border);
          padding: 2rem 2rem 2rem 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .ft-nav-link {
          font-family: var(--font-family-display);
          font-size: clamp(3rem, 5.5vw, 5rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          color: var(--text-primary);
          line-height: 0.9;
          text-decoration: none;
          transition: opacity 0.2s;
          display: block;
        }
        .ft-nav-link:hover { opacity: 0.45; }
        /* ── Mobile ── */
        @media (max-width: 768px) {
          .ft-grid { grid-template-columns: 1fr 1fr; }
          .ft-col1 { grid-column: 1 / -1; }
          .ft-col2 { display: none; }
          .ft-nav-link { font-size: clamp(2rem, 8vw, 3rem); }
        }
      `}</style>

      {/* ── Micro-bar ── */}
      <div className="ft-bar">
        <Link
          href={`/${locale}/contact`}
          style={{
            fontFamily: 'var(--font-family-serif)',
            fontStyle: 'italic',
            fontSize: '1.4rem',
            color: 'var(--text-primary)',
            textDecoration: 'none',
            borderBottom: '0.5px solid var(--text-primary)',
            paddingBottom: '1px',
            cursor: 'pointer',
          }}
        >
          ▸ {f.contactUs}
        </Link>
      </div>

      {/* ── Main grid ── */}
      <div className="ft-grid">

        {/* ── Col 1: Reel / Video ── */}
        <div className="ft-col1">
          {/* Background video */}
          <video
            src="/videos/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover',
            }}
          />

          {/* Dark overlay — always dark regardless of theme */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.38)' }} />

          {/* Reel label */}
          <div style={{
            position: 'absolute', top: '1rem', left: '1rem',
            fontSize: '1.4rem', fontWeight: 700,
            color: '#ffffff',
            zIndex: 2,
          }}>
            Reel
          </div>

          {/* Play button */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            fontFamily: 'var(--font-family-serif)',
            fontStyle: 'italic',
            fontSize: '1.1rem',
            color: '#ffffff',
            zIndex: 2,
            userSelect: 'none',
          }}>
            ▸ {f.play}
          </div>

          {/* Year */}
          <div style={{
            position: 'absolute', bottom: '1rem', right: '1rem',
            fontSize: '2rem', fontWeight: 900,
            color: '#ffffff', letterSpacing: '-0.02em',
            zIndex: 2,
            fontFamily: 'var(--font-family-display)',
          }}>
            2025
          </div>
        </div>

        {/* ── Col 2: Decorative S-curve ── */}
        <div className="ft-col2">
          <svg
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              opacity: 0.1, pointerEvents: 'none',
            }}
            viewBox="0 0 400 600"
            preserveAspectRatio="none"
          >
            <path
              d="M 400,0 C 340,50 300,90 240,160 S 130,220 180,270 S 280,310 220,370 S 80,440 40,490 S 10,530 0,600"
              fill="none"
              stroke="var(--text-primary)"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* ── Col 3: Contact & Legal ── */}
        <div className="ft-col3">

          {/* Social links */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            {([
              { label: 'Instagram', href: 'https://instagram.com/prototype', Icon: IconInstagram },
              { label: 'Facebook',  href: 'https://facebook.com/prototype', Icon: IconFacebook },
              { label: 'WhatsApp',  href: 'https://wa.me/',                 Icon: MessageCircle },
            ] as { label: string; href: string; Icon: React.ComponentType<{ size?: number }> }[]).map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  fontSize: '0.95rem', fontWeight: 500,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)' }}
              >
                <Icon size={14} />
                {label}
              </a>
            ))}
          </div>

          {/* Phone */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '1rem', color: 'var(--text-primary)', letterSpacing: '0.05em',
          }}>
            <Phone size={14} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
            +33 (0)1 XX XX XX XX
          </div>

        </div>

        {/* ── Col 4: Navigation ── */}
        <div className="ft-col4">

          {/* Brand label */}
          <div style={{
            fontSize: '1rem', fontWeight: 900,
            letterSpacing: '-0.01em',
            color: 'var(--text-muted)',
            marginBottom: '1.5rem',
          }}>
            {f.brand}
          </div>

          {/* Big nav links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <Link href={`/${locale}/`} className="ft-nav-link">{n.works}</Link>
            <Link href={`/${locale}/about`} className="ft-nav-link">{n.about}</Link>
            <Link href={`/${locale}/contact`} className="ft-nav-link">{n.contact}</Link>
          </nav>

          {/* Copyright */}
          <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
            {f.copyright}
          </div>
        </div>
      </div>
    </div>
  )
}
