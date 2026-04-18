"use client";

import { useState, useEffect } from "react";
import { useTransition } from "react";
import { toast } from "sonner";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  type NotificationPreferences,
} from "@/app/actions/notification-preferences";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export function NotificationSettingsForm() {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        console.log("[v0] Fetching notification preferences");
        const result = await getNotificationPreferences();

        if (result.data) {
          setPreferences(result.data);
          setHasChanges(false);
        } else {
          toast.error(result.error || "Failed to load preferences");
        }
      } catch (error) {
        console.error("[v0] Failed to fetch preferences:", error);
        toast.error("Failed to load preferences");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const handlePreferenceChange = (
    key: keyof NotificationPreferences,
    value: any
  ) => {
    setPreferences((prev) => {
      if (!prev) return null;
      return { ...prev, [key]: value };
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!preferences) return;

    startTransition(async () => {
      try {
        console.log("[v0] Updating notification preferences");
        const result = await updateNotificationPreferences(preferences);

        if (result.data) {
          setHasChanges(false);
          toast.success("Preferences updated successfully");
        } else {
          toast.error(result.error || "Failed to save preferences");
        }
      } catch (error) {
        console.error("[v0] Failed to update preferences:", error);
        toast.error("Failed to save preferences");
      }
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!preferences) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Failed to load preferences</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Email Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Email Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>New Orders</Label>
            <Switch
              checked={preferences.email_new_order}
              onCheckedChange={(value) =>
                handlePreferenceChange("email_new_order", value)
              }
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Order Confirmed</Label>
            <Switch
              checked={preferences.email_order_confirmed}
              onCheckedChange={(value) =>
                handlePreferenceChange("email_order_confirmed", value)
              }
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Order Preparing</Label>
            <Switch
              checked={preferences.email_order_preparing}
              onCheckedChange={(value) =>
                handlePreferenceChange("email_order_preparing", value)
              }
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Order Shipped</Label>
            <Switch
              checked={preferences.email_order_shipped}
              onCheckedChange={(value) =>
                handlePreferenceChange("email_order_shipped", value)
              }
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Order Delivered</Label>
            <Switch
              checked={preferences.email_order_delivered}
              onCheckedChange={(value) =>
                handlePreferenceChange("email_order_delivered", value)
              }
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Product Updates</Label>
            <Switch
              checked={preferences.email_product_update}
              onCheckedChange={(value) =>
                handlePreferenceChange("email_product_update", value)
              }
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Low Stock Alerts</Label>
            <Switch
              checked={preferences.email_low_stock}
              onCheckedChange={(value) =>
                handlePreferenceChange("email_low_stock", value)
              }
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Promotional Content</Label>
            <Switch
              checked={preferences.email_promotional}
              onCheckedChange={(value) =>
                handlePreferenceChange("email_promotional", value)
              }
              disabled={isPending}
            />
          </div>

          <div className="border-t pt-4">
            <Label className="block mb-2">Email Frequency</Label>
            <Select
              value={preferences.email_frequency}
              onValueChange={(value) =>
                handlePreferenceChange("email_frequency", value)
              }
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Digest</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* In-App Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">In-App Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>New Orders</Label>
            <Switch
              checked={preferences.app_new_order}
              onCheckedChange={(value) =>
                handlePreferenceChange("app_new_order", value)
              }
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Order Confirmed</Label>
            <Switch
              checked={preferences.app_order_confirmed}
              onCheckedChange={(value) =>
                handlePreferenceChange("app_order_confirmed", value)
              }
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Order Preparing</Label>
            <Switch
              checked={preferences.app_order_preparing}
              onCheckedChange={(value) =>
                handlePreferenceChange("app_order_preparing", value)
              }
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Order Shipped</Label>
            <Switch
              checked={preferences.app_order_shipped}
              onCheckedChange={(value) =>
                handlePreferenceChange("app_order_shipped", value)
              }
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Order Delivered</Label>
            <Switch
              checked={preferences.app_order_delivered}
              onCheckedChange={(value) =>
                handlePreferenceChange("app_order_delivered", value)
              }
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Product Updates</Label>
            <Switch
              checked={preferences.app_product_update}
              onCheckedChange={(value) =>
                handlePreferenceChange("app_product_update", value)
              }
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Low Stock Alerts</Label>
            <Switch
              checked={preferences.app_low_stock}
              onCheckedChange={(value) =>
                handlePreferenceChange("app_low_stock", value)
              }
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Promotional Content</Label>
            <Switch
              checked={preferences.app_promotional}
              onCheckedChange={(value) =>
                handlePreferenceChange("app_promotional", value)
              }
              disabled={isPending}
            />
          </div>
        </CardContent>
      </Card>

      {/* Push Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Push Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Order Updates</Label>
            <Switch
              checked={preferences.push_orders}
              onCheckedChange={(value) =>
                handlePreferenceChange("push_orders", value)
              }
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Promotional Offers</Label>
            <Switch
              checked={preferences.push_promotions}
              onCheckedChange={(value) =>
                handlePreferenceChange("push_promotions", value)
              }
              disabled={isPending}
            />
          </div>
        </CardContent>
      </Card>

      {/* Communication Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Communication Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Subscribe to Newsletter</Label>
            <Switch
              checked={preferences.newsletter_subscribed}
              onCheckedChange={(value) =>
                handlePreferenceChange("newsletter_subscribed", value)
              }
              disabled={isPending}
            />
          </div>

          <div className="border-t pt-4">
            <Label className="block mb-2">Language</Label>
            <Select
              value={preferences.communication_language}
              onValueChange={(value) =>
                handlePreferenceChange("communication_language", value)
              }
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ja">Japanese (日本語)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isPending}
          className="w-full"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
      </div>
    </div>
  );
}
