export type OrderStatus = 'new' | 'processing' | 'completed' | 'cancelled'

export type ProductFormData = {
  slug: string
  category_id: string | null
  name_ka: string
  name_ru: string
  name_en: string
  description_ka: string
  description_ru: string
  description_en: string
  price: number
  sizes: string[]
  colors: string[]
  images: string[]
  is_active: boolean
  is_featured: boolean
  sort_order: number
}

export type CategoryFormData = {
  slug: string
  name_ka: string
  name_ru: string
  name_en: string
  cover_url: string
  sort_order: number
  is_active: boolean
}

export type BundleFormData = {
  slug: string
  name_ka: string
  name_ru: string
  name_en: string
  description_ka: string
  description_ru: string
  description_en: string
  price: number
  original_price: number | null
  cover_url: string
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
