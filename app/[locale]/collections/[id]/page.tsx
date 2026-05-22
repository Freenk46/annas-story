'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../../../lib/useLanguage'
import { getBundleById, getRelatedBundles, type Bundle } from '../../../../lib/data/bundles'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

// ── Related bundle card ────────────────────────────────────────────────────────
function RelatedCard({ bundle, locale, saveLabel }: { bundle: Bundle; locale: string; saveLabel: string }) {
  const name    = locale === 'ka' ? bundle.nameKa    : locale === 'ru' ? bundle.nameRu    : bundle.name
  const tagline = locale === 'ka' ? bundle.taglineKa : locale === 'ru' ? bundle.taglineRu : bundle.tagline
  const savings = bundle.originalPrice - bundle.discountPrice

  return (
    <Link href={`/${locale}/collections/${bundle.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div style={{ position: 'relative', aspectRatio: '4/5', background: bundle.color, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-family-display)', fontSize: 'clamp(2rem, 4vw, 4rem)', color: 'rgba(0,0,0,0.06)', fontWeight: 900, userSelect: 'none' }}>
            {bundle.name.split(' ')[0].toUpperCase()}
          </span>
        </div>
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'var(--text-primary)', color: 'var(--bg)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.25rem 0.6rem' }}>
          -{bundle.discount}%
        </div>
        {bundle.badge && (
          <div style={{ position: 'absolute', top: '1rem', right: '1rem', border: '0.5px solid var(--text-primary)', color: 'var(--text-primary)', background: 'var(--bg)', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1em', padding: '0.2rem 0.5rem' }}>
            {bundle.badge}
          </div>
        )}
      </div>
      <div style={{ paddingTop: '0.9rem' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0 }}>{name}</p>
        <p style={{ fontFamily: 'var(--font-family-serif)', fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem', marginBottom: 0 }}>{tagline}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₾{bundle.originalPrice}</span>
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>₾{bundle.discountPrice}</span>
          <span style={{ fontSize: '0.65rem', color: '#4a7c59', fontFamily: 'var(--font-family-serif)', fontStyle: 'italic' }}>{saveLabel} ₾{savings}</span>
        </div>
      </div>
    </Link>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CollectionPage() {
  const params = useParams()
  const { locale, t } = useLanguage()
  const cp = t.collectionsPage

  const id     = Array.isArray(params.id) ? params.id[0] : params.id
  const bundle = getBundleById(id ?? '')

  const related = useMemo(
    () => bundle ? getRelatedBundles(bundle, 3) : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bundle?.id]
  )

  if (!bundle) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-family-serif)', fontStyle: 'italic' }}>Collection not found.</p>
      </main>
    )
  }

  const name    = locale === 'ka' ? bundle.nameKa    : locale === 'ru' ? bundle.nameRu    : bundle.name
  const tagline = locale === 'ka' ? bundle.taglineKa : locale === 'ru' ? bundle.taglineRu : bundle.tagline
  const savings = bundle.originalPrice - bundle.discountPrice

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <style>{`
        .col-hero {
          display: grid;
          grid-template-columns: 55% 45%;
          min-height: 70vh;
          border-bottom: 0.5px solid var(--border);
          position: relative;
          overflow: hidden;
        }
        .col-hero-right {
          padding: 3rem 3rem 3rem 2.5rem;
          display: flex; flex-direction: column; justify-content: center;
          border-left: 0.5px solid var(--border);
          position: relative;
        }
        .col-products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          padding: 0 2rem 4rem;
        }
        .col-related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          padding: 0 2rem 4rem;
        }
        @media (max-width: 900px) {
          .col-hero { grid-template-columns: 1fr; }
          .col-hero-left { height: 320px !important; }
          .col-hero-right { border-left: none; border-top: 0.5px solid var(--border); padding: 2rem 1.5rem; }
          .col-products-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; padding: 0 1rem 3rem; }
          .col-related-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; padding: 0 1rem 3rem; }
        }
      `}</style>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <div className="col-hero">

        {/* LEFT — image */}
        <motion.div
          className="col-hero-left"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ background: bundle.color, overflow: 'hidden', position: 'relative' }}
        >
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-family-display)', fontSize: 'clamp(5rem, 12vw, 10rem)', fontWeight: 900, color: 'rgba(0,0,0,0.06)', letterSpacing: '-0.02em', userSelect: 'none' }}>
              {bundle.name.split(' ')[0].toUpperCase()}
            </span>
          </div>

          {/* Discount badge */}
          <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'var(--text-primary)', color: 'var(--bg)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.4rem 0.8rem' }}>
            -{bundle.discount}%
          </div>
        </motion.div>

        {/* RIGHT — details */}
        <motion.div
          className="col-hero-right"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
        >
          {/* S-curve decoration */}
          <svg aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', opacity: 0.08 }} viewBox="0 0 400 600" preserveAspectRatio="none">
            <path d="M 400,0 C 340,50 300,90 240,160 S 130,220 180,270 S 280,310 220,370 S 80,440 40,490 S 10,530 0,600" fill="none" stroke="var(--text-primary)" strokeWidth="1" strokeLinecap="round" />
          </svg>

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              <Link href={`/${locale}/`} style={{ color: 'var(--text-muted)', textDecoration: 'none', borderBottom: '0.5px solid var(--border)', paddingBottom: '1px' }}>
                {cp.collections}
              </Link>
              <span>{cp.breadcrumbSep}</span>
              <span>{name}</span>
            </div>

            {/* Name */}
            <h1 style={{ fontFamily: 'var(--font-family-display)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', color: 'var(--text-primary)', margin: '0 0 0.5rem 0', lineHeight: 1 }}>
              {name}
            </h1>

            {/* Tagline */}
            <p style={{ fontFamily: 'var(--font-family-serif)', fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--text-secondary)', margin: '0 0 2rem 0' }}>
              {tagline}
            </p>

            {/* Divider */}
            <div style={{ borderTop: '0.5px solid var(--border)', margin: '0 0 1.5rem 0' }} />

            {/* Includes label */}
            <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 0.75rem 0' }}>
              {cp.includes}
            </p>

            {/* Products list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {bundle.products.map((p) => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>✓</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{p}</span>
                </div>
              ))}
            </div>

            {/* Price block */}
            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₾{bundle.originalPrice}</span>
              <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>₾{bundle.discountPrice}</span>
              <span style={{ fontFamily: 'var(--font-family-serif)', fontStyle: 'italic', fontSize: '0.9rem', color: '#4a7c59' }}>
                {cp.save} ₾{savings}
              </span>
            </div>

            {/* CTA */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-contact-drawer'))}
              style={{ marginTop: '1.5rem', width: '100%', height: '52px', background: 'var(--text-primary)', color: 'var(--bg)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
            >
              {cp.contactUs}
            </button>
          </div>
        </motion.div>
      </div>

      {/* ═══════════════════ WHAT'S INCLUDED ═══════════════════ */}
      <div style={{ borderTop: '0.5px solid var(--border)', padding: '3rem 2rem 1.5rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0 }}>
          {cp.whatsIncluded}
        </p>
      </div>

      <div className="col-products-grid">
        {bundle.products.map((product, i) => (
          <motion.div
            key={product}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: i * 0.07, ease: EASE }}
            style={{ background: 'var(--bg-secondary)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {/* Image placeholder */}
            <div style={{ width: '100%', aspectRatio: '1/1', background: bundle.color, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <span style={{ fontFamily: 'var(--font-family-display)', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: 'rgba(0,0,0,0.08)', fontWeight: 900, userSelect: 'none', textAlign: 'center', padding: '0.5rem' }}>
                {product.split(' ')[0].toUpperCase()}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-primary)', margin: 0 }}>
              {product}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>✓ Included in this set</p>
          </motion.div>
        ))}
      </div>

      {/* ═══════════════════ RELATED BUNDLES ═══════════════════ */}
      {related.length > 0 && (
        <>
          <div style={{ borderTop: '0.5px solid var(--border)', padding: '4rem 2rem 2rem', textAlign: 'center' }}>
            <span style={{ fontFamily: 'var(--font-family-display)', display: 'block', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1 }}>
              {cp.moreSets}
            </span>
            <span style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.3em', marginTop: '0.1em' }}>
              <span style={{ fontFamily: 'var(--font-family-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', color: 'var(--text-primary)' }}>
                {t.bundles.our}
              </span>
              <span style={{ fontFamily: 'var(--font-family-display)', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1 }}>
                {cp.ourSets}
              </span>
            </span>
          </div>

          <div className="col-related-grid">
            {related.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              >
                <RelatedCard bundle={b} locale={locale} saveLabel={cp.save} />
              </motion.div>
            ))}
          </div>
        </>
      )}
    </main>
  )
}
