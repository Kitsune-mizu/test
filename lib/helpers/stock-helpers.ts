"use server";

import { createClient } from "@/lib/supabase/server";

export interface StockValidationResult {
  isValid: boolean;
  message?: string;
  insufficientItems?: Array<{
    productId: string;
    productName: string;
    requested: number;
    available: number;
  }>;
}

/**
 * Validate stock availability for order items
 */
export async function validateStock(
  items: Array<{ product_id: string; quantity: number }>,
): Promise<StockValidationResult> {
  const supabase = await createClient();

  try {
    // Fetch all products with their current stock
    const productIds = items.map((item) => item.product_id);
    const { data: products, error } = await supabase
      .from("products")
      .select("id, name, stock")
      .in("id", productIds);

    if (error) {
      console.error("[v0] Error fetching products:", error);
      return {
        isValid: false,
        message: "Failed to validate stock",
      };
    }

    // Check stock availability
    const insufficientItems = [];

    for (const item of items) {
      const product = products?.find((p) => p.id === item.product_id);

      if (!product) {
        insufficientItems.push({
          productId: item.product_id,
          productName: "Unknown Product",
          requested: item.quantity,
          available: 0,
        });
        continue;
      }

      if (product.stock < item.quantity) {
        insufficientItems.push({
          productId: product.id,
          productName: product.name,
          requested: item.quantity,
          available: product.stock,
        });
      }
    }

    if (insufficientItems.length > 0) {
      return {
        isValid: false,
        message: "Some items are out of stock",
        insufficientItems,
      };
    }

    return {
      isValid: true,
      message: "All items are in stock",
    };
  } catch (error) {
    console.error("[v0] Stock validation error:", error);
    return {
      isValid: false,
      message: "An error occurred during stock validation",
    };
  }
}

/**
 * Deduct stock from products after successful order
 */
export async function deductStock(
  items: Array<{ product_id: string; quantity: number }>,
): Promise<{ success: boolean; message?: string }> {
  const supabase = await createClient();

  try {
    // Use RPC or batch updates to deduct stock
    const deductionPromises = items.map((item) =>
      supabase
        .from("products")
        .update({
          stock: supabase.rpc("decrement_stock", {
            p_id: item.product_id,
            p_quantity: item.quantity,
          }),
        })
        .eq("id", item.product_id),
    );

    // Alternative approach using raw SQL via Postgres function
    for (const item of items) {
      const { error } = await supabase.rpc("decrement_stock", {
        p_id: item.product_id,
        p_quantity: item.quantity,
      });

      if (error) {
        console.error(
          `[v0] Error deducting stock for ${item.product_id}:`,
          error,
        );
        return {
          success: false,
          message: `Failed to update stock for product ${item.product_id}`,
        };
      }
    }

    return {
      success: true,
      message: "Stock updated successfully",
    };
  } catch (error) {
    console.error("[v0] Stock deduction error:", error);
    return {
      success: false,
      message: "An error occurred while updating stock",
    };
  }
}

/**
 * Check if product is low on stock (< 5 items)
 */
export async function checkLowStock(): Promise<
  Array<{ productId: string; productName: string; currentStock: number }>
> {
  const supabase = await createClient();

  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("id, name, stock")
      .lt("stock", 5)
      .order("stock", { ascending: true });

    if (error) {
      console.error("[v0] Error checking low stock:", error);
      return [];
    }

    return (
      products?.map((p) => ({
        productId: p.id,
        productName: p.name,
        currentStock: p.stock,
      })) || []
    );
  } catch (error) {
    console.error("[v0] Low stock check error:", error);
    return [];
  }
}

/**
 * Get real-time stock status for a product
 */
export async function getProductStock(
  productId: string,
): Promise<number | null> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("products")
      .select("stock")
      .eq("id", productId)
      .single();

    if (error) {
      console.error("[v0] Error fetching stock:", error);
      return null;
    }

    return data?.stock || 0;
  } catch (error) {
    console.error("[v0] Stock fetch error:", error);
    return null;
  }
}
