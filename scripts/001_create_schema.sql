-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (linked to Supabase Auth)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text unique,
  phone text,
  address text,
  role text default 'customer' check (role in ('customer', 'admin')),
  created_at timestamp with time zone default now()
);

-- Products table
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  brand text,
  category text,
  price numeric not null check (price >= 0),
  stock integer default 0 check (stock >= 0),
  image_url text,
  tags text[],
  created_at timestamp with time zone default now()
);

-- Orders table
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete set null,
  total_price numeric not null check (total_price >= 0),
  payment_method text,
  shipping_method text,
  shipping_address text,
  status text default 'pending' check (status in ('pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled')),
  created_at timestamp with time zone default now()
);

-- Order items table
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null check (quantity > 0),
  price numeric not null check (price >= 0)
);

-- Wishlist table
create table if not exists public.wishlist (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(user_id, product_id)
);

-- Cart table
create table if not exists public.cart (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  quantity integer default 1 check (quantity > 0),
  created_at timestamp with time zone default now(),
  unique(user_id, product_id)
);

-- Reviews table
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default now(),
  unique(user_id, product_id)
);

-- Notifications table
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  message text not null,
  link text,
  read_status boolean default false,
  type text default 'info',
  created_at timestamp with time zone default now()
);

-- Create indexes for better performance
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_brand on public.products(brand);
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_cart_user_id on public.cart(user_id);
create index if not exists idx_wishlist_user_id on public.wishlist(user_id);
create index if not exists idx_notifications_user_id on public.notifications(user_id);
create index if not exists idx_reviews_product_id on public.reviews(product_id);
