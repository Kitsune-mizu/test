"use client";

import { Notification } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Trash2, Check, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface NotificationItemProps {
  notification: Notification;
  userRole?: string;
  onMarkAsRead: (id: string, isRead: boolean) => void;
  onDelete: (id: string) => void;
}

export function NotificationItem({
  notification,
  userRole = "customer",
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const getNotificationConfig = (type: string, role: string) => {
    // Admin notifications
    if (role === "admin") {
      switch (type) {
        case "new_order":
          return {
            icon: "📋",
            color: "bg-blue-50 border-blue-200",
            label: "New Order",
            japanese: "新規注文",
          };
        case "low_stock":
          return {
            icon: "📉",
            color: "bg-yellow-50 border-yellow-200",
            label: "Low Stock Alert",
            japanese: "在庫少",
          };
        case "product_update":
          return {
            icon: "✏️",
            color: "bg-green-50 border-green-200",
            label: "Product Updated",
            japanese: "商品更新",
          };
        default:
          return {
            icon: "🔔",
            color: "bg-neutral-50",
            label: "Notification",
            japanese: "通知",
          };
      }
    }

    // Customer notifications
    switch (type) {
      case "order_confirmed":
        return {
          icon: "✅",
          color: "bg-green-50 border-green-200",
          label: "Order Confirmed",
          japanese: "注文確認完了",
        };
      case "order_preparing":
        return {
          icon: "⚙️",
          color: "bg-blue-50 border-blue-200",
          label: "Order Preparing",
          japanese: "ご準備中",
        };
      case "order_shipped":
        return {
          icon: "🚚",
          color: "bg-purple-50 border-purple-200",
          label: "Order Shipped",
          japanese: "発送済み",
        };
      case "order_delivered":
        return {
          icon: "📦",
          color: "bg-green-50 border-green-200",
          label: "Order Delivered",
          japanese: "配達完了",
        };
      default:
        return {
          icon: "🔔",
          color: "bg-neutral-50",
          label: "Notification",
          japanese: "通知",
        };
    }
  };

  const config = getNotificationConfig(notification.type, userRole);
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
  });

  return (
    <div
      className={`p-4 rounded-lg border transition-all ${
        notification.read_status
          ? "bg-neutral-50 border-neutral-200"
          : `${config.color} border`
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <span className="text-xl flex-shrink-0">{config.icon}</span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-sm">{config.label}</p>
                <span className="text-xs text-neutral-500">
                  {config.japanese}
                </span>
              </div>
              <p className="text-sm text-neutral-700 line-clamp-2">
                {notification.message}
              </p>
              <p className="text-xs text-neutral-500 mt-2">{timeAgo}</p>
            </div>
          </div>

          {/* Link button if applicable */}
          {notification.link && (
            <Link href={notification.link}>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 p-0 h-auto text-primary hover:text-primary/80"
              >
                View Details <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onMarkAsRead(notification.id, notification.read_status)
            }
            className="h-8 w-8 p-0"
            title={notification.read_status ? "Mark as unread" : "Mark as read"}
          >
            {notification.read_status ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <div className="h-2 w-2 rounded-full bg-blue-600" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(notification.id)}
            className="h-8 w-8 p-0"
            title="Delete notification"
          >
            <Trash2 className="h-4 w-4 text-neutral-400 hover:text-red-600" />
          </Button>
        </div>
      </div>
    </div>
  );
}
