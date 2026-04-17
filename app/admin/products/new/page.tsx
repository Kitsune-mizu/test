import { Suspense } from "react"
import { ProductEditForm } from "@/components/admin/product-edit-form"
import { JapaneseSkeleton } from "@/components/loaders/japanese-loader"

export const metadata = {
  title: "Add New Product",
  description: "Create a new product for your store",
}

export default function AdminNewProductPage() {
  return (
    <Suspense fallback={<JapaneseSkeleton />}>
      <div className="space-y-6 p-6">
        <ProductEditForm mode="create" />
      </div>
    </Suspense>
  )
}
