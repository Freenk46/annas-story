'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../../../../lib/useLanguage'
import {
  getCategoryBySlug,
  getProductById,
  getRelatedCategories,
  getCategoryName,
  getProductName,
  getProductDescription,
  type Category,
} from '../../../../../lib/categories-data'

// ── Accordion ─────────────────────────────────────────────────────────────────
function Accordion({
  label, open, onToggle, children,
}: {
  label: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div style={{ borderTop: '0.5px solid var(--border)' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '0.9rem 0',
          background: 'none', border: 'none', cursor: 'pointer',
        }}
      >
        <span style={{
          fontSize: '0.78rem', letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--text-primary)', fontWeight: 600,
        }}>{label}</span>
        <span style={{
          fontSize: '1rem', color: 'var(--text-muted)',
          transition: 'transform 0.3s', display: 'inline-block',
          transform: open ? 'rotate(45deg)' : 'none',
        }}>+</span>
      </button>
      <div style={{
        overflow: 'hidden',
        maxHeight: open ? '400px' : '0',
        opacity: open ? 1 : 0,
        paddingBottom: open ? '1.25rem' : '0',
        transition: 'max-height 0.35s ease, opacity 0.3s ease, padding-bottom 0.35s ease',
      }}>
        {children}
      </div>
    </div>
  )
}

