-- =====================================================
-- ENABLE RLS
-- =====================================================

alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.cart enable row level security;
alter table public.wishlist enable row level security;
alter table public.reviews enable row level security;
alter table public.notifications enable row level security;


-- =====================================================
-- HELPER FUNCTION (FIX INFINITE RECURSION)
-- =====================================================

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
    and role = 'admin'
  );
$$;


-- =====================================================
-- USERS POLICIES
-- =====================================================

drop policy if exists "Users can view own profile" on public.users;
drop policy if exists "Users can update own profile" on public.users;
drop policy if exists "Users can insert own profile" on public.users;
drop policy if exists "Admin can view all users" on public.users;

create policy "Users can view own profile"
on public.users
for select
using (auth.uid() = id);

create policy "Users can update own profile"
on public.users
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can insert own profile"
on public.users
for insert
with check (auth.uid() = id);

create policy "Admin can view all users"
on public.users
for select
using (public.is_admin());


-- =====================================================
-- PRODUCTS POLICIES
-- =====================================================

drop policy if exists "Anyone can view products" on public.products;
drop policy if exists "Admin can insert products" on public.products;
drop policy if exists "Admin can update products" on public.products;
drop policy if exists "Admin can delete products" on public.products;

create policy "Anyone can view products"
on public.products
for select
using (true);

create policy "Admin can insert products"
on public.products
for insert
with check (public.is_admin());

create policy "Admin can update products"
on public.products
for update
using (public.is_admin());

create policy "Admin can delete products"
on public.products
for delete
using (public.is_admin());


-- =====================================================
-- ORDERS POLICIES
-- =====================================================

drop policy if exists "Users can view own orders" on public.orders;
drop policy if exists "Users can create own orders" on public.orders;
drop policy if exists "Admin can view all orders" on public.orders;
drop policy if exists "Admin can update orders" on public.orders;

create policy "Users can view own orders"
on public.orders
for select
using (auth.uid() = user_id);

create policy "Users can create own orders"
on public.orders
for insert
with check (auth.uid() = user_id);

create policy "Admin can view all orders"
on public.orders
for select
using (public.is_admin());

create policy "Admin can update orders"
on public.orders
for update
using (public.is_admin());


-- =====================================================
-- ORDER ITEMS POLICIES
-- =====================================================

drop policy if exists "Users can view own order items" on public.order_items;
drop policy if exists "Users can insert own order items" on public.order_items;
drop policy if exists "Admin can view all order items" on public.order_items;

create policy "Users can view own order items"
on public.order_items
for select
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
    and orders.user_id = auth.uid()
  )
);

create policy "Users can insert own order items"
on public.order_items
for insert
with check (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
    and orders.user_id = auth.uid()
  )
);

create policy "Admin can view all order items"
on public.order_items
for select
using (public.is_admin());


-- =====================================================
-- CART POLICIES
-- =====================================================

drop policy if exists "Users can view own cart" on public.cart;
drop policy if exists "Users can insert to cart" on public.cart;
drop policy if exists "Users can update own cart" on public.cart;
drop policy if exists "Users can delete from cart" on public.cart;

create policy "Users can view own cart"
on public.cart
for select
using (auth.uid() = user_id);

create policy "Users can insert to cart"
on public.cart
for insert
with check (auth.uid() = user_id);

create policy "Users can update own cart"
on public.cart
for update
using (auth.uid() = user_id);

create policy "Users can delete from cart"
on public.cart
for delete
using (auth.uid() = user_id);


-- =====================================================
-- WISHLIST POLICIES
-- =====================================================

drop policy if exists "Users can view own wishlist" on public.wishlist;
drop policy if exists "Users can insert to wishlist" on public.wishlist;
drop policy if exists "Users can delete from wishlist" on public.wishlist;

create policy "Users can view own wishlist"
on public.wishlist
for select
using (auth.uid() = user_id);

create policy "Users can insert to wishlist"
on public.wishlist
for insert
with check (auth.uid() = user_id);

create policy "Users can delete from wishlist"
on public.wishlist
for delete
using (auth.uid() = user_id);


-- =====================================================
-- REVIEWS POLICIES
-- =====================================================

drop policy if exists "Anyone can view reviews" on public.reviews;
drop policy if exists "Users can insert own reviews" on public.reviews;
drop policy if exists "Users can update own reviews" on public.reviews;
drop policy if exists "Users can delete own reviews" on public.reviews;

create policy "Anyone can view reviews"
on public.reviews
for select
using (true);

create policy "Users can insert own reviews"
on public.reviews
for insert
with check (auth.uid() = user_id);

create policy "Users can update own reviews"
on public.reviews
for update
using (auth.uid() = user_id);

create policy "Users can delete own reviews"
on public.reviews
for delete
using (auth.uid() = user_id);


-- =====================================================
-- NOTIFICATIONS POLICIES
-- =====================================================

drop policy if exists "Users can view own notifications" on public.notifications;
drop policy if exists "Users can update own notifications" on public.notifications;
drop policy if exists "System can insert notifications" on public.notifications;

create policy "Users can view own notifications"
on public.notifications
for select
using (auth.uid() = user_id);

create policy "Users can update own notifications"
on public.notifications
for update
using (auth.uid() = user_id);

create policy "System can insert notifications"
on public.notifications
for insert
with check (true);