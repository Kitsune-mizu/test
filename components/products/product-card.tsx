"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types"
import { formatPrice } from "@/lib/format"

interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: string) => void
  onToggleWishlist?: (productId: string) => void
  isInWishlist?: boolean
  showActions?: boolean
}

export function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false,
  showActions = true,
}: ProductCardProps) {
  const isOutOfStock = product.stock === 0

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
          {isOutOfStock && (
            <Badge className="bg-black text-white text-[10px] font-medium px-2 py-0.5">
              SOLD OUT
            </Badge>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <Badge className="bg-[#E10600] text-white text-[10px] font-medium px-2 py-0.5">
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
                disabled={isOutOfStock}
                onClick={(e) => {
                  e.preventDefault()
                  onAddToCart(product.id)
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
                  e.preventDefault()
                  onToggleWishlist(product.id)
                }}
              >
                <Heart
                  className={`h-4 w-4 ${isInWishlist ? "fill-[#E10600] text-[#E10600]" : ""}`}
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
      <div className="p-4 space-y-2">
        {/* Category & Brand */}
        <div className="flex items-center gap-2 text-[11px] text-neutral-500 uppercase tracking-wider">
          {product.brand && <span>{product.brand}</span>}
          {product.brand && product.category && <span className="text-neutral-300">|</span>}
          {product.category && <span>{product.category}</span>}
        </div>

        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-black line-clamp-2 hover:text-[#E10600] transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <p className="text-lg font-heading font-bold text-black">
          {formatPrice(product.price)}
        </p>
      </div>

      {/* Wishlist Button - Always Visible on Mobile/Touch */}
      {showActions && onToggleWishlist && (
        <button
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity"
          onClick={(e) => {
            e.preventDefault()
            onToggleWishlist(product.id)
          }}
        >
          <Heart
            className={`h-4 w-4 ${isInWishlist ? "fill-[#E10600] text-[#E10600]" : "text-neutral-600"}`}
          />
          <span className="sr-only">
            {isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          </span>
        </button>
      )}
    </div>
  )
}
