'use server'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body

    // Update order status
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', params.orderId)
      .select()
      .single()

    if (updateError) throw updateError

    // Create notification for customer
    if (updatedOrder) {
      const statusMessages: Record<string, string> = {
        pending: 'Your order is pending',
        processing: 'Your order is being processed',
        confirmed: 'Your order has been confirmed',
        preparing: 'Your order is being prepared for shipment',
        shipped: 'Your order has been shipped',
        delivered: 'Your order has been delivered',
        cancelled: 'Your order has been cancelled',
      }

      await supabase.from('notifications').insert({
        user_id: updatedOrder.user_id,
        message: statusMessages[status] || `Order status updated to ${status}`,
        type: 'order_status',
        link: `/account/orders/${params.orderId}`,
      })
    }

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Update order status error:', error)
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    )
  }
}
