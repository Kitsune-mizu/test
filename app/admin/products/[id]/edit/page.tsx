import { ProductForm } from "@/components/admin/product-form"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export default async function AdminEditProductPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single()

  if (!product) {
    notFound()
  }

  return <ProductForm mode="edit" productId={params.id} />
}
