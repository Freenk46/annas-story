import AdminHeader from '../../../../components/admin/AdminHeader'
import ProductForm from '../../../../components/admin/ProductForm'

export const metadata = { title: 'ახალი პროდუქტი — Admin' }

export default function NewProductPage() {
  return (
    <div>
      <AdminHeader title="ახალი პროდუქტი" />
      <ProductForm />
    </div>
  )
}
