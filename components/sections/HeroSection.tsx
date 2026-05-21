'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '../../lib/useLanguage'

// Word animation variant — rising mask effect
const wordVariants = {
  hidden: { y: 60, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay:    0.3 + i * 0.12,
      duration: 0.65,
      ease:     [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
}

// Masked word wrapper — clips the upward travel
function Word({ word, index, italic }: { word: string; index: number; italic?: boolean }) {
  return (
    <div style={{ overflow: 'hidden', display: 'inline-block' }}>
      <motion.span
        custom={index}
        initial="hidden"
        animate="visible"
        variants={wordVariants}
        style={{
          display:     'inline-block',
          fontFamily:  italic ? 'var(--font-family-serif)' : 'var(--font-family-display)',
          fontStyle:   italic ? 'italic' : 'normal',
          fontWeight:  italic ? 300 : 900,
          fontSize:    italic
            ? 'clamp(2rem, 4.5vw, 4rem)'
            : 'clamp(3rem, 7vw, 6.5rem)',
          letterSpacing: italic ? '0.01em' : '-0.02em',
          textTransform: italic ? 'none' : 'uppercase',
          color:       'white',
          lineHeight:  1,
        }}
      >
        {word}
      </motion.span>
    </div>
  )
}

export default function HeroSection() {
  const { t } = useLanguage()

  const line1Words = t.hero.line1.split(' ')
  const forWord    = t.hero.for
  const line2Words = t.hero.line2.split(' ')

  return (
    <section
      data-nav-theme="dark"
      style={{
        width:    '100vw',
        height:   '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: '#111',
      }}
    >
      {/* Background video */}
      <video
        src="/videos/hero.mp4"
        autoPlay muted loop playsInline
        style={{
          position:   'absolute',
          inset:      0,
          width:      '100%',
          height:     '100%',
          objectFit:  'cover',
          objectPosition: 'center center',
          zIndex:     0,
        }}
      />

      {/* Dark overlay */}
      <div
        style={{
          position:   'absolute',
          inset:      0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.45) 100%)',
          zIndex:     1,
        }}
      />

      {/* Text overlay */}
      <div
        style={{
          position:  'absolute',
          bottom:    '5rem',
          left:      '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex:    2,
          whiteSpace:'nowrap',
        }}
      >
        {/* Line 1 */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.35em', marginBottom: '0.05em' }}>
          {line1Words.map((word, i) => (
            <Word key={word + i} word={word} index={i} />
          ))}
        </div>

        {/* Line 2: italic word + rest */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.35em' }}>
          <Word word={forWord} index={line1Words.length} italic />
          {line2Words.map((word, i) => (
            <Word key={word + i} word={word} index={line1Words.length + 1 + i} />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        style={{
          position:  'absolute',
          bottom:    '1.5rem',
          left:      '50%',
          transform: 'translateX(-50%)',
          zIndex:    2,
          fontFamily:    'var(--font-family-serif)',
          fontStyle:     'italic',
          fontSize:      '0.85rem',
          color:         'white',
          letterSpacing: '0.05em',
          background:    'rgba(0,0,0,0.25)',
          padding:       '0.3rem 1rem',
          borderRadius:  '2px',
          animation:     'heroPulse 2s ease-in-out 1.7s infinite',
        }}
      >
        {t.hero.scroll}
      </motion.div>

      {/* Mobile: loosen white-space */}
      <style>{`
        @media (max-width: 640px) {
          [data-nav-theme="dark"] .hero-text-wrap {
            white-space: normal !important;
          }
        }
        @keyframes heroPulse {
          0%, 100% { opacity: 0.7; }
          50%       { opacity: 1;   }
        }
      `}</style>
    </section>
  )
}
