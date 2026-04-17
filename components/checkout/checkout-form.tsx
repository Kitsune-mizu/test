"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { createOrderAction } from "@/app/actions/orders"
import { CreditCard, Truck, Loader2, AlertCircle } from "lucide-react"
import type { User } from "@/lib/types"
import { isDemoAccount, DEMO_CARDS } from "@/lib/demo"

interface CartItem {
  id: string
  quantity: number
  product_id: string
  products: {
    id: string
    price: number
  } | null
}

interface CheckoutFormProps {
  user: User | null
  cartItems: CartItem[]
  total: number
}

export function CheckoutForm({ user, cartItems, total }: CheckoutFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isDemoMode = isDemoAccount(user?.email)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    paymentMethod: "card",
    shippingMethod: "standard",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.address) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    // Prepare order items
    const orderItems = cartItems
      .filter((item) => item.products)
      .map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.products!.price,
      }))

    const result = await createOrderAction({
      totalPrice: total,
      paymentMethod: formData.paymentMethod,
      shippingMethod: formData.shippingMethod,
      shippingAddress: `${formData.name}\n${formData.address}\n${formData.phone}`,
      items: orderItems,
    })

    if (result.error) {
      toast.error(result.error)
      setIsSubmitting(false)
    } else {
      toast.success("Order placed successfully!")
      // Redirect to success page for demo accounts, otherwise to order detail
      const successPath = isDemoMode
        ? `/account/orders/${result.orderId}/success`
        : `/account/orders/${result.orderId}`
      router.push(successPath)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900">Test Mode Active</p>
            <p className="text-sm text-blue-700 mt-1">No real payment will be charged. Use the test card below to complete checkout.</p>
            <div className="mt-3 bg-white rounded p-3 border border-blue-100 text-sm font-mono">
              <p className="text-gray-600">Card: <span className="text-black">{DEMO_CARDS.success.number}</span></p>
              <p className="text-gray-600">Exp: <span className="text-black">{DEMO_CARDS.success.expiry}</span> CVC: <span className="text-black">{DEMO_CARDS.success.cvc}</span></p>
            </div>
          </div>
        </div>
      )}
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Shipping Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="address">Full Address *</Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              placeholder="Street address, city, state, zip code"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Shipping Courier */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Shipping Courier</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.shippingMethod}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, shippingMethod: value }))
            }
            className="space-y-3"
          >
            {["DHL", "JNE", "J&T", "FedEx"].map((courier) => (
              <div key={courier} className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <RadioGroupItem value={courier.toLowerCase()} id={courier} />
                <Label htmlFor={courier} className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{courier}</p>
                        <p className="text-sm text-muted-foreground">Fast and reliable delivery</p>
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.paymentMethod}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, paymentMethod: value }))
            }
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Credit / Debit Card</p>
                    <p className="text-sm text-muted-foreground">
                      {isDemoMode 
                        ? "Use test card from above" 
                        : "Pay securely with your card"}
                    </p>
                  </div>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Separator />

      {/* Submit */}
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Processing...
          </>
        ) : (
          "Place Order"
        )}
      </Button>
    </form>
  )
}
