"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

const categories = [
  "Backpacks",
  "Tents",
  "Sleeping Bags",
  "Footwear",
  "Clothing",
  "Accessories",
  "Climbing",
  "Navigation",
]

const brands = [
  "Patagonia",
  "The North Face",
  "Arc'teryx",
  "Mountain Hardwear",
  "Black Diamond",
  "Osprey",
  "Salomon",
  "Garmin",
  "Nalgene",
  "Coleman",
]

interface ProductFormProps {
  mode: "create" | "edit"
  productId?: string
}

export function ProductForm({ mode, productId }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    stock: "",
    image_url: "",
    tags: "",
    tax_rate: "0",
    payment_methods: ["card", "cod"],
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "name" && { slug: value.toLowerCase().replace(/\s+/g, "-") }),
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePaymentMethodToggle = (method: string) => {
    setFormData((prev) => {
      const methods = prev.payment_methods.includes(method)
        ? prev.payment_methods.filter((m) => m !== method)
        : [...prev.payment_methods, method]
      return { ...prev, payment_methods: methods }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        category: formData.category,
        brand: formData.brand,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        image_url: formData.image_url,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        tax_rate: parseFloat(formData.tax_rate),
        payment_methods: formData.payment_methods,
      }

      const response = await fetch(
        mode === "create"
          ? "/api/products"
          : `/api/products/${productId}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) throw new Error("Failed to save product")

      toast.success(
        mode === "create"
          ? "Product created successfully"
          : "Product updated successfully"
      )

      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-heading font-bold">
            {mode === "create" ? "Add New Product" : "Edit Product"}
          </h1>
          <p className="text-muted-foreground">
            {mode === "create"
              ? "Create a new product for your store"
              : "Update product details"}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid gap-4">
              <h3 className="font-semibold">Basic Information</h3>

              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Alpine Hiking Backpack"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (auto-generated)</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="alpine-hiking-backpack"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Product description and features"
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Category & Brand */}
            <div className="grid gap-4">
              <h3 className="font-semibold">Categorization</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleSelectChange("category", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Select
                    value={formData.brand}
                    onValueChange={(value) =>
                      handleSelectChange("brand", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="outdoor, hiking, premium"
                />
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="grid gap-4">
              <h3 className="font-semibold">Pricing & Inventory</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="space-y-2">
              <Label htmlFor="image_url">Product Image URL</Label>
              <Input
                id="image_url"
                name="image_url"
                type="url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Tax & Payment Methods */}
            <div className="grid gap-4">
              <h3 className="font-semibold">Tax & Payment Settings</h3>

              <div className="space-y-2">
                <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                <Input
                  id="tax_rate"
                  name="tax_rate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.tax_rate}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-3">
                <Label>Payment Methods Available</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="payment_card"
                      checked={formData.payment_methods.includes("card")}
                      onCheckedChange={() => handlePaymentMethodToggle("card")}
                    />
                    <Label htmlFor="payment_card" className="font-normal cursor-pointer">
                      Credit/Debit Card (Visa, Mastercard, Citrus, etc.)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="payment_cod"
                      checked={formData.payment_methods.includes("cod")}
                      onCheckedChange={() => handlePaymentMethodToggle("cod")}
                    />
                    <Label htmlFor="payment_cod" className="font-normal cursor-pointer">
                      Cash on Delivery (COD)
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t">
              <Button
                type="submit"
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  `${mode === "create" ? "Create" : "Update"} Product`
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
