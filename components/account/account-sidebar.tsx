"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Package, Heart, Bell, Settings, LogOut, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface AccountSidebarProps {
  user: {
    id: string
    name: string | null
    role: string
  } | null
}

const menuItems = [
  { href: "/account", label: "Profile", icon: User },
  { href: "/account/orders", label: "My Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/notifications", label: "Notifications", icon: Bell },
  { href: "/account/settings", label: "Settings", icon: Settings },
]

export function AccountSidebar({ user }: AccountSidebarProps) {
  const pathname = usePathname()

  return (
    <div className="bg-card rounded-xl border p-4">
      {/* User Info */}
      <div className="flex items-center gap-3 mb-6">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="font-medium truncate">{user?.name || "User"}</p>
          <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Navigation */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}

        {/* Admin Link */}
        {user?.role === "admin" && (
          <>
            <Separator className="my-2" />
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Shield className="h-4 w-4" />
              Admin Dashboard
            </Link>
          </>
        )}

        <Separator className="my-2" />

        {/* Logout */}
        <Link
          href="/auth/logout"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Link>
      </nav>
    </div>
  )
}
