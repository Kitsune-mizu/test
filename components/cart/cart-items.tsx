"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { useCartActions } from "@/hooks/use-cart-actions";

interface CartItem {
  id: string;
  quantity: number;
  product_id: string;
  products: {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    image_url: string | null;
  } | null;
}

interface CartItemsProps {
  items: CartItem[];
}

export function CartItems({ items }: CartItemsProps) {
  const { updateQuantity, removeFromCart, loadingId } = useCartActions();

  return (
    <div className="space-y-4">
      {items.map((item) => {
        if (!item.products) return null;
        const product = item.products;
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
                    {formatPrice(product.price)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeFromCart(item.id)}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove item</span>
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
                    disabled={item.quantity >= product.stock || isLoading}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <p className="font-semibold">
                  {formatPrice(product.price * item.quantity)}
                </p>
              </div>

              {/* Stock Warning */}
              {item.quantity >= product.stock && (
                <p className="text-xs text-muted-foreground mt-1">
                  Max quantity reached
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
