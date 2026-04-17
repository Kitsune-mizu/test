import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials");
  console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✓" : "✗");
  console.error("SUPABASE_SERVICE_ROLE_KEY:", supabaseServiceKey ? "✓" : "✗");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSqlFile(filePath) {
  const sql = fs.readFileSync(filePath, "utf8");
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  console.log(
    `\n📝 Executing: ${path.basename(filePath)} (${statements.length} statements)`,
  );

  for (const statement of statements) {
    try {
      const { error } = await supabase.rpc("exec_sql", {
        sql_query: statement,
      });
      if (error && !error.message.includes("does not exist")) {
        console.error(`  ❌ Error: ${error.message}`);
        return false;
      }
    } catch (err) {
      console.error(`  ❌ Exception: ${err.message}`);
      return false;
    }
  }

  console.log(`✅ Successfully executed: ${path.basename(filePath)}`);
  return true;
}

async function runMigrations() {
  const migrationFiles = [
    path.join(__dirname, "../scripts/005_extend_products_table.sql"),
    path.join(__dirname, "../scripts/006_create_payment_methods_table.sql"),
    path.join(__dirname, "../scripts/007_extend_orders_table.sql"),
  ];

  console.log("🚀 Starting database migrations...\n");
  let allSuccess = true;

  for (const filePath of migrationFiles) {
    if (fs.existsSync(filePath)) {
      const success = await executeSqlFile(filePath);
      allSuccess = allSuccess && success;
    } else {
      console.warn(`⚠️  File not found: ${filePath}`);
      allSuccess = false;
    }
  }

  if (allSuccess) {
    console.log("\n✅ All migrations completed successfully!");
    process.exit(0);
  } else {
    console.log("\n❌ Some migrations failed!");
    process.exit(1);
  }
}

runMigrations();
