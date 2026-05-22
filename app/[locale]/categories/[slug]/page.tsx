'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../../../lib/useLanguage'
import {
  getCategoryBySlug,
  getRelatedCategories,
  getCategoryName,
  getCategoryDescription,
  getProductName,
  type Category,
  type Product,
} from '../../../../lib/categories-data'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

// ── Product card ──────────────────────────────────────────────────────────────
function ProductCard({ product, href, name }: { product: Product; href: string; name: string }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{ overflow: 'hidden', aspectRatio: '3/4', background: 'var(--bg-secondary)' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {product.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.coverImage}
            alt={name}
            style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: hovered ? 'scale(1.03)' : 'scale(1)',
            }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: hovered ? 'scale(1.03)' : 'scale(1)',
          }}>
            <span style={{
              fontFamily: 'var(--font-family-display)',
              fontSize: 'clamp(1.2rem, 2.5vw, 2rem)', fontWeight: 900,
              letterSpacing: '-0.02em', color: 'var(--text-muted)', opacity: 0.18,
              textAlign: 'center', padding: '1rem',
            }}>{name}</span>
          </div>
        )}
      </div>

      <div style={{ paddingTop: '0.75rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
          {name}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          {product.price}
        </div>
        <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.5rem' }}>
          {product.colors.map((hex, i) => (
            <div key={i} style={{ width: '10px', height: '10px', background: hex, border: '0.5px solid var(--border)' }} />
          ))}
        </div>
      </div>
    </Link>
  )
}

