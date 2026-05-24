import { createClient } from '../../../../lib/supabase/server'
import AdminHeader from '../../../../components/admin/AdminHeader'
import ProductForm from '../../../../components/admin/ProductForm'
import { notFound } from 'next/navigation'
import type { Tables } from '../../../../types/database'

export const metadata = { title: 'პროდუქტის რედაქტირება — Admin' }

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }   = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!data) notFound()

  const product = data as unknown as Tables<'products'>

  return (
    <div>
      <AdminHeader title={`${product.name_ka} — რედაქტირება`} />
      <ProductForm product={product} />
    </div>
  )
}
