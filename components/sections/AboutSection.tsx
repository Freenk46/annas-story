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

      {/* ── MOBILE layout ── */}
      <div className="md:hidden relative flex flex-col" style={{ position: 'relative', zIndex: 1 }}>
        {/* Text + CTA block */}
        <div ref={textRef} style={{ position: 'relative', padding: '20vw 8vw 10vw 8vw', borderBottom: '1px solid var(--border)' }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '35%', width: '1px', background: 'var(--border)', pointerEvents: 'none' }} />
          <p style={{ fontSize: '9px', letterSpacing: '0.45em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '20px' }}>
            {t.about.label}
          </p>
          <h2 style={{ fontFamily: 'var(--font-family-serif)', fontStyle: 'italic', fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', fontWeight: 300, lineHeight: 1.45, color: 'var(--text-primary)', marginBottom: '20px' }}>
            {t.about.title}
          </h2>
          <p style={{ fontSize: '14px', lineHeight: 1.85, color: 'var(--text-muted)', marginBottom: '32px' }}>
            {t.about.tagline}
          </p>
          <Link
            ref={ctaRef}
            href={`/${locale}/about`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--text-primary)', textDecoration: 'none' }}
          >
            <span style={{ fontSize: '8px' }}>▶</span>
            <span style={{ borderBottom: `1px solid rgba(var(--text-primary-rgb), 0.3)`, paddingBottom: '1px' }}>{t.about.link}</span>
          </Link>
        </div>

        {/* Video block */}
        <div ref={mediaRef} style={{ position: 'relative', width: '100%', aspectRatio: '3/2', overflow: 'hidden', marginBottom: '18vw' }}>
          <video
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            autoPlay muted loop playsInline
          >
            <source src="/videos/aboute.mp4" type="video/mp4" />
          </video>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom right, rgba(51,51,51,0.25), rgba(85,85,85,0.12), rgba(153,153,153,0.08))', display: 'flex', alignItems: 'flex-end', padding: '20px' }}>
            <span style={{ fontFamily: 'var(--font-family-display)', fontSize: '3.5rem', lineHeight: 1, color: 'rgba(12,12,12,0.08)', userSelect: 'none' }}>02</span>
          </div>
        </div>
      </div>

      {/* ── DESKTOP layout: 2×2 grid ── */}
      <div
        className="hidden md:grid absolute inset-0"
        style={{
          gridTemplateColumns: '35fr 65fr',
          gridTemplateRows: '42fr 58fr',
          height: '140vh',
          zIndex: 1,
        }}
      >
        {/* Dividers */}
        <div className="absolute inset-y-0 w-px bg-line z-20 pointer-events-none" style={{ left: '35%' }} />
        <div className="absolute inset-x-0 h-px bg-line z-20 pointer-events-none" style={{ top: '42%' }} />

        {/* TOP-LEFT: empty */}
        <div />

        {/* TOP-RIGHT: text → bottom-left corner */}
        <div className="flex flex-col justify-end items-start" style={{ padding: 'clamp(20px,5vh,112px) clamp(8px,2vw,64px) 0 clamp(8px,2vw,80px)' }}>
          <div ref={textRef} style={{ paddingBottom: 'clamp(16px,3vh,40px)', paddingLeft: 'clamp(8px,2.8vw,40px)' }}>
            <p className="text-[9px] tracking-[0.45em] uppercase text-ghost mb-5">
              {t.about.label}
            </p>
            <h2
              className="font-display uppercase text-paper"
              style={{ fontSize: 'clamp(1.2rem, 2.4vw, 2.4rem)', lineHeight: 1.2, letterSpacing: '0.02em' }}
            >
              {t.about.tagline}
            </h2>
          </div>
        </div>

        {/* BOTTOM-LEFT: video → top-right corner */}
        <div className="flex flex-col justify-start items-end">
          <div
            ref={mediaRef}
            className="w-[85%] aspect-[3/2] overflow-hidden relative"
            style={{ marginTop: 'clamp(16px,3vh,40px)', marginRight: 'clamp(8px,2.8vw,40px)', boxShadow: '0 16px 40px rgba(0,0,0,0.07)' }}
          >
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay muted loop playsInline
            >
              <source src="/videos/aboute.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-br from-mink/25 via-taupe/12 to-ghost/8 flex items-end p-5">
              <span className="font-display text-[3.5rem] leading-none text-paper/8 select-none">02</span>
            </div>
          </div>
        </div>

        {/* BOTTOM-RIGHT: CTA → top-left corner */}
        <div className="flex flex-col justify-start items-start">
          <Link
            ref={ctaRef}
            href={`/${locale}/about`}
            className="inline-flex items-center gap-3 text-[13px] tracking-[0.28em] uppercase text-paper group"
            style={{ marginTop: 'clamp(16px,3vh,40px)', marginLeft: 'clamp(8px,2.8vw,40px)' }}
          >
            <span className="text-[11px] transition-transform group-hover:translate-x-0.5">▶</span>
            <span className="border-b border-paper/30 group-hover:border-paper transition-colors pb-px">
              {t.about.link}
            </span>
          </Link>
        </div>
      </div>

      {/* desktop section height spacer */}
      <div className="hidden md:block" style={{ height: '140vh' }} />
    </section>
  )
}
