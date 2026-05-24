'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import AdminHeader from '../../../components/admin/AdminHeader'
import { createClient } from '../../../lib/supabase/client'
import type { Tables } from '../../../types/database'

type Bundle = Tables<'bundles'>

export default function BundlesPage() {
  const [bundles, setBundles]   = useState<Bundle[]>([])
  const [loading, setLoading]   = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase.from('bundles').select('*').order('sort_order')
    setBundles(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id: string) => {
    if (!confirm('წავშალოთ ნაკრები?')) return
    setDeleting(id)
    await fetch(`/api/admin/bundles/${id}`, { method: 'DELETE' })
    await load()
    setDeleting(null)
  }

  return (
    <div>
      <AdminHeader
        title="ნაკრებები"
        action={
          <Link href="/admin/bundles/new" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.55rem 1rem',
            background: '#f0ede8', color: '#111',
            borderRadius: '8px', textDecoration: 'none',
            fontSize: '0.875rem', fontWeight: 600,
          }}>
            <Plus size={16} />
            ახალი ნაკრები
          </Link>
        }
      />

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: '#555' }}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <div style={{
          background: '#1a1a1a', border: '1px solid #2a2a2a',
          borderRadius: '12px', overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                {['', 'სახელი', 'ფასი', 'ოდ. ფასი', 'სტატუსი', ''].map((h, i) => (
                  <th key={i} style={{
                    padding: '0.75rem 1rem', textAlign: 'left',
                    fontSize: '0.75rem', color: '#555', fontWeight: 500,
                    letterSpacing: '0.05em', textTransform: 'uppercase',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bundles.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#555', fontSize: '0.875rem' }}>ნაკრებები არ არის</td></tr>
              ) : bundles.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid #1f1f1f' }}>
                  <td style={{ padding: '0.75rem 1rem', width: '56px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', background: '#111', position: 'relative' }}>
                      {b.cover_url && <Image src={b.cover_url} alt={b.name_ka} fill style={{ objectFit: 'cover' }} />}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ fontWeight: 500, color: '#f0ede8', fontSize: '0.875rem' }}>{b.name_ka}</div>
                    <div style={{ color: '#555', fontSize: '0.75rem' }}>{b.slug}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#f0ede8', fontSize: '0.875rem' }}>{b.price} ₾</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#555', fontSize: '0.875rem' }}>
                    {b.original_price ? `${b.original_price} ₾` : '—'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem', borderRadius: '100px',
                      fontSize: '0.75rem', fontWeight: 500,
                      background: b.is_active ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)',
                      color: b.is_active ? '#34d399' : '#f87171',
                    }}>
                      {b.is_active ? 'აქტიური' : 'დაფარული'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <Link href={`/admin/bundles/${b.id}`} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '32px', height: '32px',
                        background: '#2a2a2a', borderRadius: '6px',
                        color: '#888', textDecoration: 'none',
                      }}>
                        <Pencil size={14} />
                      </Link>
                      <button onClick={() => handleDelete(b.id)} disabled={deleting === b.id} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '32px', height: '32px',
                        background: '#2a2a2a', border: 'none', borderRadius: '6px',
                        color: deleting === b.id ? '#555' : '#f87171',
                        cursor: deleting === b.id ? 'not-allowed' : 'pointer',
                      }}>
                        {deleting === b.id ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={14} />}
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
