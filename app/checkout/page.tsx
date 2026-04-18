import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { isDemoAccount } from "@/lib/demo";

export const metadata = {
  title: "Checkout | Hikaru Bouken",
  description: "Complete your order",
};

export default async function CheckoutPage() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/auth/login?redirect=/checkout");
  }

  // Get user profile
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  // Get cart items
  const { data: cartItems } = await supabase
    .from("cart")
    .select(
      `
      id,
      quantity,
      product_id,
      products (
        id,
        name,
        slug,
        price,
        stock,
        image_url
      )
    `,
    )
    .eq("user_id", authUser.id);

  if (!cartItems || cartItems.length === 0) {
    redirect("/cart");
  }

  const cartCount = cartItems.length;

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const product = item.products as { price: number } | null;
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  const shipping = subtotal >= 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  // Check if this is a demo account
  const isDemoMode = isDemoAccount(authUser?.email);

  return (
    <div className="flex min-h-screen flex-col">
      <Header cartCount={cartCount} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-heading text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <CheckoutForm user={user} cartItems={cartItems} total={total} />
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary
                items={cartItems}
                subtotal={subtotal}
                shipping={shipping}
                total={total}
                isDemoMode={isDemoMode}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
