import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CartItem, Order, Product } from "./types";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, SHIPPING_COSTS } from "./constants";

/**
 * Merge Tailwind CSS classes with proper override handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency with proper symbol and precision
 */
export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * Format date with time
 */
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/**
 * Calculate subtotal from cart items
 */
export function calculateCartSubtotal(items: (CartItem & { product?: Product })[]): number {
  return items.reduce((sum, item) => {
    const price = item.product?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);
}

/**
 * Calculate total tax for cart items
 */
export function calculateCartTax(items: (CartItem & { product?: Product })[]): number {
  return items.reduce((sum, item) => {
    const price = item.product?.price ?? 0;
    const taxRate = (item.product?.tax_rate ?? 0) / 100;
    return sum + price * item.quantity * taxRate;
  }, 0);
}

/**
 * Calculate total for cart including tax and shipping
 */
export function calculateCartTotal(
  items: (CartItem & { product?: Product })[],
  shippingCost: number = 0
): number {
  const subtotal = calculateCartSubtotal(items);
  const tax = calculateCartTax(items);
  return subtotal + tax + shippingCost;
}

/**
 * Get order status label for display
 */
export function getOrderStatusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] || status;
}

/**
 * Get order status badge color classes
 */
export function getOrderStatusColor(status: string): string {
  return ORDER_STATUS_COLORS[status as keyof typeof ORDER_STATUS_COLORS] || "bg-gray-100 text-gray-800";
}

/**
 * Calculate order total with all fees
 */
export function calculateOrderTotal(order: Order): number {
  return order.total_price;
}

/**
 * Get shipping cost by shipping method
 */
export function getShippingCost(method: string): number {
  return SHIPPING_COSTS[method as keyof typeof SHIPPING_COSTS] ?? 0;
}

/**
 * Generate order number format
 */
export function generateOrderNumber(id: string): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const shortId = id.slice(0, 4).toUpperCase();
  return `ORD-${dateStr}-${shortId}`;
}

/**
 * Truncate string to max length with ellipsis
 */
export function truncateString(str: string, maxLength: number = 50): string {
  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone format
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
  return phoneRegex.test(phone);
}

/**
 * Slugify text for URLs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]/g, "")
    .replace(/\-+/g, "-")
    .trim();
}

/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Check if item is out of stock
 */
export function isOutOfStock(product: Product): boolean {
  return product.stock <= 0;
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(originalPrice: number, discountedPrice: number): number {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

/**
 * Format product price range
 */
export function formatPriceRange(minPrice: number, maxPrice: number): string {
  if (minPrice === maxPrice) {
    return formatCurrency(minPrice);
  }
  return `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;
}

/**
 * Check if user has permission for resource
 */
export function canAccessResource(userRole: string, resourceRole: string): boolean {
  if (resourceRole === "public") return true;
  if (userRole === "admin") return true;
  return userRole === resourceRole;
}

/**
 * Generate random string for tokens
 */
export function generateRandomString(length: number = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Parse query parameters from URL
 */
export function parseQueryParams(queryString: string): Record<string, string | string[]> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string | string[]> = {};

  params.forEach((value, key) => {
    if (result[key]) {
      if (Array.isArray(result[key])) {
        (result[key] as string[]).push(value);
      } else {
        result[key] = [result[key] as string, value];
      }
    } else {
      result[key] = value;
    }
  });

  return result;
}
