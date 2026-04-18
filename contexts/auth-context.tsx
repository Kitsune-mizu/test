/**
 * Authentication Context
 * Manages global authentication state and provides auth hooks for the entire application
 */

"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@/lib/types";
import { USER_ROLES } from "@/lib/constants";

/**
 * Auth context value type
 */
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isSessionValid: boolean;
}

/**
 * Create auth context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth provider component props
 */
interface AuthProviderProps {
  children: React.ReactNode;
  initialUser?: User | null;
}

/**
 * Auth provider component
 * Wraps application with authentication context and manages auth state
 */
export function AuthProvider({ children, initialUser = null }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser ?? null);
  const [loading, setLoading] = useState(!initialUser);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isSessionValid, setIsSessionValid] = useState(true);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    const supabase = createClient();
    let isMounted = true; // Prevent state updates after unmount

    const initializeSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email ?? null,
            name: session.user.user_metadata?.name ?? null,
            role: session.user.user_metadata?.role ?? USER_ROLES.CUSTOMER,
            phone: session.user.user_metadata?.phone ?? null,
            address: session.user.user_metadata?.address ?? null,
            created_at: session.user.created_at ?? new Date().toISOString(),
          };
          setUser(userData);
          setIsSessionValid(true);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("authUser", JSON.stringify(userData));
          }
        } else {
          setUser(null);
          setIsSessionValid(true);
        }
        setLoading(false);
        setHasHydrated(true);
      } catch (error) {
        console.error("[v0] Session initialization error:", error);
        setLoading(false);
        setHasHydrated(true);
      }
    };

    initializeSession();

    // Subscribe to auth state changes with event handling
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      console.log("[v0] Auth state changed:", event);

      switch (event) {
        case "SIGNED_IN":
        case "USER_UPDATED":
          if (session?.user) {
            const userData: User = {
              id: session.user.id,
              email: session.user.email ?? null,
              name: session.user.user_metadata?.name ?? null,
              role: session.user.user_metadata?.role ?? USER_ROLES.CUSTOMER,
              phone: session.user.user_metadata?.phone ?? null,
              address: session.user.user_metadata?.address ?? null,
              created_at: session.user.created_at ?? new Date().toISOString(),
            };
            setUser(userData);
            setIsSessionValid(true);
            if (typeof window !== "undefined") {
              sessionStorage.setItem("authUser", JSON.stringify(userData));
            }
          }
          break;

        case "SIGNED_OUT":
        case "TOKEN_REFRESHED":
          if (!session?.user) {
            setUser(null);
            if (typeof window !== "undefined") {
              sessionStorage.removeItem("authUser");
            }
          }
          break;

        default:
          break;
      }
      setLoading(false);
    });

    // Listen for profile updates from other components
    const handleProfileUpdated = (e: Event) => {
      if (!isMounted) return;
      const { name, role, phone, address } = (
        e as CustomEvent<{
          name?: string;
          role?: User["role"];
          phone?: string;
          address?: string;
        }>
      ).detail ?? {};

      setUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          name: name ?? prev.name,
          role: role ?? prev.role,
          phone: phone ?? prev.phone,
          address: address ?? prev.address,
        };
      });
    };

    // Listen for session sync events with error handling
    const handleSessionSync = async () => {
      if (!isMounted) return;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email ?? null,
            name: session.user.user_metadata?.name ?? null,
            role: session.user.user_metadata?.role ?? USER_ROLES.CUSTOMER,
            phone: session.user.user_metadata?.phone ?? null,
            address: session.user.user_metadata?.address ?? null,
            created_at: session.user.created_at ?? new Date().toISOString(),
          };
          setUser(userData);
          setIsSessionValid(true);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("authUser", JSON.stringify(userData));
          }
        } else {
          setUser(null);
          setIsSessionValid(false);
        }
      } catch (error) {
        console.error("[v0] Session sync error:", error);
        setIsSessionValid(false);
      }
    };

    // Listen for visibility change to re-sync session when tab becomes active
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && hasHydrated && isMounted) {
        handleSessionSync();
      }
    };

    window.addEventListener("profile:updated", handleProfileUpdated);
    window.addEventListener("auth:sync-session", handleSessionSync);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      window.removeEventListener("profile:updated", handleProfileUpdated);
      window.removeEventListener("auth:sync-session", handleSessionSync);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [hasHydrated]);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    isSessionValid,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access authentication context
 * @throws Error if used outside of AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/**
 * Convenience hook to get the current authenticated user
 * Returns null if not authenticated or still loading
 */
export function useAuthUser(): User | null {
  const { user, loading } = useAuth();
  return loading ? null : user;
}
