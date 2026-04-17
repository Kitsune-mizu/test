"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import type { Product } from "@/lib/types";
import { useCartActions } from "@/hooks/use-cart-actions";
import { useWishlistActions } from "@/hooks/use-wishlist-actions";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const { addToCart, isLoading: cartLoading } = useCartActions();
  const { toggleWishlist, wishlistIds } = useWishlistActions();

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-8 bg-[#E10600]" />
          <span className="text-xs tracking-[0.3em] text-neutral-500 uppercase">
            New Arrivals
          </span>
        </div>

        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-black">
              Featured Products
            </h2>
            <p className="mt-2 text-neutral-500">
              最新の製品 — Latest gear for your next adventure
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            className="gap-2 hidden sm:flex text-black hover:text-[#E10600]"
          >
            <Link href="/products">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
              onToggleWishlist={toggleWishlist}
              isInWishlist={wishlistIds.includes(product.id)}
            />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 text-center sm:hidden">
          <Button
            asChild
            variant="outline"
            className="gap-2 border-black text-black hover:bg-black hover:text-white"
          >
            <Link href="/products">
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
