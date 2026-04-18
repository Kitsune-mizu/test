/**
 * Cart Context
 * Manages global shopping cart state and provides cart management hooks
 */

"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { CartItem, Product } from "@/lib/types";

/**
 * Cart context value type
 */
export interface CartContextType {
  items: (CartItem & { product?: Product })[];
  isLoading: boolean;
  addItem: (item: CartItem & { product?: Product }) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
}

/**
 * Create cart context
 */
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Cart provider component props
 */
interface CartProviderProps {
  children: React.ReactNode;
  initialItems?: (CartItem & { product?: Product })[];
}

/**
 * Cart provider component
 * Manages shopping cart state for the application
 */
export function CartProvider({ children, initialItems = [] }: CartProviderProps) {
  const [items, setItems] = useState<(CartItem & { product?: Product })[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize mounted state and prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    setIsInitialized(true);
    console.log("[v0] Cart context initialized with", initialItems.length, "items");
  }, []);

  /**
   * Add item to cart or update quantity if already exists
   */
  const addItem = useCallback(
    (item: CartItem & { product?: Product }) => {
      console.log("[v0] Cart: Adding item", item.product_id, "qty:", item.quantity);
      setItems((prevItems) => {
        const existingItem = prevItems.find((i) => i.product_id === item.product_id);
        if (existingItem) {
          const updatedItems = prevItems.map((i) =>
            i.product_id === item.product_id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
          console.log("[v0] Cart: Item quantity updated to", existingItem.quantity + item.quantity);
          return updatedItems;
        }
        console.log("[v0] Cart: New item added, total items:", prevItems.length + 1);
        return [...prevItems, item];
      });
    },
    []
  );

  /**
   * Remove item from cart
   */
  const removeItem = useCallback((itemId: string) => {
    console.log("[v0] Cart: Removing item", itemId);
    setItems((prevItems) => {
      const filtered = prevItems.filter((i) => i.id !== itemId);
      console.log("[v0] Cart: Item removed, total items:", filtered.length);
      return filtered;
    });
  }, []);

  /**
   * Update item quantity
   */
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    console.log("[v0] Cart: Updating quantity for", itemId, "to", quantity);
    setItems((prevItems) =>
      quantity <= 0
        ? prevItems.filter((i) => i.id !== itemId)
        : prevItems.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  }, []);

  /**
   * Clear all items from cart
   */
  const clearCart = useCallback(() => {
    console.log("[v0] Cart: Clearing all items");
    setItems([]);
  }, []);

  /**
   * Get total item count
   */
  const getItemCount = useCallback(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    return count;
  }, [items]);

  const value: CartContextType = {
    items,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Hook to access cart context
 * @throws Error if used outside of CartProvider
 */
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

/**
 * Hook to get cart item count
 */
export function useCartItemCount(): number {
  const { getItemCount } = useCart();
  return getItemCount();
}
