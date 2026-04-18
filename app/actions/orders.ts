"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { isDemoAccount } from "@/lib/demo";
import { generateOrderId } from "@/lib/order-id";
import {
  notifyAdminsNewOrder,
} from "@/lib/helpers/notification-helpers";
import { sendOrderConfirmationEmail } from "@/lib/helpers/email-helpers";

interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

interface CreateOrderParams {
  totalPrice: number;
  paymentMethod: string;
  shippingMethod: string;
  shippingAddress: string;
  items: OrderItem[];
}

export async function createOrderAction(params: CreateOrderParams) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const isDemo = isDemoAccount(user.email);
  const orderStatus = isDemo ? "processing" : "pending";

  const orderId = generateOrderId();

  const orderNumber = `ORD-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)
    .toUpperCase()}`;

  // CREATE ORDER
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      id: orderId,
      user_id: user.id,
      total_price: params.totalPrice,
      payment_method: params.paymentMethod,
      shipping_method: params.shippingMethod,
      shipping_address: params.shippingAddress,
      status: orderStatus,
      order_number: orderNumber,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { error: orderError?.message || "Failed to create order" };
  }

  // CREATE ORDER ITEMS
  const orderItems = params.items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    return { error: itemsError.message };
  }

  // UPDATE STOCK (FIXED)
  for (const item of params.items) {
    const { error: stockError } = await supabase.rpc("decrement_stock", {
      product_id: item.product_id,
      quantity: item.quantity,
    });

    if (stockError) {
      console.error("Stock update failed:", stockError.message);
    }
  }

  // CLEAR CART
  await supabase.from("cart").delete().eq("user_id", user.id);

  // AUTO CONFIRM (DEMO)
  if (isDemo) {
    await supabase
      .from("orders")
      .update({ status: "confirmed" })
      .eq("id", order.id);
  }

  // ADMIN NOTIFICATION
  try {
    const { data: customerProfile } = await supabase
      .from("users")
      .select("name")
      .eq("id", user.id)
      .single();

    await notifyAdminsNewOrder(
      orderId,
      customerProfile?.name || "Customer",
      params.totalPrice
    );
  } catch (error) {
    console.error("Failed to notify admins:", error);
  }

  // 🔥 FIX: GET PRODUCT NAMES FOR EMAIL
  let emailItems: { name: string; quantity: number; price: number }[] = [];

  try {
    const productIds = params.items.map((i) => i.product_id);

    const { data: products } = await supabase
      .from("products")
      .select("id, name")
      .in("id", productIds);

    emailItems = params.items.map((item) => {
      const product = products?.find((p) => p.id === item.product_id);
      return {
        name: product?.name || "Product",
        quantity: item.quantity,
        price: item.price,
      };
    });
  } catch (e) {
    console.error("Failed mapping email items", e);
  }

  // SEND EMAIL
  try {
    const { data: userProfile } = await supabase
      .from("users")
      .select("name, email")
      .eq("id", user.id)
      .single();

    if (userProfile?.email) {
      await sendOrderConfirmationEmail(userProfile.email, {
        orderNumber,
        customerName: userProfile?.name || "Customer",
        totalPrice: params.totalPrice,
        items: emailItems,
        orderId: order.id,
      });
    }
  } catch (error) {
    console.error("Failed to send email:", error);
  }

  // NOTIFICATION
  await supabase.from("notifications").insert({
    user_id: user.id,
    message: `Your order #${orderNumber} has been ${
      isDemo ? "created in test mode" : "placed successfully"
    }!`,
    link: `/account/orders/${orderId}`,
    type: "order",
  });

  revalidatePath("/", "layout");

  return { success: true, orderId };
}

export async function cancelOrderAction(orderId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data: order } = await supabase
    .from("orders")
    .select("id, status")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (!order) {
    return { error: "Order not found" };
  }

  if (!["pending", "confirmed"].includes(order.status)) {
    return { error: "Order cannot be cancelled at this stage" };
  }

  const { error } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId);

  if (error) return { error: error.message };

  await supabase.from("notifications").insert({
    user_id: user.id,
    message: `Your order #${orderId.slice(0, 8)} has been cancelled.`,
    link: `/account/orders/${orderId}`,
    type: "order",
  });

  revalidatePath("/", "layout");

  return { success: true };
}