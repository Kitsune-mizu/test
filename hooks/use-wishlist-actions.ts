"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  toggleWishlistAction,
  getWishlistIdsAction,
} from "@/app/actions/wishlist";

export function useWishlistActions() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlistIds = async () => {
      const result = await getWishlistIdsAction();
      if (result.data) {
        setWishlistIds(result.data);
      }
    };
    fetchWishlistIds();
  }, []);

  const toggleWishlist = async (productId: string) => {
    setLoadingId(productId);
    startTransition(async () => {
      const result = await toggleWishlistAction(productId);
      if (result.error) {
        if (result.error === "Not authenticated") {
          toast.error("Please sign in to add to wishlist");
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
  };
}
