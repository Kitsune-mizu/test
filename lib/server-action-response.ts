/**
 * Server Action Response Utilities
 * Standardized response formats for all server actions
 */

import { ERROR_MESSAGES } from "@/lib/constants";

/**
 * Standard action response type
 */
export interface ActionResponse<T = undefined> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

/**
 * Success response builder
 */
export function successResponse<T>(data?: T): ActionResponse<T> {
  return {
    success: true,
    data,
  };
}

/**
 * Error response builder
 */
export function errorResponse(
  message: string,
  code: string = "UNKNOWN_ERROR"
): ActionResponse {
  return {
    success: false,
    error: message,
    code,
  };
}

/**
 * Standardized error codes
 */
export const ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INSUFFICIENT_STOCK: "INSUFFICIENT_STOCK",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  DATABASE_ERROR: "DATABASE_ERROR",
  CONFLICT: "CONFLICT",
  RATE_LIMIT: "RATE_LIMIT",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

/**
 * Handle authentication check
 */
export function checkAuthenticated(userId: string | undefined) {
  if (!userId) {
    return errorResponse(
      ERROR_MESSAGES.UNAUTHORIZED,
      ERROR_CODES.UNAUTHORIZED
    );
  }
  return null; // No error
}

/**
 * Handle validation errors
 */
export function validateInput(
  data: Record<string, unknown>,
  rules: Record<string, (value: unknown) => boolean | string>
): string | null {
  for (const [key, rule] of Object.entries(rules)) {
    const result = rule(data[key]);
    if (result === true) continue;
    if (typeof result === "string") return result;
    return `Invalid ${key}`;
  }
  return null;
}

/**
 * Handle Supabase errors
 */
export function handleSupabaseError(error: unknown): ActionResponse {
  if (!error) {
    return errorResponse(
      ERROR_MESSAGES.NETWORK_ERROR,
      ERROR_CODES.DATABASE_ERROR
    );
  }

  const err = error as Record<string, unknown>;

  if (err.code === "23505") {
    // Unique constraint violation
    return errorResponse(
      ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
      ERROR_CODES.CONFLICT
    );
  }

  const message = (err.message as string) || ERROR_MESSAGES.NETWORK_ERROR;
  return errorResponse(message, ERROR_CODES.DATABASE_ERROR);
}

/**
 * Safely execute async action with error handling
 */
export async function executeAction<T>(
  action: () => Promise<ActionResponse<T>>
): Promise<ActionResponse<T>> {
  try {
    return await action();
  } catch (error) {
    console.error("[Action Error]", error);
    return errorResponse(
      ERROR_MESSAGES.NETWORK_ERROR,
      ERROR_CODES.INTERNAL_ERROR
    );
  }
}
