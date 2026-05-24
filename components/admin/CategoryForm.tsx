'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import ImageUpload from './ImageUpload'
import type { Tables } from '../../types/database'
import type { CategoryFormData } from '../../types/admin'

type Props = { category?: Tables<'categories'> }

const TABS = ['ka', 'ru', 'en'] as const
type Tab   = typeof TABS[number]
const tabLabel: Record<Tab, string> = { ka: 'ქართული', ru: 'Русский', en: 'English' }

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default function CategoryForm({ category }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<CategoryFormData>(category
    ? {
        slug: category.slug,
        name_ka: category.name_ka,
        name_ru: category.name_ru,
        name_en: category.name_en,
        cover_url: category.cover_url ?? '',
        sort_order: category.sort_order,
        is_active: category.is_active,
      }
    : { slug: '', name_ka: '', name_ru: '', name_en: '', cover_url: '', sort_order: 0, is_active: true }
  )
  const [activeTab, setActiveTab] = useState<Tab>('ka')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)

  const set = <K extends keyof CategoryFormData>(key: K, val: CategoryFormData[K]) =>
    setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const url    = category ? `/api/admin/categories/${category.id}` : '/api/admin/categories'
    const method = category ? 'PUT' : 'POST'

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

    router.push('/admin/categories')
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Names */}
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

            <label style={labelStyle}>სახელი</label>
            <input
              value={form[`name_${activeTab}`]}
              onChange={e => {
                set(`name_${activeTab}`, e.target.value)
                if (activeTab === 'en' && !category) {
                  set('slug', slugify(e.target.value))
                }
              }}
              style={inputStyle}
              required
              placeholder={`სახელი ${tabLabel[activeTab]}-ად`}
            />
          </div>

          {/* Cover image */}
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '1.5rem' }}>
            <label style={{ ...labelStyle, marginBottom: '0.75rem' }}>Cover ფოტო</label>
            <ImageUpload
              bucket="categories"
              value={form.cover_url ? [form.cover_url] : []}
              onChange={urls => set('cover_url', urls[0] ?? '')}
              multiple={false}
            />
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '2rem' }}>
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '1.25rem' }}>
            <label style={labelStyle}>Slug</label>
            <input value={form.slug} onChange={e => set('slug', e.target.value)} style={inputStyle} required />
          </div>

          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '1.25rem' }}>
            <label style={labelStyle}>რიგითობა</label>
            <input type="number" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} style={inputStyle} />
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
            {category ? 'შენახვა' : 'შექმნა'}
          </button>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </form>
  )
}
