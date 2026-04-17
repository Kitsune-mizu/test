"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

/**
 * Rate limiting helper untuk mencegah abuse
 */

const RATE_LIMITS = {
  login: { requests: 5, window: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  checkout: { requests: 3, window: 60 * 60 * 1000 }, // 3 checkouts per hour
  api: { requests: 100, window: 60 * 1000 }, // 100 requests per minute
  auth: { requests: 10, window: 60 * 60 * 1000 }, // 10 auth attempts per hour
};

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

// In-memory store (untuk production, gunakan Redis)
const rateLimitStore: RateLimitStore = {};

/**
 * Get client IP address
 */
async function getClientIp(): Promise<string> {
  const headersList = await headers();
  return (
    headersList.get("x-forwarded-for")?.split(",")[0] ||
    headersList.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Check rate limit untuk action
 */
export async function checkRateLimit(
  action: keyof typeof RATE_LIMITS,
): Promise<{ allowed: boolean; remaining: number; resetAt?: number }> {
  try {
    const ip = await getClientIp();
    const key = `${action}:${ip}`;
    const limit = RATE_LIMITS[action];
    const now = Date.now();

    // Initialize or reset rate limit
    if (!rateLimitStore[key] || rateLimitStore[key].resetAt < now) {
      rateLimitStore[key] = {
        count: 0,
        resetAt: now + limit.window,
      };
    }

    // Check if limit exceeded
    if (rateLimitStore[key].count >= limit.requests) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: rateLimitStore[key].resetAt,
      };
    }

    // Increment counter
    rateLimitStore[key].count++;

    return {
      allowed: true,
      remaining: limit.requests - rateLimitStore[key].count,
      resetAt: rateLimitStore[key].resetAt,
    };
  } catch (error) {
    console.error("[v0] Rate limit check error:", error);
    // Allow request if rate limit check fails
    return { allowed: true, remaining: -1 };
  }
}

/**
 * Input sanitization
 */
export async function sanitizeInput(input: string): Promise<string> {
  return input
    .trim()
    .replace(/[<>\"']/g, "") // Remove potentially harmful characters
    .substring(0, 1000); // Limit length
}

/**
 * Validate CSRF token (implement with NextAuth or custom middleware)
 */
export async function validateCSRFToken(token: string): Promise<boolean> {
  // This should be implemented with your session management
  // For now, basic validation
  return token && token.length > 20;
}

/**
 * Hash sensitive data for logging
 */
export async function hashForLogging(data: string): Promise<string> {
  // Simple hash for logging purposes only
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}

/**
 * Log security event untuk audit trail
 */
export async function logSecurityEvent(
  eventType: string,
  details: Record<string, any>,
  severity: "low" | "medium" | "high" = "low",
): Promise<void> {
  try {
    const supabase = await createClient();
    const ip = await getClientIp();

    // Sanitize details for logging
    const sanitizedDetails = {
      ...details,
      email: details.email ? hashForLogging(details.email) : undefined,
      phone: details.phone ? hashForLogging(details.phone) : undefined,
    };

    // Log to audit table jika ada
    await supabase.from("audit_logs").insert({
      event_type: eventType,
      severity,
      details: sanitizedDetails,
      ip_address: ip,
      created_at: new Date().toISOString(),
    });

    console.log(`[Security] ${eventType} (${severity}):`, sanitizedDetails);
  } catch (error) {
    console.error("[v0] Failed to log security event:", error);
  }
}
