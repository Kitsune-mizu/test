"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Trash2, Check } from "lucide-react";
import type { SavedPaymentMethod } from "@/lib/types";

interface PaymentMethodsListProps {
  methods: SavedPaymentMethod[];
  onMethodAdded?: () => void;
}

const CARD_BRANDS = [
  { value: "visa", label: "Visa" },
  { value: "mastercard", label: "Mastercard" },
  { value: "citrus", label: "Citrus" },
  { value: "amex", label: "American Express" },
  { value: "discover", label: "Discover" },
];

export function PaymentMethodsList({
  methods = [],
  onMethodAdded,
}: PaymentMethodsListProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    card_number: "",
    card_holder: "",
    card_brand: "visa",
    expiry_date: "",
  });

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    if (
      !formData.card_number ||
      !formData.card_holder ||
      !formData.expiry_date
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method_type: "card",
          card_number: formData.card_number.replace(/\s/g, ""),
          card_holder: formData.card_holder,
          card_brand: formData.card_brand,
          expiry_date: formData.expiry_date,
          is_default: methods.length === 0,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add payment method");
      }

      toast.success("Payment method added successfully");
      setFormData({
        card_number: "",
        card_holder: "",
        card_brand: "visa",
        expiry_date: "",
      });
      setShowForm(false);
      onMethodAdded?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add payment method",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMethod = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment method?"))
      return;

    try {
      const response = await fetch(`/api/payment-methods/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Payment method deleted");
      onMethodAdded?.();
    } catch (error) {
      toast.error("Failed to delete payment method");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const response = await fetch(`/api/payment-methods/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_default: true }),
      });

      if (!response.ok) throw new Error("Failed to update");

      toast.success("Default payment method updated");
      onMethodAdded?.();
    } catch (error) {
      toast.error("Failed to update payment method");
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Payment Method Form */}
      {showForm && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-lg">Add New Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddPaymentMethod} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="card_number">Card Number *</Label>
                  <Input
                    id="card_number"
                    placeholder="1234 5678 9012 3456"
                    value={formData.card_number}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        card_number: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="card_holder">Card Holder Name *</Label>
                  <Input
                    id="card_holder"
                    placeholder="John Doe"
                    value={formData.card_holder}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        card_holder: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="card_brand">Card Brand *</Label>
                  <Select
                    value={formData.card_brand}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        card_brand: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CARD_BRANDS.map((brand) => (
                        <SelectItem key={brand.value} value={brand.value}>
                          {brand.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiry_date">Expiry Date (MM/YY) *</Label>
                  <Input
                    id="expiry_date"
                    placeholder="12/25"
                    value={formData.expiry_date}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        expiry_date: e.target.value,
                      }))
                    }
                    maxLength="5"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Adding...
                    </>
                  ) : (
                    "Add Payment Method"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Payment Methods List */}
      {methods.length > 0 ? (
        <div className="space-y-3">
          {methods.map((method) => (
            <Card key={method.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold">
                        {method.card_brand?.toUpperCase()}
                      </p>
                      {method.is_default && (
                        <Badge variant="default" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {method.card_number}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expires: {method.expiry_date}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      {method.card_holder}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {!method.is_default && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDeleteMethod(method.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="text-center py-8 border border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">
              No payment methods added yet
            </p>
          </div>
        )
      )}

      {/* Add Button */}
      {!showForm && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowForm(true)}
        >
          Add Payment Method
        </Button>
      )}
    </div>
  );
}
