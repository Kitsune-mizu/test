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
// Import ActionResponse bisa dihapus jika tidak digunakan secara eksplisit lagi

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
      // PERBAIKAN 1: Gunakan tipe yang sesuai dengan kembalian asli fungsinya
      const result = (await getWishlistIdsAction()) as { 
        data?: string[]; 
        error?: string; 
      };
      
      if (result.data) {
        setWishlistIds(result.data);
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
      const result = (await toggleWishlistAction(productId)) as {
        success?: boolean;
        error?: string;
        added?: boolean;
      };

      if (result.error) {
        if (result.error === "Not authenticated") {
          toast.error("Please sign in to use wishlist");
          router.push("/auth/login");
        } else {
          toast.error(result.error || "Failed to update wishlist");
        }
      } else if (result.success) {
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
