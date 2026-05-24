import type { ReactNode } from 'react'
import AdminShell from '../../components/admin/AdminShell'

export const metadata = { title: 'Admin — Anna\'s Story' }

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ka">
      <body style={{ margin: 0 }}>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  )
}
