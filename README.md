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



---


光る冒険 - Hikaru Bouken (Shining Adventure)

### 1. Environment Setup

Pastikan `.env.local` sudah memiliki:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### 2. Initialize Database & Demo Data

Kunjungi: **http://localhost:3000/setup**

Halaman ini akan:

- ✅ Membuat semua database tables
- ✅ Setup Row Level Security (RLS)
- ✅ Seed 10+ produk demo
- ✅ Buat 2 demo accounts

### 3. Demo Credentials

Setelah setup, Anda akan mendapat:

**👤 Customer Account**

- Email: `customer@hikaru.test`
- Password: `DemoPassword123!`
- Login: http://localhost:3000/auth/login
- Akses: Browse produk, cart, checkout, order history

**🔐 Admin Account**

- Email: `admin@hikaru.test`
- Password: `AdminPassword123!`
- Login: http://localhost:3000/panel/login (HIDDEN - type manually!)
- Akses: Dashboard, product management, orders, customers

---

### Cara Pertama: Setup Page (RECOMMENDED)

1. Kunjungi `/setup`
2. Klik "Run Setup"
3. Gunakan demo admin credentials yang diberikan

### Cara Kedua: Manual (Untuk Production)

1. Sign-up di `/auth/login` sebagai regular customer
2. Admin lain menambahkan role di Supabase:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'newemail@example.com';
   ```
3. Logout dan login ke `/panel/login`

---

## 🌐 Production Deployment

Untuk deploy ke production (Vercel):

1. Set environment variables di Vercel project:

   ```
   NEXT_PUBLIC_SUPABASE_URL = production_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY = production_key
   ```

2. Connect Supabase production database

3. Run setup via deployment URL:

   ```
   https://yourdomain.com/setup
   ```

   (Kemudian hapus atau protect endpoint ini)

4. Create admin users via database directly

---

### 1. Environment Variables

Add these to your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 2. Start Development Server

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

### 3. Seed Demo Data

Visit: http://localhost:3000/api/seed/products (as admin)

This will add 10 sample products to your database.


## 🎨 Branding Elements

### Japanese Text Used

- **冒険** (Bouken) - Adventure
- **山** (Yama) - Mountain
- **道** (Michi) - Path
- **旅** (Tabi) - Journey

### Color Scheme

- **Primary**: Red (#E10600) - Action buttons, highlights
- **Background**: White/Black - Clean surfaces
- **Text**: Black/White - Maximum contrast
- **Accent**: Red highlights - Call-to-action

### Typography

- **Headings**: Outfit font (modern, clean)
- **Body**: Inter font (readable, professional)
- **Code**: Geist Mono (technical elements)

## 📦 Product Categories

Available product categories:

- Backpacks (50L+, day packs, hydration packs)
- Tents (2-4 person, 4-season)
- Sleeping Bags (thermal rated)
- Footwear (hiking boots, sandals)
- Clothing (jackets, layers, gear)
- Accessories (cookware, bottles, tools)
- Climbing (harnesses, ropes, protection)
- Navigation (GPS, compasses, maps)

## 💳 Payment Methods

Supported payment methods:

1. **Credit Card** - Primary payment method
2. **Debit Card** - Visa, Mastercard, etc.
3. **Cash on Delivery** - Pay on receipt
4. **Global Bank Transfer** - International payments

## 🚚 Shipping Options

Supported couriers:

- **DHL** - Express worldwide shipping
- **FedEx** - Premium international service
- **JNE** - Domestic coverage
- **J&T** - Regional delivery

Shipping tiers:

- Standard: Free (5-7 days)
- Express: $14.99 (2-3 days)
