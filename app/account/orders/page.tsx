import { createClient } from "@/lib/supabase/server";
import { OrdersList } from "@/components/account/orders-list";
import { isDemoAccount } from "@/lib/demo";

export const metadata = {
  title: "My Orders | Hikaru Bouken",
  description: "View your order history",
};

export default async function OrdersPage() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  // Check if this is a demo account
  const isDemoMode = isDemoAccount(authUser?.email);

  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        id,
        quantity,
        price,
        products (name, slug, image_url)
      )
    `,
    )
    .eq("user_id", authUser!.id)
    .order("created_at", { ascending: false });

  return <OrdersList orders={orders || []} isDemoMode={isDemoMode} />;
}
