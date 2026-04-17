"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { addToCartAction, updateCartQuantityAction, removeFromCartAction } from "@/app/actions/cart"

export function useCartActions() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const addToCart = async (productId: string, quantity: number = 1) => {
    setLoadingId(productId)
    startTransition(async () => {
      const result = await addToCartAction(productId, quantity)
      if (result.error) {
        if (result.error === "Not authenticated") {
          toast.error("Please sign in to add items to cart")
          router.push("/auth/login")
        } else {
          toast.error(result.error)
        }
      } else {
        toast.success("Added to cart")
        router.refresh()
      }
      setLoadingId(null)
    })
  }

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    setLoadingId(cartItemId)
    startTransition(async () => {
      const result = await updateCartQuantityAction(cartItemId, quantity)
      if (result.error) {
        toast.error(result.error)
      } else {
        router.refresh()
      }
      setLoadingId(null)
    })
  }

  const removeFromCart = async (cartItemId: string) => {
    setLoadingId(cartItemId)
    startTransition(async () => {
      const result = await removeFromCartAction(cartItemId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Removed from cart")
        router.refresh()
      }
      setLoadingId(null)
    })
  }

  return {
    addToCart,
    updateQuantity,
    removeFromCart,
    isLoading: isPending,
    loadingId,
  }
}
