'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useLanguage } from '../../lib/useLanguage'
import { gsap } from '../../lib/gsap'

export default function AboutSection() {
  const { locale, t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (textRef.current) {
        gsap.from(Array.from(textRef.current.children), {
          opacity: 0, y: 40, duration: 1.0, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
        })
      }
      gsap.from(mediaRef.current, {
        opacity: 0, y: 50, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
      })
      gsap.from(ctaRef.current, {
        opacity: 0, y: 30, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 55%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative bg-ink"
      style={{ overflow: 'hidden', position: 'relative' }}
    >
      {/* ── Decorative winding line — top-right → visits all 4 quadrants → bottom-left ── */}
      {/* Grid dividers: vertical x≈238 (35%), horizontal y≈202 (42%) of viewBox 680×480 */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          zIndex: 0, pointerEvents: 'none',
          stroke: 'var(--text-primary)',
        }}
        viewBox="0 0 680 480"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="curveGrad" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--text-primary)" stopOpacity="0.32" />
            <stop offset="35%"  stopColor="var(--text-primary)" stopOpacity="0.16" />
            <stop offset="70%"  stopColor="var(--text-primary)" stopOpacity="0.07" />
            <stop offset="100%" stopColor="var(--text-primary)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="curveGrad2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--text-primary)" stopOpacity="0.18" />
            <stop offset="45%"  stopColor="var(--text-primary)" stopOpacity="0.09" />
            <stop offset="100%" stopColor="var(--text-primary)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="curveGrad3" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--text-primary)" stopOpacity="0.12" />
            <stop offset="50%"  stopColor="var(--text-primary)" stopOpacity="0.05" />
            <stop offset="100%" stopColor="var(--text-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/*
          Path journey:
          (680,0)   → TOP-RIGHT quadrant  (x>238, y<202)
          → crosses x=238 → TOP-LEFT quadrant   (x<238, y<202)
          → crosses y=202 → BOTTOM-LEFT quadrant (x<238, y>202)
          → crosses x=238 → BOTTOM-RIGHT quadrant (x>238, y>202)
          → sweeps back   → (0,480) bottom-left corner
        */}
        <path
          d={[
            'M 680,0',
            'C 605,28  545,58  478,88',
            'S 355,118  305,152',
            'C 268,178  250,196  218,191',
            'S 162,172  124,153',
            'C 78,128   44,142  26,172',
            'S 8,196    18,218',
            'C 34,242   72,256  104,272',
            'S 168,294  196,312',
            'C 220,322  234,314  258,320',
            'S 318,344  368,360',
            'C 430,376  476,392  494,422',
            'S 458,450  374,458',
            'C 284,464  174,469  86,474',
            'S 28,477   0,480',
          ].join(' ')}
          fill="none"
          style={{
            stroke: 'url(#curveGrad)',
            strokeWidth: 1,
            strokeLinecap: 'round',
            strokeDasharray: 3500,
            animation: 'drawCurve 1.8s ease 0.3s forwards',
          }}
        />

        {/* Line 2 — offset ~30px below, shorter loops, delay 0.55s */}
        <path
          d={[
            'M 680,30',
            'C 610,55  555,82  492,112',
            'S 378,140  332,172',
            'C 296,196  276,212  248,206',
            'S 194,186  154,168',
            'C 106,146  66,158  46,188',
            'S 28,212   40,234',
            'C 58,256   96,268  128,284',
            'S 194,308  222,326',
            'C 244,336  256,328  280,336',
            'S 342,362  394,378',
            'C 452,394  496,410  510,440',
            'S 470,464  382,470',
            'C 288,476  176,479  0,480',
          ].join(' ')}
          fill="none"
          style={{
            stroke: 'url(#curveGrad2)',
            strokeWidth: 1,
            strokeLinecap: 'round',
            strokeDasharray: 3500,
            animation: 'drawCurve 1.8s ease 0.55s forwards',
          }}
        />

        {/* Line 3 — tighter, offset ~60px below, delay 0.8s */}
        <path
          d={[
            'M 680,60',
            'C 618,82  566,106  508,134',
            'S 400,160  356,190',
            'C 322,212  302,226  274,220',
            'S 218,200  180,184',
            'C 132,162  90,174  68,202',
            'S 52,228   66,250',
            'C 84,270  122,282  154,298',
            'S 220,320  248,340',
            'C 268,350  278,342  302,350',
            'S 366,376  416,394',
            'C 472,412  514,428  524,456',
            'S 480,474  390,478',
            'C 292,482  0,480  0,480',
          ].join(' ')}
          fill="none"
          style={{
            stroke: 'url(#curveGrad3)',
            strokeWidth: 1,
            strokeLinecap: 'round',
            strokeDasharray: 3500,
            animation: 'drawCurve 1.8s ease 0.8s forwards',
          }}
        />
      </svg>

      <style>{`
        .about-mobile  { display: block; }
        .about-desktop { display: none;  }
        @media (min-width: 769px) {
          .about-mobile  { display: none  !important; }
          .about-desktop { display: block !important; }
          #about { padding-bottom: 8rem; }
        }
      `}</style>

      {/* ── MOBILE layout ── */}
      <div
        className="about-mobile"
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: '30% 70%',
          gridTemplateRows: 'auto auto',
        }}
      >
        {/* Top-left: empty */}
        <div style={{ borderRight: '0.5px solid var(--border)', minHeight: '200px' }} />

        {/* Top-right: tagline + link */}
        <div
          ref={textRef}
          style={{
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <p style={{
            fontFamily: 'Cormorant Garamond, var(--font-family-serif), serif',
            fontStyle: 'italic',
            fontSize: 'clamp(1.1rem, 4.5vw, 1.4rem)',
            lineHeight: 1.5,
            color: 'var(--text-primary)',
            margin: 0,
          }}>
            {t.about.tagline}
          </p>
          <Link
            ref={ctaRef}
            href={`/${locale}/about`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '1.5rem',
              fontSize: '0.85rem',
              color: 'var(--text-primary)',
              textDecoration: 'none',
            }}
          >
            ▸ {t.about.link}
          </Link>
        </div>

        {/* Bottom row: video */}
        <div
          ref={mediaRef}
          style={{
            gridColumn: '1 / -1',
            padding: '1rem',
            boxSizing: 'border-box',
            margin: 0,
          }}
        >
          <video
            style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
            autoPlay muted loop playsInline
          >
            <source src="/videos/aboute.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      {/* ── DESKTOP layout: 2×2 grid ── */}
      <div
        className="about-desktop"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            height: '100vh',
            position: 'relative',
            borderRight: '3px solid var(--text-primary)',
          }}
        >
          {/* Column divider */}
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '0.5px', background: 'var(--border)', zIndex: 2, pointerEvents: 'none' }} />
          {/* Row divider */}
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '0.5px', background: 'var(--border)', zIndex: 2, pointerEvents: 'none' }} />

          {/* Cell 1: top-left — empty */}
          <div />

          {/* Cell 2: top-right — tagline */}
          <div
            ref={textRef}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 3rem' }}
          >
            <p style={{
              fontFamily: 'Cormorant Garamond, var(--font-family-serif), serif',
              fontStyle: 'italic',
              fontSize: 'clamp(1.2rem, 1.8vw, 2rem)',
              lineHeight: 1.55,
              color: 'var(--text-primary)',
              margin: 0,
              textAlign: 'center',
            }}>
              {t.about.tagline}
            </p>
          </div>

          {/* Cell 3: bottom-left — video */}
          <div
            ref={mediaRef}
            style={{ overflow: 'hidden', position: 'relative' }}
          >
            <video
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              autoPlay muted loop playsInline
            >
              <source src="/videos/aboute.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Cell 4: bottom-right — link */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Link
              ref={ctaRef}
              href={`/${locale}/about`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                textDecoration: 'none',
              }}
            >
              ▸ {t.about.link}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
