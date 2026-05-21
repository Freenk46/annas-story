export type CollectionSlug =
  | 'pure-comfort'
  | 'spa-ritual'
  | 'linen-dream'
  | 'cloud-nine'
  | 'bamboo-luxe'
  | 'heritage'

export const collectionImages: Record<CollectionSlug, string> = {
  'pure-comfort': '/images/collections/pure-comfort.webp',
  'spa-ritual': '/images/collections/spa-ritual.webp',
  'linen-dream': '/images/collections/linen-dream.webp',
  'cloud-nine': '/images/collections/cloud-nine.webp',
  'bamboo-luxe': '/images/collections/bamboo-luxe.webp',
  heritage: '/images/collections/heritage.webp',
}

export const collectionSlugs: CollectionSlug[] = [
  'pure-comfort',
  'spa-ritual',
  'linen-dream',
  'cloud-nine',
  'bamboo-luxe',
  'heritage',
]
