/**
 * Contexts Index
 * Central export point for all React contexts used throughout the application
 */

// Authentication Context
export { AuthProvider, useAuth, useAuthUser } from "@/contexts/auth-context";
export type { AuthContextType } from "@/contexts/auth-context";

// Cart Context
export { CartProvider, useCart } from "@/contexts/cart-context";
export type { CartContextType } from "@/contexts/cart-context";

// Notification Context
export { NotificationProvider, useNotification } from "@/contexts/notification-context";
export type { NotificationContextType, Toast } from "@/contexts/notification-context";

// Root Provider (combines all contexts)
export { RootProvider } from "@/components/providers/root-provider";
