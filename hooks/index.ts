/**
 * Hooks Index
 * Central export point for all custom React hooks used throughout the application
 */

// Authentication and Session
export { useAuth, useAuthUser } from "@/contexts/auth-context";
export { useSessionSync } from "@/hooks/use-session-sync";

// Cart Management
export { useCartActions } from "@/hooks/use-cart-actions";

// Wishlist Management
export { useWishlistActions } from "@/hooks/use-wishlist-actions";

// Utilities
export { useToast } from "@/hooks/use-toast";
export { useIsMobile } from "@/hooks/use-mobile";
