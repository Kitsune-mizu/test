/**
 * Notification Context
 * Manages notification/toast state across the application
 */

"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { NotificationType } from "@/lib/constants";

/**
 * Notification item type
 */
export interface NotificationItem {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

/**
 * Notification context value type
 */
export interface NotificationContextType {
  notifications: NotificationItem[];
  addNotification: (notification: Omit<NotificationItem, "id">) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

/**
 * Create notification context
 */
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * Notification provider component props
 */
interface NotificationProviderProps {
  children: React.ReactNode;
}

/**
 * Notification provider component
 * Manages toast/notification state for the application
 */
export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  /**
   * Add new notification
   */
  const addNotification = useCallback((notification: Omit<NotificationItem, "id">) => {
    const id = `${Date.now()}-${Math.random()}`;
    const item: NotificationItem = {
      ...notification,
      id,
    };

    setNotifications((prev) => [...prev, item]);

    // Auto-remove notification after duration
    if (notification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration);
    }
  }, []);

  /**
   * Remove notification by id
   */
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  /**
   * Clear all notifications
   */
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * Hook to access notification context
 * @throws Error if used outside of NotificationProvider
 */
export function useNotification(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}

/**
 * Convenience hook for showing success notification
 */
export function useSuccessNotification() {
  const { addNotification } = useNotification();
  return (message: string, duration = 3000) => {
    addNotification({ message, type: "success", duration });
  };
}

/**
 * Convenience hook for showing error notification
 */
export function useErrorNotification() {
  const { addNotification } = useNotification();
  return (message: string, duration = 4000) => {
    addNotification({ message, type: "error", duration });
  };
}

/**
 * Convenience hook for showing warning notification
 */
export function useWarningNotification() {
  const { addNotification } = useNotification();
  return (message: string, duration = 3500) => {
    addNotification({ message, type: "warning", duration });
  };
}

/**
 * Convenience hook for showing info notification
 */
export function useInfoNotification() {
  const { addNotification } = useNotification();
  return (message: string, duration = 3000) => {
    addNotification({ message, type: "info", duration });
  };
}
