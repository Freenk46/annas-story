'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, X } from 'lucide-react'
import ImageUpload from './ImageUpload'
import { createClient } from '../../lib/supabase/client'
import { useAdminTheme, themeStyles } from '../../lib/adminTheme'
import type { Tables } from '../../types/database'
import type { ProductFormData } from '../../types/admin'

type Props = { product?: Tables<'products'> }

const TABS = ['ka', 'ru', 'en'] as const
type Tab   = typeof TABS[number]
const TAB_LABEL: Record<Tab, string> = { ka: 'ქართული', ru: 'Русский', en: 'English' }

const PRESET_SIZES  = ['140×200', '160×200', '200×220', '220×240', '50×70', '70×70']
const PRESET_COLORS = ['თეთრი', 'ბეჟი', 'რუხი', 'მოვარდისფრო', 'ყავისფერი', 'შავი', 'კრემისფერი', 'ლურჯი']

const EMPTY: ProductFormData = {
  slug: '', category_id: null,
  name_ka: '', name_ru: '', name_en: '',
  subtitle_ka: '', subtitle_ru: '', subtitle_en: '',
  description_ka: '', description_ru: '', description_en: '',
  technical_info_ka: '', technical_info_ru: '', technical_info_en: '',
  price: 0, original_price: null,
  sizes: [], colors: [], images: [],
  collection: '', year: null,
  is_active: true, is_featured: false, sort_order: 0,
}

function fromProduct(p: Tables<'products'>): ProductFormData {
  return {
    slug: p.slug,
    category_id: p.category_id,
    name_ka: p.name_ka, name_ru: p.name_ru, name_en: p.name_en,
    subtitle_ka: p.subtitle_ka ?? '', subtitle_ru: p.subtitle_ru ?? '', subtitle_en: p.subtitle_en ?? '',
    description_ka: p.description_ka ?? '', description_ru: p.description_ru ?? '', description_en: p.description_en ?? '',
    technical_info_ka: p.technical_info_ka ?? '', technical_info_ru: p.technical_info_ru ?? '', technical_info_en: p.technical_info_en ?? '',
    price: Number(p.price), original_price: p.original_price ? Number(p.original_price) : null,
    sizes: p.sizes, colors: p.colors, images: p.images,
    collection: p.collection ?? '', year: p.year ?? null,
    is_active: p.is_active, is_featured: p.is_featured, sort_order: p.sort_order,
  }
}

type CategoryRow = { id: string; slug: string; name_ka: string }

