"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRealtimeNotifications } from "@/lib/hooks/use-realtime";
import { NotificationItem } from "./notification-item";
// PERBAIKAN: Import tipe Notification langsung dari sumber utamanya
import type { Notification } from "@/lib/types"; 
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell } from "lucide-react";
import { toast } from "sonner";

// PERBAIKAN: Interface Notification lokal DIHAPUS agar tidak bentrok dengan yang ada di @/lib/types

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("customer");
  const { notifications, unreadCount } = useRealtimeNotifications(userId);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setUserRole(user.user_metadata?.role || "customer");
      }
    };
    getUser();
  }, [supabase]);

  const handleMarkAsRead = async (notificationId: string, isRead: boolean) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read_status: !isRead }),
      });

      if (!response.ok) throw new Error("Failed to update notification");
      toast.success(isRead ? "Marked as unread" : "Marked as read");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error");
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete notification");
      toast.success("Notification deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.read_status);

      await Promise.all(
        unreadNotifications.map((n) =>
          fetch(`/api/notifications/${n.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ read_status: true }),
          }),
        ),
      );

      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const handleClearAll = async () => {
    try {
      await Promise.all(
        notifications.map((n) =>
          fetch(`/api/notifications/${n.id}`, {
            method: "DELETE",
          }),
        ),
      );

      toast.success("All notifications cleared");
    } catch (error) {
      toast.error("Failed to clear notifications");
    }
  };

  return (
    <>
      {/* Notification Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="relative"
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-white text-xs">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:w-96 flex flex-col">
          <SheetHeader className="border-b pb-3">
            <div className="flex items-center justify-between">
              <SheetTitle>
                Notifications {userRole === "admin" && "(管理者)"}
              </SheetTitle>
              {notifications.length > 0 && (
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className="text-xs h-8"
                    >
                      Mark all read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="text-xs h-8 text-destructive"
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 mt-4">
            {notifications.length > 0 ? (
              <div className="space-y-2 pr-4">
                {notifications.map((notification: Notification) => (
                  <div key={notification.id}>
                    <NotificationItem
                      notification={notification}
                      userRole={userRole}
                      onMarkAsRead={handleMarkAsRead}
                      onDelete={handleDelete}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <p>No notifications yet</p>
              </div>
            )}
          </ScrollArea>

          {/* Footer info */}
          <div className="border-t pt-3 text-xs text-neutral-500">
            {notifications.length > 0 && (
              <p>{notifications.filter((n) => !n.read_status).length} unread</p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}