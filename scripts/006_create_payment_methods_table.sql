-- Create saved_payment_methods table for customer payment method management
create table if not exists public.saved_payment_methods (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  method_type text not null check (method_type in ('card', 'cod')),
  card_number_masked text,
  card_holder_name text,
  expiry_month integer check (expiry_month >= 1 and expiry_month <= 12),
  expiry_year integer,
  card_type text check (card_type in ('visa', 'mastercard', 'amex', 'citrus', 'other') or card_type is null),
  is_default boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create index for user_id for faster queries
create index if not exists idx_saved_payment_methods_user_id on public.saved_payment_methods(user_id);
create index if not exists idx_saved_payment_methods_is_default on public.saved_payment_methods(user_id, is_default);

-- Enable RLS
alter table public.saved_payment_methods enable row level security;

-- RLS Policies
drop policy if exists "Users can view own payment methods" on public.saved_payment_methods;
drop policy if exists "Users can insert own payment methods" on public.saved_payment_methods;
drop policy if exists "Users can update own payment methods" on public.saved_payment_methods;
drop policy if exists "Users can delete own payment methods" on public.saved_payment_methods;

create policy "Users can view own payment methods"
on public.saved_payment_methods
for select
using (auth.uid() = user_id);

create policy "Users can insert own payment methods"
on public.saved_payment_methods
for insert
with check (auth.uid() = user_id);

create policy "Users can update own payment methods"
on public.saved_payment_methods
for update
using (auth.uid() = user_id);

create policy "Users can delete own payment methods"
on public.saved_payment_methods
for delete
using (auth.uid() = user_id);
