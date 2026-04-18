/**
 * useCartActions Hook
 * Manages cart operations with retry logic, error handling, and user feedback
 */

"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import {
  addToCartAction,
  updateCartQuantityAction,
  removeFromCartAction,
} from "@/app/actions/cart";
import type { ActionResponse } from "@/lib/server-action-response";

const MAX_RETRIES = 2;
const RETRY_DELAY = 500; // ms

/**
 * Hook for managing cart operations
 * Handles adding, updating, and removing items with retry logic and error handling
 */
export function useCartActions() {
  const router = useRouter();
  const { isAuthenticated, isSessionValid } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showFloatingItem, setShowFloatingItem] = useState(false);

  /**
   * Retry action with exponential backoff
   */
  const retryAction = async <T,>(
    action: () => Promise<ActionResponse<T>>,
    attempt = 1
  ): Promise<ActionResponse<T>> => {
    try {
      return await action();
    } catch (error) {
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY * Math.pow(2, attempt - 1))
        );
        return retryAction(action, attempt + 1);
      }
      throw error;
    }
  };

  /**
   * Handle action errors with appropriate user feedback
   */
  const handleError = useCallback(
    (error: string, code?: string) => {
      console.log("[v0] Cart action error:", error, "Code:", code);
      if (error === "Not authenticated" || code === "UNAUTHENTICATED") {
        toast.error("Please sign in to manage your cart");
        router.push("/auth/login");
      } else if (error.includes("Session")) {
        toast.error("Session expired, please sign in again");
        router.push("/auth/login");
      } else {
        toast.error(error);
      }
    },
    [router]
  );

  /**
   * Add product to cart with authentication check and retry
   */
  const addToCart = useCallback(
    (productId: string, quantity: number = 1) => {
      if (!isAuthenticated || !isSessionValid) {
        toast.error("Please sign in to add items to cart");
        router.push("/auth/login");
        return;
      }

      setLoadingId(productId);
      startTransition(async () => {
        try {
          console.log("[v0] Adding to cart:", productId, "qty:", quantity);
          const result = (await retryAction(() =>
            addToCartAction(productId, quantity) as Promise<ActionResponse>
          )) as ActionResponse;

          if (!result.success) {
            handleError(result.error, result.code);
          } else {
            setShowFloatingItem(true);
            setTimeout(() => setShowFloatingItem(false), 1200);
            toast.success("Item added to cart");
            console.log("[v0] Item added successfully");
            router.refresh();
          }
        } catch (error) {
          console.error("[v0] Add to cart exception:", error);
          handleError("Failed to add item to cart");
        } finally {
          setLoadingId(null);
        }
      });
    },
    [isAuthenticated, isSessionValid, router, handleError]
  );

  /**
   * Update cart item quantity with retry
   */
  const updateQuantity = useCallback(
    (cartItemId: string, quantity: number) => {
      if (!isAuthenticated || !isSessionValid) {
        toast.error("Please sign in to update cart");
        router.push("/auth/login");
        return;
      }

      setLoadingId(cartItemId);
      startTransition(async () => {
        try {
          console.log("[v0] Updating quantity:", cartItemId, "to:", quantity);
          const result = (await retryAction(() =>
            updateCartQuantityAction(cartItemId, quantity) as Promise<ActionResponse>
          )) as ActionResponse;

          if (!result.success) {
            handleError(result.error, result.code);
          } else {
            console.log("[v0] Quantity updated successfully");
            router.refresh();
          }
        } catch (error) {
          console.error("[v0] Update quantity exception:", error);
          handleError("Failed to update cart");
        } finally {
          setLoadingId(null);
        }
      });
    },
    [isAuthenticated, isSessionValid, router, handleError]
  );

  /**
   * Remove item from cart with retry
   */
  const removeFromCart = useCallback(
    (cartItemId: string) => {
      if (!isAuthenticated || !isSessionValid) {
        toast.error("Please sign in to remove items from cart");
        router.push("/auth/login");
        return;
      }

      setLoadingId(cartItemId);
      startTransition(async () => {
        try {
          console.log("[v0] Removing from cart:", cartItemId);
          const result = (await retryAction(() =>
            removeFromCartAction(cartItemId) as Promise<ActionResponse>
          )) as ActionResponse;

          if (!result.success) {
            handleError(result.error, result.code);
          } else {
            toast.success("Item removed from cart");
            console.log("[v0] Item removed successfully");
            router.refresh();
          }
        } catch (error) {
          console.error("[v0] Remove from cart exception:", error);
          handleError("Failed to remove item");
        } finally {
          setLoadingId(null);
        }
      });
    },
    [isAuthenticated, isSessionValid, router, handleError]
  );

  return {
    addToCart,
    updateQuantity,
    removeFromCart,
    isLoading: isPending,
    loadingId,
    showFloatingItem,
    isAuthenticated,
    isSessionValid,
  };
}
