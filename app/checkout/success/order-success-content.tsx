"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Package, Download, Share2 } from "lucide-react";
import { toast } from "sonner";

interface OrderDetails {
  id: string;
  order_number: string;
  total_price: number;
  created_at: string;
  items_count: number;
  estimated_delivery: string;
}

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    const fetchOrder = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth/login");
          return;
        }

        const { data, error } = await supabase
          .from("orders")
          .select(
            `
            id,
            order_number,
            total_price,
            created_at,
            order_items (count)
          `,
          )
          .eq("id", orderId)
          .eq("user_id", user.id)
          .single();

        if (error || !data) {
          toast.error("Order not found");
          router.push("/account/orders");
          return;
        }

        // Calculate estimated delivery (5-7 business days)
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 6);

        setOrder({
          id: data.id,
          order_number: data.order_number,
          total_price: data.total_price,
          created_at: data.created_at,
          items_count: data.order_items?.[0]?.count || 0,
          estimated_delivery: deliveryDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        });
      } catch (error) {
        console.error("[v0] Error fetching order:", error);
        toast.error("Failed to load order details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router, supabase]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Order ${order?.order_number}`,
          text: `My order has been confirmed!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Order link copied to clipboard");
      }
    } catch (error) {
      console.error("[v0] Share error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Order not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <CheckCircle className="w-24 h-24 text-green-600 animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            ご注文ありがとうございます
          </h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your purchase!
          </p>
        </div>

        {/* Order Details Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {/* Order Number */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Order Number
                </p>
                <p className="text-2xl font-bold text-foreground">
                  #{order.order_number}
                </p>
                <p className="text-xs text-muted-foreground mt-2">注文番号</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Amount */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Total Amount
                </p>
                <p className="text-2xl font-bold text-foreground">
                  ${order.total_price.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">合計金額</p>
              </div>
            </CardContent>
          </Card>

          {/* Estimated Delivery */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Estimated Delivery
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {order.estimated_delivery}
                </p>
                <p className="text-xs text-muted-foreground mt-2">配達予定日</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Status Timeline */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Status Timeline (注文ステータス)
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                    ✓
                  </div>
                  <div className="w-0.5 h-12 bg-gray-300 my-2"></div>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Order Confirmed (注文確認)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                    →
                  </div>
                  <div className="w-0.5 h-12 bg-gray-300 my-2"></div>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Processing (処理中)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    We&apos;re preparing your items
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                    →
                  </div>
                  <div className="w-0.5 h-12 bg-gray-300 my-2"></div>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Shipped (発送済み)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your package is on the way
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                    →
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Delivered (配達完了)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Expected by {order.estimated_delivery}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps & Actions */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">
              次のステップ (Next Steps)
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>
                  Check your email for order confirmation and tracking
                  information
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>You can track your order in your account anytime</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>Contact support if you have any questions</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Print Receipt
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share Order
          </Button>
          <Link href="/account/orders">
            <Button>View All Orders</Button>
          </Link>
          <Link href="/products">
            <Button variant="ghost">Continue Shopping</Button>
          </Link>
        </div>

        {/* Support Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-center text-sm text-muted-foreground">
              お困りですか? サポートチームがお手伝いします
              <br />
              Have questions? Our support team is here to help.
              <br />
              <Link
                href="/support"
                className="text-blue-600 hover:underline font-semibold"
              >
                Contact Support
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
