import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatDate, formatPrice } from "@/lib/format"
import { ArrowLeft, MapPin, CreditCard, Truck, Zap } from "lucide-react"
import { CancelOrderButton } from "@/components/account/cancel-order-button"
import { isDemoAccount } from "@/lib/demo"

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  preparing: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  shipped: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  delivered: "bg-green-500/10 text-green-600 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
}

const statusSteps = ["pending", "confirmed", "preparing", "shipped", "delivered"]

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user: authUser } } = await supabase.auth.getUser()

  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        id,
        quantity,
        price,
        products (id, name, slug, image_url)
      )
    `)
    .eq("id", id)
    .eq("user_id", authUser!.id)
    .single()

  if (!order) {
    notFound()
  }

  // Check if this is a demo account order
  const isDemoOrder = isDemoAccount(authUser?.email)

  const currentStepIndex = statusSteps.indexOf(order.status)
  const canCancel = ["pending", "confirmed"].includes(order.status)

  return (
    <div>
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">
            Order #{order.id}
          </h1>
          <p className="text-muted-foreground">{formatDate(order.created_at)}</p>
        </div>
        <div className="flex items-center gap-2">
          {isDemoOrder && (
            <Badge className="bg-blue-100 text-blue-700 border-blue-300 flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Test Order
            </Badge>
          )}
          <Badge
            variant="outline"
            className={`text-sm py-1 px-3 ${statusColors[order.status] || ""}`}
          >
            {order.status}
          </Badge>
        </div>
      </div>

      {/* Order Progress */}
      {order.status !== "cancelled" && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted" />
              <div
                className="absolute top-4 left-0 h-0.5 bg-primary transition-all"
                style={{
                  width: `${Math.max(0, (currentStepIndex / (statusSteps.length - 1)) * 100)}%`,
                }}
              />

              {/* Steps */}
              {statusSteps.map((step, index) => (
                <div key={step} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      index <= currentStepIndex
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="mt-2 text-xs capitalize hidden sm:block">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.order_items.map((item: {
                  id: string
                  quantity: number
                  price: number
                  products: { id: string; name: string; slug: string; image_url: string | null } | null
                }) => {
                  const product = item.products
                  if (!product) return null

                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${product.slug}`}
                          className="font-medium hover:text-primary transition-colors line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} x {formatPrice(item.price)}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  )
                })}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatPrice(order.total_price)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Details */}
        <div className="space-y-4">
          {/* Shipping Address */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {order.shipping_address || "Not provided"}
              </p>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground capitalize">
                {order.payment_method === "cod"
                  ? "Cash on Delivery"
                  : order.payment_method || "Not specified"}
              </p>
            </CardContent>
          </Card>

          {/* Shipping Method */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Shipping Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground capitalize">
                {order.shipping_method || "Standard"} Shipping
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          {canCancel && (
            <CancelOrderButton orderId={order.id} orderStatus={order.status} />
          )}
        </div>
      </div>
    </div>
  )
}
