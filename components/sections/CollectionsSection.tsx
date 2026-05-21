'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '../../lib/useLanguage'
import { gsap } from '../../lib/gsap'
import { collections as COLLECTIONS } from '../../lib/collections-data'

const TOTAL = COLLECTIONS.length

// ── Math utils ────────────────────────────────────────────────────────────────
const clamp  = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
const lerpFn = (a: number, b: number, t: number)   => a + (b - a) * clamp(t, 0, 1)

// ── Component ─────────────────────────────────────────────────────────────────
export default function CollectionsSection() {
  const { locale } = useLanguage()
  const [entered, setEntered]         = useState(false)
  const enteredRef                     = useRef(false)

  // Mobile sticky number indicator
  const [activeIndex, setActiveIndex] = useState(0)
  const [displayIndex, setDisplayIndex] = useState(0)
  const [numVisible, setNumVisible]   = useState(true)
  const isFirstRender                 = useRef(true)

  // Layout refs
  const sectionRef   = useRef<HTMLElement>(null)
  const stickyRef    = useRef<HTMLDivElement>(null)
  const leftRef      = useRef<HTMLDivElement>(null)
  const centerRef    = useRef<HTMLDivElement>(null)
  const rightRef     = useRef<HTMLDivElement>(null)
  const cardStackRef = useRef<HTMLDivElement>(null)

  // Per-item refs — direct DOM manipulation, zero re-renders in hot path
  const numRefs     = useRef<(HTMLDivElement | null)[]>(Array(TOTAL).fill(null))
  const cardRefs    = useRef<(HTMLDivElement | null)[]>(Array(TOTAL).fill(null))
  const navRefs     = useRef<(HTMLDivElement | null)[]>(Array(TOTAL).fill(null))

  // Side labels
  const campaignRef = useRef<HTMLDivElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)
  const prevActive  = useRef(-1)

  // Mobile detection — skip RAF DOM work on mobile (CSS handles mobile layout)
  const isMobileRef = useRef(
    typeof window !== 'undefined' && window.innerWidth <= 768
  )
  useEffect(() => {
    const check = () => { isMobileRef.current = window.innerWidth <= 768 }
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  // ── Mobile: fade transition when active collection changes ───────────────
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return }
    setNumVisible(false)
    const t = setTimeout(() => { setDisplayIndex(activeIndex); setNumVisible(true) }, 300)
    return () => clearTimeout(t)
  }, [activeIndex])

  // ── Mobile: IntersectionObserver per collection block ────────────────────
  useEffect(() => {
    const observers = COLLECTIONS.map((col, i) => {
      const el = document.getElementById(`collection-${col.id}`)
      if (!el) return null
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIndex(i) },
        { threshold: 0.3, rootMargin: '-44px 0px 0px 0px' }
      )
      observer.observe(el)
      return observer
    })
    return () => observers.forEach(obs => obs?.disconnect())
  }, [])

  // ── Entry animation (one-time, IntersectionObserver) ─────────────────────
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      enteredRef.current = true
      setEntered(true)
      gsap.fromTo(
        [leftRef.current, centerRef.current, rightRef.current],
        { y: 80, opacity: 0 },
        { y: 0,  opacity: 1, duration: 0.9, ease: 'power2.out', stagger: 0 }
      )
      obs.disconnect()
    }, { threshold: 0.05 })

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // ── Scroll scrub engine (RAF + lerp) ─────────────────────────────────────
  useEffect(() => {
    const sectionEl = sectionRef.current
    if (!sectionEl) return

    let lerpedY = window.scrollY
    let rafId: number
    const LERP = 0.04

    const PARK_TOP     = 72
    const PARK_SPACING = 42

    const tick = () => {
      if (isMobileRef.current) { rafId = requestAnimationFrame(tick); return }

      lerpedY += (window.scrollY - lerpedY) * LERP
      if (!enteredRef.current) { rafId = requestAnimationFrame(tick); return }

      const vH         = window.innerHeight
      const sectionTop = sectionEl.offsetTop
      const raw        = (lerpedY - sectionTop) / vH
      const total      = clamp(raw, 0, TOTAL)

      // ── LEFT — numbers ────────────────────────────────────────────────────
      numRefs.current.forEach((el, i) => {
        if (!el) return
        const rel = total - i
        let y: number, op: number
        if (rel <= 0)       { y = -120; op = 0 }
        else if (rel < 0.3) { const t = rel / 0.3; y = lerpFn(-120, 0, t); op = t }
        else if (rel < 0.7) { y = 0; op = 1 }
        else if (rel < 1)   { const t = (rel - 0.7) / 0.3; y = lerpFn(0, 120, t); op = 1 - t }
        else                { y = 120; op = 0 }
        el.style.transform = `translateY(${y}px)`
        el.style.opacity   = op.toFixed(3)
      })

      // ── CENTER — card stack ───────────────────────────────────────────────
      if (cardStackRef.current) {
        const scrollAmt = clamp(raw, 0, TOTAL - 1) * vH
        cardStackRef.current.style.transform = `translateY(${-scrollAmt}px)`
      }
      cardRefs.current.forEach((el, i) => {
        if (!el) return
        const dist = Math.abs(total - i)
        el.style.filter  = `blur(${clamp(dist * 6, 0, 6).toFixed(1)}px)`
        el.style.opacity = clamp(1 - dist * 0.55, 0.4, 1).toFixed(3)
      })

      // Campaign / category labels
      const activeIdx = clamp(Math.floor(total), 0, TOTAL - 1)
      if (activeIdx !== prevActive.current) {
        prevActive.current = activeIdx
        if (campaignRef.current) campaignRef.current.textContent = COLLECTIONS[activeIdx].products[0]?.title ?? ''
        if (categoryRef.current) categoryRef.current.textContent = COLLECTIONS[activeIdx].category
      }

      // ── RIGHT — nav items ────────────────────────────────────────────────
      const rightEl = rightRef.current
      if (!rightEl) { rafId = requestAnimationFrame(tick); return }

      const rH      = rightEl.clientHeight
      const spacing = Math.min(48, (rH - 120) / (TOTAL + 1))
      const listTop = rH / 2 - ((TOTAL - 1) / 2) * spacing
      let parkedSoFar = 0

      navRefs.current.forEach((el, i) => {
        if (!el) return
        const rel    = total - i
        const listY  = listTop + i * spacing
        const isCurr = i === activeIdx

        if (rel >= 1) {
          const parkY = PARK_TOP + parkedSoFar * PARK_SPACING
          el.style.transform    = `translateY(${parkY}px)`
          el.style.opacity      = '0.30'
          el.style.fontSize     = '28px'
          el.style.fontWeight   = '400'
          el.style.borderRight  = 'none'
          el.style.paddingRight = '8px'
          el.style.zIndex       = '20'
          parkedSoFar++
        } else if (rel > 0 && rel < 1) {
          const parkY = PARK_TOP + parkedSoFar * PARK_SPACING
          const fs    = lerpFn(52, 28, rel)
          el.style.transform    = `translateY(${lerpFn(listY, parkY, rel).toFixed(1)}px)`
          el.style.opacity      = lerpFn(1, 0.3, rel).toFixed(3)
          el.style.fontSize     = `${fs.toFixed(1)}px`
          el.style.fontWeight   = rel < 0.4 ? '700' : '400'
          el.style.borderRight  = rel < 0.35 ? '3px solid var(--border-strong)' : 'none'
          el.style.paddingRight = rel < 0.35 ? '14px' : '8px'
          el.style.zIndex       = '10'
        } else {
          el.style.transform    = `translateY(${listY}px)`
          el.style.opacity      = isCurr ? '1' : '0.32'
          el.style.fontSize     = isCurr ? '52px' : '34px'
          el.style.fontWeight   = isCurr ? '700' : '400'
          el.style.borderRight  = isCurr ? '3px solid var(--border-strong)' : 'none'
          el.style.paddingRight = isCurr ? '14px' : '8px'
          el.style.zIndex       = '1'
        }
      })

      rafId = requestAnimationFrame(tick)
    }

    lerpedY = window.scrollY
    rafId   = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section
      id="collections"
      ref={sectionRef}
      className="cs-section"
      style={{ height: `calc(${TOTAL} * 100vh)`, position: 'relative' }}
    >
      <style>{`
        /* ── Mobile: hide desktop, show mobile list ── */
        .cs-mobile { display: none; }

        @media (max-width: 768px) {
          .cs-section  { height: auto !important; position: static !important; }
          .cs-sticky   { display: none !important; }
          .cs-mobile   { display: block; }

          .cs-mob-item {
            display: block;
            width: 100%;
            padding: 2rem 1rem;
            border-bottom: 0.5px solid var(--border);
            text-decoration: none;
          }
          .cs-mob-header {
            display: flex;
            align-items: baseline;
            gap: 0.4rem;
            margin-bottom: 1rem;
          }
          .cs-mob-num {
            font-size: 0.7rem;
            font-family: 'Arial', 'Helvetica Neue', sans-serif;
            font-variant-numeric: normal;
            font-feature-settings: 'liga' 0, 'calt' 0;
            font-weight: 400;
            color: var(--text-muted);
          }
          .cs-mob-name {
            font-size: 1.2rem;
            font-weight: 700;
            font-family: var(--font-family-display);
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: var(--text-primary);
          }
          .cs-mob-visual {
            width: 100%;
            aspect-ratio: 16/9;
            background: var(--bg-secondary);
            overflow: hidden;
            margin-bottom: 0.5rem;
            position: relative;
          }
          .cs-mob-visual video {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .cs-mob-meta {
            display: flex;
            justify-content: space-between;
            font-family: var(--font-family-serif);
            font-style: italic;
            font-size: 0.85rem;
            color: var(--text-secondary);
            margin-top: 0.25rem;
          }
          /* Sticky number bar */
          .cs-mob-numbar {
            position: sticky;
            top: 60px;
            z-index: 10;
            background: var(--bg);
            width: 100%;
            border-bottom: 0.5px solid var(--border);
            padding: 1rem 1rem 0.75rem;
            margin: 0;
            display: flex;
            align-items: baseline;
            gap: 0.3rem;
            overflow: visible;
          }
          .cs-mob-numbar-num {
            font-size: 2.5rem;
            font-weight: 900;
            font-family: 'Arial', 'Helvetica Neue', sans-serif;
            font-variant-numeric: normal;
            font-feature-settings: 'liga' 0, 'calt' 0;
            -webkit-font-smoothing: antialiased;
            letter-spacing: -0.03em;
            color: var(--text-primary);
            line-height: 1.2;
          }
          .cs-mob-numbar-suffix {
            font-size: 0.85rem;
            font-weight: 400;
            font-family: 'Arial', 'Helvetica Neue', sans-serif;
            font-variant-numeric: normal;
            font-feature-settings: 'liga' 0, 'calt' 0;
            color: var(--text-muted);
          }
        }
        /* Hide sticky bar on desktop */
        @media (min-width: 769px) {
          .cs-mob-numbar { display: none !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════
          DESKTOP — sticky 3-column scroll (unchanged)
      ══════════════════════════════════════════════════════════════════ */}
      <div
        ref={stickyRef}
        className="cs-sticky"
        style={{
          position: 'sticky', top: 0,
          height: '100vh', overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '15% 55% 30%',
          background: 'var(--bg)',
          borderTop: '1px solid var(--border)',
          opacity: entered ? 1 : 0,
        }}
      >
        {/* S-curve */}
        <svg
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
          viewBox="0 0 680 480"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="curveColl" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%"   stopColor="#111111" stopOpacity="0.13" />
              <stop offset="100%" stopColor="#111111" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 0,480 C 80,430 140,400 220,320 S 370,265 300,240 S 178,215 256,170 S 453,110 558,75 S 642,35 680,0"
            fill="none"
            style={{ stroke: 'url(#curveColl)', strokeWidth: 1, strokeLinecap: 'round' }}
          />
        </svg>

        {/* Campaign label */}
        <div ref={campaignRef} style={{ position: 'absolute', left: '15%', top: '50%', transform: 'translateX(-50%) translateY(-50%) rotate(-90deg)', fontFamily: 'var(--font-family-serif)', fontStyle: 'italic', fontSize: '1.3rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', zIndex: 5, pointerEvents: 'none', userSelect: 'none' }}>
          {COLLECTIONS[0].products[0]?.title ?? ''}
        </div>

        {/* Category label */}
        <div ref={categoryRef} style={{ position: 'absolute', left: '70%', top: '50%', transform: 'translateX(-50%) translateY(-50%) rotate(90deg)', fontFamily: 'var(--font-family-serif)', fontStyle: 'italic', fontSize: '1.3rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', zIndex: 5, pointerEvents: 'none', userSelect: 'none' }}>
          {COLLECTIONS[0].category}
        </div>

        {/* LEFT — number */}
        <div ref={leftRef} style={{ position: 'relative', zIndex: 1, borderRight: '1px solid var(--border)', overflow: 'hidden' }}>
          {COLLECTIONS.map((col, i) => (
            <div key={col.id} ref={el => { numRefs.current[i] = el }} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', paddingLeft: '24px', opacity: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '3px' }}>
                <span style={{ fontFamily: 'var(--font-family-display)', fontSize: 'clamp(5rem, 9vw, 12rem)', lineHeight: 1, color: 'var(--text-primary)', letterSpacing: '-0.02em', fontWeight: 900 }}>
                  {col.id}
                </span>
                <span style={{ fontSize: '1.7rem', fontWeight: 400, color: 'var(--text-muted)', marginTop: '10px' }}>
                  /{String(TOTAL).padStart(2, '0')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CENTER — card stack */}
        <div ref={centerRef} style={{ position: 'relative', zIndex: 1, borderRight: '1px solid var(--border)', overflow: 'hidden' }}>
          <div ref={cardStackRef} style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
            {COLLECTIONS.map((col, i) => (
              <Link
                key={col.id}
                href={`/${locale}/collections/${col.slug}`}
                ref={el => { cardRefs.current[i] = el as HTMLDivElement | null }}
                style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 32px', textDecoration: 'none' }}
              >
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                  {col.products[0]?.videos?.[0] ? (
                    <video src={col.products[0].videos![0]} autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: '24px 28px' }}>
                      <span style={{ fontFamily: 'var(--font-family-display)', fontSize: 'clamp(5rem, 10vw, 9rem)', lineHeight: 1, color: `rgba(var(--text-primary-rgb), 0.05)`, userSelect: 'none' }}>
                        {col.id}
                      </span>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px' }}>
                  <span style={{ fontFamily: 'var(--font-family-serif)', fontStyle: 'italic', fontSize: '22px', color: 'var(--text-muted)' }}>{col.name}</span>
                  <span style={{ fontSize: '14px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--text-muted)', opacity: 0.4 }}>{col.category}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT — nav list */}
        <div ref={rightRef} style={{ position: 'relative', zIndex: 1, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 15, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px 20px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
            <p style={{ fontSize: '14px', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Works</p>
          </div>
          {COLLECTIONS.map((col, i) => (
            <div key={col.id} ref={el => { navRefs.current[i] = el }} style={{ position: 'absolute', left: 0, right: 0, textAlign: 'right', paddingRight: '8px', opacity: 0.32, borderRight: 'none', cursor: 'pointer', userSelect: 'none', zIndex: 1 }}>
              <Link href={`/${locale}/collections/${col.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <span style={{ fontFamily: 'var(--font-family-display)', fontSize: '34px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-primary)', lineHeight: 1.4, display: 'block' }}>
                  {col.name}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MOBILE — simple vertical scroll list
      ══════════════════════════════════════════════════════════════════ */}
      <div className="cs-mobile">

        {/* Sticky number bar */}
        <div className="cs-mob-numbar">
          <span
            className="cs-mob-numbar-num"
            style={{
              opacity: numVisible ? 1 : 0,
              transition: 'opacity 0.2s ease',
              fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
              fontVariantNumeric: 'normal',
              fontFeatureSettings: "'liga' 0, 'calt' 0",
              WebkitFontSmoothing: 'antialiased',
            }}
          >
            {COLLECTIONS[displayIndex].id}
          </span>
          <span className="cs-mob-numbar-suffix">/{String(TOTAL).padStart(2, '0')}</span>
        </div>

        {COLLECTIONS.map((col) => (
          <div key={col.id} id={`collection-${col.id}`}>
            <Link
              href={`/${locale}/collections/${col.slug}`}
              className="cs-mob-item"
            >
              {/* Name + number */}
              <div className="cs-mob-header">
                <span className="cs-mob-num">{col.id}</span>
                <span className="cs-mob-name">{col.name}</span>
              </div>

              {/* Visual */}
              <div className="cs-mob-visual">
                {col.products[0]?.videos?.[0] ? (
                  <video src={col.products[0].videos![0]} autoPlay muted loop playsInline />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-family-display)', fontSize: '4rem', color: `rgba(var(--text-primary-rgb), 0.06)` }}>
                      {col.id}
                    </span>
                  </div>
                )}
              </div>

              {/* Category + campaign */}
              <div className="cs-mob-meta">
                <span>{col.category}</span>
                <span>{col.products[0]?.title ?? ''}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
