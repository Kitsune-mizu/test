import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();

  const results = {
    migrations_run: [] as string[],
    errors: [] as string[],
  };

  // Migration 1: Extend products table
  try {
    await supabase.rpc("exec_sql", {
      sql_query: `
        ALTER TABLE IF EXISTS public.products
        ADD COLUMN IF NOT EXISTS tax_rate numeric DEFAULT 0 CHECK (tax_rate >= 0 AND tax_rate <= 100),
        ADD COLUMN IF NOT EXISTS payment_methods text[] DEFAULT ARRAY['card', 'cod'];
        
        CREATE INDEX IF NOT EXISTS idx_products_tax_rate ON public.products(tax_rate);
      `,
    });
    results.migrations_run.push("Products table extended");
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (!errorMsg.includes("does not exist")) {
      results.errors.push(`Products migration: ${errorMsg}`);
    }
  }

  // Migration 2: Create saved_payment_methods table
  try {
    await supabase.rpc("exec_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS public.saved_payment_methods (
          id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
          method_type text NOT NULL CHECK (method_type IN ('card', 'cod')),
          card_number_masked text,
          card_holder_name text,
          expiry_month integer CHECK (expiry_month >= 1 AND expiry_month <= 12),
          expiry_year integer,
          card_type text CHECK (card_type IN ('visa', 'mastercard', 'amex', 'citrus', 'other') OR card_type IS NULL),
          is_default boolean DEFAULT false,
          created_at timestamp with time zone DEFAULT NOW(),
          updated_at timestamp with time zone DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_saved_payment_methods_user_id ON public.saved_payment_methods(user_id);
        CREATE INDEX IF NOT EXISTS idx_saved_payment_methods_is_default ON public.saved_payment_methods(user_id, is_default);
        
        ALTER TABLE public.saved_payment_methods ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can view own payment methods" ON public.saved_payment_methods;
        DROP POLICY IF EXISTS "Users can insert own payment methods" ON public.saved_payment_methods;
        DROP POLICY IF EXISTS "Users can update own payment methods" ON public.saved_payment_methods;
        DROP POLICY IF EXISTS "Users can delete own payment methods" ON public.saved_payment_methods;
        
        CREATE POLICY "Users can view own payment methods"
        ON public.saved_payment_methods
        FOR SELECT
        USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can insert own payment methods"
        ON public.saved_payment_methods
        FOR INSERT
        WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Users can update own payment methods"
        ON public.saved_payment_methods
        FOR UPDATE
        USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can delete own payment methods"
        ON public.saved_payment_methods
        FOR DELETE
        USING (auth.uid() = user_id);
      `,
    });
    results.migrations_run.push("Payment methods table created");
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (!errorMsg.includes("does not exist")) {
      results.errors.push(`Payment methods migration: ${errorMsg}`);
    }
  }

  // Migration 3: Extend orders table
  try {
    await supabase.rpc("exec_sql", {
      sql_query: `
        ALTER TABLE IF EXISTS public.orders
        ADD COLUMN IF NOT EXISTS order_number text UNIQUE,
        ADD COLUMN IF NOT EXISTS processed_at timestamp with time zone,
        ADD COLUMN IF NOT EXISTS invoice_url text;
        
        CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
        CREATE INDEX IF NOT EXISTS idx_orders_processed_at ON public.orders(processed_at);
      `,
    });
    results.migrations_run.push("Orders table extended");
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (!errorMsg.includes("does not exist")) {
      results.errors.push(`Orders migration: ${errorMsg}`);
    }
  }

  return NextResponse.json({
    success: results.errors.length === 0,
    migrations_run: results.migrations_run,
    errors: results.errors,
  });
}
