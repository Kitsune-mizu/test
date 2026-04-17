/**
 * Generate alphanumeric order IDs like "HB-001A2B"
 * Uses timestamp + random string for unique identifiers
 */

export function generateOrderId(): string {
  // Get timestamp in hex format (compact)
  const timestamp = Date.now().toString(36).toUpperCase()
  
  // Generate random alphanumeric suffix
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let random = ""
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  // Combine: HB prefix + timestamp + random
  return `HB-${timestamp.slice(-5)}${random}`
}

/**
 * Format order ID for display with hyphen
 * Input: "HB001A2B" -> Output: "HB-001A2B"
 */
export function formatOrderId(id: string): string {
  if (id.includes("-")) return id
  if (id.startsWith("HB")) {
    return `${id.slice(0, 2)}-${id.slice(2)}`
  }
  return id
}

/**
 * Extract clean order ID without formatting
 * Input: "HB-001A2B" -> Output: "HB001A2B"
 */
export function cleanOrderId(id: string): string {
  return id.replace(/-/g, "")
}
