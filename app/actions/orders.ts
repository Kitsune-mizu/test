"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { isDemoAccount } from "@/lib/demo"
import { generateOrderId } from "@/lib/order-id"

interface OrderItem {
  product_id: string
  quantity: number
  price: number
}

interface CreateOrderParams {
  totalPrice: number
  paymentMethod: string
  shippingMethod: string
  shippingAddress: string
  items: OrderItem[]
}

export async function createOrderAction(params: CreateOrderParams) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  // Check if this is a demo account
  const isDemo = isDemoAccount(user.email)
  
  // For demo accounts, auto-confirm the order (status: confirmed)
  // For real accounts, orders start as pending and need payment confirmation
  const orderStatus = isDemo ? "confirmed" : "pending"
  
  // Generate alphanumeric order ID
  const orderId = generateOrderId()

  // Create order
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
    })
    .select("id")
    .single()

  if (orderError || !order) {
    return { error: orderError?.message || "Failed to create order" }
  }

  // Create order items
  const orderItems = params.items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
  }))

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems)

  if (itemsError) {
    // Rollback order if items fail
    await supabase.from("orders").delete().eq("id", order.id)
    return { error: itemsError.message }
  }

  // Update product stock
  for (const item of params.items) {
    await supabase.rpc("decrement_stock", {
      product_id: item.product_id,
      quantity: item.quantity,
    }).catch(() => {
      // Silently fail stock update - admin can handle manually
    })
  }

  // Clear cart
  await supabase.from("cart").delete().eq("user_id", user.id)

  // Create notification
  await supabase.from("notifications").insert({
    user_id: user.id,
    message: `Your order #${orderId} has been ${isDemo ? "created in test mode" : "placed successfully"}!`,
    link: `/account/orders/${orderId}`,
    type: "order",
  })

  revalidatePath("/", "layout")
  return { success: true, orderId: orderId }
}

export async function cancelOrderAction(orderId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  // Verify order belongs to user and can be cancelled
  const { data: order } = await supabase
    .from("orders")
    .select("id, status")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single()

  if (!order) {
    return { error: "Order not found" }
  }

  if (!["pending", "confirmed"].includes(order.status)) {
    return { error: "Order cannot be cancelled at this stage" }
  }

  const { error } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId)

  if (error) return { error: error.message }

  // Create notification
  await supabase.from("notifications").insert({
    user_id: user.id,
    message: `Your order #${orderId.slice(0, 8)} has been cancelled.`,
    link: `/account/orders/${orderId}`,
    type: "order",
  })

  revalidatePath("/", "layout")
  return { success: true }
}
