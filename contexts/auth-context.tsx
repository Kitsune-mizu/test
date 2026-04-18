/**
 * Authentication Context
 * Manages global authentication state and provides auth hooks for the entire application
 */

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
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

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? null,
          name: session.user.user_metadata?.name ?? null,
          role: session.user.user_metadata?.role ?? USER_ROLES.CUSTOMER,
          phone: session.user.user_metadata?.phone ?? null,
          address: session.user.user_metadata?.address ?? null,
          created_at: session.user.created_at ?? new Date().toISOString(),
        });
      }
      setLoading(false);
    });

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? null,
          name: session.user.user_metadata?.name ?? null,
          role: session.user.user_metadata?.role ?? USER_ROLES.CUSTOMER,
          phone: session.user.user_metadata?.phone ?? null,
          address: session.user.user_metadata?.address ?? null,
          created_at: session.user.created_at ?? new Date().toISOString(),
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Listen for profile updates from other components
    const handleProfileUpdated = (e: Event) => {
      // PERBAIKAN: Ubah tipe `role` dari `string` menjadi `User["role"]`
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

    // Listen for session sync events
    const handleSessionSync = () => {
      // Re-fetch the session to ensure we have the latest data
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email ?? null,
            name: session.user.user_metadata?.name ?? null,
            role: session.user.user_metadata?.role ?? USER_ROLES.CUSTOMER,
            phone: session.user.user_metadata?.phone ?? null,
            address: session.user.user_metadata?.address ?? null,
            created_at: session.user.created_at ?? new Date().toISOString(),
          });
        }
      });
    };

    window.addEventListener("profile:updated", handleProfileUpdated);
    window.addEventListener("auth:sync-session", handleSessionSync);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("profile:updated", handleProfileUpdated);
      window.removeEventListener("auth:sync-session", handleSessionSync);
    };
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
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