import { createClient } from "@/lib/supabase/server"
import { NextResponse, NextRequest } from "next/server"

/**
 * GET /api/admin/products/[id] - Get a single product
 * PATCH /api/admin/products/[id] - Update a product
 * DELETE /api/admin/products/[id] - Delete a product
 */

async function verifyAdmin(userId: string) {
  const supabase = await createClient()
  const { data: user_profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single()

  return user_profile?.role === "admin"
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Verify admin
    const isAdmin = await verifyAdmin(user.id)
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 403 })
    }

    // Get product
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single()

    if (error || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("[v0] Error fetching product:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Verify admin
    const isAdmin = await verifyAdmin(user.id)
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 403 })
    }

    // Update product
    const { error } = await supabase
      .from("products")
      .update(body)
      .eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: "Product updated" })
  } catch (error) {
    console.error("[v0] Error updating product:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Verify admin
    const isAdmin = await verifyAdmin(user.id)
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 403 })
    }

    // Delete product
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: "Product deleted" })
  } catch (error) {
    console.error("[v0] Error deleting product:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

