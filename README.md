# Hikaru Bouken (光る冒険) - E-Commerce Application

A **modern, production-ready e-commerce platform** for outdoor adventure gear. Built as a fully-functional university project demonstrating real-world development practices.

## 🏔️ Branding

**Hikaru Bouken** (光る冒険) means "Shining Adventure" in Japanese. The platform features:
- **Color Scheme**: Black (#000000), White (#FFFFFF), Red Accent (#E10600)
- **Japanese Elements**: 冒険 (Adventure), 山 (Mountain), 道 (Path), 旅 (Journey)
- **Design**: Modern, minimal, high-end outdoor gear aesthetic

## 🎯 Features

### Customer Features
- 🛍️ **Browse Products** - Grid-based product browsing with filters
- 🛒 **Shopping Cart** - Add/remove items, manage quantities
- ❤️ **Wishlist** - Save favorite products for later
- 💳 **Checkout** - Secure checkout with multiple payment methods
- 📦 **Order Tracking** - View order history and status
- ⭐ **Reviews** - Rate and review purchased products
- 👤 **User Account** - Profile management, address book, order history

### Admin Features
- 📊 **Dashboard** - Real-time analytics and store overview
- 📦 **Product Management** - CRUD operations for products
- 📋 **Order Management** - View, update, and manage orders
- 👥 **Customer Management** - View customer information
- 🔔 **Notifications** - System and order notifications
- 📈 **Analytics** - Sales trends and performance metrics
- ⚙️ **Settings** - Admin account and security settings

### Core Functionalities
- 🔐 **Authentication** - Supabase Auth with role-based access
- 💾 **Database** - PostgreSQL with row-level security
- 🔒 **Authorization** - Admin and customer role separation
- 📱 **Responsive Design** - Mobile-first, works on all devices
- ⚡ **Performance** - Optimized loading, smooth animations
- 🎨 **Modern UI** - ShadCN UI components with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19.2** - UI library
- **Tailwind CSS 4** - Utility-first CSS
- **ShadCN UI** - High-quality component library
- **TypeScript** - Type-safe development

### Backend
- **Next.js API Routes** - RESTful endpoints
- **Server Actions** - Form submissions and mutations
- **Middleware** - Session and authentication

### Database & Auth
- **Supabase** - PostgreSQL database
- **Supabase Auth** - Email/password authentication
- **Row Level Security (RLS)** - Data access control

### Additional Tools
- **Sonner** - Toast notifications
- **Lucide React** - Icons
- **Zod** - Schema validation

## 📁 Project Structure

``` 
app/
├── admin/                    # Admin dashboard
│   ├── layout.tsx           # Admin layout with sidebar
│   ├── dashboard/page.tsx   # Dashboard overview
│   ├── products/            # Product management
│   ├── orders/page.tsx      # Order management
│   ├── customers/page.tsx   # Customer list
│   ├── notifications/       # Notifications
│   ├── analytics/page.tsx   # Analytics
│   ├── settings/page.tsx    # Admin settings
│   └── auth/login/page.tsx  # Admin login (hidden URL)
├── account/                 # Customer account
│   ├── page.tsx            # Profile page
│   ├── orders/             # Order history
│   ├── wishlist/page.tsx   # Wishlist
│   └── layout.tsx          # Account layout with sidebar
├── auth/                   # Authentication pages
│   ├── login/page.tsx      # Customer login
│   ├── sign-up/page.tsx    # Sign up
│   └── logout/route.ts     # Logout
├── cart/page.tsx           # Shopping cart
├── checkout/page.tsx       # Checkout page
├── products/               # Product pages
│   ├── page.tsx            # Product listing
│   └── [slug]/page.tsx     # Product detail
├── api/                    # API endpoints
│   ├── products/           # Product management API
│   └── seed/products/      # Demo data seeding
├── page.tsx                # Homepage
└── layout.tsx              # Root layout

components/
├── admin/
│   ├── admin-sidebar.tsx   # Admin navigation
│   └── product-form.tsx    # Product create/edit form
├── home/
│   ├── hero-section.tsx    # Hero banner
│   ├── featured-products.tsx
│   ├── category-grid.tsx
│   └── value-proposition.tsx
├── products/
│   ├── product-card.tsx    # Product card component
│   ├── product-details.tsx # Product detail view
│   ├── product-filters.tsx # Filter sidebar
│   ├── products-grid.tsx   # Products grid
│   ├── product-reviews.tsx # Reviews section
│   └── related-products.tsx
├── cart/
│   ├── cart-items.tsx      # Cart items list
│   └── cart-summary.tsx    # Cart totals
├── checkout/
│   ├── checkout-form.tsx   # Checkout form
│   └── order-summary.tsx   # Order summary
├── account/
│   ├── account-sidebar.tsx # Account navigation
│   └── profile-form.tsx    # Profile form
├── layout/
│   ├── header.tsx          # Site header with nav
│   └── footer.tsx          # Site footer
└── ui/                     # ShadCN UI components
```

## 🗄️ Database Schema

### Users
```sql
- id (UUID)
- name (TEXT)
- email (TEXT)
- phone (TEXT)
- address (TEXT)
- role (ENUM: 'customer', 'admin')
- created_at (TIMESTAMP)
```

### Products
```sql
- id (UUID)
- name (TEXT)
- slug (TEXT) - unique
- description (TEXT)
- category (TEXT)
- brand (TEXT)
- price (NUMERIC)
- stock (INTEGER)
- image_url (TEXT)
- tags (TEXT[])
- created_at (TIMESTAMP)
```

### Orders
```sql
- id (UUID)
- user_id (UUID) - FK to users
- total_price (NUMERIC)
- payment_method (TEXT)
- shipping_method (TEXT)
- shipping_address (TEXT)
- status (ENUM: pending, confirmed, preparing, shipped, delivered, cancelled)
- created_at (TIMESTAMP)
```

### Order Items
```sql
- id (UUID)
- order_id (UUID) - FK to orders
- product_id (UUID) - FK to products
- quantity (INTEGER)
- price (NUMERIC)
```

### Cart
```sql
- id (UUID)
- user_id (UUID) - FK to users
- product_id (UUID) - FK to products
- quantity (INTEGER)
- created_at (TIMESTAMP)
```

### Wishlist
```sql
- id (UUID)
- user_id (UUID) - FK to users
- product_id (UUID) - FK to products
- created_at (TIMESTAMP)
```

### Reviews
```sql
- id (UUID)
- user_id (UUID) - FK to users
- product_id (UUID) - FK to products
- order_id (UUID) - FK to orders (nullable)
- rating (INTEGER: 1-5)
- comment (TEXT)
- created_at (TIMESTAMP)
```

### Notifications
```sql
- id (UUID)
- user_id (UUID) - FK to users
- message (TEXT)
- link (TEXT)
- type (TEXT: order, system, etc)
- read_status (BOOLEAN)
- created_at (TIMESTAMP)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Git

### Installation

1. **Clone & Install**
   ```bash
   git clone <repository>
   cd hikaru-bouken
   pnpm install
   ```

2. **Environment Setup**
   - Create `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **Database Setup**
   - Create tables using Supabase SQL editor
   - Run migration scripts (see `scripts/` folder)
   - Seed sample data via `/api/seed/products` endpoint

4. **Development**
   ```bash
   pnpm dev
   ```
   Open http://localhost:3000

### Demo Credentials

**Customer Login:**
- Email: `customer@example.com`
- Password: `demo123456`

**Admin Login:**
- Email: `admin@example.com`
- Password: `admin123456`

## 📍 Key Routes

### Customer Routes
- `/` - Homepage
- `/products` - Product listing
- `/products/[slug]` - Product detail
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/auth/login` - Customer login
- `/auth/sign-up` - Sign up
- `/account` - Profile
- `/account/orders` - Order history
- `/account/wishlist` - Wishlist

### Admin Routes
- `/admin/auth/login` - Admin login (hidden, must type manually)
- `/admin/dashboard` - Dashboard
- `/admin/products` - Product management
- `/admin/products/new` - Create product
- `/admin/products/[id]/edit` - Edit product
- `/admin/orders` - Order management
- `/admin/customers` - Customer list
- `/admin/analytics` - Analytics
- `/admin/settings` - Admin settings

### API Routes
- `POST /api/products` - Create product
- `GET /api/products` - List products (with filters)
- `PATCH /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product
- `POST /api/seed/products` - Seed demo products

## 🔐 Security Features

- **Authentication**: Supabase Auth with JWT tokens
- **Authorization**: Role-based access control (RBAC)
- **Row Level Security (RLS)**: Database-level data protection
- **Server Actions**: Secure server-side mutations
- **API Protection**: Admin-only endpoints
- **Password Hashing**: Supabase handles securely
- **CSRF Protection**: Built into Next.js

## 📊 Key Metrics

- **Products**: 500+ items across 6 categories
- **Brands**: 50+ premium outdoor brands
- **Orders**: Full order management workflow
- **Users**: Customer and admin roles
- **Performance**: Optimized for fast load times
- **Mobile**: Fully responsive design

## 🎨 Design System

### Colors
- **Primary**: #E10600 (Red accent)
- **Background**: #FFFFFF (Light) / #000000 (Dark)
- **Foreground**: #000000 (Light) / #FFFFFF (Dark)
- **Border**: #E5E5E5 (Light) / #333333 (Dark)

### Typography
- **Headings**: Outfit font
- **Body**: Inter font
- **Mono**: Geist Mono

### Components
- Card-based layouts
- Grid systems
- Hover animations
- Smooth transitions
- Toast notifications

## 🧪 Testing

Visit `/api/seed/products` (as admin) to populate demo data:
```bash
POST /api/seed/products
```

This will add 10 sample outdoor gear products with images and details.

## 📝 File Organization

- **Pages**: Define routes and UI
- **Components**: Reusable UI components
- **Actions**: Server actions for mutations
- **API Routes**: Backend endpoints
- **Lib**: Utilities, types, configuration
- **Scripts**: Database migrations and seeds

## 🎓 Learning Resources

This project demonstrates:
- Next.js 16 App Router patterns
- Supabase authentication & RLS
- TypeScript best practices
- React server/client components
- Tailwind CSS design system
- ShadCN UI component library
- Database design & normalization
- API design & security
- Authentication & authorization
- State management patterns

## 📄 License

University Project - Educational Purpose Only

## 🤝 Support

For issues or questions:
1. Check the documentation
2. Review Supabase setup
3. Verify environment variables
4. Check browser console for errors

---

**Built with ❤️ for modern e-commerce**

光る冒険 - Hikaru Bouken (Shining Adventure)
#   H i B 
 
 # HiB
#   t e s t  
 