// ── Related category card (Section 2) ──────────────────────────────────────
function RelatedCard({ col, locale }: { col: Category; locale: string }) {
  const thumb   = col.coverImage || col.products[0]?.coverImage || ''
  const catName = getCategoryName(col, locale)
  const prodName = col.products[0] ? getProductName(col.products[0], locale) : ''
  return (
    <Link href={`/${locale}/categories/${col.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{ overflow: 'hidden', aspectRatio: '4/5', background: 'var(--bg-secondary)' }}>
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb} alt={catName}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.3s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.85' }}
            onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.opacity = '1' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: 'var(--font-family-display)',
              fontSize: 'clamp(1rem, 2vw, 1.8rem)', fontWeight: 900,
              letterSpacing: '-0.02em', color: 'var(--text-muted)', opacity: 0.15,
              textAlign: 'center', padding: '0.75rem',
            }}>{catName}</span>
          </div>
        )}
      </div>
      <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-primary)', marginTop: '0.75rem' }}>
        {catName}
      </div>
      <div style={{ fontFamily: 'var(--font-family-serif)', fontStyle: 'italic', fontSize: '0.85rem', fontWeight: 300, color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
        {prodName}
      </div>
    </Link>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CategoryPage() {
  const params     = useParams()
  const { locale, t } = useLanguage()
  const cd = t.categoryDetail
  const typeLabel = (t.categories as unknown as Record<string, string>).typeLabel ?? 'Bedding'

  const slug       = Array.isArray(params.slug) ? params.slug[0] : params.slug
  const category = getCategoryBySlug(slug ?? '')
  const catName  = category ? getCategoryName(category, locale) : ''

  const related = useMemo(
    () => category ? getRelatedCategories(category, 4) : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category?.slug]
  )

  if (!category) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-family-serif)', fontStyle: 'italic' }}>Category not found.</p>
      </main>
    )
  }

  const count = category.products.length

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <style>{`
        /* ── Section 1 ── */
        .cl-s1 {
          display: grid;
          grid-template-columns: 65% 35%;
          align-items: start;
          border-bottom: 0.5px solid var(--border);
          position: relative;
        }
        .cl-left {
          padding: 5rem 2rem 4rem 2rem;
          min-height: 100vh;
        }
        .cl-right {
          border-left: 0.5px solid var(--border);
          padding: 5rem 2.5rem;
          display: flex; flex-direction: column; justify-content: center;
          position: sticky;
          top: 68px;
          height: calc(100vh - 68px);
          overflow: hidden;
          align-self: start;
        }
        .cl-products {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          align-content: start;
        }
        /* ── Section 2 ── */
        .cl-s2 {
          display: grid;
          grid-template-columns: 1fr 1fr auto 1fr 1fr;
          align-items: center;
          padding: 5rem 2rem;
          gap: 2rem;
          border-top: 0.5px solid var(--border);
        }
        .cl-s2-heading {
          padding: 0 3rem;
          text-align: center;
          white-space: nowrap;
        }
        /* ── Mobile ── */
        @media (max-width: 900px) {
          .cl-s1 { grid-template-columns: 1fr; }
          .cl-right {
            position: static;
            height: auto;
            border-left: none;
            border-bottom: 0.5px solid var(--border);
            padding: 2.5rem 1.5rem;
          }
          .cl-left { padding: 2.5rem 1rem; min-height: unset; }
          .cl-products { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
          .cl-s2 {
            grid-template-columns: 1fr 1fr;
            padding: 3rem 1rem;
          }
          .cl-s2-heading {
            grid-column: 1 / -1;
            order: -1;
            padding: 0;
            white-space: normal;
          }
        }
      `}</style>

      {/* ══════════════════════════ SECTION 1 ══════════════════════════ */}
      <div className="cl-s1">

        {/* ── LEFT — products grid ── */}
        <motion.div
          className="cl-left"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            <Link href={`/${locale}/`} style={{ color: 'var(--text-muted)', textDecoration: 'none', borderBottom: '0.5px solid var(--border)', paddingBottom: '1px' }}>
              {t.nav.works}
            </Link>
            <span>/</span>
            <span>{catName}</span>
          </div>

          {/* Products */}
          <div className="cl-products">
            {category.products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.15 + i * 0.08, ease: EASE }}
              >
                <ProductCard
                  product={product}
                  href={`/${locale}/categories/${category.slug}/${product.id}`}
                  name={getProductName(product, locale)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── RIGHT — sticky info ── */}
        <motion.div
          className="cl-right"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
        >
          {/* S-curve */}
          <svg aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', opacity: 0.08 }} viewBox="0 0 400 600" preserveAspectRatio="none">
            <path d="M 400,0 C 340,50 300,90 240,160 S 130,220 180,270 S 280,310 220,370 S 80,440 40,490 S 10,530 0,600" fill="none" stroke="var(--text-primary)" strokeWidth="1" strokeLinecap="round" />
          </svg>

          {/* Right edge accent */}
          <div style={{ position: 'absolute', right: 0, top: 0, width: '3px', height: '100%', background: 'var(--text-primary)', opacity: 0.06 }} />

          <div style={{ position: 'relative', zIndex: 1 }}>

            {/* Brand label */}
            <div style={{ fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              {typeLabel}
            </div>

            {/* Name */}
            <h1 style={{
              fontFamily: 'var(--font-family-display)',
              fontSize: 'clamp(2.8rem, 4vw, 4rem)', fontWeight: 900,
              letterSpacing: '-0.03em', textTransform: 'uppercase',
              color: 'var(--text-primary)', lineHeight: 1, margin: '0 0 2rem 0',
            }}>
              {catName}
            </h1>

            {/* Divider */}
            <div style={{ borderTop: '0.5px solid var(--border)', marginBottom: '2rem' }} />

            {/* Meta rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {([
                [cd.collectionLabel, typeLabel],
                [cd.yearLabel, category.year],
                [cd.works ?? 'WORKS', String(count)],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            {category.description && (
              <p style={{ fontSize: '0.85rem', lineHeight: 1.75, color: 'var(--text-secondary)', marginTop: '2rem', maxWidth: '320px' }}>
                {getCategoryDescription(category, locale)}
              </p>
            )}
          </div>

          {/* Product count badge — bottom */}
          <div style={{
            position: 'absolute', bottom: '3rem', left: '2.5rem',
            fontSize: '0.65rem', letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--text-muted)',
          }}>
            {count} {count === 1 ? (cd.work ?? 'WORK') : (cd.works ?? 'WORKS')}
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════ SECTION 2 — WANT TO SEE MORE ══════════════════════════ */}
      <div className="cl-s2">

        {/* Left pair */}
        {related.slice(0, 2).map((col, i) => (
          <motion.div
            key={col.slug}
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
          >
            <RelatedCard col={col} locale={locale} />
          </motion.div>
        ))}

        {/* Center heading */}
        <motion.div
          className="cl-s2-heading"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span style={{
            fontFamily: 'var(--font-family-display)',
            display: 'block',
            fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 900,
            textTransform: 'uppercase', letterSpacing: '-0.03em',
            color: 'var(--text-primary)', lineHeight: 1,
          }}>
            {cd.wantLine1}
          </span>
          <span style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.2em', marginTop: '0.1em' }}>
            <span style={{
              fontFamily: 'var(--font-family-serif)',
              fontStyle: 'italic', fontWeight: 300,
              fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)',
              color: 'var(--text-primary)',
            }}>
              {cd.wantTo}
            </span>
            <span style={{
              fontFamily: 'var(--font-family-display)',
              fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 900,
              textTransform: 'uppercase', letterSpacing: '-0.03em',
              color: 'var(--text-primary)', lineHeight: 1,
            }}>
              {cd.wantLine2}
            </span>
          </span>
        </motion.div>

        {/* Right pair */}
        {related.slice(2, 4).map((col, i) => (
          <motion.div
            key={col.slug}
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
          >
            <RelatedCard col={col} locale={locale} />
          </motion.div>
        ))}
      </div>
    </main>
  )
}