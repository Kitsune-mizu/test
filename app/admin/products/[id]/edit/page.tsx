import { Suspense } from "react";
import { ProductEditForm } from "@/components/admin/product-edit-form";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { JapaneseSkeleton } from "@/components/loaders/japanese-loader";

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    notFound();
  }

  return (
    <Suspense fallback={<JapaneseSkeleton />}>
      <div className="space-y-6 p-6">
        <ProductEditForm mode="edit" product={product} productId={id} />
      </div>
    </Suspense>
  );
}
