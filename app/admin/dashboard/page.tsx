import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Package, ShoppingCart, Users, TrendingUp, AlertCircle } from "lucide-react"
import { formatPrice } from "@/lib/format"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Get stats
  const [
    { count: productsCount },
    { count: ordersCount },
    { data: totalRevenueData },
    { data: recentOrders },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "delivered"),
    supabase
      .from("orders")
      .select("total_price")
      .eq("status", "delivered"),
    supabase
      .from("orders")
      .select(`
        id,
        total_price,
        status,
        created_at,
        users(name)
      `)
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  const totalRevenue = totalRevenueData?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0
  const lowStockProducts = await supabase
    .from("products")
    .select("id, name, stock")
    .lt("stock", 10)
    .gt("stock", 0)

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your store overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productsCount || 0}</div>
            <p className="text-xs text-muted-foreground">Active products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordersCount || 0}</div>
            <p className="text-xs text-muted-foreground">Delivered orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Total earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockProducts.data?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Need restock</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders && recentOrders.length > 0 ? (
              recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.users?.name || "Guest"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(order.total_price)}</p>
                    <p className="text-xs text-muted-foreground capitalize">{order.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No orders yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alert */}
      {lowStockProducts.data && lowStockProducts.data.length > 0 && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Low Stock Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockProducts.data.map((product: any) => (
                <div key={product.id} className="flex items-center justify-between">
                  <span>{product.name}</span>
                  <span className="font-medium">{product.stock} left</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
