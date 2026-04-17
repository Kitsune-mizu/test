'use server'

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * PATCH /api/notifications/[id] - Mark as read/unread
 * DELETE /api/notifications/[id] - Delete notification
 */

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { read_status } = body

    // Update notification
    const { data, error } = await supabase
      .from('notifications')
      .update({
        read_status,
        read_at: read_status ? new Date().toISOString() : null,
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Update notification error:', error)
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Verify notification belongs to user
    const { data: notification } = await supabase
      .from('notifications')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!notification || notification.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }

    // Delete notification
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Notification deleted',
    })
  } catch (error) {
    console.error('[v0] Error deleting notification:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

