// app/account/settings/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock } from "lucide-react";
import { ChangePasswordForm } from "@/components/account/change-password-form";
import { PaymentMethodsList } from "@/components/account/payment-methods-list";
import type { SavedPaymentMethod } from "@/lib/types";
import { useEffect } from "react";
import { Bell } from "lucide-react";
import { NotificationSettingsForm } from "@/components/notifications/notification-settings-form";

export default function CustomerSettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<SavedPaymentMethod[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      setUser(authUser);

      if (authUser) {
        const response = await fetch("/api/payment-methods");
        if (response.ok) {
          const methods = await response.json();
          setPaymentMethods(methods);
        }
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handlePaymentMethodAdded = async () => {
    const response = await fetch("/api/payment-methods");
    if (response.ok) {
      const methods = await response.json();
      setPaymentMethods(methods);
    }
  };

  if (isLoading) {
    return <div className="space-y-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and security
        </p>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-base">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Last Sign In
              </p>
              <p className="text-base">
                {user?.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentMethodsList
            methods={paymentMethods}
            onMethodAdded={handlePaymentMethodAdded}
          />
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <ShieldCheck className="h-4 w-4" />
            <AlertDescription>
              Keep your password secure and never share it with anyone.
            </AlertDescription>
          </Alert>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Change Password
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Update your password to keep your account secure
                </p>
              </div>
              <Link href="/auth/change-password">
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Form */}
      <ChangePasswordForm />

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationSettingsForm />
        </CardContent>
      </Card>

      {/* Login History */}
      <Card>
        <CardHeader>
          <CardTitle>Login History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p>Recent login activity for your account:</p>
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
  );
}
