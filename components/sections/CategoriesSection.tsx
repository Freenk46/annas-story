'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { gsap } from '../../lib/gsap'

type CategoryItem = {
  number: string
  name: string
  slug: string
}

export default function CategoriesSection() {
  const t = useTranslations('categories')
  const locale = useLocale()
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const items = t.raw('items') as CategoryItem[]

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (gridRef.current) {
        gsap.from(Array.from(gridRef.current.children), {
          opacity: 0,
          y: 40,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 75%',
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="bg-ink py-32 px-8 md:px-16 lg:px-24 border-t border-line"
    >
      <div className="max-w-7xl mx-auto">
        <p className="text-[9px] tracking-[0.4em] uppercase text-ghost mb-16">
          {t('label')}
        </p>

        <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-line">
          {items.map((item) => (
            <Link
              key={item.number}
              href={`/${locale}/catalog?category=${item.slug}`}
              className="group relative bg-ink p-10 flex flex-col justify-between min-h-[280px] hover:bg-line transition-colors duration-300"
            >
              <span className="text-[10px] tracking-[0.3em] uppercase text-ghost">
                {item.number}
              </span>

              <div>
                <p className="font-display text-3xl md:text-4xl tracking-[0.03em] text-paper uppercase group-hover:text-mink transition-colors duration-300 mb-4">
                  {item.name}
                </p>
                <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-ghost group-hover:text-mink transition-colors duration-300">
                  View
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
