"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import {
  Menu,
  ShoppingCart,
  User,
  Heart,
  ChevronDown,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  Package,
  Home,
  Grid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HikaruLogoMinimal } from "@/components/ui/hikaru-logo";
import { createClient } from "@/lib/supabase/client";
import { NotificationCenter } from "@/components/notifications/notification-center";
// SheetTitle & SheetDescription must be static (Radix a11y requirement)
import { SheetTitle, SheetDescription } from "@/components/ui/sheet";

// ─── Dynamic imports (SSR off — avoids hydration mismatch) ───────────────────

const DropdownMenu = dynamic(
  () => import("@/components/ui/dropdown-menu").then((m) => m.DropdownMenu),
  { ssr: false },
);
const DropdownMenuContent = dynamic(
  () =>
    import("@/components/ui/dropdown-menu").then((m) => m.DropdownMenuContent),
  { ssr: false },
);
const DropdownMenuItem = dynamic(
  () => import("@/components/ui/dropdown-menu").then((m) => m.DropdownMenuItem),
  { ssr: false },
);
const DropdownMenuSeparator = dynamic(
  () =>
    import("@/components/ui/dropdown-menu").then(
      (m) => m.DropdownMenuSeparator,
    ),
  { ssr: false },
);
const DropdownMenuTrigger = dynamic(
  () =>
    import("@/components/ui/dropdown-menu").then((m) => m.DropdownMenuTrigger),
  { ssr: false },
);
const Sheet = dynamic(
  () => import("@/components/ui/sheet").then((m) => m.Sheet),
  { ssr: false },
);
const SheetContent = dynamic(
  () => import("@/components/ui/sheet").then((m) => m.SheetContent),
  { ssr: false },
);
const SheetTrigger = dynamic(
  () => import("@/components/ui/sheet").then((m) => m.SheetTrigger),
  { ssr: false },
);

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserData {
  id: string;
  name: string | null;
  role: string;
}

interface HeaderProps {
  // Passed from server component — same pattern as AccountSidebar
  user?: UserData | null;
  cartCount?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const categories = [
  { name: "Sandals", href: "/products?category=Sandals", japanese: "サンダル" },
  {
    name: "Hiking Shoes",
    href: "/products?category=Hiking+Shoes",
    japanese: "登山靴",
  },
  {
    name: "Backpacks",
    href: "/products?category=Backpacks",
    japanese: "バックパック",
  },
  {
    name: "Jackets",
    href: "/products?category=Jackets",
    japanese: "ジャケット",
  },
  {
    name: "Outdoor Equipment",
    href: "/products?category=Equipment",
    japanese: "装備",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function Header({ user, cartCount = 0 }: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  // Initialise from server-passed prop — same as sidebar does
  const [currentUser, setCurrentUser] = useState<UserData | null>(user ?? null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);

  // Keep prop changes (e.g. after router.refresh()) in sync with local state
  useEffect(() => {
    setCurrentUser(user ?? null);
  }, [user]);

  useEffect(() => {
    setMounted(true);

    // ProfileForm dispatches "profile:updated" with the new name in detail
    // so we can update state immediately — before router.refresh() rerenders
    const handleProfileUpdated = (e: Event) => {
      const { name, role } =
        (e as CustomEvent<{ name: string; role: string }>).detail ?? {};
      setCurrentUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          name: name ?? prev.name,
          role: role ?? prev.role,
        };
      });
    };

    window.addEventListener("profile:updated", handleProfileUpdated);
    return () =>
      window.removeEventListener("profile:updated", handleProfileUpdated);
  }, []);

