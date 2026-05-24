'use client'

import { useState, useEffect, useCallback } from 'react'
import { Loader2, ChevronDown } from 'lucide-react'
import AdminHeader from '../../../components/admin/AdminHeader'
import { createClient } from '../../../lib/supabase/client'
import type { Tables } from '../../../types/database'
import type { OrderStatus } from '../../../types/admin'

type Order = Tables<'orders'>

const STATUS_TABS: { key: string; label: string }[] = [
  { key: 'all',        label: 'ყველა' },
  { key: 'new',        label: 'ახალი' },
  { key: 'processing', label: 'დამუშავება' },
  { key: 'completed',  label: 'დასრულებული' },
  { key: 'cancelled',  label: 'გაუქმებული' },
]

const STATUS_COLORS: Record<OrderStatus, { bg: string; color: string }> = {
  new:        { bg: 'rgba(96,165,250,0.15)', color: '#60a5fa' },
  processing: { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24' },
  completed:  { bg: 'rgba(52,211,153,0.15)', color: '#34d399' },
  cancelled:  { bg: 'rgba(248,113,113,0.15)', color: '#f87171' },
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'ახალი', processing: 'დამუშავება', completed: 'დასრულებული', cancelled: 'გაუქმებული',
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const c = STATUS_COLORS[status]
  return (
    <span style={{
      padding: '0.2rem 0.6rem',
      borderRadius: '100px',
      fontSize: '0.75rem',
      fontWeight: 500,
      background: c.bg,
      color: c.color,
    }}>
      {STATUS_LABELS[status]}
    </span>
  )
}

export default function OrdersPage() {
  const [orders, setOrders]         = useState<Order[]>([])
  const [loading, setLoading]       = useState(true)
  const [activeTab, setActiveTab]   = useState('all')
  const [selected, setSelected]     = useState<Order | null>(null)
  const [updating, setUpdating]     = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (activeTab !== 'all') query = query.eq('status', activeTab as OrderStatus)
    const { data } = await query
    setOrders(data ?? [])
    setLoading(false)
  }, [activeTab])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id: string, status: OrderStatus) => {
    setUpdating(true)
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    await load()
    setSelected(prev => prev ? { ...prev, status } : null)
    setUpdating(false)
  }

  const fmt = (dateStr: string) => new Date(dateStr).toLocaleString('ka-GE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <div>
      <AdminHeader title="შეკვეთები" />

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', background: '#1a1a1a', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
        {STATUS_TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setActiveTab(key)} style={{
            padding: '0.4rem 0.9rem',
            background: activeTab === key ? '#2a2a2a' : 'transparent',
            border: 'none', borderRadius: '7px',
            color: activeTab === key ? '#f0ede8' : '#555',
            fontSize: '0.8rem', fontWeight: activeTab === key ? 600 : 400,
            cursor: 'pointer', transition: 'all 0.15s',
          }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap: '1.5rem' }}>

        {/* Table */}
        <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: '#555' }}>
              <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                  {['თარიღი', 'მომხმარებელი', 'ჯამი', 'სტატუსი', ''].map((h, i) => (
                    <th key={i} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', color: '#555', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#555', fontSize: '0.875rem' }}>შეკვეთები არ არის</td></tr>
                ) : orders.map(o => (
                  <tr
                    key={o.id}
                    onClick={() => setSelected(selected?.id === o.id ? null : o)}
                    style={{
                      borderBottom: '1px solid #1f1f1f',
                      cursor: 'pointer',
                      background: selected?.id === o.id ? '#222' : 'transparent',
                      transition: 'background 0.15s',
                    }}
                  >
                    <td style={{ padding: '0.875rem 1rem', color: '#888', fontSize: '0.8rem' }}>{fmt(o.created_at)}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ fontWeight: 500, color: '#f0ede8', fontSize: '0.875rem' }}>{o.customer_name ?? '—'}</div>
                      <div style={{ color: '#555', fontSize: '0.75rem' }}>{o.customer_phone ?? ''}</div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: '#f0ede8', fontSize: '0.875rem' }}>
                      {o.total_price ? `${o.total_price} ₾` : '—'}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <StatusBadge status={o.status as OrderStatus} />
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: '#555' }}>
                      <ChevronDown size={14} style={{ transform: selected?.id === o.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '1.5rem', position: 'sticky', top: '2rem', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#f0ede8', marginBottom: '0.25rem' }}>{selected.customer_name ?? 'სახელი არ არის'}</div>
                <div style={{ color: '#555', fontSize: '0.8rem' }}>{selected.customer_phone ?? ''}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#555', marginBottom: '1rem' }}>{fmt(selected.created_at)}</div>

            {/* Items */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#555', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>ნივთები</div>
              {Array.isArray(selected.items) && (selected.items as Array<{ name?: string; quantity?: number; price?: number }>).map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #222', fontSize: '0.85rem' }}>
                  <span style={{ color: '#f0ede8' }}>{item.name ?? '—'} {item.quantity ? `× ${item.quantity}` : ''}</span>
                  <span style={{ color: '#888' }}>{item.price ? `${item.price} ₾` : ''}</span>
                </div>
              ))}
            </div>

            {selected.total_price && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#f0ede8', marginBottom: '1.25rem' }}>
                <span>სულ</span>
                <span>{selected.total_price} ₾</span>
              </div>
            )}

            {/* Status change */}
            <div>
              <div style={{ fontSize: '0.75rem', color: '#555', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>სტატუსის ცვლილება</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {(['new', 'processing', 'completed', 'cancelled'] as OrderStatus[]).map(s => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected.id, s)}
                    disabled={updating || selected.status === s}
                    style={{
                      padding: '0.5rem 0.75rem',
                      background: selected.status === s ? '#2a2a2a' : '#111',
                      border: `1px solid ${selected.status === s ? '#3a3a3a' : '#2a2a2a'}`,
                      borderRadius: '8px',
                      color: selected.status === s ? STATUS_COLORS[s].color : '#666',
                      fontSize: '0.8rem',
                      cursor: selected.status === s ? 'default' : 'pointer',
                      textAlign: 'left',
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                    }}
                  >
                    {updating && selected.status !== s && <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />}
                    {STATUS_LABELS[s]}
                    {selected.status === s && <span style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {selected.notes && (
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#111', borderRadius: '8px', fontSize: '0.8rem', color: '#888' }}>
                <strong style={{ color: '#555', display: 'block', marginBottom: '0.25rem' }}>შენიშვნა</strong>
                {selected.notes}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
