'use server'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        total_price,
        status,
        created_at,
        users!inner(name)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) throw error

    return NextResponse.json(
      orders?.map((order: any) => ({
        id: order.id,
        total_price: order.total_price,
        status: order.status,
        created_at: order.created_at,
        user_name: order.users?.name,
      })) || []
    )
  } catch (error) {
    console.error('Recent orders error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent orders' },
      { status: 500 }
    )
  }
}
