import { Suspense } from 'react'
import CatalogContent from './CatalogContent'

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ink" />}>
      <CatalogContent />
    </Suspense>
  )
}
