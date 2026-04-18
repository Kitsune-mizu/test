/**
 * useWishlistActions Hook
 * Manages wishlist operations with loading states, retry logic, and user feedback
 */

"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import {
  toggleWishlistAction,
  getWishlistIdsAction,
} from "@/app/actions/wishlist";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

/**
 * Hook for managing wishlist operations
 * Handles fetching wishlist items and toggling wishlist state with retry logic
 */
export function useWishlistActions() {
  const router = useRouter();
  const { isAuthenticated, isSessionValid } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  /**
   * Fetch user's current wishlist on mount with retry logic
   */
  const fetchWishlistIds = useCallback(async (attempt = 1) => {
    if (!isAuthenticated || !isSessionValid) {
      setIsInitialized(true);
      return;
    }

    try {
      console.log("[v0] Fetching wishlist - attempt", attempt);
      const result = (await getWishlistIdsAction()) as {
        data?: string[];
        error?: string;
      };

      if (result.data) {
        setWishlistIds(result.data);
        setRetryCount(0);
        console.log("[v0] Wishlist fetched successfully:", result.data.length, "items");
      } else if (result.error && attempt < MAX_RETRIES) {
        console.warn(`[v0] Wishlist fetch failed (${attempt}/${MAX_RETRIES}):`, result.error);
        // Retry with exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY * Math.pow(2, attempt - 1))
        );
        setRetryCount(attempt);
        await fetchWishlistIds(attempt + 1);
      } else {
        console.error("[v0] Final wishlist fetch failed:", result.error);
        toast.error("Failed to load wishlist");
      }
      setIsInitialized(true);
    } catch (error) {
      console.error("[v0] Wishlist fetch error:", error);
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY * Math.pow(2, attempt - 1))
        );
        setRetryCount(attempt);
        await fetchWishlistIds(attempt + 1);
      } else {
        setIsInitialized(true);
        toast.error("Failed to load wishlist after retries");
      }
    }
  }, [isAuthenticated, isSessionValid]);

  useEffect(() => {
    fetchWishlistIds();
  }, [isAuthenticated, isSessionValid, fetchWishlistIds]);

  /**
   * Toggle product in wishlist (add/remove) with retry logic
   */
  const toggleWishlist = useCallback(
    (productId: string) => {
      // Check authentication before attempting
      if (!isAuthenticated) {
        toast.error("Please sign in to use wishlist");
        router.push("/auth/login");
        return;
      }

      if (!isSessionValid) {
        toast.error("Session expired, please sign in again");
        router.push("/auth/login");
        return;
      }

      setLoadingId(productId);
      startTransition(async () => {
        try {
          console.log("[v0] Toggling wishlist for product:", productId);
          const result = (await toggleWishlistAction(productId)) as {
            success?: boolean;
            error?: string;
            added?: boolean;
          };

          if (result.error) {
            console.error("[v0] Wishlist toggle error:", result.error);
            if (
              result.error === "Not authenticated" ||
              result.error.includes("UNAUTHENTICATED")
            ) {
              toast.error("Please sign in to use wishlist");
              router.push("/auth/login");
            } else {
              toast.error(result.error || "Failed to update wishlist");
            }
          } else if (result.success) {
            // Optimistic update
            if (result.added) {
              setWishlistIds((prev) => [...prev, productId]);
              toast.success("Added to wishlist");
            } else {
              setWishlistIds((prev) => prev.filter((id) => id !== productId));
              toast.success("Removed from wishlist");
            }
            console.log("[v0] Wishlist updated successfully");
            router.refresh();
          }
        } catch (error) {
          console.error("[v0] Wishlist toggle exception:", error);
          toast.error("Failed to update wishlist");
        } finally {
          setLoadingId(null);
        }
      });
    },
    [isAuthenticated, isSessionValid, router]
  );

  return {
    toggleWishlist,
    wishlistIds,
    isLoading: isPending,
    loadingId,
    isInitialized: isInitialized && !isPending,
    retryCount,
    isInWishlist: useCallback(
      (productId: string) => wishlistIds.includes(productId),
      [wishlistIds]
    ),
  };
}
