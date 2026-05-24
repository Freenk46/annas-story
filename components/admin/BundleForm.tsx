'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, X } from 'lucide-react'
import ImageUpload from './ImageUpload'
import { createClient } from '../../lib/supabase/client'
import type { Tables } from '../../types/database'
import type { BundleFormData } from '../../types/admin'

type Props = {
  bundle?: Tables<'bundles'> & { bundle_products?: { product_id: string }[] }
}

const TABS = ['ka', 'ru', 'en'] as const
type Tab   = typeof TABS[number]
const tabLabel: Record<Tab, string> = { ka: 'ქართული', ru: 'Русский', en: 'English' }

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default function BundleForm({ bundle }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<BundleFormData>(bundle
    ? {
        slug: bundle.slug,
        name_ka: bundle.name_ka, name_ru: bundle.name_ru, name_en: bundle.name_en,
        description_ka: bundle.description_ka ?? '',
        description_ru: bundle.description_ru ?? '',
        description_en: bundle.description_en ?? '',
        price: Number(bundle.price),
        original_price: bundle.original_price ? Number(bundle.original_price) : null,
        cover_url: bundle.cover_url ?? '',
        is_active: bundle.is_active,
        sort_order: bundle.sort_order,
        product_ids: bundle.bundle_products?.map(bp => bp.product_id) ?? [],
      }
    : {
        slug: '', name_ka: '', name_ru: '', name_en: '',
        description_ka: '', description_ru: '', description_en: '',
        price: 0, original_price: null, cover_url: '',
        is_active: true, sort_order: 0, product_ids: [],
      }
  )
  const [activeTab, setActiveTab]   = useState<Tab>('ka')
  const [products, setProducts]     = useState<{ id: string; name_ka: string; price: number }[]>([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('products').select('id, name_ka, price').order('name_ka').then(({ data }) => {
      setProducts((data ?? []) as { id: string; name_ka: string; price: number }[])
    })
  }, [])

  const set = <K extends keyof BundleFormData>(key: K, val: BundleFormData[K]) =>
    setForm(f => ({ ...f, [key]: val }))

  const toggleProduct = (id: string) => {
    set('product_ids', form.product_ids.includes(id)
      ? form.product_ids.filter(p => p !== id)
      : [...form.product_ids, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const url    = bundle ? `/api/admin/bundles/${bundle.id}` : '/api/admin/bundles'
    const method = bundle ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, cover_url: form.cover_url || null }),
    })

    if (!res.ok) {
      const d = await res.json() as { error?: string }
      setError(d.error ?? 'შეცდომა')
      setLoading(false)
      return
    }

    router.push('/admin/bundles')
    router.refresh()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.65rem 0.75rem',
    background: '#111', border: '1px solid #2a2a2a',
    borderRadius: '8px', color: '#f0ede8',
    fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.75rem', color: '#666',
    marginBottom: '0.4rem', letterSpacing: '0.05em', textTransform: 'uppercase',
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Name + description */}
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.25rem', background: '#111', borderRadius: '8px', padding: '3px' }}>
              {TABS.map(tab => (
                <button key={tab} type="button" onClick={() => setActiveTab(tab)} style={{
                  flex: 1, padding: '0.4rem',
                  background: activeTab === tab ? '#2a2a2a' : 'transparent',
                  border: 'none', borderRadius: '6px',
                  color: activeTab === tab ? '#f0ede8' : '#555',
                  fontSize: '0.8rem', fontWeight: activeTab === tab ? 600 : 400,
                  cursor: 'pointer',
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
                    if (activeTab === 'en' && !bundle) set('slug', slugify(e.target.value))
                  }}
                  style={inputStyle} required
                />
              </div>
              <div>
                <label style={labelStyle}>აღწერა</label>
                <textarea
                  value={form[`description_${activeTab}`]}
                  onChange={e => set(`description_${activeTab}`, e.target.value)}
                  rows={3} style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          {/* Products list */}
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '1.5rem' }}>
            <label style={{ ...labelStyle, marginBottom: '0.75rem' }}>
              პროდუქტები ({form.product_ids.length} არჩეული)
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '240px', overflowY: 'auto' }}>
              {products.map(p => {
                const checked = form.product_ids.includes(p.id)
                return (
                  <label key={p.id} style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.5rem 0.75rem',
                    background: checked ? '#2a2a2a' : 'transparent',
                    borderRadius: '8px', cursor: 'pointer',
                  }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleProduct(p.id)}
                      style={{ accentColor: '#34d399', width: '16px', height: '16px' }}
                    />
                    <span style={{ flex: 1, color: '#f0ede8', fontSize: '0.875rem' }}>{p.name_ka}</span>
                    <span style={{ color: '#555', fontSize: '0.8rem' }}>{p.price} ₾</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Cover */}
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '1.5rem' }}>
            <label style={{ ...labelStyle, marginBottom: '0.75rem' }}>Cover ფოტო</label>
            <ImageUpload
              bucket="categories"
              value={form.cover_url ? [form.cover_url] : []}
              onChange={urls => set('cover_url', urls[0] ?? '')}
            />
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '2rem' }}>
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '1.25rem' }}>
            <label style={labelStyle}>Slug</label>
            <input value={form.slug} onChange={e => set('slug', e.target.value)} style={inputStyle} required />
          </div>

          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>ფასი (₾)</label>
              <input type="number" min={0} step={0.01} value={form.price || ''} onChange={e => set('price', parseFloat(e.target.value) || 0)} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>ოდ. ფასი (₾)</label>
              <input type="number" min={0} step={0.01} value={form.original_price ?? ''} onChange={e => set('original_price', parseFloat(e.target.value) || null)} style={inputStyle} placeholder="სურვილისამებრ" />
            </div>
          </div>

          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '1.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <span style={{ fontSize: '0.875rem', color: '#f0ede8' }}>აქტიური</span>
              <div onClick={() => set('is_active', !form.is_active)} style={{
                width: '40px', height: '22px', borderRadius: '11px',
                background: form.is_active ? '#34d399' : '#2a2a2a',
                position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
              }}>
                <div style={{
                  position: 'absolute', top: '3px',
                  left: form.is_active ? 'calc(100% - 17px)' : '3px',
                  width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
                  transition: 'left 0.2s',
                }} />
              </div>
            </label>
          </div>

          {error && (
            <div style={{ padding: '0.75rem', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '8px', color: '#f87171', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            padding: '0.75rem', background: loading ? '#333' : '#f0ede8',
            color: loading ? '#666' : '#111', border: 'none', borderRadius: '8px',
            fontSize: '0.9rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          }}>
            {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
            {bundle ? 'შენახვა' : 'შექმნა'}
          </button>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </form>
  )
}
