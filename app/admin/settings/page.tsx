import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChangePasswordForm } from "@/components/account/change-password-form"

export default async function AdminSettingsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage admin settings and security</p>
      </div>

      {/* Admin Info */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-lg">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Sign In</p>
              <p className="text-lg">
                {user?.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-destructive/50 bg-destructive/5">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription>
              Your account has full administrative access. Keep your password secure.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Change Password Form */}
      <ChangePasswordForm />

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>Login History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p>All login events for your admin account:</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span>Last login</span>
                <span>
                  {user?.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
