// Auto-generated stub — replace with:
// npx supabase gen types typescript --project-id YOUR_ID > types/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          slug: string
          name_ka: string
          name_ru: string
          name_en: string
          cover_url: string | null
          sort_order: number
          is_active: boolean
          year: number | null
          collection_ka: string | null
          collection_ru: string | null
          collection_en: string | null
          description_ka: string | null
          description_ru: string | null
          description_en: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name_ka: string
          name_ru: string
          name_en: string
          cover_url?: string | null
          sort_order?: number
          is_active?: boolean
          year?: number | null
          collection_ka?: string | null
          collection_ru?: string | null
          collection_en?: string | null
          description_ka?: string | null
          description_ru?: string | null
          description_en?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name_ka?: string
          name_ru?: string
          name_en?: string
          cover_url?: string | null
          sort_order?: number
          is_active?: boolean
          year?: number | null
          collection_ka?: string | null
          collection_ru?: string | null
          collection_en?: string | null
          description_ka?: string | null
          description_ru?: string | null
          description_en?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          slug: string
          category_id: string | null
          name_ka: string
          name_ru: string
          name_en: string
          subtitle_ka: string | null
          subtitle_ru: string | null
          subtitle_en: string | null
          description_ka: string | null
          description_ru: string | null
          description_en: string | null
          technical_info_ka: string | null
          technical_info_ru: string | null
          technical_info_en: string | null
          price: number
          original_price: number | null
          sizes: string[]
          colors: string[]
          images: string[]
          collection: string | null
          year: number | null
          is_active: boolean
          is_featured: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          category_id?: string | null
          name_ka: string
          name_ru: string
          name_en: string
          subtitle_ka?: string | null
          subtitle_ru?: string | null
          subtitle_en?: string | null
          description_ka?: string | null
          description_ru?: string | null
          description_en?: string | null
          technical_info_ka?: string | null
          technical_info_ru?: string | null
          technical_info_en?: string | null
          price: number
          original_price?: number | null
          sizes?: string[]
          colors?: string[]
          images?: string[]
          collection?: string | null
          year?: number | null
          is_active?: boolean
          is_featured?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          category_id?: string | null
          name_ka?: string
          name_ru?: string
          name_en?: string
          subtitle_ka?: string | null
          subtitle_ru?: string | null
          subtitle_en?: string | null
          description_ka?: string | null
          description_ru?: string | null
          description_en?: string | null
          technical_info_ka?: string | null
          technical_info_ru?: string | null
          technical_info_en?: string | null
          price?: number
          original_price?: number | null
          sizes?: string[]
          colors?: string[]
          images?: string[]
          collection?: string | null
          year?: number | null
          is_active?: boolean
          is_featured?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      bundles: {
        Row: {
          id: string
          slug: string
          name_ka: string
          name_ru: string
          name_en: string
          subtitle_ka: string | null
          subtitle_ru: string | null
          subtitle_en: string | null
          description_ka: string | null
          description_ru: string | null
          description_en: string | null
          price: number
          original_price: number | null
          cover_url: string | null
          items_list: string[]
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name_ka: string
          name_ru: string
          name_en: string
          subtitle_ka?: string | null
          subtitle_ru?: string | null
          subtitle_en?: string | null
          description_ka?: string | null
          description_ru?: string | null
          description_en?: string | null
          price: number
          original_price?: number | null
          cover_url?: string | null
          items_list?: string[]
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name_ka?: string
          name_ru?: string
          name_en?: string
          subtitle_ka?: string | null
          subtitle_ru?: string | null
          subtitle_en?: string | null
          description_ka?: string | null
          description_ru?: string | null
          description_en?: string | null
          price?: number
          original_price?: number | null
          cover_url?: string | null
          items_list?: string[]
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      bundle_products: {
        Row: {
          bundle_id: string
          product_id: string
          quantity: number
        }
        Insert: {
          bundle_id: string
          product_id: string
          quantity?: number
        }
        Update: {
          bundle_id?: string
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "bundle_products_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          customer_name: string | null
          customer_phone: string | null
          items: Json
          total_price: number | null
          status: 'new' | 'processing' | 'completed' | 'cancelled'
          notes: string | null
          whatsapp_sent_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_name?: string | null
          customer_phone?: string | null
          items: Json
          total_price?: number | null
          status?: 'new' | 'processing' | 'completed' | 'cancelled'
          notes?: string | null
          whatsapp_sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_name?: string | null
          customer_phone?: string | null
          items?: Json
          total_price?: number | null
          status?: 'new' | 'processing' | 'completed' | 'cancelled'
          notes?: string | null
          whatsapp_sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      order_status: 'new' | 'processing' | 'completed' | 'cancelled'
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
