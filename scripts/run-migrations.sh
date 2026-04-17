#!/bin/bash

# Execute SQL migrations using psql
POSTGRES_URL="$POSTGRES_URL_NON_POOLING"

if [ -z "$POSTGRES_URL" ]; then
  echo "Error: POSTGRES_URL_NON_POOLING is not set"
  exit 1
fi

echo "Executing migrations..."

# Execute each SQL file
psql "$POSTGRES_URL" -f scripts/005_extend_products_table.sql && echo "✅ Migration 005 completed"
psql "$POSTGRES_URL" -f scripts/006_create_payment_methods_table.sql && echo "✅ Migration 006 completed"
psql "$POSTGRES_URL" -f scripts/007_extend_orders_table.sql && echo "✅ Migration 007 completed"

echo "✅ All migrations completed!"
