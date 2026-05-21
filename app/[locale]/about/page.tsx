'use client'

import { useLanguage } from '../../../lib/useLanguage'

// ── Image placeholder ─────────────────────────────────────────────────────────
function Img({ src, className, style }: { src: string; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={className}
      style={{
        background:     'var(--bg-secondary)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        overflow:       'hidden',
        flexShrink:     0,
        ...style,
      }}
    >
      <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.08em', padding: '8px', textAlign: 'center', wordBreak: 'break-all' }}>
        {src}
      </span>
    </div>
  )
}

const bodyText: React.CSSProperties = {
  fontSize: '0.85rem', fontWeight: 400, lineHeight: 1.75, color: 'var(--text-primary)',
}
const divider: React.CSSProperties = { borderTop: '0.5px solid var(--border)' }

// ── Component ─────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const { t } = useLanguage()
  const ap = t.aboutPage

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* ── Responsive styles ── */}
      <style>{`
        .ab-hero-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          flex: 1;
          position: relative;
          z-index: 1;
        }
        .ab-hero-left { border-right: 0.5px solid var(--border); position: relative; min-height: 50vh; }
        .ab-hero-right {
          display: flex; flex-direction: column;
          justify-content: flex-end;
          padding: 2.5rem 2.5rem 3rem;
          position: relative; z-index: 1;
        }
        .ab-hero-img { width: 100%; height: 420px; z-index: 1; }

        .ab-sophie-grid {
          display: grid;
          grid-template-columns: 25% 75%;
          min-height: 600px;
          padding: 5rem 2rem;
          align-items: start;
        }
        .ab-sophie-left  { padding-right: 3rem; padding-top: 0.5rem; }
        .ab-sophie-right {
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 1rem;
          align-items: start;
          overflow: visible;
        }
        .ab-sophie-img1 { aspect-ratio: 1/1; width: 100%; }
        .ab-sophie-img2 { grid-row: 1/3; grid-column: 2; min-height: 560px; width: 100%; margin-right: -2rem; }

        .ab-fred-grid {
          display: grid;
          grid-template-columns: 30% 40% 30%;
          min-height: 600px;
          padding: 5rem 2rem;
          align-items: start;
        }
        .ab-fred-img1  { height: 600px; width: 100%; margin-left: -2rem; }
        .ab-fred-center { padding: 0 3rem; padding-top: 0.5rem; }
        .ab-fred-right { display: flex; align-items: flex-end; justify-content: flex-end; }
        .ab-fred-img2 { width: 260px; height: 200px; }

        @media (max-width: 768px) {
          .ab-hero-grid { grid-template-columns: 1fr; }
          .ab-hero-left { display: none; }
          .ab-hero-right { padding: 2rem 1.25rem 2.5rem; min-height: 40vh; }
          .ab-hero-img  { height: 260px; }

          .ab-sophie-grid { grid-template-columns: 1fr; padding: 3rem 1.25rem; min-height: unset; }
          .ab-sophie-left  { padding-right: 0; margin-bottom: 2rem; }
          .ab-sophie-right { grid-template-columns: 1fr; gap: 0.75rem; }
          .ab-sophie-img1 { aspect-ratio: 4/3; }
          .ab-sophie-img2 { grid-row: unset; grid-column: unset; min-height: 280px; margin-right: 0; }

          .ab-fred-grid { grid-template-columns: 1fr; padding: 3rem 1.25rem; min-height: unset; }
          .ab-fred-img1  { height: 300px; margin-left: 0; margin-bottom: 2rem; }
          .ab-fred-center { padding: 0; margin-bottom: 2rem; }
          .ab-fred-right { justify-content: flex-start; }
          .ab-fred-img2  { width: 100%; height: 220px; }
        }
      `}</style>

      {/* ══ HERO ══ */}
      <section
        style={{
          minHeight: '90vh', position: 'relative',
          overflow: 'hidden', borderBottom: '0.5px solid var(--border)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <svg
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', color: 'var(--text-primary)' }}
          viewBox="0 0 760 600"
          preserveAspectRatio="none"
        >
          <path
            d="M 760,0 C 660,60 600,100 500,180 S 320,230 400,270 S 520,300 440,360 S 220,420 120,450 S 30,480 0,600"
            fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"
            style={{ opacity: 0.1 }}
          />
        </svg>

        <div className="ab-hero-grid">
          <div className="ab-hero-left">
            <div
              aria-hidden="true"
              style={{
                position: 'absolute', width: '420px', height: '420px',
                borderRadius: '50%', border: '0.8px solid var(--border)',
                opacity: 0.6, top: '-60px', left: '-80px',
                pointerEvents: 'none', zIndex: 0,
              }}
            />
          </div>

          <div className="ab-hero-right">
            <div>
              <div style={{
                fontFamily: 'var(--font-family-display)',
                fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                fontWeight: 900, letterSpacing: '-0.03em',
                textTransform: 'uppercase', color: 'var(--text-primary)', lineHeight: 1,
              }}>
                {ap.heading1}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3em', flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: 'var(--font-family-serif)', fontStyle: 'italic',
                  fontWeight: 300, fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
                  color: 'var(--text-primary)', lineHeight: 1,
                }}>
                  {ap.our}
                </span>
                <span style={{
                  fontFamily: 'var(--font-family-display)',
                  fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                  fontWeight: 900, letterSpacing: '-0.03em',
                  textTransform: 'uppercase', color: 'var(--text-primary)', lineHeight: 1,
                }}>
                  {ap.heading2}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Img src="/images/office-hero.jpg" className="ab-hero-img" />
      </section>

      {/* ══ SOPHIE BIO ══ */}
      <section style={divider}>
        <div className="ab-sophie-grid">
          <div className="ab-sophie-left">
            <p style={{ ...bodyText, marginBottom: '1.5rem' }}>{ap.sophieBio1}</p>
            <p style={bodyText}>{ap.sophieBio2}</p>
          </div>
          <div className="ab-sophie-right">
            <Img src="/images/sophie-office-1.jpg" className="ab-sophie-img1" />
            <Img src="/images/sophie-office-2.jpg" className="ab-sophie-img2" />
          </div>
        </div>
      </section>

      {/* ══ FRED BIO ══ */}
      <section style={divider}>
        <div className="ab-fred-grid">
          <Img src="/images/fred-office-1.jpg" className="ab-fred-img1" />
          <div className="ab-fred-center">
            <p style={{ ...bodyText, marginBottom: '1.5rem' }}>{ap.fredBio1}</p>
            <p style={bodyText}>{ap.fredBio2}</p>
          </div>
          <div className="ab-fred-right">
            <Img src="/images/fred-office-2.jpg" className="ab-fred-img2" />
          </div>
        </div>
      </section>

    </main>
  )
}
