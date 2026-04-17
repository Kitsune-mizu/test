'use server'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Check auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all stats in parallel with limits to prevent heavy queries
    const [
      { count: productsCount },
      { count: allOrdersCount },
      { data: deliveredOrdersData },
      { data: lowStockData },
    ] = await Promise.all([
      supabase
        .from('products')
        .select('id', { count: 'exact', head: true }),
      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true }),
      supabase
        .from('orders')
        .select('total_price')
        .eq('status', 'delivered')
        .limit(1000), // Limit to prevent huge aggregations
      supabase
        .from('products')
        .select('id, name, stock')
        .lt('stock', 10)
        .gt('stock', 0)
        .limit(100),
    ])

    // Calculate totals
    const totalRevenue = deliveredOrdersData?.reduce(
      (sum, order) => sum + (order.total_price || 0),
      0
    ) || 0

    const lowStockCount = lowStockData?.length || 0

    return NextResponse.json({
      productsCount: productsCount || 0,
      ordersCount: allOrdersCount || 0,
      totalRevenue,
      lowStockCount,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
