/**
 * Root Provider
 * Wraps the entire application with all necessary context providers
 */

"use client";

import React from "react";
import { AuthProvider } from "@/contexts/auth-context";
import { CartProvider } from "@/contexts/cart-context";
import { NotificationProvider } from "@/contexts/notification-context";

/**
 * Root provider component props
 */
interface RootProviderProps {
  children: React.ReactNode;
}

/**
 * Combines all context providers in the correct order
 * Enables use of all hooks throughout the application
 */
export function RootProvider({ children }: RootProviderProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
}
