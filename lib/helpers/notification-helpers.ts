'use server'

import { createClient } from '@/lib/supabase/server'

export interface NotificationData {
  userId: string
  type: 'new_order' | 'low_stock' | 'product_update' | 'order_confirmed' | 'order_preparing' | 'order_shipped' | 'order_delivered'
  message: string
  link?: string | null
}

/**
 * Create a notification for a user
 */
export async function createNotification(data: NotificationData) {
  const supabase = await createClient()

  try {
    const { error } = await supabase.from('notifications').insert({
      user_id: data.userId,
      type: data.type,
      message: data.message,
      link: data.link || null,
      read_status: false,
    })

    if (error) {
      console.error('[v0] Error creating notification:', error)
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('[v0] Error in createNotification:', error)
    return { error: 'Failed to create notification' }
  }
}

/**
 * Create notification for new order (for admin)
 */
export async function createNewOrderNotification(
  adminId: string,
  orderId: string,
  customerName: string,
  totalAmount: number
) {
  return createNotification({
    userId: adminId,
    type: 'new_order',
    message: `新規注文: ${customerName} - $${totalAmount.toFixed(2)}`,
    link: `/admin/orders/${orderId}`,
  })
}

/**
 * Create notification for low stock (for admin)
 */
export async function createLowStockNotification(
  adminId: string,
  productId: string,
  productName: string,
  stock: number
) {
  return createNotification({
    userId: adminId,
    type: 'low_stock',
    message: `${productName} - Low stock: ${stock} remaining`,
    link: `/admin/products/${productId}/edit`,
  })
}

/**
 * Create notification for order confirmed (for customer)
 */
export async function createOrderConfirmedNotification(
  customerId: string,
  orderId: string,
  totalAmount: number
) {
  return createNotification({
    userId: customerId,
    type: 'order_confirmed',
    message: `ご注文ありがとうございます! Your order has been confirmed - $${totalAmount.toFixed(2)}`,
    link: `/account/orders/${orderId}`,
  })
}

/**
 * Create notification for order preparing (for customer)
 */
export async function createOrderPreparingNotification(
  customerId: string,
  orderId: string
) {
  return createNotification({
    userId: customerId,
    type: 'order_preparing',
    message: `お待たせしております: Your order is being prepared and will ship soon`,
    link: `/account/orders/${orderId}`,
  })
}

/**
 * Create notification for order shipped (for customer)
 */
export async function createOrderShippedNotification(
  customerId: string,
  orderId: string,
  trackingNumber?: string
) {
  return createNotification({
    userId: customerId,
    type: 'order_shipped',
    message: `発送済み: Your order has shipped! ${trackingNumber ? `Tracking: ${trackingNumber}` : ''}`,
    link: `/account/orders/${orderId}`,
  })
}

/**
 * Create notification for order delivered (for customer)
 */
export async function createOrderDeliveredNotification(
  customerId: string,
  orderId: string
) {
  return createNotification({
    userId: customerId,
    type: 'order_delivered',
    message: `配達完了: Your order has been delivered! Thank you for your purchase 😊`,
    link: `/account/orders/${orderId}`,
  })
}

/**
 * Get all admins for notifications
 */
export async function getAllAdmins() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'admin')

    if (error) {
      console.error('[v0] Error fetching admins:', error)
      return []
    }

    return data?.map((admin) => admin.id) || []
  } catch (error) {
    console.error('[v0] Error in getAllAdmins:', error)
    return []
  }
}

/**
 * Notify all admins about a new order
 */
export async function notifyAdminsNewOrder(
  orderId: string,
  customerName: string,
  totalAmount: number
) {
  const admins = await getAllAdmins()

  try {
    await Promise.all(
      admins.map((adminId) =>
        createNewOrderNotification(adminId, orderId, customerName, totalAmount)
      )
    )

    return { success: true }
  } catch (error) {
    console.error('[v0] Error notifying admins:', error)
    return { error: 'Failed to notify admins' }
  }
}
