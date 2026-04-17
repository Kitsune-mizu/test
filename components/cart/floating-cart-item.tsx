"use client";

import { ShoppingCart } from "lucide-react";

interface FloatingCartItemProps {
  onComplete: () => void;
}

export function FloatingCartItem({ onComplete }: FloatingCartItemProps) {
  return (
    <div
      className="fixed pointer-events-none"
      style={{
        animation: `floatToCart 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
      }}
      onAnimationEnd={onComplete}
    >
      <div className="bg-red-600 text-white p-3 rounded-lg flex items-center gap-2 shadow-lg">
        <ShoppingCart className="h-5 w-5" />
        <span className="font-medium text-sm">Added to cart!</span>
      </div>
    </div>
  );
}