// ── Related card ──────────────────────────────────────────────────────────────
function RelatedCard({ col, locale }: { col: Category; locale: string }) {
  const thumb    = col.products[0]?.coverImage || ''
  const catName  = getCategoryName(col, locale)
  const firstProd = col.products[0]
  const prodName = firstProd ? getProductName(firstProd, locale) : ''
  return (
    <Link href={`/${locale}/categories/${col.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        width: '100%', aspectRatio: '3/4', marginBottom: '0.85rem',
        overflow: 'hidden', background: 'var(--bg-secondary)',
      }}>
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb} alt={catName}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              display: 'block', transition: 'transform 0.5s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.08em', textAlign: 'center', padding: '8px' }}>{catName}</span>
          </div>
        )}
      </div>

      {/* Colour swatches */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '0.5rem' }}>
        {col.products[0]?.colors.map((hex, i) => (
          <div key={i} style={{ width: '12px', height: '12px', background: hex, border: '0.5px solid rgba(0,0,0,0.12)' }} />
        ))}
      </div>

      <div style={{ fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '0.15rem' }}>{catName}</div>
      <div style={{ fontFamily: 'var(--font-family-serif)', fontStyle: 'italic', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{prodName}</div>
    </Link>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const params   = useParams()
  const router   = useRouter()
  const { locale, t } = useLanguage()
  const cd = t.categoryDetail
  const typeLabel = (t.categories as unknown as Record<string, string>).typeLabel ?? 'Bedding'

  const slug      = Array.isArray(params.slug)    ? params.slug[0]    : params.slug
  const productId = Array.isArray(params.product) ? params.product[0] : params.product

  const category = getCategoryBySlug(slug ?? '')
  const product    = category ? getProductById(category, productId ?? '') : undefined

  const related = useMemo(
    () => category ? getRelatedCategories(category, 4) : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category?.slug]
  )

  const [activeImg,     setActiveImg]     = useState(0)
  const [activeColor,   setActiveColor]   = useState(0)
  const [activeFormat,  setActiveFormat]  = useState(0)
  const [qty,           setQty]           = useState(1)
  const [openAccordion, setOpenAccordion] = useState<string | null>('description')

  if (!category || !product) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-family-serif)', fontStyle: 'italic' }}>
          {cd.productNotFound ?? 'Product not found.'}
        </p>
      </main>
    )
  }

  const catName     = getCategoryName(category, locale)
  const productName = getProductName(product, locale)

  const displayImages = product.images.length > 0
    ? product.images
    : ['__placeholder_0', '__placeholder_1', '__placeholder_2']

  const isPlaceholder = (src: string) => src.startsWith('__placeholder_')
  const currentImg = displayImages[Math.min(activeImg, displayImages.length - 1)]

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <style>{`
        .pd-wrap { display: grid; grid-template-columns: 55% 45%; }
        .pd-left {
          display: grid; grid-template-columns: 64px 1fr;
          position: sticky; top: 68px;
          height: calc(100vh - 68px); align-self: start; overflow: hidden;
        }
        .pd-thumbs {
          display: flex; flex-direction: column; gap: 8px;
          padding: 1.25rem 0 1.25rem 1.25rem;
          overflow-y: auto; scrollbar-width: none;
        }
        .pd-thumbs::-webkit-scrollbar { display: none; }
        .pd-main-img { height: calc(100vh - 68px); overflow: hidden; }
        .pd-right {
          padding: 3rem 3rem 5rem 3rem;
          border-left: 0.5px solid var(--border); overflow-y: auto;
        }
        .pd-back { position: fixed; top: 80px; left: 1.5rem; z-index: 20; }
        .pd-related-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        @media (max-width: 900px) {
          .pd-wrap { grid-template-columns: 1fr; }
          .pd-left { position: static; height: auto; grid-template-columns: 1fr; }
          .pd-thumbs { flex-direction: row; overflow-x: auto; overflow-y: hidden; padding: 0.75rem 1rem; }
          .pd-main-img { height: 70vw; min-height: 280px; }
          .pd-right { padding: 2rem 1.5rem 4rem; border-left: none; border-top: 0.5px solid var(--border); }
          .pd-back { position: static; display: inline-flex; margin: 1rem 1.5rem; }
          .pd-related-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      {/* ← Back */}
      <button
        onClick={() => router.back()}
        className="pd-back"
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          fontFamily: 'var(--font-family-serif)', fontStyle: 'italic',
          fontSize: '0.85rem', color: 'var(--text-secondary)',
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          borderBottom: '0.5px solid var(--border)', paddingBottom: '1px',
        }}
      >
        ← {cd.back}
      </button>

      {/* ── 2-col grid ── */}
      <div className="pd-wrap">

        {/* LEFT */}
        <motion.div
          className="pd-left"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="pd-thumbs">
            {displayImages.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                style={{
                  width: '48px', height: '60px', flexShrink: 0,
                  padding: 0, overflow: 'hidden',
                  background: 'var(--bg-secondary)', cursor: 'pointer',
                  border: activeImg === i ? '1.5px solid var(--text-primary)' : '1px solid var(--border)',
                  transition: 'border-color 0.2s',
                }}
              >
                {isPlaceholder(src) ? (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{i + 1}</span>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                )}
              </button>
            ))}
          </div>

          <div className="pd-main-img">
            {isPlaceholder(currentImg) ? (
              <div style={{
                width: '100%', height: '100%', background: 'var(--bg-secondary)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem',
              }}>
                <span style={{
                  fontFamily: 'var(--font-family-display)',
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900,
                  letterSpacing: '-0.02em', color: 'var(--text-muted)',
                  textAlign: 'center', padding: '0 2rem',
                }}>{catName}</span>
                <span style={{ fontFamily: 'var(--font-family-serif)', fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  {productName}
                </span>
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentImg} alt={productName} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            )}
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          className="pd-right"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* S-curve decoration */}
          <svg aria-hidden="true" style={{ position: 'absolute', right: 0, top: 0, width: '45%', height: '100%', zIndex: 0, pointerEvents: 'none', opacity: 0.05 }} viewBox="0 0 400 800" preserveAspectRatio="none">
            <path d="M 400,0 C 320,80 280,140 200,220 S 80,320 160,400 S 340,460 260,560 S 60,660 80,760 S 120,800 0,800" fill="none" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>

          <div style={{ position: 'relative', zIndex: 1 }}>

            {/* Breadcrumb */}
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Link href={`/${locale}/categories/${category.slug}`} style={{ color: 'var(--text-muted)', textDecoration: 'none', borderBottom: '0.5px solid var(--border)' }}>
                {catName}
              </Link>
              <span>/</span>
              <span style={{ color: 'var(--text-secondary)' }}>{productName}</span>
            </div>

            {/* Collection + year */}
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              {typeLabel} · {category.year}
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: 'var(--font-family-display)',
              fontSize: 'clamp(2.2rem, 4.5vw, 4rem)', fontWeight: 900,
              letterSpacing: '-0.03em', color: 'var(--text-primary)',
              lineHeight: 1, margin: '0 0 0.2rem 0',
            }}>{catName}</h1>

            <div style={{ fontFamily: 'var(--font-family-serif)', fontStyle: 'italic', fontSize: '1.1rem', fontWeight: 300, color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
              {productName}
            </div>

            {/* Price */}
            <div style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.02em', color: 'var(--text-primary)', marginBottom: '1.75rem' }}>
              {product.price}
            </div>

            <div style={{ height: '0.5px', background: 'var(--border)', marginBottom: '2rem' }} />

            {/* Colour swatches */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                {cd.colorsLabel} — <span style={{ color: 'var(--text-secondary)' }}>{product.colorNames[activeColor]}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {product.colors.map((hex, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveColor(i)}
                    title={product.colorNames[i]}
                    style={{
                      width: '28px', height: '28px', borderRadius: '50%', background: hex,
                      border: activeColor === i ? '2.5px solid var(--text-primary)' : '2px solid transparent',
                      outline: activeColor === i ? '2px solid var(--bg)' : 'none',
                      outlineOffset: '-4px', cursor: 'pointer',
                      transition: 'border-color 0.2s, transform 0.15s',
                      transform: activeColor === i ? 'scale(1.15)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Format selector */}
            <div style={{ marginBottom: '2.25rem' }}>
              <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>{cd.formatsLabel}</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.formats.map((fmt, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveFormat(i)}
                    style={{
                      padding: '7px 18px',
                      border: activeFormat === i ? '1px solid var(--text-primary)' : '1px solid var(--border)',
                      background: activeFormat === i ? 'var(--text-primary)' : 'transparent',
                      color: activeFormat === i ? 'var(--bg)' : 'var(--text-secondary)',
                      fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >{fmt}</button>
                ))}
              </div>
            </div>

            {/* Qty + CTA */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'stretch', marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '0.5px solid var(--border)', height: '50px', flexShrink: 0 }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: '42px', height: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--text-primary)' }}>−</button>
                <span style={{ width: '34px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', userSelect: 'none' }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: '42px', height: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--text-primary)' }}>+</button>
              </div>
              <button
                style={{ flex: 1, height: '50px', background: 'var(--text-primary)', color: 'var(--bg)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-family-display)', fontSize: '1rem', fontWeight: 900, letterSpacing: '0.06em', transition: 'opacity 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.8' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
              >{cd.cta}</button>
            </div>

            {/* Client row */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{cd.client}</span>
              <span style={{ fontFamily: 'var(--font-family-serif)', fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)' }}>{catName}</span>
            </div>

            {/* Credits */}
            {product.credits && (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', letterSpacing: '0.02em', lineHeight: 1.7, marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '0.5px solid var(--border)' }}>
                {product.credits}
              </div>
            )}

            <Accordion
              label={cd.descriptionLabel}
              open={openAccordion === 'description'}
              onToggle={() => setOpenAccordion(o => o === 'description' ? null : 'description')}
            >
              <p style={{ fontSize: '0.85rem', lineHeight: 1.8, color: 'var(--text-secondary)', margin: 0 }}>{getProductDescription(product, locale)}</p>
            </Accordion>

            <Accordion
              label={cd.technicalLabel}
              open={openAccordion === 'technical'}
              onToggle={() => setOpenAccordion(o => o === 'technical' ? null : 'technical')}
            >
              <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
                {([
                  [cd.yearLabel, category.year],
                  [cd.collectionLabel, typeLabel],
                  [cd.formatsLabel, product.formats.join(', ')],
                ] as [string, string][]).map(([label, val], i, arr) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: '0.45rem', borderBottom: i < arr.length - 1 ? '0.5px solid var(--border)' : 'none', marginBottom: i < arr.length - 1 ? '0.45rem' : 0 }}>
                    <span style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>{label}</span>
                    <span style={{ fontWeight: 500 }}>{val}</span>
                  </div>
                ))}
              </div>
            </Accordion>

            <div style={{ borderTop: '0.5px solid var(--border)', marginTop: 0 }} />
          </div>
        </motion.div>
      </div>

      {/* ── RELATED WORKS ── */}
      <section style={{ borderTop: '0.5px solid var(--border)', padding: '4rem 2rem 5rem', background: 'var(--bg)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-family-display)', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.02em', margin: 0, color: 'var(--text-primary)' }}>
            {cd.relatedTitle}
          </h2>
        </div>
        <div className="pd-related-grid">
          {related.map((col, i) => (
            <motion.div key={col.slug} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}>
              <RelatedCard col={col} locale={locale} />
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  )
}