"use client"

import Link from "next/link"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate, formatPrice } from "@/lib/format"
import { Package, ChevronRight, Zap } from "lucide-react"
import type { OrderWithItems } from "@/lib/types"

interface OrdersListProps {
  orders: OrderWithItems[]
  isDemoMode: boolean
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  processing: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  confirmed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  preparing: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  shipped: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  delivered: "bg-green-500/10 text-green-600 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
}

const statuses = [
  { value: "all", label: "All Orders" },
  { value: "processing", label: "Processing" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
]

export function OrdersList({ orders, isDemoMode }: OrdersListProps) {
  const [activeStatus, setActiveStatus] = useState("all")

  const filteredOrders =
    activeStatus === "all"
      ? orders
      : orders.filter((order) => order.status === activeStatus)

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-6">My Orders</h1>

      {/* Status Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {statuses.map((status) => (
          <Button
            key={status.value}
            variant={activeStatus === status.value ? "default" : "outline"}
            onClick={() => setActiveStatus(status.value)}
            className="rounded-full"
          >
            {status.label}
            {status.value !== "all" && (
              <span className="ml-2 text-xs">
                ({orders.filter((o) => o.status === status.value).length})
              </span>
            )}
          </Button>
        ))}
      </div>

      {filteredOrders && filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Link key={order.id} href={`/account/orders/${order.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">
                      Order #{order.order_number || order.id.slice(0, 8)}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {isDemoMode && (
                        <Badge className="bg-blue-100 text-blue-700 border-blue-300 flex items-center gap-1 text-xs">
                          <Zap className="h-3 w-3" />
                          Test
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className={statusColors[order.status] || ""}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.created_at)}
                      </p>
                      <p className="font-semibold text-primary">
                        {formatPrice(order.total_price)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.order_items?.length || 0} item(s)
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-muted p-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="font-medium text-lg mb-1">
              {activeStatus === "all" ? "No orders yet" : "No orders in this status"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {activeStatus === "all"
                ? "Start shopping to see your orders here"
                : "Change the filter to see other orders"}
            </p>
            {activeStatus === "all" && (
              <Link href="/products" className="text-primary hover:underline">
                Browse Products
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
