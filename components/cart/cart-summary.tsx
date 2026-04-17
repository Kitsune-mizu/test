import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format";
import { Truck, ShieldCheck } from "lucide-react";

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
}

export function CartSummary({
  subtotal,
  shipping,
  total,
  itemCount,
}: CartSummaryProps) {
  const freeShippingThreshold = 100;
  const amountToFreeShipping = freeShippingThreshold - subtotal;

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Items */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Subtotal ({itemCount} items)
            </span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>

        {/* Free Shipping Progress */}
        {amountToFreeShipping > 0 && (
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm mb-2">
              <Truck className="h-4 w-4 text-primary" />
              <span>
                Add {formatPrice(amountToFreeShipping)} for free shipping
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{
                  width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {shipping === 0 && (
          <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 rounded-lg p-3">
            <Truck className="h-4 w-4" />
            <span>You qualify for free shipping!</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button asChild className="w-full" size="lg">
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/products">Continue Shopping</Link>
        </Button>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-4 pt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
