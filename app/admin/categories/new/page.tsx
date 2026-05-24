import AdminHeader from '../../../../components/admin/AdminHeader'
import CategoryForm from '../../../../components/admin/CategoryForm'

export const metadata = { title: 'ახალი კატეგორია — Admin' }

export default function NewCategoryPage() {
  return (
    <div>
      <AdminHeader title="ახალი კატეგორია" />
      <CategoryForm />
    </div>
  )
}
