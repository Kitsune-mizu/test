// components/admin/admin-sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Bell,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",     href: "/admin/dashboard"     },
  { icon: Package,         label: "Products",      href: "/admin/products"      },
  { icon: ShoppingCart,    label: "Orders",        href: "/admin/orders"        },
  { icon: Users,           label: "Customers",     href: "/admin/customers"     },
  { icon: Bell,            label: "Notifications", href: "/admin/notifications" },
  { icon: BarChart3,       label: "Analytics",     href: "/admin/analytics"     },
  { icon: Settings,        label: "Settings",      href: "/admin/settings"      },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    // self-stretch  → sidebar fills the full height of the flex row
    // sticky top-0  → sidebar stays visible while main content scrolls
    // h-[calc(...)] → accounts for the header height (h-16 = 64px) so
    //                 sticky positioning works correctly within the viewport
    <aside className="
      w-64 flex-shrink-0 border-r bg-sidebar text-sidebar-foreground
      flex flex-col
      self-stretch
      sticky top-16
      h-[calc(100vh-4rem)]
    ">

      {/* Header */}
      <div className="flex-shrink-0 p-6">
        <h2 className="text-lg font-bold">Admin Panel</h2>
        <p className="text-sm text-muted-foreground">Store Management</p>
      </div>

      {/* Nav — scrollable if items overflow */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isActive && "bg-sidebar-primary text-sidebar-primary-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Logout — always pinned to bottom */}
      <div className="flex-shrink-0 border-t p-3">
        <Link href="/auth/logout">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </Link>
      </div>

    </aside>
  )
}