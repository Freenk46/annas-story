'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '../../../lib/useLanguage'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com/prototype' },
  { label: 'Youtube',   href: 'https://youtube.com/@prototype'  },
  { label: 'Facebook',  href: 'https://facebook.com/prototype'  },
  { label: 'WhatsApp',  href: 'https://wa.me/'                  },
]

export default function ContactPage() {
  const { t } = useLanguage()
  const cp = t.contactPage
  const panel = t.contact_panel
  const cd = t.contactDrawer

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <style>{`
        .ct-hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 60vh;
          padding: 4rem 2rem 3rem;
          border-bottom: 0.5px solid var(--border);
          position: relative;
          overflow: hidden;
        }
        .ct-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: flex-start;
          padding-top: 0.5rem;
        }
.ct-map-label {
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 0.5px solid var(--border);
        }
        .ct-strip {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          border-bottom: 0.5px solid var(--border);
        }
        .ct-strip-cell {
          padding: 2rem;
          border-right: 0.5px solid var(--border);
        }
        .ct-strip-cell:last-child {
          border-right: none;
        }
        .ct-strip-label {
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 0.55rem;
        }
        .ct-strip-body {
          font-family: var(--font-family-serif);
          font-style: italic;
          font-size: 1.2rem;
          color: var(--text-primary);
          line-height: 1.65;
        }
        @media (max-width: 768px) {
          .ct-strip {
            grid-template-columns: 1fr;
          }
          .ct-strip-cell {
            border-right: none;
            border-bottom: 0.5px solid var(--border);
          }
          .ct-strip-cell:last-child {
            border-bottom: none;
          }
        }
        .ct-map-iframe {
          display: block;
          width: 100%;
          border: 0;
        }
        [data-theme="dark"] .ct-map-iframe {
          filter: invert(90%) hue-rotate(180deg);
        }
        @media (max-width: 768px) {
          .ct-hero {
            grid-template-columns: 1fr;
            padding: 3rem 1.5rem 2rem;
          }
          .ct-right {
            align-items: flex-start;
            margin-top: 2rem;
          }
        }
      `}</style>

      {/* ══════════════════ CONTACT HERO ══════════════════ */}
      <section className="ct-hero">

        {/* S-curve */}
        <svg aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', opacity: 0.08 }} viewBox="0 0 800 600" preserveAspectRatio="none">
          <path d="M 0,600 C 80,520 200,480 320,380 S 500,280 420,220 S 260,180 380,120 S 620,60 800,0" fill="none" stroke="var(--text-primary)" strokeWidth="1" strokeLinecap="round" />
        </svg>

        {/* ── LEFT ── */}
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>

          {/* Heading */}
          <div>
            {/* Line 1: LET'S */}
            <motion.span
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              style={{
                fontFamily: 'var(--font-family-display)',
                fontSize: 'clamp(3.5rem, 7vw, 7rem)',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
                lineHeight: 1,
                display: 'block',
              }}
            >
              {cp.line1}
            </motion.span>

            {/* Line 2: work TOGETHER */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3em', flexWrap: 'wrap' }}>
              <motion.span
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.32, ease: EASE }}
                style={{
                  fontFamily: 'var(--font-family-serif)',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: 'clamp(2rem, 4vw, 4rem)',
                  color: 'var(--text-primary)',
                }}
              >
                {cp.line2italic}
              </motion.span>
              <motion.span
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.44, ease: EASE }}
                style={{
                  fontFamily: 'var(--font-family-display)',
                  fontSize: 'clamp(3.5rem, 7vw, 7rem)',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.03em',
                  color: 'var(--text-primary)',
                  lineHeight: 1,
                }}
              >
                {cp.line2bold}
              </motion.span>
            </div>
          </div>

          {/* Social links */}
          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {SOCIALS.map(({ label, href }, i) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.55 + i * 0.08, ease: EASE }}
                style={{
                  fontFamily: 'var(--font-family-serif)',
                  fontStyle: 'italic',
                  fontSize: '1.4rem',
                  fontWeight: 300,
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                  display: 'inline-block',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.5' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
              >
                {label}
              </motion.a>
            ))}
          </div>
        </div>

        {/* ── RIGHT — contact info ── */}
        <motion.div
          className="ct-right"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <a
            href={`mailto:${cp.email}`}
            style={{
              fontFamily: 'var(--font-family-serif)',
              fontStyle: 'italic',
              fontSize: '1.4rem',
              fontWeight: 300,
              color: 'var(--text-primary)',
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.6' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
          >
            {cp.email}
          </a>

          <div style={{
            fontFamily: 'var(--font-family-serif)',
            fontStyle: 'italic',
            fontSize: '1.4rem',
            fontWeight: 300,
            color: 'var(--text-primary)',
            textAlign: 'right',
            marginTop: '0.3rem',
          }}>
            {cp.address}
          </div>

          <div style={{
            fontFamily: 'var(--font-family-serif)',
            fontStyle: 'italic',
            fontSize: '1.4rem',
            color: 'var(--text-primary)',
            marginTop: '0.3rem',
          }}>
            {cp.phone}
          </div>
        </motion.div>

      </section>

      {/* ══════════════════ INFO STRIP ══════════════════ */}
      <div className="ct-strip">

        {/* Cell 1 — Working Hours */}
        <div className="ct-strip-cell">
          <div className="ct-strip-label">{panel.hours_label}</div>
          <div className="ct-strip-body">
            {panel.hours}<br />
            {cd.sundayClosed}
          </div>
        </div>

        {/* Cell 2 — Location */}
        <div className="ct-strip-cell">
          <div className="ct-strip-label">{panel.location_label}</div>
          <div className="ct-strip-body">
            {panel.location}<br />
            <span style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              {panel.delivery}
            </span>
          </div>
        </div>

        {/* Cell 3 — Contact */}
        <div className="ct-strip-cell">
          <div className="ct-strip-label">{cd.contactLabel}</div>
          <div className="ct-strip-body">
            <a
              href={`mailto:${cp.email}`}
              style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
            >
              {cp.email}
            </a><br />
            {cp.phone}
          </div>
        </div>

      </div>

      {/* ══════════════════ MAP SECTION ══════════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        {/* Location label */}
        <div className="ct-map-label">
          <span style={{
            fontSize: '0.75rem', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--text-primary)',
          }}>
            {cp.locationLabel}
          </span>
          <span style={{
            fontFamily: 'var(--font-family-serif)',
            fontStyle: 'italic',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
          }}>
            {cp.locationCity}
          </span>
        </div>

        {/* Map embed */}
        <iframe
          className="ct-map-iframe"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47919.70961847258!2d41.53432!3d41.6169!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40676dc6a8b12b07%3A0x9b92c9c6e8ec9a45!2sBatumi%2C%20Georgia!5e0!3m2!1sen!2sus!4v1716000000000!5m2!1sen!2sus"
          height="480"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Anna's Story — Batumi, Georgia"
        />
      </motion.section>
    </main>
  )
}
