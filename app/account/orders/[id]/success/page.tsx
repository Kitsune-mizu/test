import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatPrice } from "@/lib/format";
import { CheckCircle2, Download, ArrowLeft } from "lucide-react";

interface OrderSuccessPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderSuccessPage({
  params,
}: OrderSuccessPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/auth/login");
  }

  const { data: order } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        id,
        quantity,
        price,
        products (id, name, slug, image_url)
      )
    `,
    )
    .eq("id", id)
    .eq("user_id", authUser.id)
    .single();

  if (!order) {
    notFound();
  }

  // Only show this page if order is in a completed or successful state
  if (
    !["processing", "confirmed", "shipped", "delivered"].includes(order.status)
  ) {
    redirect(`/account/orders/${id}`);
  }

  const orderNumber =
    order.order_number || `ORD-${order.id.slice(0, 8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-background pt-8">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl" />
              <CheckCircle2 className="h-16 w-16 text-green-600 relative" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground text-lg">
            Your order has been successfully placed. Thank you for your
            purchase!
          </p>
        </div>

        {/* Order Number & Date */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Order Number
                </p>
                <p className="text-xl font-semibold">{orderNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Order Date
                </p>
                <p className="text-lg">{formatDate(order.created_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.order_items.map(
              (item: {
                id: string;
                quantity: number;
                price: number;
                products: {
                  id: string;
                  name: string;
                  slug: string;
                  image_url: string | null;
                } | null;
              }) => {
                const product = item.products;
                if (!product) return null;

                return (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
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
                      <p className="text-sm text-muted-foreground mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                );
              },
            )}

            <Separator />

            <div className="flex justify-between items-center pt-2">
              <span className="font-semibold text-lg">Total</span>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(order.total_price)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Payment Method
                </p>
                <p className="capitalize">
                  {order.payment_method === "cod"
                    ? "Cash on Delivery"
                    : order.payment_method || "Card"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Shipping Method
                </p>
                <p className="capitalize">
                  {order.shipping_method || "Standard"} Shipping
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Shipping Address
              </p>
              <p className="text-sm whitespace-pre-line">
                {order.shipping_address || "Not provided"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">What happens next?</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-primary font-bold">1.</span>
                <span>
                  We&apos;ll send you a confirmation email with your invoice
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">2.</span>
                <span>Your order will be prepared for shipping</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">3.</span>
                <span>You&apos;ll receive tracking information via email</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">4.</span>
                <span>Track your order status anytime from your account</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 flex-col sm:flex-row">
          <Link href="/account/orders" className="flex-1">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <Link href="/products" className="flex-1">
            <Button className="w-full">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
