"use server";

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch analytics data
    const [
      { data: ordersData },
      { data: productsData },
      { data: revenueData },
      { data: customersData },
    ] = await Promise.all([
      // Daily orders count
      supabase
        .from("orders")
        .select("created_at")
        .order("created_at", { ascending: true })
        .limit(365),
      // Top products
      supabase
        .from("order_items")
        .select("product_id, quantity, products(name)")
        .order("quantity", { ascending: false })
        .limit(10),
      // Daily revenue
      supabase
        .from("orders")
        .select("total_price, created_at")
        .eq("status", "delivered")
        .order("created_at", { ascending: true }),
      // Customer growth
      supabase
        .from("users")
        .select("created_at")
        .neq("role", "admin")
        .order("created_at", { ascending: true }),
    ]);

    // Process orders data
    const ordersByDate: Record<string, number> = {};
    ordersData?.forEach((order: any) => {
      const date = new Date(order.created_at).toLocaleDateString("en-US");
      ordersByDate[date] = (ordersByDate[date] || 0) + 1;
    });

    const ordersChartData = Object.entries(ordersByDate).map(
      ([date, count]) => ({
        date,
        orders: count,
      }),
    );

    // Process revenue data
    const revenueByDate: Record<string, number> = {};
    revenueData?.forEach((order: any) => {
      const date = new Date(order.created_at).toLocaleDateString("en-US");
      revenueByDate[date] =
        (revenueByDate[date] || 0) + (order.total_price || 0);
    });

    const revenueChartData = Object.entries(revenueByDate).map(
      ([date, revenue]) => ({
        date,
        revenue,
      }),
    );

    // Process products data
    const topProductsData =
      productsData?.map((item: any) => ({
        name: item.products?.name || "Unknown",
        sales: item.quantity,
      })) || [];

    // Process customers data
    const customersByDate: Record<string, number> = {};
    customersData?.forEach((customer: any) => {
      const date = new Date(customer.created_at).toLocaleDateString("en-US");
      customersByDate[date] = (customersByDate[date] || 0) + 1;
    });

    const customersChartData = Object.entries(customersByDate).map(
      ([date, count]) => ({
        date,
        customers: count,
      }),
    );

    return NextResponse.json({
      ordersChartData: ordersChartData.slice(-30),
      revenueChartData: revenueChartData.slice(-30),
      topProductsData,
      customersChartData: customersChartData.slice(-30),
      totalOrders: ordersData?.length || 0,
      totalRevenue:
        revenueData?.reduce(
          (sum: number, order: any) => sum + (order.total_price || 0),
          0,
        ) || 0,
      totalCustomers: customersData?.length || 0,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
