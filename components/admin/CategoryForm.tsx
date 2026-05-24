'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import ImageUpload from './ImageUpload'
import { useAdminTheme, themeStyles } from '../../lib/adminTheme'
import type { Tables } from '../../types/database'
import type { CategoryFormData } from '../../types/admin'

type Props = { category?: Tables<'categories'> }

const TABS = ['ka', 'ru', 'en'] as const
type Tab   = typeof TABS[number]
const TAB_LABEL: Record<Tab, string> = { ka: 'ქართული', ru: 'Русский', en: 'English' }

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\x00-\x7F]/g, '')  // strip non-ASCII (Georgian etc)
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function fromCategory(c: Tables<'categories'>): CategoryFormData {
  return {
    slug: c.slug,
    name_ka: c.name_ka, name_ru: c.name_ru, name_en: c.name_en,
    collection_ka: c.collection_ka ?? '',
    description_ka: c.description_ka ?? '',
    description_ru: c.description_ru ?? '',
    description_en: c.description_en ?? '',
    cover_url: c.cover_url ?? '',
    year: c.year ?? null,
    sort_order: c.sort_order,
    is_active: c.is_active,
  }
}

const EMPTY: CategoryFormData = {
  slug: '', name_ka: '', name_ru: '', name_en: '',
  collection_ka: '', description_ka: '', description_ru: '', description_en: '',
  cover_url: '', year: null, sort_order: 0, is_active: true,
}

export default function CategoryForm({ category }: Props) {
  const router          = useRouter()
  const { isDark }      = useAdminTheme()
  const s               = themeStyles(isDark)
  const [form, setForm] = useState<CategoryFormData>(category ? fromCategory(category) : EMPTY)
  const [tab, setTab]   = useState<Tab>('ka')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const set = <K extends keyof CategoryFormData>(key: K, val: CategoryFormData[K]) =>
    setForm(f => ({ ...f, [key]: val }))

  // Auto-compute slug from name_en for preview
  const autoSlug = useMemo(() => {
    const base = form.name_en.trim() || form.name_ka.trim()
    return slugify(base) || form.slug
  }, [form.name_en, form.name_ka, form.slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Use existing slug for edits; auto-generate for new
    const slug = category ? form.slug : (autoSlug || `category-${Date.now()}`)

    const res = await fetch(
      category ? `/api/admin/categories/${category.id}` : '/api/admin/categories',
      {
        method: category ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form, slug,
          cover_url: form.cover_url || null,
          collection_ka: form.collection_ka || null,
          description_ka: form.description_ka || null,
          description_ru: form.description_ru || null,
          description_en: form.description_en || null,
          year: form.year || null,
        }),
      }
    )

    if (!res.ok) {
      const d = await res.json() as { error?: string }
      setError(d.error ?? 'შეცდომა')
      setLoading(false)
      return
    }

    router.push('/admin/categories')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2rem', alignItems: 'start' }}>

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
                  style={s.input}
                  required={tab === 'ka'}
                  placeholder={`სახელი ${TAB_LABEL[tab]}-ად`}
                />
              </div>

              <div>
                <label style={s.label}>აღწერა</label>
                <textarea
                  value={form[`description_${tab}`]}
                  onChange={e => set(`description_${tab}`, e.target.value)}
                  rows={4}
                  style={{ ...s.input, resize: 'vertical' }}
                  placeholder={`კატეგორიის აღწერა ${TAB_LABEL[tab]}-ად`}
                />
              </div>
            </div>
          </div>

          {/* Collection — single field (Georgian only) */}
          <div style={s.card}>
            <label style={s.label}>კოლექცია</label>
            <input
              value={form.collection_ka}
              onChange={e => set('collection_ka', e.target.value)}
              style={s.input}
              placeholder="მაგ: ტექსტილი"
            />
          </div>

          {/* Cover image */}
          <div style={s.card}>
            <label style={{ ...s.label, marginBottom: '0.75rem' }}>Cover ფოტო</label>
            <ImageUpload
              bucket="categories"
              value={form.cover_url ? [form.cover_url] : []}
              onChange={urls => set('cover_url', urls[0] ?? '')}
              multiple={false}
            />
          </div>
        </div>

        {/* ══ RIGHT ═════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', position: 'sticky', top: '2rem' }}>

          {/* Slug preview */}
          <div style={s.cardSm}>
            <label style={s.label}>Slug (ავტომატური)</label>
            <div style={{
              padding: '0.6rem 0.75rem',
              background: isDark ? '#0f0f0f' : '#faf7f2',
              border: `1px solid ${isDark ? '#2a2a2a' : '#e8e0d5'}`,
              borderRadius: '8px',
              fontSize: '0.8rem',
              color: isDark ? '#888' : '#aaa',
              fontFamily: 'monospace',
              letterSpacing: '0.03em',
              wordBreak: 'break-all',
            }}>
              {category ? form.slug : (autoSlug || '—')}
            </div>
            {category && (
              <input value={form.slug} onChange={e => set('slug', e.target.value)}
                style={{ ...s.input, marginTop: '0.5rem', fontSize: '0.8rem' }}
                placeholder="slug" />
            )}
          </div>

          {/* Year */}
          <div style={s.cardSm}>
            <label style={s.label}>წელი</label>
            <input type="number" value={form.year ?? ''} onChange={e => set('year', parseInt(e.target.value) || null)}
              style={s.input} placeholder="2025" />
          </div>

          {/* Sort order */}
          <div style={s.cardSm}>
            <label style={s.label}>რიგითობა</label>
            <input type="number" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)}
              style={s.input} />
          </div>

          {/* Active toggle */}
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
            {category ? 'შენახვა' : 'შექმნა'}
          </button>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </form>
  )
}
