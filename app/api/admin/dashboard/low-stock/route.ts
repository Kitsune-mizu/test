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

    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, stock')
      .lt('stock', 10)
      .gt('stock', 0)
      .order('stock', { ascending: true })
      .limit(10)

    if (error) throw error

    return NextResponse.json(products || [])
  } catch (error) {
    console.error('Low stock error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch low stock products' },
      { status: 500 }
    )
  }
}
