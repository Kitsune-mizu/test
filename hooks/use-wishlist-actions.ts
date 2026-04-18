/**
 * useWishlistActions Hook
 * Manages wishlist operations with loading states and user feedback
 */

"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  toggleWishlistAction,
  getWishlistIdsAction,
} from "@/app/actions/wishlist";
import type { ActionResponse } from "@/lib/server-action-response";

/**
 * Hook for managing wishlist operations
 * Handles fetching wishlist items and toggling wishlist state with loading states
 */
export function useWishlistActions() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Fetch user's current wishlist on mount
   */
  useEffect(() => {
    const fetchWishlistIds = async () => {
      const result = (await getWishlistIdsAction()) as ActionResponse;
      if (result.data) {
        setWishlistIds(result.data as string[]);
      }
      setIsInitialized(true);
    };
    fetchWishlistIds();
  }, []);

  /**
   * Toggle product in wishlist (add/remove)
   */
  const toggleWishlist = async (productId: string) => {
    setLoadingId(productId);
    startTransition(async () => {
      const result = (await toggleWishlistAction(
        productId
      )) as ActionResponse & { added?: boolean };

      if (result.error) {
        if (result.code === "UNAUTHENTICATED") {
          toast.error("Please sign in to use wishlist");
          router.push("/auth/login");
        } else {
          toast.error(result.error);
        }
      } else {
        if (result.added) {
          setWishlistIds((prev) => [...prev, productId]);
          toast.success("Added to wishlist");
        } else {
          setWishlistIds((prev) => prev.filter((id) => id !== productId));
          toast.success("Removed from wishlist");
        }
        router.refresh();
      }
      setLoadingId(null);
    });
  };

  return {
    toggleWishlist,
    wishlistIds,
    isLoading: isPending,
    loadingId,
    isInitialized,
    isInWishlist: (productId: string) => wishlistIds.includes(productId),
  };
}
