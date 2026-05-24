'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'

type Props = {
  bucket: 'products' | 'categories'
  value: string[]
  onChange: (urls: string[]) => void
  multiple?: boolean
}

export default function ImageUpload({ bucket, value, onChange, multiple = false }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (files: FileList) => {
    setUploading(true)
    setError(null)

    try {
      const urls: string[] = []
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('bucket', bucket)

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })

        if (!res.ok) {
          const data = await res.json() as { error?: string }
          throw new Error(data.error ?? 'Upload failed')
        }

        const data = await res.json() as { url: string }
        urls.push(data.url)
      }

      onChange(multiple ? [...value, ...urls] : urls)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const remove = (url: string) => {
    onChange(value.filter(u => u !== url))
  }

  return (
    <div>
      {/* Preview grid */}
      {value.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: '0.5rem',
          marginBottom: '0.75rem',
        }}>
          {value.map(url => (
            <div key={url} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', background: '#111' }}>
              <Image src={url} alt="" fill style={{ objectFit: 'cover' }} />
              <button
                type="button"
                onClick={() => remove(url)}
                style={{
                  position: 'absolute', top: '4px', right: '4px',
                  background: 'rgba(0,0,0,0.7)',
                  border: 'none', borderRadius: '50%',
                  width: '22px', height: '22px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#fff',
                }}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        style={{
          width: '100%',
          padding: '1.5rem',
          border: '1.5px dashed #333',
          borderRadius: '10px',
          background: '#111',
          cursor: uploading ? 'not-allowed' : 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#666',
          transition: 'border-color 0.2s, color 0.2s',
        }}
        onMouseEnter={e => {
          if (!uploading) {
            e.currentTarget.style.borderColor = '#555'
            e.currentTarget.style.color = '#999'
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#333'
          e.currentTarget.style.color = '#666'
        }}
      >
        {uploading
          ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
          : <Upload size={20} />
        }
        <span style={{ fontSize: '0.8rem' }}>
          {uploading ? 'იტვირთება...' : 'ფოტოს ატვირთვა'}
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={e => e.target.files && handleUpload(e.target.files)}
      />

      {error && (
        <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.5rem' }}>{error}</p>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
