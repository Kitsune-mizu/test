import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSql(filePath) {
  const sql = fs.readFileSync(filePath, "utf8");
  console.log(`\n📝 Executing: ${path.basename(filePath)}`);

  try {
    const { error } = await supabase.rpc("exec_sql", { sql_query: sql });
    if (error) {
      console.error(`❌ Error in ${path.basename(filePath)}:`, error.message);
      return false;
    }
    console.log(`✅ Successfully executed: ${path.basename(filePath)}`);
    return true;
  } catch (err) {
    console.error(
      `❌ Error executing ${path.basename(filePath)}:`,
      err.message,
    );
    return false;
  }
}

async function runMigrations() {
  const migrationFiles = [
    "scripts/005_extend_products_table.sql",
    "scripts/006_create_payment_methods_table.sql",
    "scripts/007_extend_orders_table.sql",
  ];

  let allSuccess = true;
  for (const file of migrationFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const success = await executeSql(filePath);
      allSuccess = allSuccess && success;
    } else {
      console.warn(`⚠️  File not found: ${file}`);
    }
  }

  if (allSuccess) {
    console.log("\n✅ All migrations completed successfully!");
  } else {
    console.log("\n❌ Some migrations failed!");
    process.exit(1);
  }
}

runMigrations();
