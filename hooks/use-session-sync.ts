"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";

/**
 * Hook to handle profile updates dispatched via custom events.
 * Keeps the auth context in sync with profile changes without requiring
 * a full router.refresh() or page reload.
 *
 * Usage: Call this hook in a component that might dispatch "profile:updated" events.
 */
export function useSessionSync() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const handleProfileUpdated = (e: Event) => {
      const { name, role } = (e as CustomEvent<{ name: string; role: string }>)
        .detail ?? {};

      // Dispatch a custom event that the AuthProvider or other listeners can pick up
      // This ensures the auth context is updated with any profile changes
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("auth:sync-session", {
            detail: { name, role },
          })
        );
      }
    };

    window.addEventListener("profile:updated", handleProfileUpdated);
    return () =>
      window.removeEventListener("profile:updated", handleProfileUpdated);
  }, [user]);
}
