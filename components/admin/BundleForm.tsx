'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, X } from 'lucide-react'
import ImageUpload from './ImageUpload'
import { createClient } from '../../lib/supabase/client'
import { useAdminTheme, themeStyles } from '../../lib/adminTheme'
import type { Tables } from '../../types/database'
import type { BundleFormData } from '../../types/admin'

type Props = {
  bundle?: Tables<'bundles'> & { bundle_products?: { product_id: string }[] }
}

const TABS = ['ka', 'ru', 'en'] as const
type Tab   = typeof TABS[number]
const TAB_LABEL: Record<Tab, string> = { ka: 'ქართული', ru: 'Русский', en: 'English' }

function fromBundle(b: Tables<'bundles'> & { bundle_products?: { product_id: string }[] }): BundleFormData {
  return {
    slug: b.slug,
    name_ka: b.name_ka, name_ru: b.name_ru, name_en: b.name_en,
    subtitle_ka: b.subtitle_ka ?? '', subtitle_ru: b.subtitle_ru ?? '', subtitle_en: b.subtitle_en ?? '',
    description_ka: b.description_ka ?? '', description_ru: b.description_ru ?? '', description_en: b.description_en ?? '',
    price: Number(b.price), original_price: b.original_price ? Number(b.original_price) : null,
    cover_url: b.cover_url ?? '',
    items_list: b.items_list ?? [],
    is_active: b.is_active, sort_order: b.sort_order,
    product_ids: b.bundle_products?.map(bp => bp.product_id) ?? [],
  }
}

const EMPTY: BundleFormData = {
  slug: '', name_ka: '', name_ru: '', name_en: '',
  subtitle_ka: '', subtitle_ru: '', subtitle_en: '',
  description_ka: '', description_ru: '', description_en: '',
  price: 0, original_price: null, cover_url: '',
  items_list: [], is_active: true, sort_order: 0, product_ids: [],
}

type ProdRow = { id: string; name_ka: string; price: number }

