'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('არასწორი იმეილი ან პაროლი')
      setLoading(false)
      return
    }

    router.push('/admin/products')
    router.refresh()
  }

  return (
    <html lang="ka">
      <body style={{ margin: 0, background: '#0f0f0f', color: '#f0ede8', fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '100%',
          maxWidth: '380px',
          padding: '2.5rem',
          background: '#1a1a1a',
          borderRadius: '16px',
          border: '1px solid #2a2a2a',
        }}>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '1.4rem', color: '#f0ede8', marginBottom: '0.25rem' }}>
              Anna&apos;s Story
            </div>
            <div style={{ color: '#555', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Admin Panel
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.4rem' }}>
                იმეილი
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="admin@annas-story.ge"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem',
                  background: '#111',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#f0ede8',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.4rem' }}>
                პაროლი
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem',
                  background: '#111',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#f0ede8',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {error && (
              <div style={{
                padding: '0.65rem 0.75rem',
                background: 'rgba(248,113,113,0.1)',
                border: '1px solid rgba(248,113,113,0.3)',
                borderRadius: '8px',
                color: '#f87171',
                fontSize: '0.85rem',
              }}>
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
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem',
                transition: 'background 0.2s',
              }}
            >
              {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
              შესვლა
            </button>
          </form>
        </div>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          input:focus { border-color: #555 !important; }
        `}</style>
      </body>
    </html>
  )
}
