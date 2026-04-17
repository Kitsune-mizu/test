"use client";

import { ProductCard } from "./product-card";
import { useCartActions } from "@/hooks/use-cart-actions";
import { useWishlistActions } from "@/hooks/use-wishlist-actions";
import type { Product } from "@/lib/types";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const { addToCart } = useCartActions();
  const { toggleWishlist, wishlistIds } = useWishlistActions();

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </div>
  );
}
