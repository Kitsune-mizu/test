"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function submitReviewAction(
  productId: string,
  rating: number,
  comment?: string
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  // Check if user already reviewed this product
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single()

  if (existingReview) {
    return { error: "You have already reviewed this product" }
  }

  const { error } = await supabase
    .from("reviews")
    .insert({
      user_id: user.id,
      product_id: productId,
      rating,
      comment: comment || null,
    })

  if (error) return { error: error.message }

  revalidatePath(`/products`, "layout")
  return { success: true }
}

export async function deleteReviewAction(reviewId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId)
    .eq("user_id", user.id)

  if (error) return { error: error.message }

  revalidatePath(`/products`, "layout")
  return { success: true }
}
