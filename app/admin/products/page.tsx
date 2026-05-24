'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Search, Pencil, Trash2, Loader2 } from 'lucide-react'
import AdminHeader from '../../../components/admin/AdminHeader'
import { createClient } from '../../../lib/supabase/client'
import type { Tables } from '../../../types/database'

type Product = Tables<'products'> & { categories: { name_ka: string } | null }

export default function ProductsPage() {
  const [products, setProducts]   = useState<Product[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [deleting, setDeleting]   = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select('*, categories(name_ka)')
      .order('sort_order')
      .order('created_at', { ascending: false })
    setProducts((data ?? []) as Product[])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = products.filter(p =>
    p.name_ka.toLowerCase().includes(search.toLowerCase()) ||
    p.name_en.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (!confirm('წავშალოთ პროდუქტი?')) return
    setDeleting(id)
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    await load()
    setDeleting(null)
  }

  return (
    <div>
      <AdminHeader
        title="პროდუქტები"
        action={
          <Link href="/admin/products/new" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.55rem 1rem',
            background: '#f0ede8', color: '#111',
            borderRadius: '8px', border: 'none',
            textDecoration: 'none',
            fontSize: '0.875rem', fontWeight: 600,
            cursor: 'pointer',
          }}>
            <Plus size={16} />
            ახალი პროდუქტი
          </Link>
        }
      />

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '360px' }}>
        <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
        <input
          type="text"
          placeholder="პროდუქტის ძებნა..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            paddingLeft: '2.5rem',
            paddingRight: '0.75rem',
            paddingTop: '0.6rem',
            paddingBottom: '0.6rem',
            background: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: '8px',
            color: '#f0ede8',
            fontSize: '0.875rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: '#555' }}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <div style={{
          background: '#1a1a1a',
          border: '1px solid #2a2a2a',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                {['სახელი (KA)', 'კატეგორია', 'ფასი', 'სტატუსი', ''].map(h => (
                  <th key={h} style={{
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    color: '#555',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#555', fontSize: '0.875rem' }}>
                    პროდუქტები არ მოიძებნა
                  </td>
                </tr>
              ) : filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #1f1f1f' }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ fontWeight: 500, color: '#f0ede8', fontSize: '0.875rem' }}>{p.name_ka}</div>
                    <div style={{ color: '#555', fontSize: '0.75rem' }}>{p.slug}</div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#888', fontSize: '0.875rem' }}>
                    {p.categories?.name_ka ?? '—'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#f0ede8', fontSize: '0.875rem' }}>
                    {p.price} ₾
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '100px',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      background: p.is_active ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)',
                      color: p.is_active ? '#34d399' : '#f87171',
                    }}>
                      {p.is_active ? 'აქტიური' : 'დაფარული'}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <Link href={`/admin/products/${p.id}`} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '32px', height: '32px',
                        background: '#2a2a2a', border: 'none', borderRadius: '6px',
                        color: '#888', cursor: 'pointer', textDecoration: 'none',
                      }}>
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deleting === p.id}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          width: '32px', height: '32px',
                          background: '#2a2a2a', border: 'none', borderRadius: '6px',
                          color: deleting === p.id ? '#555' : '#f87171',
                          cursor: deleting === p.id ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {deleting === p.id
                          ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                          : <Trash2 size={14} />
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
