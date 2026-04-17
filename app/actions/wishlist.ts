"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function toggleWishlistAction(productId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  // Check if already in wishlist
  const { data: existingItem } = await supabase
    .from("wishlist")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single()

  if (existingItem) {
    // Remove from wishlist
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("id", existingItem.id)

    if (error) return { error: error.message }
    
    revalidatePath("/", "layout")
    return { success: true, added: false }
  } else {
    // Add to wishlist
    const { error } = await supabase
      .from("wishlist")
      .insert({
        user_id: user.id,
        product_id: productId,
      })

    if (error) return { error: error.message }

    revalidatePath("/", "layout")
    return { success: true, added: true }
  }
}

export async function getWishlistIdsAction() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { data: [] }
  }

  const { data, error } = await supabase
    .from("wishlist")
    .select("product_id")
    .eq("user_id", user.id)

  if (error) return { error: error.message, data: [] }

  return { data: data.map((item) => item.product_id) }
}

export async function removeFromWishlistAction(wishlistItemId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("wishlist")
    .delete()
    .eq("id", wishlistItemId)
    .eq("user_id", user.id)

  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { success: true }
}