export default function ProductForm({ product }: Props) {
  const router              = useRouter()
  const { isDark }          = useAdminTheme()
  const s                   = themeStyles(isDark)
  const [form, setForm]     = useState<ProductFormData>(product ? fromProduct(product) : EMPTY)
  const [tab, setTab]       = useState<Tab>('ka')
  const [categories, setCats] = useState<CategoryRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState<string | null>(null)
  const [sizeInput, setSizeInput]   = useState('')
  const [colorInput, setColorInput] = useState('')

  useEffect(() => {
    createClient().from('categories').select('id, slug, name_ka').order('sort_order')
      .then(({ data }) => setCats((data ?? []) as CategoryRow[]))
  }, [])

  const set = <K extends keyof ProductFormData>(key: K, val: ProductFormData[K]) =>
    setForm(f => ({ ...f, [key]: val }))

  const toggleTag = (field: 'sizes' | 'colors', val: string) => {
    set(field, form[field].includes(val)
      ? form[field].filter(x => x !== val)
      : [...form[field], val]
    )
  }

  const addCustomTag = (field: 'sizes' | 'colors', val: string) => {
    const v = val.trim()
    if (!v || form[field].includes(v)) return
    set(field, [...form[field], v])
  }

  const discount = form.original_price && form.price && form.original_price > form.price
    ? Math.round((1 - form.price / form.original_price) * 100)
    : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    let slug = form.slug
    if (!slug) {
      const cat = categories.find(c => c.id === form.category_id)
      slug = cat ? `${cat.slug}-${Date.now()}` : `product-${Date.now()}`
    }

    const url    = product ? `/api/admin/products/${product.id}` : '/api/admin/products'
    const method = product ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form, slug,
        collection: form.collection || null,
        year: form.year || null,
        original_price: form.original_price || null,
        subtitle_ka: form.subtitle_ka || null,
        subtitle_ru: form.subtitle_ru || null,
        subtitle_en: form.subtitle_en || null,
        technical_info_ka: form.technical_info_ka || null,
        technical_info_ru: form.technical_info_ru || null,
        technical_info_en: form.technical_info_en || null,
      }),
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

  // ── Pill helper ──────────────────────────────────
  const pillSelected: React.CSSProperties = {
    padding: '0.3rem 0.75rem',
    borderRadius: '100px',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    background: isDark ? '#f0ede8' : '#2c2c2c',
    color: isDark ? '#111' : '#f0ede8',
    transition: 'all 0.15s',
  }
  const pillUnselected: React.CSSProperties = {
    ...pillSelected,
    background: isDark ? '#1f1f1f' : '#f0ede8',
    color: isDark ? '#888' : '#666',
    fontWeight: 400,
  }

  const toggleStyle: React.CSSProperties = {
    width: '40px', height: '22px', borderRadius: '11px',
    position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
    border: 'none',
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>

        {/* ══ LEFT ══════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Language tabs */}
          <div style={s.card}>
            {/* Tab bar */}
            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.25rem', ...s.tabsBar }}>
              {TABS.map(t => (
                <button key={t} type="button" onClick={() => setTab(t)} style={{
                  flex: 1, padding: '0.4rem',
                  borderRadius: '6px', border: 'none',
                  fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.15s',
                  ...(tab === t ? s.tabActive : s.tabInactive),
                  fontWeight: tab === t ? 600 : 400,
                }}>
                  {TAB_LABEL[t]}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

              {/* Name */}
              <div>
                <label style={s.label}>სახელი</label>
                <input
                  value={form[`name_${tab}`]}
                  onChange={e => set(`name_${tab}`, e.target.value)}
                  style={s.input}
                  placeholder={`სახელი ${TAB_LABEL[tab]}-ად`}
                  required={tab === 'ka'}
                />
              </div>

              {/* Subtitle */}
              <div>
                <label style={s.label}>subtitle</label>
                <input
                  value={form[`subtitle_${tab}`]}
                  onChange={e => set(`subtitle_${tab}`, e.target.value)}
                  style={s.input}
                  placeholder="მაგ: პერკალის საბნის გარსი"
                />
              </div>

              {/* Description */}
              <div>
                <label style={s.label}>აღწერა</label>
                <textarea
                  value={form[`description_${tab}`]}
                  onChange={e => set(`description_${tab}`, e.target.value)}
                  rows={4}
                  style={{ ...s.input, resize: 'vertical' }}
                  placeholder={`აღწერა ${TAB_LABEL[tab]}-ად`}
                />
              </div>

              {/* Technical info */}
              <div>
                <label style={s.label}>ტექნიკური ინფო (accordion-ში)</label>
                <textarea
                  value={form[`technical_info_${tab}`]}
                  onChange={e => set(`technical_info_${tab}`, e.target.value)}
                  rows={3}
                  style={{ ...s.input, resize: 'vertical' }}
                  placeholder="100% ბამბა, 200 ძაფი / სმ², ..."
                />
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div style={s.card}>
            <label style={{ ...s.label, marginBottom: '0.625rem' }}>ზომები</label>

            {/* Preset pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
              {PRESET_SIZES.map(sz => (
                <button key={sz} type="button" onClick={() => toggleTag('sizes', sz)}
                  style={form.sizes.includes(sz) ? pillSelected : pillUnselected}>
                  {sz}
                </button>
              ))}
            </div>

            {/* Selected custom / extra */}
            {form.sizes.filter(s => !PRESET_SIZES.includes(s)).length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                {form.sizes.filter(s => !PRESET_SIZES.includes(s)).map(v => (
                  <span key={v} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                    padding: '0.25rem 0.5rem 0.25rem 0.75rem',
                    background: isDark ? '#2a2a2a' : '#f0ede8',
                    borderRadius: '100px', fontSize: '0.8rem',
                    color: s.text.primary,
                  }}>
                    {v}
                    <button type="button" onClick={() => toggleTag('sizes', v)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.text.muted, padding: 0, display: 'flex' }}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Custom input */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                value={sizeInput}
                onChange={e => setSizeInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') { e.preventDefault(); addCustomTag('sizes', sizeInput); setSizeInput('') }
                }}
                placeholder="custom ზომა, Enter"
                style={{ ...s.input, flex: 1 }}
              />
              <button type="button" onClick={() => { addCustomTag('sizes', sizeInput); setSizeInput('') }}
                style={{
                  padding: '0 0.875rem', background: isDark ? '#2a2a2a' : '#f0ede8',
                  border: `1px solid ${isDark ? '#3a3a3a' : '#ddd'}`,
                  borderRadius: '8px', cursor: 'pointer',
                  color: s.text.secondary, fontSize: '0.8rem', whiteSpace: 'nowrap',
                }}>
                + დამატება
              </button>
            </div>
          </div>

          {/* Colors */}
          <div style={s.card}>
            <label style={{ ...s.label, marginBottom: '0.625rem' }}>ფერები</label>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
              {PRESET_COLORS.map(c => (
                <button key={c} type="button" onClick={() => toggleTag('colors', c)}
                  style={form.colors.includes(c) ? pillSelected : pillUnselected}>
                  {c}
                </button>
              ))}
            </div>

            {form.colors.filter(c => !PRESET_COLORS.includes(c)).length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                {form.colors.filter(c => !PRESET_COLORS.includes(c)).map(v => (
                  <span key={v} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                    padding: '0.25rem 0.5rem 0.25rem 0.75rem',
                    background: isDark ? '#2a2a2a' : '#f0ede8',
                    borderRadius: '100px', fontSize: '0.8rem',
                    color: s.text.primary,
                  }}>
                    {v}
                    <button type="button" onClick={() => toggleTag('colors', v)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.text.muted, padding: 0, display: 'flex' }}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                value={colorInput}
                onChange={e => setColorInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') { e.preventDefault(); addCustomTag('colors', colorInput); setColorInput('') }
                }}
                placeholder="custom ფერი, Enter"
                style={{ ...s.input, flex: 1 }}
              />
              <button type="button" onClick={() => { addCustomTag('colors', colorInput); setColorInput('') }}
                style={{
                  padding: '0 0.875rem', background: isDark ? '#2a2a2a' : '#f0ede8',
                  border: `1px solid ${isDark ? '#3a3a3a' : '#ddd'}`,
                  borderRadius: '8px', cursor: 'pointer',
                  color: s.text.secondary, fontSize: '0.8rem', whiteSpace: 'nowrap',
                }}>
                + დამატება
              </button>
            </div>
          </div>

          {/* Images */}
          <div style={s.card}>
            <label style={{ ...s.label, marginBottom: '0.75rem' }}>ფოტოები</label>
            <ImageUpload bucket="products" value={form.images} onChange={urls => set('images', urls)} multiple />
          </div>
        </div>

        {/* ══ RIGHT (sticky) ════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', position: 'sticky', top: '2rem' }}>

          {/* Collection + Year */}
          <div style={s.cardSm}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={s.label}>კოლექცია</label>
                <input value={form.collection} onChange={e => set('collection', e.target.value)}
                  style={s.input} placeholder="მაგ: ტექსტილი" />
              </div>
              <div>
                <label style={s.label}>წელი</label>
                <input type="number" value={form.year ?? ''} onChange={e => set('year', parseInt(e.target.value) || null)}
                  style={s.input} placeholder="2025" />
              </div>
            </div>
          </div>

          {/* Price + Original */}
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

          {/* Category */}
          <div style={s.cardSm}>
            <label style={s.label}>კატეგორია</label>
            <select value={form.category_id ?? ''} onChange={e => set('category_id', e.target.value || null)}
              style={{ ...s.input, cursor: 'pointer' }}>
              <option value="">— აირჩიე —</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name_ka}</option>
              ))}
            </select>
          </div>

          {/* Toggles */}
          <div style={{ ...s.cardSm, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {([['is_active', 'აქტიური'], ['is_featured', 'გამორჩეული']] as const).map(([key, label]) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <span style={{ fontSize: '0.875rem', color: s.text.primary }}>{label}</span>
                <div onClick={() => set(key, !form[key])} style={{
                  ...toggleStyle,
                  background: form[key] ? '#34d399' : (isDark ? '#2a2a2a' : '#ddd'),
                }}>
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
          <div style={s.cardSm}>
            <label style={s.label}>რიგითობა</label>
            <input type="number" value={form.sort_order}
              onChange={e => set('sort_order', parseInt(e.target.value) || 0)}
              style={s.input} />
          </div>

          {error && (
            <div style={{ padding: '0.75rem', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '8px', color: '#f87171', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            padding: '0.75rem',
            background: loading ? (isDark ? '#333' : '#ccc') : (isDark ? '#f0ede8' : '#2c2c2c'),
            color: loading ? (isDark ? '#666' : '#999') : (isDark ? '#111' : '#f0ede8'),
            border: 'none', borderRadius: '8px',
            fontSize: '0.9rem', fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            transition: 'background 0.2s',
          }}>
            {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
            {product ? 'შენახვა' : 'შექმნა'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        select option { background: ${isDark ? '#1a1a1a' : '#fff'}; }
      `}</style>
    </form>
  )
}