export default function BundleForm({ bundle }: Props) {
  const router               = useRouter()
  const { isDark }           = useAdminTheme()
  const s                    = themeStyles(isDark)
  const [form, setForm]      = useState<BundleFormData>(bundle ? fromBundle(bundle) : EMPTY)
  const [tab, setTab]        = useState<Tab>('ka')
  const [products, setProducts] = useState<ProdRow[]>([])
  const [loading, setLoading]= useState(false)
  const [error, setError]    = useState<string | null>(null)
  const [itemInput, setItemInput] = useState('')

  useEffect(() => {
    createClient().from('products').select('id, name_ka, price').order('name_ka')
      .then(({ data }) => setProducts((data ?? []) as ProdRow[]))
  }, [])

  const set = <K extends keyof BundleFormData>(key: K, val: BundleFormData[K]) =>
    setForm(f => ({ ...f, [key]: val }))

  const toggleProduct = (id: string) => {
    set('product_ids', form.product_ids.includes(id)
      ? form.product_ids.filter(p => p !== id)
      : [...form.product_ids, id]
    )
  }

  const addItem = (val: string) => {
    const v = val.trim()
    if (!v || form.items_list.includes(v)) return
    set('items_list', [...form.items_list, v])
  }

  const removeItem = (val: string) => set('items_list', form.items_list.filter(x => x !== val))

  const discount = form.original_price && form.price && form.original_price > form.price
    ? Math.round((1 - form.price / form.original_price) * 100)
    : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const slug = bundle ? form.slug : `bundle-${Date.now()}`

    const res = await fetch(
      bundle ? `/api/admin/bundles/${bundle.id}` : '/api/admin/bundles',
      {
        method: bundle ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form, slug,
          cover_url: form.cover_url || null,
          original_price: form.original_price || null,
          subtitle_ka: form.subtitle_ka || null,
          subtitle_ru: form.subtitle_ru || null,
          subtitle_en: form.subtitle_en || null,
        }),
      }
    )

    if (!res.ok) {
      const d = await res.json() as { error?: string }
      setError(d.error ?? 'შეცდომა')
      setLoading(false)
      return
    }

    router.push('/admin/bundles')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>

        {/* ══ LEFT ══════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Language tabs */}
          <div style={s.card}>
            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.25rem', ...s.tabsBar }}>
              {TABS.map(t => (
                <button key={t} type="button" onClick={() => setTab(t)} style={{
                  flex: 1, padding: '0.4rem', borderRadius: '6px', border: 'none',
                  fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.15s',
                  ...(tab === t ? s.tabActive : s.tabInactive),
                  fontWeight: tab === t ? 600 : 400,
                }}>
                  {TAB_LABEL[t]}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label style={s.label}>სახელი</label>
                <input
                  value={form[`name_${tab}`]}
                  onChange={e => set(`name_${tab}`, e.target.value)}
                  style={s.input} required={tab === 'ka'}
                  placeholder={`სახელი ${TAB_LABEL[tab]}-ად`}
                />
              </div>
              <div>
                <label style={s.label}>subtitle</label>
                <input
                  value={form[`subtitle_${tab}`]}
                  onChange={e => set(`subtitle_${tab}`, e.target.value)}
                  style={s.input}
                  placeholder="მაგ: ყველაფერი სასტარტოდ"
                />
              </div>
              <div>
                <label style={s.label}>აღწერა</label>
                <textarea
                  value={form[`description_${tab}`]}
                  onChange={e => set(`description_${tab}`, e.target.value)}
                  rows={3} style={{ ...s.input, resize: 'vertical' }}
                  placeholder={`აღწერა ${TAB_LABEL[tab]}-ად`}
                />
              </div>
            </div>
          </div>

          {/* Items list */}
          <div style={s.card}>
            <label style={{ ...s.label, marginBottom: '0.75rem' }}>შემადგენლობა (✓ სია)</label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.75rem' }}>
              {form.items_list.map(item => (
                <div key={item} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.4rem 0.625rem',
                  background: isDark ? '#111' : '#f9f6f1',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: s.text.primary,
                }}>
                  <span style={{ color: '#34d399', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span style={{ flex: 1 }}>{item}</span>
                  <button type="button" onClick={() => removeItem(item)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: s.text.muted, padding: 0, display: 'flex',
                  }}>
                    <X size={14} />
                  </button>
                </div>
              ))}
              {form.items_list.length === 0 && (
                <p style={{ color: s.text.muted, fontSize: '0.8rem', margin: 0 }}>სია ცარიელია</p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                value={itemInput}
                onChange={e => setItemInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') { e.preventDefault(); addItem(itemInput); setItemInput('') }
                }}
                placeholder="მაგ: Duvet Cover (200×220)"
                style={{ ...s.input, flex: 1 }}
              />
              <button type="button" onClick={() => { addItem(itemInput); setItemInput('') }}
                style={{
                  padding: '0 0.875rem',
                  background: isDark ? '#2a2a2a' : '#f0ede8',
                  border: `1px solid ${isDark ? '#3a3a3a' : '#ddd'}`,
                  borderRadius: '8px', cursor: 'pointer',
                  color: s.text.secondary, fontSize: '0.8rem', whiteSpace: 'nowrap',
                }}>
                + დამატება
              </button>
            </div>
          </div>

          {/* Products */}
          <div style={s.card}>
            <label style={{ ...s.label, marginBottom: '0.625rem' }}>
              პროდუქტები ({form.product_ids.length} არჩეული)
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', maxHeight: '240px', overflowY: 'auto' }}>
              {products.map(p => {
                const checked = form.product_ids.includes(p.id)
                return (
                  <label key={p.id} style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.4rem 0.625rem',
                    background: checked ? (isDark ? '#2a2a2a' : '#f0ede8') : 'transparent',
                    borderRadius: '8px', cursor: 'pointer', transition: 'background 0.15s',
                  }}>
                    <input type="checkbox" checked={checked} onChange={() => toggleProduct(p.id)}
                      style={{ accentColor: '#34d399', width: '15px', height: '15px' }} />
                    <span style={{ flex: 1, color: s.text.primary, fontSize: '0.875rem' }}>{p.name_ka}</span>
                    <span style={{ color: s.text.muted, fontSize: '0.8rem' }}>{p.price} ₾</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Cover */}
          <div style={s.card}>
            <label style={{ ...s.label, marginBottom: '0.75rem' }}>Cover ფოტო</label>
            <ImageUpload
              bucket="categories"
              value={form.cover_url ? [form.cover_url] : []}
              onChange={urls => set('cover_url', urls[0] ?? '')}
            />
          </div>
        </div>

        {/* ══ RIGHT ═════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', position: 'sticky', top: '2rem' }}>

          {/* Price */}
          <div style={s.cardSm}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={s.label}>ფასი (₾)</label>
                <input type="number" min={0} step={0.01}
                  value={form.price || ''} onChange={e => set('price', parseFloat(e.target.value) || 0)}
                  style={s.input} required />
              </div>
              <div>
                <label style={{ ...s.label, display: 'flex', justifyContent: 'space-between' }}>
                  <span>ძველი ფასი (₾)</span>
                  {discount !== null && (
                    <span style={{
                      padding: '0.1rem 0.4rem', borderRadius: '4px',
                      background: 'rgba(52,211,153,0.15)', color: '#34d399',
                      fontSize: '0.7rem', fontWeight: 700,
                    }}>
                      -{discount}%
                    </span>
                  )}
                </label>
                <input type="number" min={0} step={0.01}
                  value={form.original_price ?? ''} onChange={e => set('original_price', parseFloat(e.target.value) || null)}
                  style={s.input} placeholder="სურვილისამებრ" />
              </div>
            </div>
          </div>

          {/* Active */}
          <div style={s.cardSm}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <span style={{ fontSize: '0.875rem', color: s.text.primary }}>აქტიური</span>
              <div onClick={() => set('is_active', !form.is_active)} style={{
                width: '40px', height: '22px', borderRadius: '11px',
                background: form.is_active ? '#34d399' : (isDark ? '#2a2a2a' : '#ddd'),
                position: 'relative', cursor: 'pointer', border: 'none', transition: 'background 0.2s',
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
            padding: '0.75rem',
            background: loading ? (isDark ? '#333' : '#ccc') : (isDark ? '#f0ede8' : '#2c2c2c'),
            color: loading ? '#666' : (isDark ? '#111' : '#f0ede8'),
            border: 'none', borderRadius: '8px',
            fontSize: '0.9rem', fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          }}>
            {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
            {bundle ? 'შენახვა' : 'შექმნა'}
          </button>

          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
            select option { background: ${isDark ? '#1a1a1a' : '#fff'}; }
          `}</style>
        </div>
      </div>
    </form>
  )
}
