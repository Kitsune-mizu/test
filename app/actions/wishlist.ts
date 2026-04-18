"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  errorResponse,
  successResponse,
  ERROR_CODES,
  type ActionResponse,
} from "@/lib/server-action-response";

export async function toggleWishlistAction(
  productId: string
): Promise<ActionResponse<{ added: boolean }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.warn("[v0] Wishlist toggle: User not authenticated");
      return errorResponse("Not authenticated", ERROR_CODES.UNAUTHORIZED);
    }

    // Validate product ID
    if (!productId || typeof productId !== "string") {
      return errorResponse("Invalid product ID", ERROR_CODES.VALIDATION_ERROR);
    }

    console.log("[v0] Toggle wishlist - User:", user.id, "Product:", productId);

    // Check if already in wishlist
    const { data: existingItem, error: selectError } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      // PGRST116 = no rows found
      console.error("[v0] Wishlist select error:", selectError);
      return errorResponse("Database error", ERROR_CODES.DATABASE_ERROR);
    }

    if (existingItem) {
      // Remove from wishlist
      const { error: deleteError } = await supabase
        .from("wishlist")
        .delete()
        .eq("id", existingItem.id)
        .eq("user_id", user.id); // Add user_id check for safety

      if (deleteError) {
        console.error("[v0] Wishlist delete error:", deleteError);
        return errorResponse(deleteError.message, ERROR_CODES.DATABASE_ERROR);
      }

      console.log("[v0] Removed from wishlist:", productId);
      revalidatePath("/", "layout");
      return successResponse({ added: false });
    } else {
      // Add to wishlist
      const { error: insertError } = await supabase.from("wishlist").insert({
        user_id: user.id,
        product_id: productId,
      });

      if (insertError) {
        console.error("[v0] Wishlist insert error:", insertError);
        return errorResponse(insertError.message, ERROR_CODES.DATABASE_ERROR);
      }

      console.log("[v0] Added to wishlist:", productId);
      revalidatePath("/", "layout");
      return successResponse({ added: true });
    }
  } catch (error) {
    console.error("[v0] Wishlist toggle exception:", error);
    return errorResponse(
      "Failed to update wishlist",
      ERROR_CODES.INTERNAL_ERROR
    );
  }
}

export async function getWishlistIdsAction(): Promise<ActionResponse<string[]>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("[v0] Get wishlist IDs: User not authenticated");
      return successResponse([]);
    }

    console.log("[v0] Fetching wishlist IDs for user:", user.id);

    const { data, error } = await supabase
      .from("wishlist")
      .select("product_id")
      .eq("user_id", user.id);

    if (error) {
      console.error("[v0] Wishlist fetch error:", error);
      return errorResponse(error.message, ERROR_CODES.DATABASE_ERROR);
    }

    const wishlistIds = (data || []).map((item: any) => item.product_id);
    console.log("[v0] Fetched", wishlistIds.length, "wishlist items");
    return successResponse(wishlistIds);
  } catch (error) {
    console.error("[v0] Get wishlist IDs exception:", error);
    return errorResponse(
      "Failed to fetch wishlist",
      ERROR_CODES.INTERNAL_ERROR
    );
  }
}

export async function removeFromWishlistAction(
  wishlistItemId: string
): Promise<ActionResponse<{ success: true }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.warn("[v0] Remove from wishlist: User not authenticated");
      return errorResponse("Not authenticated", ERROR_CODES.UNAUTHORIZED);
    }

    // Validate ID
    if (!wishlistItemId || typeof wishlistItemId !== "string") {
      return errorResponse(
        "Invalid wishlist item ID",
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    console.log("[v0] Removing from wishlist - Item:", wishlistItemId);

    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("id", wishlistItemId)
      .eq("user_id", user.id);

    if (error) {
      console.error("[v0] Wishlist delete error:", error);
      return errorResponse(error.message, ERROR_CODES.DATABASE_ERROR);
    }

    console.log("[v0] Successfully removed from wishlist");
    revalidatePath("/", "layout");
    return successResponse({ success: true });
  } catch (error) {
    console.error("[v0] Remove from wishlist exception:", error);
    return errorResponse(
      "Failed to remove from wishlist",
      ERROR_CODES.INTERNAL_ERROR
    );
  }
}
