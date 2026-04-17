import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  const results = {
    tables_created: false,
    products_seeded: false,
    errors: [] as string[],
  }

  const demoCredentials = {
    customerEmail: "customer@hikaru.test",
    customerPassword: "DemoPassword123!",
    adminEmail: "admin@hikaru.test",
    adminPassword: "AdminPassword123!",
  }

  const sampleProducts = [
    {
      name: "Alpine Pro Backpack 50L",
      slug: "alpine-pro-backpack-50l",
      description:
        "Premium 50L hiking backpack with ergonomic design, rain cover, and multiple compartments.",
      category: "Backpacks",
      brand: "Patagonia",
      price: 299.99,
      stock: 45,
      image_url:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
      tags: ["hiking", "backpack", "premium"],
    },
    {
      name: "Summit Hiking Boots",
      slug: "summit-hiking-boots",
      description:
        "Waterproof hiking boots with ankle support and durable rubber sole.",
      category: "Footwear",
      brand: "Salomon",
      price: 189.99,
      stock: 67,
      image_url:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
      tags: ["boots", "hiking", "footwear"],
    },
    {
      name: "Mountain Tent 4-Person",
      slug: "mountain-tent-4-person",
      description:
        "Lightweight 4-person tent with instant setup and aluminum poles.",
      category: "Tents",
      brand: "Mountain Hardwear",
      price: 449.99,
      stock: 28,
      image_url:
        "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=500&h=500&fit=crop",
      tags: ["tent", "camping"],
    },
    {
      name: "Thermal Sleeping Bag",
      slug: "thermal-sleeping-bag",
      description: "Sleeping bag rated for cold weather camping.",
      category: "Sleeping Bags",
      brand: "The North Face",
      price: 229.99,
      stock: 52,
      image_url:
        "https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?w=500&h=500&fit=crop",
      tags: ["sleeping bag", "camping"],
    },
  ]

  try {
    // Check if products table exists
    const { count: productCount, error: countError } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })

    if (countError) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Database tables not found. Please run SQL migration scripts first.",
        },
        { status: 400 }
      )
    }

    results.tables_created = true

    // Create demo customer
    const { error: customerError } = await supabase.auth.admin.createUser({
      email: demoCredentials.customerEmail,
      password: demoCredentials.customerPassword,
      email_confirm: true,
    })

    if (customerError && !customerError.message.includes("already")) {
      results.errors.push(customerError.message)
    }

    // Create demo admin
    const { data: adminData, error: adminError } =
      await supabase.auth.admin.createUser({
        email: demoCredentials.adminEmail,
        password: demoCredentials.adminPassword,
        email_confirm: true,
      })

    if (adminError && !adminError.message.includes("already")) {
      results.errors.push(adminError.message)
    }

    //  SET ROLE ADMIN 
    if (adminData?.user) {
      await supabase
        .from("users")
        .update({ role: "admin" })
        .eq("id", adminData.user.id)
    }

    if (!adminData?.user) {
      const { data: existingAdmin } = await supabase
        .from("users")
        .select("id")
        .eq("email", demoCredentials.adminEmail)
        .single()

      if (existingAdmin) {
        await supabase
          .from("users")
          .update({ role: "admin" })
          .eq("id", existingAdmin.id)
      }
    }

    // Seed products
    if (!productCount) {
      const { error: insertError } = await supabase
        .from("products")
        .insert(sampleProducts)

      if (insertError) {
        results.errors.push(insertError.message)
      } else {
        results.products_seeded = true
      }
    } else {
      results.products_seeded = true
    }

    return NextResponse.json({
      success: true,
      message: "Setup complete!",
      credentials: demoCredentials,
      results,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}