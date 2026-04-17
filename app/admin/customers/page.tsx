import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, Bell, BarChart3 } from "lucide-react"

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Customers</h1>
        <p className="text-muted-foreground">Manage your customer base</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Customer management coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
