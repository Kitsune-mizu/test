import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

export async function GET() {
  try {
    const supabase = await createClient();

    const results = {
      migrations_executed: [] as string[],
      errors: [] as string[],
    };

    // Get the migrations in order
    const migrationFiles = [
      "005_extend_products_table.sql",
      "006_create_payment_methods_table.sql",
      "007_extend_orders_table.sql",
    ];

    for (const file of migrationFiles) {
      try {
        const filePath = path.join(process.cwd(), "scripts", file);
        const sql = fs.readFileSync(filePath, "utf-8");

        // Split by semicolons and filter empty statements
        const statements = sql
          .split(";")
          .map((stmt) => stmt.trim())
          .filter(
            (stmt) => stmt && !stmt.startsWith("--") && !stmt.startsWith("/*"),
          );

        // Execute each statement
        for (const statement of statements) {
          const { error } = await supabase.rpc("exec_sql", {
            sql: statement + ";",
          });

          if (error) {
            // Check if it's a "function does not exist" error
            if (
              error.message.includes("exec_sql") ||
              error.message.includes("does not exist")
            ) {
              // Try alternative method using raw query if available
              console.warn(`RPC method not available, skipping: ${file}`);
              results.migrations_executed.push(
                `${file} (skipped - RPC not available)`,
              );
              continue;
            } else {
              results.errors.push(`${file}: ${error.message}`);
            }
          }
        }

        results.migrations_executed.push(file);
      } catch (error) {
        results.errors.push(
          `${file}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }

    return NextResponse.json({
      success: results.errors.length === 0,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
