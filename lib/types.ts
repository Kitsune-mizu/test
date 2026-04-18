/**
 * Database and Application Types
 * Type definitions for all entities used throughout the application
 */

import type { UserRole, OrderStatus, PaymentMethod, ShippingMethod, NotificationType, SavedPaymentMethodType } from "./constants";

/**
 * User entity - represents a registered user in the system
 */
export interface User {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  role: UserRole;
  created_at: string;
  updated_at?: string;
}

/**
 * Product entity - represents a product in the catalog
 */
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  brand: string | null;
  category: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  tags: string[] | null;
  tax_rate: number; // Percentage (0-100)
  payment_methods: PaymentMethod[]; // Available payment methods for this product
  created_at: string;
  updated_at?: string;
}

/**
 * Order entity - represents a customer order
 */
export interface Order {
  id: string;
  user_id: string | null;
  total_price: number;
  payment_method: PaymentMethod | null;
  shipping_method: ShippingMethod | null;
  shipping_address: string | null;
  status: OrderStatus;
  order_number: string | null; // Unique order number for invoice
  invoice_url: string | null; // URL to invoice/receipt
  created_at: string;
  updated_at?: string;
}

/**
 * Order item - represents a product in an order
 */
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  quantity: number;
  price: number; // Price at time of purchase
  product?: Product;
}

/**
 * Order with items - order data including associated items
 */
export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

/**
 * Wishlist item - user's favorited products
 */
export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

/**
 * Cart item - product in user's shopping cart
 */
export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at?: string;
  product?: Product;
}

/**
 * Product review - customer review of a product
 */
export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  order_id: string | null;
  rating: number; // 1-5
  comment: string | null;
  created_at: string;
  updated_at?: string;
  user?: Pick<User, "id" | "name">;
}

/**
 * Notification - user notification/message
 */
export interface Notification {
  id: string;
  user_id: string;
  message: string;
  link: string | null;
  read_status: boolean;
  type: NotificationType;
  created_at: string;
}

/**
 * OTP Code - One-Time Password for verification
 */
export interface OTPCode {
  id: string;
  email: string;
  code_hash: string;
  created_at: string;
  expires_at: string;
  verified_at: string | null;
  attempts: number;
  last_attempt_at: string | null;
}

/**
 * Saved Payment Method - stored payment information for quick checkout
 */
export interface SavedPaymentMethod {
  id: string;
  user_id: string;
  method_type: SavedPaymentMethodType;
  card_number: string | null; // Last 4 digits stored
  card_holder: string | null;
  card_brand: string | null; // Mastercard, Visa, etc.
  expiry_date: string | null; // MM/YY format
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
