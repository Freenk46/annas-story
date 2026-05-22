'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '../../lib/useLanguage'
import { gsap } from '../../lib/gsap'
import { bundles, type Bundle } from '../../lib/data/bundles'

function BundleCard({ bundle, locale, saveLabel }: { bundle: Bundle; locale: string; saveLabel: string }) {
  const [hovered, setHovered] = useState(false)

  const name =
    locale === 'ka' ? bundle.nameKa : locale === 'ru' ? bundle.nameRu : bundle.name
  const tagline =
    locale === 'ka' ? bundle.taglineKa : locale === 'ru' ? bundle.taglineRu : bundle.tagline
  const savings = bundle.originalPrice - bundle.discountPrice

  return (
    <Link
      href={`/${locale}/collections/${bundle.id}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '4/5', background: bundle.color, overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute', inset: 0,
            background: bundle.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
            willChange: 'transform',
          }}
        >
          <span style={{ fontFamily: 'var(--font-family-display)', fontSize: 'clamp(3rem, 6vw, 5rem)', color: 'rgba(0,0,0,0.06)', letterSpacing: '-0.02em', fontWeight: 900, userSelect: 'none' }}>
            {bundle.name.split(' ')[0].toUpperCase()}
          </span>
        </div>

        {/* Discount badge */}
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'var(--text-primary)', color: 'var(--bg)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.25rem 0.6rem' }}>
          -{bundle.discount}%
        </div>

        {bundle.badge && (
          <div style={{ position: 'absolute', top: '1rem', right: '1rem', border: '0.5px solid var(--text-primary)', color: 'var(--text-primary)', background: 'var(--bg)', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1em', padding: '0.2rem 0.5rem' }}>
            {bundle.badge}
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: '1rem 0 0.5rem' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0 }}>
          {name}
        </p>
        <p style={{ fontFamily: 'var(--font-family-serif)', fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem', marginBottom: 0 }}>
          {tagline}
        </p>

        {/* Products list — reveal on hover */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', marginTop: hovered ? '0.5rem' : 0, maxHeight: hovered ? '200px' : 0, overflow: 'hidden', transition: 'max-height 0.3s ease, margin-top 0.3s ease' }}>
          {bundle.products.map((p) => (
            <span key={p} style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>· {p}</span>
          ))}
        </div>

        {/* Price row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₾{bundle.originalPrice}</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>₾{bundle.discountPrice}</span>
          <span style={{ fontSize: '0.65rem', color: '#4a7c59', fontFamily: 'var(--font-family-serif)', fontStyle: 'italic' }}>{saveLabel} ₾{savings}</span>
        </div>
      </div>
    </Link>
  )
}

export default function BundlesSection() {
  const { locale, t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.from(Array.from(headingRef.current.children), {
          opacity: 0, y: 30, duration: 0.8, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 75%' },
        })
      }
      if (gridRef.current) {
        gsap.from(Array.from(gridRef.current.children), {
          opacity: 0, y: 40, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 75%' },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const b = t.bundles

  return (
    <section ref={sectionRef} style={{ background: 'var(--bg)', borderTop: '0.5px solid var(--border)' }}>
      {/* Header */}
      <div style={{ padding: '4rem 2rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div ref={headingRef} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <span style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 900, fontFamily: 'var(--font-family-display)', textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1, color: 'var(--text-primary)' }}>
            {b.heading1}
          </span>
          <span style={{ display: 'flex', alignItems: 'baseline', gap: '0.3em' }}>
            <span style={{ fontFamily: 'var(--font-family-serif)', fontStyle: 'italic', fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: 'var(--text-primary)' }}>
              {b.our}
            </span>
            <span style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 900, fontFamily: 'var(--font-family-display)', textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1, color: 'var(--text-primary)' }}>
              {b.heading2}
            </span>
          </span>
        </div>
        <span style={{ fontFamily: 'var(--font-family-serif)', fontStyle: 'italic', fontSize: '1rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
          {b.subtitle}
        </span>
      </div>

      {/* Grid */}
      <div ref={gridRef} className="bundles-grid" style={{ padding: '0 2rem 4rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {bundles.map((bundle) => (
          <BundleCard key={bundle.id} bundle={bundle} locale={locale} saveLabel={b.save} />
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .bundles-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1rem !important;
            padding: 0 1rem 3rem !important;
          }
        }
      `}</style>
    </section>
  )
}
