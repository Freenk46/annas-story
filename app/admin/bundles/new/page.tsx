import AdminHeader from '../../../../components/admin/AdminHeader'
import BundleForm from '../../../../components/admin/BundleForm'

export const metadata = { title: 'ახალი ნაკრები — Admin' }

export default function NewBundlePage() {
  return (
    <div>
      <AdminHeader title="ახალი ნაკრები" />
      <BundleForm />
    </div>
  )
}
