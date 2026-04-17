// app/account/notifications/page.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell } from "lucide-react"

export default function CustomerNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Notifications</h1>
        <p className="text-muted-foreground">Your order updates and alerts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Notifications center coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}