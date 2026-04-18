"use server";

import { createClient } from "@/lib/supabase/server";
import {
  errorResponse,
  successResponse,
  ERROR_CODES,
  type ActionResponse,
} from "@/lib/server-action-response";

export interface NotificationPreferences {
  id: string;
  user_id: string;
  // Email notifications
  email_new_order: boolean;
  email_order_confirmed: boolean;
  email_order_preparing: boolean;
  email_order_shipped: boolean;
  email_order_delivered: boolean;
  email_product_update: boolean;
  email_low_stock: boolean;
  email_promotional: boolean;
  // In-app notifications
  app_new_order: boolean;
  app_order_confirmed: boolean;
  app_order_preparing: boolean;
  app_order_shipped: boolean;
  app_order_delivered: boolean;
  app_product_update: boolean;
  app_low_stock: boolean;
  app_promotional: boolean;
  // Push notifications
  push_orders: boolean;
  push_promotions: boolean;
  // Frequency settings
  email_frequency: "immediate" | "daily" | "weekly" | "never";
  // Communication preferences
  newsletter_subscribed: boolean;
  communication_language: string;
}

/**
 * Get notification preferences for the current user
 */
export async function getNotificationPreferences(): Promise<
  ActionResponse<NotificationPreferences>
> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.warn("[v0] Get preferences: User not authenticated");
      return errorResponse("Not authenticated", ERROR_CODES.UNAUTHORIZED);
    }

    console.log("[v0] Fetching notification preferences for user:", user.id);

    const { data, error } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found
      console.error("[v0] Fetch preferences error:", error);
      return errorResponse(
        "Failed to fetch preferences",
        ERROR_CODES.DATABASE_ERROR
      );
    }

    // If no preferences exist, create default ones
    if (!data) {
      console.log("[v0] Creating default notification preferences");
      const { data: newData, error: insertError } = await supabase
        .from("notification_preferences")
        .insert({
          user_id: user.id,
        })
        .select()
        .single();

      if (insertError) {
        console.error("[v0] Insert preferences error:", insertError);
        return errorResponse(
          "Failed to create preferences",
          ERROR_CODES.DATABASE_ERROR
        );
      }

      return successResponse(newData as NotificationPreferences);
    }

    return successResponse(data as NotificationPreferences);
  } catch (error) {
    console.error("[v0] Get preferences exception:", error);
    return errorResponse(
      "Failed to fetch preferences",
      ERROR_CODES.INTERNAL_ERROR
    );
  }
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  updates: Partial<NotificationPreferences>
): Promise<ActionResponse<NotificationPreferences>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.warn("[v0] Update preferences: User not authenticated");
      return errorResponse("Not authenticated", ERROR_CODES.UNAUTHORIZED);
    }

    console.log("[v0] Updating notification preferences for user:", user.id);

    // Remove user_id and id from updates if present
    const { user_id: _, id: __, ...safeUpdates } = updates as any;

    const { data, error } = await supabase
      .from("notification_preferences")
      .update(safeUpdates)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("[v0] Update preferences error:", error);
      return errorResponse(
        "Failed to update preferences",
        ERROR_CODES.DATABASE_ERROR
      );
    }

    console.log("[v0] Preferences updated successfully");
    return successResponse(data as NotificationPreferences);
  } catch (error) {
    console.error("[v0] Update preferences exception:", error);
    return errorResponse(
      "Failed to update preferences",
      ERROR_CODES.INTERNAL_ERROR
    );
  }
}

/**
 * Get user notifications with pagination
 */
export async function getUserNotifications(
  limit: number = 20,
  offset: number = 0
): Promise<ActionResponse<any[]>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.warn("[v0] Get notifications: User not authenticated");
      return errorResponse("Not authenticated", ERROR_CODES.UNAUTHORIZED);
    }

    console.log(
      "[v0] Fetching notifications for user:",
      user.id,
      "limit:",
      limit,
      "offset:",
      offset
    );

    const { data, error, count } = await supabase
      .from("notifications")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("[v0] Fetch notifications error:", error);
      return errorResponse(
        "Failed to fetch notifications",
        ERROR_CODES.DATABASE_ERROR
      );
    }

    console.log("[v0] Fetched", data?.length || 0, "notifications");
    return successResponse(data || []);
  } catch (error) {
    console.error("[v0] Get notifications exception:", error);
    return errorResponse(
      "Failed to fetch notifications",
      ERROR_CODES.INTERNAL_ERROR
    );
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(
  notificationId: string
): Promise<ActionResponse<{ success: true }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.warn("[v0] Mark read: User not authenticated");
      return errorResponse("Not authenticated", ERROR_CODES.UNAUTHORIZED);
    }

    if (!notificationId || typeof notificationId !== "string") {
      return errorResponse(
        "Invalid notification ID",
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    console.log("[v0] Marking notification as read:", notificationId);

    const { error } = await supabase
      .from("notifications")
      .update({ read_status: true, read_at: new Date().toISOString() })
      .eq("id", notificationId)
      .eq("user_id", user.id);

    if (error) {
      console.error("[v0] Mark read error:", error);
      return errorResponse(
        "Failed to update notification",
        ERROR_CODES.DATABASE_ERROR
      );
    }

    console.log("[v0] Notification marked as read");
    return successResponse({ success: true });
  } catch (error) {
    console.error("[v0] Mark read exception:", error);
    return errorResponse(
      "Failed to update notification",
      ERROR_CODES.INTERNAL_ERROR
    );
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<
  ActionResponse<{ count: number }>
> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.warn("[v0] Mark all read: User not authenticated");
      return errorResponse("Not authenticated", ERROR_CODES.UNAUTHORIZED);
    }

    console.log("[v0] Marking all notifications as read for user:", user.id);

    const { error, count } = await supabase
      .from("notifications")
      .update({ read_status: true, read_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("read_status", false);

    if (error) {
      console.error("[v0] Mark all read error:", error);
      return errorResponse(
        "Failed to update notifications",
        ERROR_CODES.DATABASE_ERROR
      );
    }

    console.log("[v0] Marked", count || 0, "notifications as read");
    return successResponse({ count: count || 0 });
  } catch (error) {
    console.error("[v0] Mark all read exception:", error);
    return errorResponse(
      "Failed to update notifications",
      ERROR_CODES.INTERNAL_ERROR
    );
  }
}

/**
 * Delete notification
 */
export async function deleteNotification(
  notificationId: string
): Promise<ActionResponse<{ success: true }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.warn("[v0] Delete notification: User not authenticated");
      return errorResponse("Not authenticated", ERROR_CODES.UNAUTHORIZED);
    }

    if (!notificationId || typeof notificationId !== "string") {
      return errorResponse(
        "Invalid notification ID",
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    console.log("[v0] Deleting notification:", notificationId);

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId)
      .eq("user_id", user.id);

    if (error) {
      console.error("[v0] Delete error:", error);
      return errorResponse(
        "Failed to delete notification",
        ERROR_CODES.DATABASE_ERROR
      );
    }

    console.log("[v0] Notification deleted");
    return successResponse({ success: true });
  } catch (error) {
    console.error("[v0] Delete exception:", error);
    return errorResponse(
      "Failed to delete notification",
      ERROR_CODES.INTERNAL_ERROR
    );
  }
}
