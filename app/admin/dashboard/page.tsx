"use client";

import { Suspense } from "react";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { RecentOrders } from "@/components/admin/recent-orders";
import { LowStockAlerts } from "@/components/admin/low-stock-alerts";
import { JapaneseSkeleton } from "@/components/loaders/japanese-loader";

export default function AdminDashboard() {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s your store overview.
        </p>
      </div>

      <Suspense fallback={<JapaneseSkeleton />}>
        {/* Stats Grid */}
        <DashboardStats />

        {/* Recent Orders */}
        <RecentOrders />

        {/* Low Stock Alert */}
        <LowStockAlerts />
      </Suspense>
    </div>
  );
}
