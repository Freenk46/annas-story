'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import AdminHeader from '../../../components/admin/AdminHeader'
import { createClient } from '../../../lib/supabase/client'
import type { Tables } from '../../../types/database'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Tables<'categories'>[]>([])
  const [loading, setLoading]       = useState(true)
  const [deleting, setDeleting]     = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase.from('categories').select('*').order('sort_order')
    setCategories(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id: string) => {
    if (!confirm('წავშალოთ კატეგორია?')) return
    setDeleting(id)
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    await load()
    setDeleting(null)
  }

  return (
    <div>
      <AdminHeader
        title="კატეგორიები"
        action={
          <Link href="/admin/categories/new" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.55rem 1rem',
            background: '#f0ede8', color: '#111',
            borderRadius: '8px', textDecoration: 'none',
            fontSize: '0.875rem', fontWeight: 600,
          }}>
            <Plus size={16} />
            ახალი კატეგორია
          </Link>
        }
      />

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: '#555' }}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {categories.map(cat => (
            <div key={cat.id} style={{
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: '12px',
              overflow: 'hidden',
            }}>
              {/* Cover */}
              <div style={{ aspectRatio: '4/3', background: '#111', position: 'relative' }}>
                {cat.cover_url
                  ? <Image src={cat.cover_url} alt={cat.name_ka} fill style={{ objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '0.75rem' }}>ფოტო არ არის</div>
                }
                <span style={{
                  position: 'absolute', top: '8px', right: '8px',
                  padding: '0.15rem 0.5rem',
                  background: cat.is_active ? 'rgba(52,211,153,0.9)' : 'rgba(248,113,113,0.9)',
                  borderRadius: '100px', fontSize: '0.7rem', fontWeight: 600, color: '#111',
                }}>
                  {cat.is_active ? 'აქტ' : 'მაlen'}
                </span>
              </div>

              {/* Info */}
              <div style={{ padding: '0.875rem 1rem' }}>
                <div style={{ fontWeight: 600, color: '#f0ede8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{cat.name_ka}</div>
                <div style={{ color: '#555', fontSize: '0.75rem', marginBottom: '0.75rem' }}>{cat.slug}</div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link href={`/admin/categories/${cat.id}`} style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                    padding: '0.45rem',
                    background: '#2a2a2a', border: 'none', borderRadius: '6px',
                    color: '#888', fontSize: '0.8rem', textDecoration: 'none',
                  }}>
                    <Pencil size={13} /> რედ.
                  </Link>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    disabled={deleting === cat.id}
                    style={{
                      width: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: '#2a2a2a', border: 'none', borderRadius: '6px',
                      color: '#f87171', cursor: 'pointer',
                    }}
                  >
                    {deleting === cat.id
                      ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                      : <Trash2 size={13} />
                    }
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
