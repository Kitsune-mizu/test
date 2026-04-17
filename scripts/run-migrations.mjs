import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeMigration(filePath) {
  try {
    const sql = fs.readFileSync(filePath, "utf-8");
    console.log(`\n📝 Executing: ${path.basename(filePath)}`);

    // Split by semicolons to handle multiple statements
    const statements = sql
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt && !stmt.startsWith("--"));

    for (const statement of statements) {
      const { error } = await supabase.rpc("exec_sql", {
        sql: statement + ";",
      });

      if (error) {
        console.error(`❌ Error executing statement:`, error);
        throw error;
      }
    }

    console.log(`✅ Successfully executed: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`Failed to execute ${filePath}:`, error);
    throw error;
  }
}

async function runMigrations() {
  const migrations = [
    "./scripts/005_extend_products_table.sql",
    "./scripts/006_create_payment_methods_table.sql",
    "./scripts/007_extend_orders_table.sql",
  ];

  try {
    console.log("🚀 Starting migrations...");

    for (const migration of migrations) {
      await executeMigration(migration);
    }

    console.log("\n✨ All migrations completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigrations();
