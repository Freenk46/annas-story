'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'

type CollectionItem = {
  number: string
  name: string
  slug: string
}

export default function CatalogContent() {
  const t = useTranslations('collections')
  const locale = useLocale()
  const searchParams = useSearchParams()
  const activeCollection = searchParams.get('collection') ?? 'all'

  const collections = t.raw('items') as CollectionItem[]

  return (
    <div className="min-h-screen bg-ink pt-32 pb-24 px-8 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <p className="text-[9px] tracking-[0.4em] uppercase text-ghost mb-4">
            Anna&apos;s Story
          </p>
          <h1 className="font-display text-[clamp(3rem,8vw,7rem)] tracking-[0.02em] text-paper uppercase leading-none">
            Catalog
          </h1>
        </header>

        <div className="flex flex-wrap gap-2 mb-16 border-b border-line pb-8">
          <Link
            href={`/${locale}/catalog`}
            className={`px-5 py-2 text-[10px] tracking-[0.2em] uppercase transition-colors ${
              activeCollection === 'all'
                ? 'bg-paper text-ink'
                : 'text-ghost hover:text-paper border border-line hover:border-ghost'
            }`}
          >
            All
          </Link>
          {collections.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${locale}/catalog?collection=${cat.slug}`}
              className={`px-5 py-2 text-[10px] tracking-[0.2em] uppercase transition-colors ${
                activeCollection === cat.slug
                  ? 'bg-paper text-ink'
                  : 'text-ghost hover:text-paper border border-line hover:border-ghost'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="py-32 text-center">
          <p className="font-display text-6xl text-paper/10 uppercase tracking-widest mb-4">
            Coming Soon
          </p>
          <p className="text-sm text-ghost">
            {locale === 'ka' ? 'პროდუქტები მალე დაემატება' : 'Products will be added soon'}
          </p>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-3 mt-10 text-[11px] tracking-[0.2em] uppercase text-ghost hover:text-mink transition-colors"
          >
            ← {locale === 'ka' ? 'მთავარზე დაბრუნება' : 'Back to home'}
          </Link>
        </div>
      </div>
    </div>
  )
}