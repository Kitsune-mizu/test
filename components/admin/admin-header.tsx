// components/admin/admin-header.tsx
"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { useState } from "react"
import { User, LayoutDashboard, LogOut, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HikaruLogoMinimal } from "@/components/ui/hikaru-logo"

// ─── Dynamic imports (SSR off) ────────────────────────────────────────────────

const DropdownMenu = dynamic(
  () => import("@/components/ui/dropdown-menu").then((m) => m.DropdownMenu),
  { ssr: false }
)
const DropdownMenuContent = dynamic(
  () => import("@/components/ui/dropdown-menu").then((m) => m.DropdownMenuContent),
  { ssr: false }
)
const DropdownMenuItem = dynamic(
  () => import("@/components/ui/dropdown-menu").then((m) => m.DropdownMenuItem),
  { ssr: false }
)
const DropdownMenuSeparator = dynamic(
  () => import("@/components/ui/dropdown-menu").then((m) => m.DropdownMenuSeparator),
  { ssr: false }
)
const DropdownMenuTrigger = dynamic(
  () => import("@/components/ui/dropdown-menu").then((m) => m.DropdownMenuTrigger),
  { ssr: false }
)

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminHeaderProps {
  user: {
    id: string
    name: string | null
    role: string
  } | null
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminHeader({ user }: AdminHeaderProps) {
  const [mounted] = useState(true)

  const displayName = user?.name ?? "Admin"
  const userInitial = displayName.charAt(0).toUpperCase()

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-neutral-200">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo + Admin badge */}
          <Link href="/admin/dashboard">
            <HikaruLogoMinimal />
          </Link>

          {/* Right — profile dropdown only */}
          {mounted && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center text-white text-sm font-medium">
                    {userInitial}
                  </div>
                  <div className="hidden sm:flex flex-col items-start leading-tight">
                    <span className="text-sm font-medium">{displayName}</span>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wide">Administrator</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-neutral-400" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-52">
                <div className="px-3 py-2 border-b">
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-xs text-neutral-500">Administrator</p>
                </div>

                <DropdownMenuItem asChild>
                  <Link href="/admin/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Admin Dashboard
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link
                    href="/auth/logout"
                    className="flex items-center gap-2 text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

        </div>
      </div>
    </header>
  )
}