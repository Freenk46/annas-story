export type CategorySlug =
  | 'pure-comfort'
  | 'spa-ritual'
  | 'linen-dream'
  | 'cloud-nine'
  | 'bamboo-luxe'
  | 'heritage'

export const categoryImages: Record<CategorySlug, string> = {
  'pure-comfort': '/images/categories/pure-comfort.webp',
  'spa-ritual': '/images/categories/spa-ritual.webp',
  'linen-dream': '/images/categories/linen-dream.webp',
  'cloud-nine': '/images/categories/cloud-nine.webp',
  'bamboo-luxe': '/images/categories/bamboo-luxe.webp',
  heritage: '/images/categories/heritage.webp',
}

export const categorySlugs: CategorySlug[] = [
  'pure-comfort',
  'spa-ritual',
  'linen-dream',
  'cloud-nine',
  'bamboo-luxe',
  'heritage',
]