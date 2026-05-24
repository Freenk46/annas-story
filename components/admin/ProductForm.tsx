'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, X } from 'lucide-react'
import ImageUpload from './ImageUpload'
import { createClient } from '../../lib/supabase/client'
import type { Tables } from '../../types/database'
import type { ProductFormData } from '../../types/admin'

type Props = {
  product?: Tables<'products'>
}

const TABS = ['ka', 'ru', 'en'] as const
type Tab   = typeof TABS[number]

const tabLabel: Record<Tab, string> = { ka: 'ქართული', ru: 'Русский', en: 'English' }

const emptyForm: ProductFormData = {
  slug: '', category_id: null,
  name_ka: '', name_ru: '', name_en: '',
  description_ka: '', description_ru: '', description_en: '',
  price: 0, sizes: [], colors: [], images: [],
  is_active: true, is_featured: false, sort_order: 0,
}

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default function ProductForm({ product }: Props) {
  const router = useRouter()
  const [form, setForm]           = useState<ProductFormData>(product
    ? {
        slug: product.slug,
        category_id: product.category_id,
        name_ka: product.name_ka,
        name_ru: product.name_ru,
        name_en: product.name_en,
        description_ka: product.description_ka ?? '',
        description_ru: product.description_ru ?? '',
        description_en: product.description_en ?? '',
        price: Number(product.price),
        sizes: product.sizes,
        colors: product.colors,
        images: product.images,
        is_active: product.is_active,
        is_featured: product.is_featured,
        sort_order: product.sort_order,
      }
    : emptyForm
  )
  const [activeTab, setActiveTab] = useState<Tab>('ka')
  const [categories, setCategories] = useState<Tables<'categories'>[]>([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [sizeInput, setSizeInput]  = useState('')
  const [colorInput, setColorInput] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => {
      setCategories(data ?? [])
    })
  }, [])

  const set = <K extends keyof ProductFormData>(key: K, val: ProductFormData[K]) =>
    setForm(f => ({ ...f, [key]: val }))

  const addTag = (field: 'sizes' | 'colors', val: string) => {
    const v = val.trim()
    if (!v || form[field].includes(v)) return
    set(field, [...form[field], v])
  }

  const removeTag = (field: 'sizes' | 'colors', val: string) =>
    set(field, form[field].filter(x => x !== val))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const url    = product ? `/api/admin/products/${product.id}` : '/api/admin/products'
    const method = product ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (!res.ok) {
      const d = await res.json() as { error?: string }
      setError(d.error ?? 'შეცდომა')
      setLoading(false)
      return
    }

    router.push('/admin/products')
    router.refresh()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.65rem 0.75rem',
    background: '#111', border: '1px solid #2a2a2a',
    borderRadius: '8px', color: '#f0ede8',
    fontSize: '0.875rem', outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.75rem',
    color: '#666', marginBottom: '0.4rem',
    letterSpacing: '0.05em', textTransform: 'uppercase',
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>

        {/* ── Left column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Tabs: name + description */}
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.25rem', background: '#111', borderRadius: '8px', padding: '3px' }}>
              {TABS.map(tab => (
                <button key={tab} type="button" onClick={() => setActiveTab(tab)} style={{
                  flex: 1, padding: '0.4rem',
                  background: activeTab === tab ? '#2a2a2a' : 'transparent',
                  border: 'none', borderRadius: '6px',
                  color: activeTab === tab ? '#f0ede8' : '#555',
                  fontSize: '0.8rem', fontWeight: activeTab === tab ? 600 : 400,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  {tabLabel[tab]}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>სახელი</label>
                <input
                  value={form[`name_${activeTab}`]}
                  onChange={e => {
                    set(`name_${activeTab}`, e.target.value)
                    if (activeTab === 'en' && !product) {
                      set('slug', slugify(e.target.value))
                    }
                  }}
                  style={inputStyle}
                  placeholder={`სახელი ${tabLabel[activeTab]}-ად`}
                />
              </div>
              <div>
                <label style={labelStyle}>აღწერა</label>
                <textarea
                  value={form[`description_${activeTab}`]}
                  onChange={e => set(`description_${activeTab}`, e.target.value)}
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder={`აღწერა ${tabLabel[activeTab]}-ად`}
                />
              </div>
            </div>
          </div>

          {/* Sizes + Colors */}
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {([['sizes', sizeInput, setSizeInput], ['colors', colorInput, setColorInput]] as const).map(([field, inputVal, setInputVal]) => (
                <div key={field}>
                  <label style={labelStyle}>{field === 'sizes' ? 'ზომები' : 'ფერები'}</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem' }}>
                    {form[field].map(v => (
                      <span key={v} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                        padding: '0.2rem 0.5rem 0.2rem 0.75rem',
                        background: '#2a2a2a', borderRadius: '100px',
                        fontSize: '0.8rem', color: '#f0ede8',
                      }}>
                        {v}
                        <button type="button" onClick={() => removeTag(field, v)} style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: '#555', padding: 0, display: 'flex',
                        }}>
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault()
                        addTag(field, inputVal)
                        setInputVal('')
                      }
                    }}
                    placeholder={field === 'sizes' ? '200x220, Enter' : 'თეთრი, Enter'}
                    style={{ ...inputStyle, width: '100%' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '1.5rem' }}>
            <label style={{ ...labelStyle, marginBottom: '0.75rem' }}>ფოტოები</label>
            <ImageUpload
              bucket="products"
              value={form.images}
              onChange={urls => set('images', urls)}
              multiple
            />
          </div>
        </div>

        {/* ── Right column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '2rem' }}>

          {/* Slug */}
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '1.25rem' }}>
            <label style={labelStyle}>Slug</label>
            <input value={form.slug} onChange={e => set('slug', e.target.value)} style={inputStyle} required placeholder="product-slug" />
          </div>

          {/* Price */}
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '1.25rem' }}>
            <label style={labelStyle}>ფასი (₾)</label>
            <input
              type="number" min={0} step={0.01}
              value={form.price || ''}
              onChange={e => set('price', parseFloat(e.target.value) || 0)}
              style={inputStyle}
              required
            />
          </div>

          {/* Category */}
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '1.25rem' }}>
            <label style={labelStyle}>კატეგორია</label>
            <select
              value={form.category_id ?? ''}
              onChange={e => set('category_id', e.target.value || null)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="">— აირჩიე —</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name_ka}</option>
              ))}
            </select>
          </div>

          {/* Toggles */}
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {([
              ['is_active',   'აქტიური'],
              ['is_featured', 'გამორჩეული'],
            ] as const).map(([key, label]) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <span style={{ fontSize: '0.875rem', color: '#f0ede8' }}>{label}</span>
                <div
                  onClick={() => set(key, !form[key])}
                  style={{
                    width: '40px', height: '22px',
                    borderRadius: '11px',
                    background: form[key] ? '#34d399' : '#2a2a2a',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: '3px',
                    left: form[key] ? 'calc(100% - 17px)' : '3px',
                    width: '16px', height: '16px',
                    borderRadius: '50%', background: '#fff',
                    transition: 'left 0.2s',
                  }} />
                </div>
              </label>
            ))}
          </div>

          {/* Sort order */}
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '1.25rem' }}>
            <label style={labelStyle}>რიგითობა</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={e => set('sort_order', parseInt(e.target.value) || 0)}
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{ padding: '0.75rem', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '8px', color: '#f87171', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem',
              background: loading ? '#333' : '#f0ede8',
              color: loading ? '#666' : '#111',
              border: 'none', borderRadius: '8px',
              fontSize: '0.9rem', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              transition: 'background 0.2s',
            }}
          >
            {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
            {product ? 'შენახვა' : 'შექმნა'}
          </button>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } } select option { background: #1a1a1a; }`}</style>
        </div>
      </div>
    </form>
  )
}
