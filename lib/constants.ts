/**
 * Application-wide constants and enumerations
 * Centralized reference for all static values, status codes, and configuration
 */

// Order Status Types
export const ORDER_STATUSES = {
  PENDING: "pending",
  PROCESSING: "processing",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

export type OrderStatus =
  typeof ORDER_STATUSES[keyof typeof ORDER_STATUSES];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  confirmed: "Confirmed",
  preparing: "Preparing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  confirmed: "bg-green-100 text-green-800",
  preparing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

// User Roles
export const USER_ROLES = {
  CUSTOMER: "customer",
  ADMIN: "admin",
} as const;

export type UserRole =
  typeof USER_ROLES[keyof typeof USER_ROLES];

// Payment Methods
export const PAYMENT_METHODS = {
  CARD: "card",
  COD: "cod",
} as const;

export type PaymentMethod =
  typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  card: "Credit/Debit Card",
  cod: "Cash on Delivery",
};

// Payment Method Types
export const PAYMENT_METHOD_TYPES = {
  CARD: "card",
  BANK_ACCOUNT: "bank_account",
} as const;

export type SavedPaymentMethodType =
  typeof PAYMENT_METHOD_TYPES[keyof typeof PAYMENT_METHOD_TYPES];

// Shipping Methods
export const SHIPPING_METHODS = {
  STANDARD: "standard",
  EXPRESS: "express",
  OVERNIGHT: "overnight",
} as const;

export type ShippingMethod =
  typeof SHIPPING_METHODS[keyof typeof SHIPPING_METHODS];

export const SHIPPING_METHOD_LABELS: Record<ShippingMethod, string> = {
  standard: "Standard (5-7 days)",
  express: "Express (2-3 days)",
  overnight: "Overnight",
};

export const SHIPPING_COSTS: Record<ShippingMethod, number> = {
  standard: 0,
  express: 15,
  overnight: 30,
};

// Notification Types
export const NOTIFICATION_TYPES = {
  ORDER_CONFIRMED: "order_confirmed",
  SHIPMENT_UPDATE: "shipment_update",
  DELIVERY_UPDATE: "delivery_update",
  REVIEW_REQUEST: "review_request",
  PROMOTION: "promotion",
  SYSTEM_MESSAGE: "system_message",
} as const;

export type NotificationType =
  typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];

// Product Categories
export const PRODUCT_CATEGORIES = {
  SANDALS: "Sandals",
  HIKING_SHOES: "Hiking Shoes",
  BACKPACKS: "Backpacks",
  JACKETS: "Jackets",
  OUTDOOR_EQUIPMENT: "Outdoor Equipment",
} as const;

// ❌ ERROR (khusus error saja)
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "You are not authorized to perform this action",
  PRODUCT_NOT_FOUND: "Product not found",
  CART_EMPTY: "Your cart is empty",
  ORDER_NOT_FOUND: "Order not found",
  USER_NOT_FOUND: "User not found",
  INVALID_EMAIL: "Invalid email address",
  INVALID_PASSWORD: "Password must be at least 8 characters",
  EMAIL_ALREADY_EXISTS: "Email already in use",
  PAYMENT_FAILED: "Payment processing failed",
  INSUFFICIENT_STOCK: "Insufficient stock available",
  NETWORK_ERROR: "Network error. Please try again",
} as const;

// ✅ SUCCESS (🔥 pakai ini di cart.ts)
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: "Profile updated successfully",
  CART_ITEM_ADDED: "Item added to cart",
  CART_ITEM_REMOVED: "Item removed from cart",
  ORDER_PLACED: "Order placed successfully",
  WISHLIST_ITEM_ADDED: "Item added to wishlist",
  WISHLIST_ITEM_REMOVED: "Item removed from wishlist",
  PASSWORD_CHANGED: "Password changed successfully",
} as const;

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
} as const;

// Tax Configuration
export const TAX_CONFIG = {
  DEFAULT_TAX_RATE: 10,
  MAX_TAX_RATE: 50,
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MAX_LENGTH: 100,
  PRODUCT_NAME_MAX_LENGTH: 200,
  REVIEW_COMMENT_MAX_LENGTH: 1000,
  PHONE_PATTERN: /^\+?[\d\s\-()]{10,}$/,
  OTP_LENGTH: 6,
} as const;

// Default Values
export const DEFAULTS = {
  CURRENCY: "USD",
  CURRENCY_SYMBOL: "$",
  TIMEZONE: "UTC",
  LANGUAGE: "en",
  ITEMS_PER_PAGE: 12,
  MAX_CART_ITEMS: 100,
} as const;

// Timeouts
export const TIMEOUTS = {
  TOAST_DURATION: 3000,
  DIALOG_CLOSE_DELAY: 200,
  LOADING_DELAY: 500,
  DEBOUNCE_DELAY: 300,
} as const;