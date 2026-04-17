'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRealtimeNotifications } from '@/lib/hooks/use-realtime'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Bell, Trash2, Check } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

interface Notification {
  id: string
  message: string
  type: string
  read_status: boolean
  created_at: string
  link: string | null
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const { notifications, unreadCount } = useRealtimeNotifications(userId)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
    }
    getUser()
  }, [supabase])

  const handleMarkAsRead = async (notificationId: string, isRead: boolean) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read_status: !isRead }),
      })

      if (!response.ok) throw new Error('Failed to update notification')
      toast.success('Notification updated')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error')
    }
  }

  const handleDelete = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete notification')
      toast.success('Notification deleted')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error')
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_status':
        return '📦'
      case 'payment':
        return '💳'
      case 'alert':
        return '⚠️'
      default:
        return '🔔'
    }
  }

  return (
    <>
      {/* Notification Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:w-96">
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-full mt-4">
            {notifications.length > 0 ? (
              <div className="space-y-1 pr-4">
                {notifications.map((notification: Notification, index) => (
                  <div key={notification.id}>
                    <div
                      className={`p-3 rounded-lg space-y-2 ${
                        notification.read_status
                          ? 'bg-muted/50'
                          : 'bg-primary/5 border border-primary/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="flex items-center gap-2">
                            <span>{getNotificationIcon(notification.type)}</span>
                            <span className="text-sm font-medium">
                              {notification.message}
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(notification.created_at), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleMarkAsRead(notification.id, notification.read_status)
                            }
                          >
                            {notification.read_status ? (
                              <Check className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Badge className="h-2 w-2 rounded-full p-0" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(notification.id)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>

                      {notification.link && (
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto"
                          onClick={() => {
                            window.location.href = notification.link || '/'
                          }}
                        >
                          View Details →
                        </Button>
                      )}
                    </div>
                    {index < notifications.length - 1 && <Separator className="my-1" />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <p>No notifications yet</p>
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  )
}
