"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addToCartAction(productId: string, quantity: number = 1) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  // Check if product exists and has stock
  const { data: product } = await supabase
    .from("products")
    .select("id, stock")
    .eq("id", productId)
    .single();

  if (!product) {
    return { error: "Product not found" };
  }

  if (product.stock < quantity) {
    return { error: "Not enough stock available" };
  }

  // Check if item already in cart
  const { data: existingItem } = await supabase
    .from("cart")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (existingItem) {
    // Update quantity
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > product.stock) {
      return { error: "Not enough stock available" };
    }

    const { error } = await supabase
      .from("cart")
      .update({ quantity: newQuantity })
      .eq("id", existingItem.id);

    if (error) return { error: error.message };
  } else {
    // Insert new item
    const { error } = await supabase.from("cart").insert({
      user_id: user.id,
      product_id: productId,
      quantity,
    });

    if (error) return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateCartQuantityAction(
  cartItemId: string,
  quantity: number,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  if (quantity < 1) {
    return removeFromCartAction(cartItemId);
  }

  // Get cart item with product info
  const { data: cartItem } = await supabase
    .from("cart")
    .select("id, product_id, products(stock)")
    .eq("id", cartItemId)
    .eq("user_id", user.id)
    .single();

  if (!cartItem) {
    return { error: "Cart item not found" };
  }

  const product = cartItem.products as { stock: number } | null;
  if (product && quantity > product.stock) {
    return { error: "Not enough stock available" };
  }

  const { error } = await supabase
    .from("cart")
    .update({ quantity })
    .eq("id", cartItemId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}

export async function removeFromCartAction(cartItemId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("cart")
    .delete()
    .eq("id", cartItemId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}

export async function clearCartAction() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase.from("cart").delete().eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}
