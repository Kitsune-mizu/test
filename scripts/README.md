# Database Migration Scripts

This directory contains all SQL migration scripts for setting up and maintaining the application database schema.

## Migration Files

### Core Schema Setup

#### `001_create_schema.sql`
Creates the foundational database tables:
- **users** - User accounts (linked to Supabase Auth)
- **products** - Product catalog with pricing and inventory
- **orders** - Customer orders with status tracking
- **order_items** - Order line items
- **wishlist** - User wishlist items
- **cart** - Shopping cart items
- **reviews** - Product reviews and ratings
- **notifications** - System notifications

Includes indexes for:
- Product category/brand/slug lookups
- Order user and status filtering
- Cart and wishlist user filtering
- Notification user filtering
- Review product lookups

#### `002_rls_policies.sql`
Implements Row-Level Security (RLS) policies:
- **Users**: View and update own profile, admins can view all
- **Products**: Public read, admin-only write/delete
- **Orders**: Users view own orders, admins can view and update all
- **Order Items**: Users view own order items, admins have full access
- **Cart**: Users manage own cart
- **Wishlist**: Users manage own wishlist
- **Reviews**: Public read, users create/update/delete own reviews
- **Notifications**: Users manage own notifications

Defines `is_admin()` helper function for admin permission checks.

#### `003_user_trigger.sql`
Creates trigger to automatically create a user profile when a new Supabase Auth user is created.

#### `004_seed_products.sql`
Seeds the database with sample product data (electronics, clothing, books, etc.) for development/testing.

### Extended Features

#### `005_extend_products_table.sql`
Adds additional columns to products table:
- Video URL support
- SKU for inventory management
- Weight for shipping calculations
- Dimensions for packaging
- Manufacturer information

#### `006_create_payment_methods_table.sql`
Creates payment methods storage:
- **payment_methods** - Saved credit/debit cards
- User references and soft deletes
- Card type and last 4 digits tracking
- Default payment method flag

#### `007_extend_orders_table.sql`
Extends orders with:
- Tracking number support
- Return window calculation
- Additional order metadata

#### `008_extend_notifications_table.sql`
Adds notification enhancements:
- `read_at` timestamp for read tracking
- Indexes for faster queries
- Trigger to auto-update read_status

#### `009_notification_settings.sql` (NEW)
Comprehensive notification preferences system:
- **notification_preferences** table with:
  - Email notification toggles (orders, products, promotions)
  - In-app notification toggles
  - Push notification toggles
  - Email frequency settings (immediate, daily, weekly, never)
  - Newsletter subscription
  - Communication language preference

- Functions:
  - `get_or_create_notification_preferences()` - Auto-create default preferences
  - `update_notification_preferences_timestamp()` - Auto-update timestamps
  - `cleanup_old_notifications()` - Remove old read notifications

- Enhanced notifications table with:
  - Title column
  - Category (order, product, system, promotional, general)
  - Priority levels (low, normal, high)
  - JSONB metadata for flexible data storage
  - Better indexing for performance

### Additional Utilities

#### `create-otp-table.sql`
Creates One-Time Password (OTP) table for authentication:
- Email-based OTP verification
- Expiration tracking
- Usage limits

## Running Migrations

### Option 1: Using the Migration Script (Recommended)
```bash
node scripts/execute-migrations-complete.mjs
```

### Option 2: Run Individually in Supabase Console
1. Go to your Supabase project → SQL Editor
2. Copy content of each SQL file in order
3. Run each file one by one

### Option 3: Using npm Scripts
If configured in package.json:
```bash
npm run migrate:run
npm run migrate:check
```

## Database Schema Overview

```
┌─────────────────────────────────────────────────┐
│                  auth.users                      │
│         (Supabase Authentication)                │
└────────────────────┬────────────────────────────┘
                     │
                     └─→ public.users (1:1)
                           ├─→ public.orders
                           ├─→ public.cart
                           ├─→ public.wishlist
                           ├─→ public.reviews
                           ├─→ public.notifications
                           └─→ public.notification_preferences
                           
                     public.products
                           ├─→ public.order_items
                           ├─→ public.cart
                           ├─→ public.wishlist
                           └─→ public.reviews
                           
                     public.orders
                           └─→ public.order_items
                           
                     public.payment_methods (user linked)
```

## Key Features

### Row-Level Security
All tables have RLS enabled with granular policies for:
- User data privacy
- Admin panel access
- Customer visibility of their own data

### Performance Optimizations
- Indexes on frequently queried columns
- Proper foreign key relationships
- Denormalized fields where appropriate

### Notification System
- Email, in-app, and push notification preferences
- Per-user customization
- Admin notifications for orders and low stock
- Customer notifications for order status changes

### Data Integrity
- Check constraints for valid data (pricing ≥ 0, etc.)
- Unique constraints (email, slugs, etc.)
- Cascade deletes for dependent records
- Soft deletes for payment methods

## Environment Setup

Before running migrations, ensure these environment variables are set:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
POSTGRES_URL=postgresql://user:password@host:port/database
```

## Troubleshooting

### "Function exec does not exist"
The migration script uses Supabase's `exec` RPC function if available. If not found, you'll need to run migrations manually in the Supabase SQL editor.

### RLS Policy Errors
Ensure you're logged in as a service role or admin when running migrations. User-level auth will be denied by RLS policies.

### Foreign Key Constraint Violations
Migrations must be run in order. If you skipped a migration, previous ones may fail.

## Adding New Migrations

When adding new migrations:
1. Create file with pattern: `NNN_description.sql` (e.g., `010_new_feature.sql`)
2. Add to `MIGRATIONS` array in `execute-migrations-complete.mjs`
3. Include proper error handling and comments
4. Test in Supabase SQL editor first

## Support

For issues with migrations:
1. Check Supabase project logs
2. Verify all environment variables are correct
3. Ensure Supabase project is accessible
4. Check for RLS policy conflicts
