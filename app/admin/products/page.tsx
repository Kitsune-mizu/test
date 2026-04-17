import { createClient } from "@/lib/supabase/server"
import { Suspense } from "react"
import { JapaneseSkeleton } from "@/components/loaders/japanese-loader"
import { ProductsTable } from "@/components/admin/products-table-client"

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <Suspense fallback={<JapaneseSkeleton />}>
      <ProductsTable products={products || []} />
    </Suspense>
  )
}
