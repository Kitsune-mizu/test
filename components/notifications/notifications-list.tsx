"use client";

import { useState, useEffect } from "react";
import { useTransition } from "react";
import { toast } from "sonner";
import {
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
  markAllNotificationsAsRead,
} from "@/app/actions/notification-preferences";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/ui/empty";
import { X, Check, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  title?: string;
  message: string;
  type?: string;
  category?: string;
  priority?: string;
  read_status: boolean;
  read_at?: string;
  created_at: string;
  link?: string;
}

const NOTIFICATION_COLORS: Record<string, string> = {
  order: "bg-blue-50 border-blue-200",
  product: "bg-green-50 border-green-200",
  system: "bg-yellow-50 border-yellow-200",
  promotional: "bg-purple-50 border-purple-200",
  general: "bg-gray-50 border-gray-200",
};

const PRIORITY_ICONS: Record<string, string> = {
  high: "🔴",
  normal: "🟡",
  low: "🟢",
};

export function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      console.log("[v0] Fetching notifications");
      const result = await getUserNotifications(50, 0);

      if (result.data) {
        setNotifications(result.data);
        setUnreadCount(result.data.filter((n) => !n.read_status).length);
      } else {
        toast.error(result.error || "Failed to load notifications");
      }
    } catch (error) {
      console.error("[v0] Failed to fetch notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = (id: string) => {
    startTransition(async () => {
      try {
        console.log("[v0] Marking notification as read:", id);
        const result = await markNotificationAsRead(id);

        if (result.data) {
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === id
                ? {
                    ...n,
                    read_status: true,
                    read_at: new Date().toISOString(),
                  }
                : n
            )
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
          toast.success("Marked as read");
        } else {
          toast.error(result.error || "Failed to mark as read");
        }
      } catch (error) {
        console.error("[v0] Failed to mark as read:", error);
        toast.error("Failed to mark as read");
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        console.log("[v0] Deleting notification:", id);
        const result = await deleteNotification(id);

        if (result.data) {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
          const deleted = notifications.find((n) => n.id === id);
          if (deleted && !deleted.read_status) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
          }
          toast.success("Notification deleted");
        } else {
          toast.error(result.error || "Failed to delete notification");
        }
      } catch (error) {
        console.error("[v0] Failed to delete notification:", error);
        toast.error("Failed to delete notification");
      }
    });
  };

  const handleMarkAllAsRead = () => {
    startTransition(async () => {
      try {
        console.log("[v0] Marking all notifications as read");
        const result = await markAllNotificationsAsRead();

        if (result.data) {
          setNotifications((prev) =>
            prev.map((n) => ({
              ...n,
              read_status: true,
              read_at: new Date().toISOString(),
            }))
          );
          setUnreadCount(0);
          toast.success("All notifications marked as read");
        } else {
          toast.error(result.error || "Failed to mark all as read");
        }
      } catch (error) {
        console.error("[v0] Failed to mark all as read:", error);
        toast.error("Failed to mark all as read");
      }
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading notifications...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Empty
            icon="Bell"
            title="No notifications"
            description="You're all caught up!"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={isPending}
          >
            Mark all as read
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {notifications.map((notification) => {
          const bgColor =
            NOTIFICATION_COLORS[notification.category || "general"] ||
            NOTIFICATION_COLORS.general;
          const priorityIcon = PRIORITY_ICONS[notification.priority || "normal"];

          return (
            <Card
              key={notification.id}
              className={cn("border", bgColor, {
                "opacity-75": notification.read_status,
              })}
            >
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {notification.title && (
                      <h4 className="font-semibold text-sm mb-1">
                        {priorityIcon && (
                          <span className="mr-2">{priorityIcon}</span>
                        )}
                        {notification.title}
                      </h4>
                    )}
                    <p className="text-sm text-foreground mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(
                        new Date(notification.created_at),
                        { addSuffix: true }
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!notification.read_status && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={isPending}
                        title="Mark as read"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}

                    {notification.read_status && (
                      <div className="flex items-center justify-center w-8 h-8">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(notification.id)}
                      disabled={isPending}
                      title="Delete notification"
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                {notification.link && (
                  <div className="mt-3 pt-3 border-t">
                    <a
                      href={notification.link}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      View Details →
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
