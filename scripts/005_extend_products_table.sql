-- Add tax_rate and payment_methods fields to products table
alter table if exists public.products
add column if not exists tax_rate numeric default 0 check (tax_rate >= 0 and tax_rate <= 100),
add column if not exists payment_methods text[] default array['card', 'cod'];

-- Create index for tax_rate if needed for filtering
create index if not exists idx_products_tax_rate on public.products(tax_rate);
