'use client'

import { RealtimeOrdersTable } from '@/components/admin/realtime-orders-table'

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders with live updates</p>
      </div>

      {/* Real-time Orders Table */}
      <RealtimeOrdersTable />
    </div>
  )
}
