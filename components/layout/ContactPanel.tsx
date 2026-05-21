'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '../../lib/gsap'

export default function ContactPanel() {
  const t = useTranslations('contact_panel')
  const panelRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || ''

  const close = () => {
    const panel = panelRef.current
    const overlay = overlayRef.current
    if (!panel || !overlay) return
    gsap.to(panel, { x: '100%', duration: 0.55, ease: 'power3.in' })
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        overlay.style.pointerEvents = 'none'
      },
    })
  }

  const open = () => {
    const panel = panelRef.current
    const overlay = overlayRef.current
    if (!panel || !overlay) return
    overlay.style.pointerEvents = 'auto'
    gsap.to(overlay, { opacity: 1, duration: 0.4 })
    gsap.to(panel, { x: '0%', duration: 0.6, ease: 'power3.out' })
  }

  useEffect(() => {
    const el = document.getElementById('contact-panel')
    if (!el) return
    const handleOpen = () => open()
    const handleClose = () => close()
    el.addEventListener('open-panel', handleOpen)
    el.addEventListener('close-panel', handleClose)
    return () => {
      el.removeEventListener('open-panel', handleOpen)
      el.removeEventListener('close-panel', handleClose)
    }
  }, [])

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={close}
        className="fixed inset-0 z-[60] bg-black/40 opacity-0"
        style={{ pointerEvents: 'none' }}
      />

      {/* Panel */}
      <div
        id="contact-panel"
        ref={panelRef}
        className="fixed top-0 right-0 z-[70] h-full w-full max-w-sm bg-line flex flex-col justify-between p-10 translate-x-full"
      >
        {/* Close */}
        <div className="flex justify-end">
          <button
            onClick={close}
            className="text-[11px] tracking-[0.2em] uppercase text-paper/50 hover:text-paper transition-colors"
          >
            ✕ Close
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-10">
          <h2 className="font-display text-[clamp(2.5rem,4vw,4rem)] tracking-[0.08em] text-paper uppercase">
            {t('title')}
          </h2>

          <div className="flex flex-col gap-6">
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <span className="h-px flex-1 bg-ghost/30 group-hover:bg-mink transition-colors" />
                <span className="text-[11px] tracking-[0.2em] uppercase text-paper/70 group-hover:text-mink transition-colors">
                  {t('whatsapp')}
                </span>
                <span className="text-paper/30 group-hover:text-mink transition-colors">→</span>
              </a>
            )}

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 group"
            >
              <span className="h-px flex-1 bg-ghost/30 group-hover:bg-mink transition-colors" />
              <span className="text-[11px] tracking-[0.2em] uppercase text-paper/70 group-hover:text-mink transition-colors">
                {t('instagram')}
              </span>
              <span className="text-paper/30 group-hover:text-mink transition-colors">→</span>
            </a>

            <a
              href="mailto:hello@annas-story.ge"
              className="flex items-center gap-4 group"
            >
              <span className="h-px flex-1 bg-ghost/30 group-hover:bg-mink transition-colors" />
              <span className="text-[11px] tracking-[0.2em] uppercase text-paper/70 group-hover:text-mink transition-colors">
                {t('email')}
              </span>
              <span className="text-paper/30 group-hover:text-mink transition-colors">→</span>
            </a>
          </div>

          <div className="flex flex-col gap-4 pt-4 border-t border-ghost/20">
            <div>
              <p className="text-[9px] tracking-[0.3em] uppercase text-ghost mb-1">
                {t('hours_label')}
              </p>
              <p className="text-sm text-paper/70">{t('hours')}</p>
            </div>
            <div>
              <p className="text-[9px] tracking-[0.3em] uppercase text-ghost mb-1">
                {t('location_label')}
              </p>
              <p className="text-sm text-paper/70">{t('location')}</p>
              <p className="text-xs text-ghost mt-1">{t('delivery')}</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <p className="text-[9px] tracking-[0.2em] uppercase text-ghost">
          Anna&apos;s Story © 2025
        </p>
      </div>
    </>
  )
}
