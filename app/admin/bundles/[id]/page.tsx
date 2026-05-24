import { createClient } from '../../../../lib/supabase/server'
import AdminHeader from '../../../../components/admin/AdminHeader'
import BundleForm from '../../../../components/admin/BundleForm'
import { notFound } from 'next/navigation'
import type { Tables } from '../../../../types/database'

type BundleWithProducts = Tables<'bundles'> & {
  bundle_products: { product_id: string; quantity: number }[]
}

export const metadata = { title: 'ნაკრების რედაქტირება — Admin' }

export default async function EditBundlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id }   = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('bundles')
    .select('*, bundle_products(product_id, quantity)')
    .eq('id', id)
    .single()

  if (!data) notFound()

  const bundle = data as unknown as BundleWithProducts

  return (
    <div>
      <AdminHeader title={`${bundle.name_ka} — რედაქტირება`} />
      <BundleForm bundle={bundle} />
    </div>
  )
}
