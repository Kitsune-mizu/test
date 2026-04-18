/**
 * useCartActions Hook
 * Manages cart operations with loading states and user feedback
 */

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  addToCartAction,
  updateCartQuantityAction,
  removeFromCartAction,
} from "@/app/actions/cart";
import { FloatingCartItem } from "@/components/cart/floating-cart-item";
import { ERROR_MESSAGES } from "@/lib/constants";
import type { ActionResponse } from "@/lib/server-action-response";

/**
 * Hook for managing cart operations
 * Handles adding, updating, and removing items with loading states and toast notifications
 */
export function useCartActions() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showFloatingItem, setShowFloatingItem] = useState(false);

  /**
   * Add product to cart
   */
  const addToCart = async (productId: string, quantity: number = 1) => {
    setLoadingId(productId);
    startTransition(async () => {
      const result = (await addToCartAction(
        productId,
        quantity
      )) as ActionResponse;

      if (result.error) {
        handleError(result.error, result.code);
      } else {
        setShowFloatingItem(true);
        setTimeout(() => setShowFloatingItem(false), 1200);

        toast.success(ERROR_MESSAGES.CART_ITEM_ADDED, {
          description: "Item added to your cart",
        });
        router.refresh();
      }
      setLoadingId(null);
    });
  };

  /**
   * Update cart item quantity
   */
  const updateQuantity = async (cartItemId: string, quantity: number) => {
    setLoadingId(cartItemId);
    startTransition(async () => {
      const result = (await updateCartQuantityAction(
        cartItemId,
        quantity
      )) as ActionResponse;

      if (result.error) {
        handleError(result.error, result.code);
      } else {
        router.refresh();
      }
      setLoadingId(null);
    });
  };

  /**
   * Remove item from cart
   */
  const removeFromCart = async (cartItemId: string) => {
    setLoadingId(cartItemId);
    startTransition(async () => {
      const result = (await removeFromCartAction(
        cartItemId
      )) as ActionResponse;

      if (result.error) {
        handleError(result.error, result.code);
      } else {
        toast.success(ERROR_MESSAGES.CART_ITEM_REMOVED);
        router.refresh();
      }
      setLoadingId(null);
    });
  };

  /**
   * Handle action errors with appropriate user feedback
   */
  const handleError = (error: string, code?: string) => {
    if (code === "UNAUTHENTICATED") {
      toast.error("Please sign in to manage your cart");
      router.push("/auth/login");
    } else {
      toast.error(error);
    }
  };

  return {
    addToCart,
    updateQuantity,
    removeFromCart,
    isLoading: isPending,
    loadingId,
    showFloatingItem,
  };
}
