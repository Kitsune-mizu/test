/**
 * Product Card Component
 * Displays a single product with image, price, and quick actions
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";
import { formatCurrency, isOutOfStock } from "@/lib/utils";

/**
 * Product card props
 */
interface ProductCardProps {
  /** Product data to display */
  product: Product;
  /** Callback when add to cart is clicked */
  onAddToCart?: (productId: string) => void;
  /** Callback when wishlist toggle is clicked */
  onToggleWishlist?: (productId: string) => void;
  /** Whether product is in user's wishlist */
  isInWishlist?: boolean;
  /** Whether to show action buttons */
  showActions?: boolean;
}

/**
 * Product Card Component
 * Displays product information with hover actions
 */
export function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false,
  showActions = true,
}: ProductCardProps) {
  const outOfStock = isOutOfStock(product);

  return (
    <div className="group relative bg-white">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        <Link href={`/products/${product.slug}`}>
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-neutral-400">
              <span className="font-heading text-4xl">光</span>
            </div>
          )}
        </Link>

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {outOfStock && (
            <Badge className="bg-black text-white text-[10px] font-medium px-2 py-0.5">
              SOLD OUT
            </Badge>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <Badge className="bg-red-600 text-white text-[10px] font-medium px-2 py-0.5">
              LOW STOCK
            </Badge>
          )}
        </div>

        {/* Quick Actions - Appear on Hover */}
        {showActions && (
          <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            {onAddToCart && (
              <Button
                variant="secondary"
                size="sm"
                disabled={outOfStock}
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart(product.id);
                }}
                className="flex-1 bg-black text-white hover:bg-neutral-800 text-xs h-9"
              >
                <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                Add to Cart
              </Button>
            )}
            <Link href={`/products/${product.slug}`}>
              <Button
                variant="secondary"
                size="icon"
                className="bg-white hover:bg-neutral-100 h-9 w-9"
              >
                <Eye className="h-4 w-4" />
                <span className="sr-only">Quick View</span>
              </Button>
            </Link>
            {onToggleWishlist && (
              <Button
                variant="secondary"
                size="icon"
                className="bg-white hover:bg-neutral-100 h-9 w-9"
                onClick={(e) => {
                  e.preventDefault();
                  onToggleWishlist(product.id);
                }}
              >
                <Heart
                  className={`h-4 w-4 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`}
                />
                <span className="sr-only">
                  {isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                </span>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link
          href={`/products/${product.slug}`}
          className="block group/link"
        >
          <h3 className="font-medium text-sm text-neutral-900 line-clamp-2 group-hover/link:text-neutral-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.brand && (
          <p className="text-xs text-neutral-500 mt-1">{product.brand}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="text-sm font-semibold text-neutral-900">
            {formatCurrency(product.price)}
          </span>
          {product.tags && product.tags.length > 0 && (
            <span className="text-[10px] text-neutral-400">
              {product.tags[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
