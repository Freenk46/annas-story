import { createClient } from '../../../../lib/supabase/server'
import AdminHeader from '../../../../components/admin/AdminHeader'
import CategoryForm from '../../../../components/admin/CategoryForm'
import { notFound } from 'next/navigation'
import type { Tables } from '../../../../types/database'

export const metadata = { title: 'კატეგორიის რედაქტირება — Admin' }

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }   = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (!data) notFound()

  const category = data as unknown as Tables<'categories'>

  return (
    <div>
      <AdminHeader title={`${category.name_ka} — რედაქტირება`} />
      <CategoryForm category={category} />
    </div>
  )
}
