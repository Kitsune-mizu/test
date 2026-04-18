/**
 * Cart Server Actions
 * Handles all cart operations: add, remove, update, clear
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  successResponse,
  errorResponse,
  ERROR_CODES,
  checkAuthenticated,
} from "@/lib/server-action-response";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/lib/constants";
import type { ActionResponse } from "@/lib/server-action-response";

/**
 * Add item to cart or increase quantity if already exists
 */
export async function addToCartAction(
  productId: string,
  quantity: number = 1
): Promise<ActionResponse<{ message: string }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("[v0] addToCartAction - User:", user?.id, "Product:", productId, "Qty:", quantity);

    const authError = checkAuthenticated(user?.id);
    if (authError && !authError.success) {
      console.warn("[v0] Authentication failed for add to cart");
      return authError;
    }

    if (!productId || quantity < 1) {
      console.warn("[v0] Invalid product or quantity");
      return errorResponse(
        "Invalid product or quantity",
        ERROR_CODES.VALIDATION_ERROR
      );
    }

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

  const { data: existingItem, error: selectError } = await supabase
    .from("cart")
    .select("id, quantity")
    .eq("user_id", user!.id)
    .eq("product_id", productId)
    .single();

  if (selectError && selectError.code !== "PGRST116") {
    return errorResponse(
      ERROR_MESSAGES.NETWORK_ERROR,
      ERROR_CODES.DATABASE_ERROR
    );
  }

  if (existingItem) {
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

    console.log("[v0] Item added to cart successfully");
    revalidatePath("/", "layout");
    return successResponse({ message: SUCCESS_MESSAGES.CART_ITEM_ADDED });
  } catch (error) {
    console.error("[v0] addToCartAction exception:", error);
    return errorResponse(
      ERROR_MESSAGES.NETWORK_ERROR,
      ERROR_CODES.INTERNAL_ERROR
    );
  }
}

/**
 * Update cart item quantity
 */
export async function updateCartQuantityAction(
  cartItemId: string,
  quantity: number
): Promise<ActionResponse<{ message: string }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("[v0] updateCartQuantityAction - User:", user?.id, "Item:", cartItemId, "Qty:", quantity);

    const authError = checkAuthenticated(user?.id);
    if (authError && !authError.success) {
      console.warn("[v0] Authentication failed for update quantity");
      return authError;
    }

    if (!cartItemId || quantity < 0) {
      console.warn("[v0] Invalid cart item or quantity");
      return errorResponse(
        "Invalid cart item or quantity",
        ERROR_CODES.VALIDATION_ERROR
      );
    }

  if (quantity === 0) {
    return removeFromCartAction(cartItemId);
  }

  const { data: cartItem, error: selectError } = await supabase
    .from("cart")
    .select("id, product_id, products(stock)")
    .eq("id", cartItemId)
    .eq("user_id", user!.id)
    .single();

  if (selectError || !cartItem) {
    return errorResponse("Cart item not found", ERROR_CODES.NOT_FOUND);
  }

  const product = cartItem.products?.[0];

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

    console.log("[v0] Cart quantity updated successfully");
    revalidatePath("/", "layout");
    return successResponse({ message: "Cart updated" });
  } catch (error) {
    console.error("[v0] updateCartQuantityAction exception:", error);
    return errorResponse(
      ERROR_MESSAGES.NETWORK_ERROR,
      ERROR_CODES.INTERNAL_ERROR
    );
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCartAction(
  cartItemId: string
): Promise<ActionResponse<{ message: string }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("[v0] removeFromCartAction - User:", user?.id, "Item:", cartItemId);

    const authError = checkAuthenticated(user?.id);
    if (authError && !authError.success) {
      console.warn("[v0] Authentication failed for remove from cart");
      return authError;
    }

    if (!cartItemId) {
      console.warn("[v0] Invalid cart item");
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

    console.log("[v0] Item removed from cart successfully");
    revalidatePath("/", "layout");
    return successResponse({ message: SUCCESS_MESSAGES.CART_ITEM_REMOVED });
  } catch (error) {
    console.error("[v0] removeFromCartAction exception:", error);
    return errorResponse(
      ERROR_MESSAGES.NETWORK_ERROR,
      ERROR_CODES.INTERNAL_ERROR
    );
  }
}

/**
 * Clear all items from cart
 */
export async function clearCartAction(): Promise<ActionResponse<{ message: string }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("[v0] clearCartAction - User:", user?.id);

    const authError = checkAuthenticated(user?.id);
    if (authError && !authError.success) {
      console.warn("[v0] Authentication failed for clear cart");
      return authError;
    }

    const { error: deleteError } = await supabase
      .from("cart")
      .delete()
      .eq("user_id", user!.id);

    if (deleteError) {
      console.error("[v0] Clear cart error:", deleteError);
      return errorResponse(
        ERROR_MESSAGES.NETWORK_ERROR,
        ERROR_CODES.DATABASE_ERROR
      );
    }

    console.log("[v0] Cart cleared successfully");
    revalidatePath("/", "layout");
    return successResponse({ message: "Cart cleared" });
  } catch (error) {
    console.error("[v0] clearCartAction exception:", error);
    return errorResponse(
      ERROR_MESSAGES.NETWORK_ERROR,
      ERROR_CODES.INTERNAL_ERROR
    );
  }
}
