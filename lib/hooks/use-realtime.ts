'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface UseRealtimeOptions {
  enabled?: boolean
}

export function useRealtimeOrders(options?: UseRealtimeOptions) {
  const { enabled = true } = options || {}
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!enabled) return

    const subscribeToOrders = async () => {
      try {
        setIsLoading(true)

        // Fetch initial data
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select(`
            id,
            total_price,
            status,
            created_at,
            user_id,
            payment_method,
            order_number
          `)
          .order('created_at', { ascending: false })
          .limit(100)

        if (fetchError) throw fetchError
        setOrders(data || [])

        // Subscribe to real-time updates
        channelRef.current = supabase
          .channel('orders-realtime')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'orders',
            },
            (payload: any) => {
              if (payload.eventType === 'INSERT') {
                setOrders((prev) => [payload.new, ...prev])
              } else if (payload.eventType === 'UPDATE') {
                setOrders((prev) =>
                  prev.map((order) =>
                    order.id === payload.new.id ? payload.new : order
                  )
                )
              } else if (payload.eventType === 'DELETE') {
                setOrders((prev) => prev.filter((order) => order.id !== payload.old.id))
              }
            }
          )
          .subscribe()

        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    subscribeToOrders()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [enabled, supabase])

  return { orders, isLoading, error }
}

export function useRealtimeOrderDetail(orderId: string, enabled = true) {
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!enabled || !orderId) return

    const subscribeToOrder = async () => {
      try {
        setIsLoading(true)

        // Fetch initial data
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select(`
            *,
            order_items(
              id,
              quantity,
              price,
              products(name, slug, image_url)
            )
          `)
          .eq('id', orderId)
          .single()

        if (fetchError) throw fetchError
        setOrder(data)

        // Subscribe to real-time updates for this specific order
        channelRef.current = supabase
          .channel(`order-${orderId}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'orders',
              filter: `id=eq.${orderId}`,
            },
            (payload: any) => {
              setOrder(payload.new)
            }
          )
          .subscribe()

        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    subscribeToOrder()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [orderId, enabled, supabase])

  return { order, isLoading, error }
}

export function useRealtimeNotifications(userId: string | null, enabled = true) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!enabled || !userId) return

    const subscribeToNotifications = async () => {
      try {
        // Fetch initial unread notifications
        const { data, error: fetchError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .eq('read_status', false)
          .order('created_at', { ascending: false })
          .limit(50)

        if (fetchError) throw fetchError
        setNotifications(data || [])
        setUnreadCount(data?.length || 0)

        // Subscribe to new notifications
        channelRef.current = supabase
          .channel(`notifications-${userId}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${userId}`,
            },
            (payload: any) => {
              setNotifications((prev) => [payload.new, ...prev])
              if (!payload.new.read_status) {
                setUnreadCount((prev) => prev + 1)
              }
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${userId}`,
            },
            (payload: any) => {
              setNotifications((prev) =>
                prev.map((notif) =>
                  notif.id === payload.new.id ? payload.new : notif
                )
              )
              if (payload.old.read_status !== payload.new.read_status) {
                setUnreadCount((prev) =>
                  payload.new.read_status ? Math.max(0, prev - 1) : prev + 1
                )
              }
            }
          )
          .subscribe()
      } catch (err) {
        console.error('Notification subscription error:', err)
      }
    }

    subscribeToNotifications()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [userId, enabled, supabase])

  return { notifications, unreadCount }
}