  // ─── Supabase auth listener ─────────────────────────────────────────────────
  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    const supabase = createClient();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Handle sign in / session refresh
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          name: session.user.user_metadata?.name ?? null,
          role: session.user.user_metadata?.role ?? "customer",
        });
      }
      // Handle sign out
      else if (event === "SIGNED_OUT") {
        setCurrentUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ─── Derived display values ─────────────────────────────────────────────────

  const userInitial = (currentUser?.name ?? "U").charAt(0).toUpperCase();
  const displayName = currentUser?.name ?? "User";
  const displayRole =
    currentUser?.role === "admin" ? "Administrator" : "Customer";

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-neutral-200">
      {/* Announcement bar */}
      <div className="bg-black text-white text-center py-2 text-xs tracking-wide">
        <span className="opacity-80">FREE SHIPPING ON ORDERS OVER $100</span>
        <span className="mx-3 opacity-40">|</span>
        <span className="opacity-60 font-heading">冒険を始めよう</span>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-6">
          {/* ── Mobile hamburger ───────────────────────────────────────────── */}
          <div className="flex items-center gap-2 lg:hidden">
            {mounted && (
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="left"
                  className="w-[300px] p-0 flex flex-col"
                >
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    Main navigation links
                  </SheetDescription>

                  {/* Brand header */}
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100">
                    <HikaruLogoMinimal />
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm font-semibold tracking-wide text-black">
                        HIKARU
                      </span>
                      <span className="text-[10px] tracking-widest text-neutral-400 font-medium">
                        冒険 BOUKEN
                      </span>
                    </div>
                  </div>

                  {/* User info */}
                  {currentUser && (
                    <div className="flex items-center gap-3 px-5 py-4 bg-neutral-50 border-b border-neutral-100">
                      <div className="h-9 w-9 rounded-full bg-black flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                        {userInitial}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {displayRole}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Nav links */}
                  <nav className="flex-1 overflow-y-auto py-3">
                    <Link
                      href="/"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-black transition-colors"
                    >
                      <Home className="h-4 w-4 text-neutral-400" />
                      Home
                    </Link>

                    <Link
                      href="/products"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-black transition-colors"
                    >
                      <Grid className="h-4 w-4 text-neutral-400" />
                      Shop All
                    </Link>

                    {/* Categories accordion */}
                    <div>
                      <button
                        onClick={() => setCategoriesExpanded((v) => !v)}
                        className="w-full flex items-center justify-between gap-3 px-5 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-black transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Package className="h-4 w-4 text-neutral-400" />
                          Categories
                        </div>
                        <ChevronRight
                          className={`h-4 w-4 text-neutral-400 transition-transform duration-200 ${
                            categoriesExpanded ? "rotate-90" : ""
                          }`}
                        />
                      </button>

                      {categoriesExpanded && (
                        <div className="bg-neutral-50 border-y border-neutral-100">
                          {categories.map((cat) => (
                            <Link
                              key={cat.name}
                              href={cat.href}
                              onClick={() => setMobileOpen(false)}
                              className="flex items-center justify-between px-8 py-2.5 text-sm text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors"
                            >
                              <span>{cat.name}</span>
                              <span className="text-xs text-neutral-400">
                                {cat.japanese}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="my-2 border-t border-neutral-100" />

                    {/* Account links — logged in only */}
                    {currentUser && (
                      <>
                        <Link
                          href="/account"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-black transition-colors"
                        >
                          <User className="h-4 w-4 text-neutral-400" />
                          My Account
                        </Link>

                        <Link
                          href="/account/orders"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-black transition-colors"
                        >
                          <Package className="h-4 w-4 text-neutral-400" />
                          Orders
                        </Link>

                        <Link
                          href="/account/wishlist"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-black transition-colors"
                        >
                          <Heart className="h-4 w-4 text-neutral-400" />
                          Wishlist
                        </Link>

                        {currentUser.role === "admin" && (
                          <>
                            <div className="my-2 border-t border-neutral-100" />
                            <Link
                              href="/admin/dashboard"
                              onClick={() => setMobileOpen(false)}
                              className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-[#E10600] hover:bg-red-50 transition-colors"
                            >
                              <LayoutDashboard className="h-4 w-4" />
                              Admin Dashboard
                            </Link>
                          </>
                        )}
                      </>
                    )}
                  </nav>

                  {/* Sheet footer */}
                  <div className="border-t border-neutral-100 p-4">
                    {currentUser ? (
                      <Link
                        href="/auth/logout"
                        onClick={() => setMobileOpen(false)}
                        className="group flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-md text-sm font-medium text-neutral-600 border border-neutral-200 hover:bg-red-50 hover:text-[#E10600] hover:border-red-200 transition-all duration-200"
                      >
                        <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                        Sign Out
                      </Link>
                    ) : (
                      <Link
                        href="/auth/login"
                        onClick={() => setMobileOpen(false)}
                      >
                        <Button className="w-full bg-black text-white">
                          Sign In
                        </Button>
                      </Link>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>

          {/* ── Logo ───────────────────────────────────────────────────────── */}
          <Link href="/" className="flex-shrink-0">
            <HikaruLogoMinimal />
          </Link>

          {/* ── Desktop nav ────────────────────────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-neutral-600 hover:text-black"
            >
              Home
            </Link>

            <Link
              href="/products"
              className="text-sm font-medium text-neutral-600 hover:text-black"
            >
              Shop All
            </Link>

            {mounted && (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-neutral-600 hover:text-black">
                  Categories
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-white">
                  {categories.map((cat) => (
                    <DropdownMenuItem key={cat.name} asChild>
                      <Link
                        href={cat.href}
                        className="flex items-center justify-between w-full"
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs text-neutral-400 ml-3">
                          {cat.japanese}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* ── Right-side icons ───────────────────────────────────────────── */}
          <div className="flex items-center gap-1">
            {/* Notifications — logged in only */}
            {currentUser && mounted && <NotificationCenter />}

            {/* Wishlist — logged in only */}
            {currentUser && (
              <Link href="/account/wishlist">
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E10600] text-[10px] text-white">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User dropdown — desktop, logged in */}
            {currentUser && mounted && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden lg:flex"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium">{displayName}</p>
                    <p className="text-xs text-neutral-500">{displayRole}</p>
                  </div>

                  <DropdownMenuItem asChild>
                    <Link href="/account">My Account</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/account/orders">Orders</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/account/wishlist">Wishlist</Link>
                  </DropdownMenuItem>

                  {currentUser.role === "admin" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href="/admin/dashboard"
                          className="text-[#E10600]"
                        >
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href="/auth/logout">Sign Out</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Sign In — desktop, logged out */}
            {!currentUser && (
              <Link href="/auth/login">
                <Button
                  size="sm"
                  className="bg-black text-white ml-2 hidden lg:flex"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
