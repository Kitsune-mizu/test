'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, ChevronRight } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/format'

interface RecentOrder {
  id: string
  total_price: number
  status: string
  created_at: string
  user_name: string | null
}

export function RecentOrders() {
  const [orders, setOrders] = useState<RecentOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/admin/dashboard/recent-orders')
        if (!response.ok) throw new Error('Failed to fetch orders')
        const data = await response.json()
        setOrders(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-600',
    processing: 'bg-orange-500/10 text-orange-600',
    confirmed: 'bg-blue-500/10 text-blue-600',
    preparing: 'bg-purple-500/10 text-purple-600',
    shipped: 'bg-cyan-500/10 text-cyan-600',
    delivered: 'bg-green-500/10 text-green-600',
    cancelled: 'bg-red-500/10 text-red-600',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Recent Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="text-destructive">{error}</div>}
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-3">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <Link key={order.id} href={`/admin/orders/${order.id}`}>
                <div className="flex items-center justify-between border-b pb-3 last:border-0 hover:bg-muted/50 p-2 rounded cursor-pointer transition-colors">
                  <div>
                    <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">{order.user_name || 'Guest'}</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="font-medium">{formatPrice(order.total_price)}</p>
                      <Badge className={statusColors[order.status] || ''} variant="outline">
                        {order.status}
                      </Badge>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-muted-foreground">No recent orders</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
