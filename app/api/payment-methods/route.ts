import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { data, error } = await supabase
      .from("saved_payment_methods")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch payment methods" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      method_type,
      card_number,
      card_holder,
      card_brand,
      expiry_date,
      is_default,
    } = body

    // Validate input
    if (!method_type || !card_number || !card_holder) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // If setting as default, unset other defaults
    if (is_default) {
      await supabase
        .from("saved_payment_methods")
        .update({ is_default: false })
        .eq("user_id", user.id)
    }

    const { data, error } = await supabase
      .from("saved_payment_methods")
      .insert([
        {
          user_id: user.id,
          method_type,
          card_number: `****-****-****-${card_number.slice(-4)}`,
          card_holder_name: card_holder,
          card_type: card_brand,
          expiry_month: parseInt(expiry_date.split("/")[0]),
          expiry_year: parseInt(expiry_date.split("/")[1]),
          is_default: is_default || false,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create payment method" },
      { status: 500 }
    )
  }
}
