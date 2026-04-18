/**
 * Cart Items Component
 * Displays list of items in shopping cart with edit and remove options
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CartItem, Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useCartActions } from "@/hooks/use-cart-actions";

/**
 * Extended cart item type with product data
 */
interface CartItemWithProduct extends CartItem {
  product?: Product;
}

/**
 * Cart items component props
 */
interface CartItemsProps {
  /** Array of cart items to display */
  items: CartItemWithProduct[];
}

/**
 * Cart Items Component
 * Displays each cart item with quantity controls and remove button
 */
export function CartItems({ items }: CartItemsProps) {
  const { updateQuantity, removeFromCart, loadingId } = useCartActions();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-neutral-600 mb-4">Your cart is empty</p>
        <Link href="/products" className="text-blue-600 hover:underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        if (!item.product) return null;
        const product = item.product;
        const isLoading = loadingId === item.id;

        return (
          <div
            key={item.id}
            className="flex gap-4 p-4 bg-card rounded-xl border"
          >
            {/* Product Image */}
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                  No image
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-1 flex-col">
              <div className="flex justify-between">
                <div>
                  <Link
                    href={`/products/${product.slug}`}
                    className="font-medium hover:text-primary transition-colors line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <p className="text-lg font-bold text-primary mt-1">
                    {formatCurrency(product.price)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeFromCart(item.id)}
                  disabled={isLoading}
                  aria-label="Remove item from cart"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between mt-auto pt-2">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-r-none"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1 || isLoading}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-10 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-l-none"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={isLoading || item.quantity >= product.stock}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm font-semibold">
                  {formatCurrency(product.price * item.quantity)}
                </p>
              </div>

              {/* Stock Warning */}
              {item.quantity >= product.stock && product.stock > 0 && (
                <p className="text-xs text-yellow-600 mt-2">
                  Only {product.stock} items available
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
