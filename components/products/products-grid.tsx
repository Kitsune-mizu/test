"use client";

import { ProductCard } from "./product-card";
import { useCartActions } from "@/hooks/use-cart-actions";
import { useWishlistActions } from "@/hooks/use-wishlist-actions";
import type { Product } from "@/lib/types";
import { PackageX } from "lucide-react";

interface ProductsGridProps {
  products: Product[];
}

export function ProductsGrid({ products }: ProductsGridProps) {
  const { addToCart } = useCartActions();
  const { toggleWishlist, wishlistIds } = useWishlistActions();

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <PackageX className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-lg mb-1">No products found</h3>
        <p className="text-muted-foreground text-sm">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
  );
}
