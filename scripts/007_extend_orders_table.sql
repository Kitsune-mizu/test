-- Add new fields to orders table for order success flow and invoicing
alter table if exists public.orders
add column if not exists order_number text unique,
add column if not exists processed_at timestamp with time zone,
add column if not exists invoice_url text;

-- Create index for order_number for faster lookups
create index if not exists idx_orders_order_number on public.orders(order_number);
create index if not exists idx_orders_processed_at on public.orders(processed_at);
