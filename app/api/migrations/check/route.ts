import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = await createClient()

    // We'll verify by trying to query the tables
    // If they don't exist, we know we need to migrate

    // Test if products has the new columns
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select("tax_rate, payment_methods")
      .limit(1)

    if (productsError && productsError.code === "PGRST116") {
      // Columns don't exist
      return NextResponse.json(
        {
          success: false,
          message: "Database columns not found. Tables may not be properly migrated.",
          details: productsError.message,
        },
        { status: 400 }
      )
    }

    // Test if payment methods table exists
    const { count: paymentMethodsCount, error: paymentError } =
      await supabase
        .from("saved_payment_methods")
        .select("*", { count: "exact", head: true })

    if (paymentError) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment methods table not found.",
          details: paymentError.message,
        },
        { status: 400 }
      )
    }

    // Test if orders has new columns
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select("order_number, processed_at, invoice_url")
      .limit(1)

    if (ordersError && ordersError.code === "PGRST116") {
      return NextResponse.json(
        {
          success: false,
          message: "Orders table columns not found.",
          details: ordersError.message,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "All database tables and columns are properly set up!",
        verification: {
          products_table: "✓",
          payment_methods_table: "✓",
          orders_table: "✓",
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[Migration Check Error]", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
