import type { ReactNode } from 'react'
import AdminSidebar from '../../components/admin/AdminSidebar'

export const metadata = { title: 'Admin — Anna\'s Story' }

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ka">
      <body style={{ margin: 0, background: '#0f0f0f', color: '#f0ede8', fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh' }}>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <AdminSidebar />
          <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto', minHeight: '100vh' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
