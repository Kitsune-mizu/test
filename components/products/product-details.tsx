"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Heart, Minus, Plus, ShoppingCart, Truck, Shield, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Product } from "@/lib/types"
import { formatPrice } from "@/lib/format"
import { useCartActions } from "@/hooks/use-cart-actions"
import { useWishlistActions } from "@/hooks/use-wishlist-actions"
import { FloatingCartItem } from "@/components/cart/floating-cart-item"
import { createPortal } from "react-dom"

interface ProductDetailsProps {
  product: Product
  isInWishlist: boolean
  isLoggedIn: boolean
}

export function ProductDetails({ product, isInWishlist: initialWishlist, isLoggedIn }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(initialWishlist)
  const { addToCart, isLoading: cartLoading, showFloatingItem } = useCartActions()
  const { toggleWishlist } = useWishlistActions()
  const [hideFloating, setHideFloating] = useState(false)

  const isOutOfStock = product.stock === 0
  const maxQuantity = Math.min(product.stock, 10)

  const handleAddToCart = () => {
    addToCart(product.id, quantity)
  }

  const handleToggleWishlist = () => {
    toggleWishlist(product.id)
    setIsWishlisted(!isWishlisted)
  }

  return (
    <div>
      {/* Floating animation portal */}
      {showFloatingItem && !hideFloating && typeof document !== 'undefined' && (
        createPortal(
          <FloatingCartItem onComplete={() => setHideFloating(true)} />,
          document.body
        )
      )}

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
        {product.category && (
          <>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/products?category=${product.category}`} className="hover:text-primary transition-colors">
              {product.category}
            </Link>
          </>
        )}
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No image available
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <Badge variant="destructive" className="text-lg py-2 px-4">Out of Stock</Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {/* Brand & Category */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            {product.brand && <span className="font-medium">{product.brand}</span>}
            {product.brand && product.category && <span>•</span>}
            {product.category && (
              <Link href={`/products?category=${product.category}`} className="hover:text-primary transition-colors">
                {product.category}
              </Link>
            )}
          </div>

          {/* Name */}
          <h1 className="font-heading text-3xl font-bold">{product.name}</h1>

          {/* Price */}
          <p className="mt-4 text-3xl font-bold text-primary">{formatPrice(product.price)}</p>

          {/* Stock Status */}
          <div className="mt-4">
            {isOutOfStock ? (
              <Badge variant="destructive">Out of Stock</Badge>
            ) : product.stock <= 5 ? (
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                Only {product.stock} left in stock
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                In Stock
              </Badge>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="mt-6 text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <Separator className="my-6" />

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-r-none"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-l-none"
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  disabled={quantity >= maxQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1 gap-2"
              onClick={handleAddToCart}
              disabled={isOutOfStock || cartLoading}
            >
              <ShoppingCart className="h-5 w-5" />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleToggleWishlist}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? "fill-destructive text-destructive" : ""}`} />
              <span className="sr-only">{isWishlisted ? "Remove from wishlist" : "Add to wishlist"}</span>
            </Button>
          </div>

          {/* Features */}
          <div className="mt-8 grid gap-4">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="h-5 w-5 text-primary" />
              <span>Free shipping on orders over $100</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-5 w-5 text-primary" />
              <span>2-year warranty included</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <RefreshCw className="h-5 w-5 text-primary" />
              <span>30-day hassle-free returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
