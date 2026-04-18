/**
 * Cart Server Actions
 * Handles all cart operations: add, remove, update, clear
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { CartItem } from "@/lib/types";
import {
  successResponse,
  errorResponse,
  ERROR_CODES,
  checkAuthenticated,
} from "@/lib/server-action-response";
import { ERROR_MESSAGES } from "@/lib/constants";
import type { ActionResponse } from "@/lib/server-action-response";

/**
 * Add item to cart or increase quantity if already exists
 */
export async function addToCartAction(
  productId: string,
  quantity: number = 1
): Promise<ActionResponse> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const authError = checkAuthenticated(user?.id);
  if (authError) return authError;

  if (!productId || quantity < 1) {
    return errorResponse(
      "Invalid product or quantity",
      ERROR_CODES.VALIDATION_ERROR
    );
  }

  // Check if product exists and has stock
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, stock")
    .eq("id", productId)
    .single();

  if (productError || !product) {
    return errorResponse(
      ERROR_MESSAGES.PRODUCT_NOT_FOUND,
      ERROR_CODES.NOT_FOUND
    );
  }

  if (product.stock < quantity) {
    return errorResponse(
      ERROR_MESSAGES.INSUFFICIENT_STOCK,
      ERROR_CODES.INSUFFICIENT_STOCK
    );
  }

  // Check if item already in cart
  const { data: existingItem, error: selectError } = await supabase
    .from("cart")
    .select("id, quantity")
    .eq("user_id", user!.id)
    .eq("product_id", productId)
    .single();

  if (selectError && selectError.code !== "PGRST116") {
    // PGRST116 means no rows found, which is expected
    return errorResponse(
      ERROR_MESSAGES.NETWORK_ERROR,
      ERROR_CODES.DATABASE_ERROR
    );
  }

  if (existingItem) {
    // Update quantity
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > product.stock) {
      return errorResponse(
        ERROR_MESSAGES.INSUFFICIENT_STOCK,
        ERROR_CODES.INSUFFICIENT_STOCK
      );
    }

    const { error: updateError } = await supabase
      .from("cart")
      .update({ quantity: newQuantity })
      .eq("id", existingItem.id);

    if (updateError) {
      return errorResponse(
        ERROR_MESSAGES.NETWORK_ERROR,
        ERROR_CODES.DATABASE_ERROR
      );
    }
  } else {
    // Insert new item
    const { error: insertError } = await supabase.from("cart").insert({
      user_id: user!.id,
      product_id: productId,
      quantity,
    });

    if (insertError) {
      return errorResponse(
        ERROR_MESSAGES.NETWORK_ERROR,
        ERROR_CODES.DATABASE_ERROR
      );
    }
  }

  revalidatePath("/", "layout");
  return successResponse({ message: ERROR_MESSAGES.CART_ITEM_ADDED });
}

/**
 * Update cart item quantity
 */
export async function updateCartQuantityAction(
  cartItemId: string,
  quantity: number
): Promise<ActionResponse> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const authError = checkAuthenticated(user?.id);
  if (authError) return authError;

  if (!cartItemId || quantity < 0) {
    return errorResponse(
      "Invalid cart item or quantity",
      ERROR_CODES.VALIDATION_ERROR
    );
  }

  if (quantity === 0) {
    return removeFromCartAction(cartItemId);
  }

  // Get cart item with product info
  const { data: cartItem, error: selectError } = await supabase
    .from("cart")
    .select("id, product_id, products(stock)")
    .eq("id", cartItemId)
    .eq("user_id", user!.id)
    .single();

  if (selectError || !cartItem) {
    return errorResponse(
      "Cart item not found",
      ERROR_CODES.NOT_FOUND
    );
  }

  const product = cartItem.products as { stock: number } | null;
  if (!product || quantity > product.stock) {
    return errorResponse(
      ERROR_MESSAGES.INSUFFICIENT_STOCK,
      ERROR_CODES.INSUFFICIENT_STOCK
    );
  }

  const { error: updateError } = await supabase
    .from("cart")
    .update({ quantity })
    .eq("id", cartItemId)
    .eq("user_id", user!.id);

  if (updateError) {
    return errorResponse(
      ERROR_MESSAGES.NETWORK_ERROR,
      ERROR_CODES.DATABASE_ERROR
    );
  }

  revalidatePath("/", "layout");
  return successResponse();
}

/**
 * Remove item from cart
 */
export async function removeFromCartAction(
  cartItemId: string
): Promise<ActionResponse> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const authError = checkAuthenticated(user?.id);
  if (authError) return authError;

  if (!cartItemId) {
    return errorResponse(
      "Invalid cart item",
      ERROR_CODES.VALIDATION_ERROR
    );
  }

  const { error: deleteError } = await supabase
    .from("cart")
    .delete()
    .eq("id", cartItemId)
    .eq("user_id", user!.id);

  if (deleteError) {
    return errorResponse(
      ERROR_MESSAGES.NETWORK_ERROR,
      ERROR_CODES.DATABASE_ERROR
    );
  }

  revalidatePath("/", "layout");
  return successResponse({ message: ERROR_MESSAGES.CART_ITEM_REMOVED });
}

/**
 * Clear all items from cart
 */
export async function clearCartAction(): Promise<ActionResponse> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const authError = checkAuthenticated(user?.id);
  if (authError) return authError;

  const { error: deleteError } = await supabase
    .from("cart")
    .delete()
    .eq("user_id", user!.id);

  if (deleteError) {
    return errorResponse(
      ERROR_MESSAGES.NETWORK_ERROR,
      ERROR_CODES.DATABASE_ERROR
    );
  }

  revalidatePath("/", "layout");
  return successResponse();
}
