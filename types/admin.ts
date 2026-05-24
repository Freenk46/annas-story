export type OrderStatus = 'new' | 'processing' | 'completed' | 'cancelled'

export type ProductFormData = {
  slug: string
  category_id: string | null
  name_ka: string
  name_ru: string
  name_en: string
  subtitle_ka: string
  subtitle_ru: string
  subtitle_en: string
  description_ka: string
  description_ru: string
  description_en: string
  technical_info_ka: string
  technical_info_ru: string
  technical_info_en: string
  price: number
  original_price: number | null
  sizes: string[]
  colors: string[]
  images: string[]
  collection: string
  year: number | null
  is_active: boolean
  is_featured: boolean
  sort_order: number
}

export type CategoryFormData = {
  slug: string
  name_ka: string
  name_ru: string
  name_en: string
  collection_ka: string
  description_ka: string
  description_ru: string
  description_en: string
  cover_url: string
  year: number | null
  sort_order: number
  is_active: boolean
}

export type BundleFormData = {
  slug: string
  name_ka: string
  name_ru: string
  name_en: string
  subtitle_ka: string
  subtitle_ru: string
  subtitle_en: string
  description_ka: string
  description_ru: string
  description_en: string
  price: number
  original_price: number | null
  cover_url: string
  items_list: string[]
  is_active: boolean
  sort_order: number
  product_ids: string[]
}

export type OrderItem = {
  product_id?: string
  bundle_id?: string
  name: string
  price: number
  quantity: number
}
