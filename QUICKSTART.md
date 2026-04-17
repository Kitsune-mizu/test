# 🚀 Hikaru Bouken - Quick Start Guide

Welcome to the Hikaru Bouken e-commerce platform! This guide will help you get started quickly.

## ⚡ Quick Setup

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

## 👥 User Roles

### Customer

- Browse products
- Add to cart & wishlist
- Checkout & place orders
- Track orders
- Review products
- Manage profile

### Admin

- Manage products (CRUD)
- View all orders
- Update order status
- Manage customers
- View analytics
- System settings

## 🎯 Main Features

### For Customers

| Feature        | URL                 | Description                    |
| -------------- | ------------------- | ------------------------------ |
| Homepage       | `/`                 | Browse featured products       |
| Products       | `/products`         | View all products with filters |
| Product Detail | `/products/[slug]`  | View product info & reviews    |
| Cart           | `/cart`             | Manage shopping cart           |
| Checkout       | `/checkout`         | Complete order                 |
| Profile        | `/account`          | Update personal info           |
| Orders         | `/account/orders`   | View order history             |
| Wishlist       | `/account/wishlist` | Saved products                 |
| Login          | `/auth/login`       | Sign in to account             |

### For Admins

| Feature       | URL                         | Description               |
| ------------- | --------------------------- | ------------------------- |
| Dashboard     | `/admin/dashboard`          | Overview & analytics      |
| Products      | `/admin/products`           | Manage product catalog    |
| Add Product   | `/admin/products/new`       | Create new product        |
| Edit Product  | `/admin/products/[id]/edit` | Update product            |
| Orders        | `/admin/orders`             | Manage customer orders    |
| Customers     | `/admin/customers`          | View customer list        |
| Notifications | `/admin/notifications`      | System notifications      |
| Analytics     | `/admin/analytics`          | Sales & performance       |
| Settings      | `/admin/settings`           | Admin account settings    |
| Admin Login   | `/admin/auth/login`         | Admin access (hidden URL) |

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

## 🗄️ Database Tables

```
users               → Customer & admin accounts
products            → Product catalog
cart                → Shopping carts
wishlist            → Favorite products
orders              → Customer orders
order_items         → Items in each order
reviews             → Product ratings & comments
notifications       → System notifications
```

## 🔐 Security & Auth

### Role-Based Access

- **Customers**: Can only access their own data
- **Admins**: Can access all data
- **Public**: Can view products without login
- **Protected**: Cart, checkout, account require login

### Data Protection

- Row Level Security (RLS) at database level
- Server-side validation
- Secure password hashing
- JWT token authentication
- CORS protection

## 📊 Dashboard Overview

The admin dashboard displays:

- **Total Products** count
- **Total Orders** count
- **Revenue** from completed orders
- **Low Stock** alerts (< 10 items)
- **Recent Orders** list
- **Stock Alerts** for reorder

## ✅ Checklist for First Time

- [ ] Install dependencies (`pnpm install`)
- [ ] Set up `.env.local` with Supabase credentials
- [ ] Run development server (`pnpm dev`)
- [ ] Visit homepage (http://localhost:3000)
- [ ] Seed demo products (`/api/seed/products`)
- [ ] Create test customer account
- [ ] Browse products
- [ ] Add items to cart
- [ ] Complete a test order
- [ ] Login as admin
- [ ] View dashboard
- [ ] Create new product
- [ ] Manage orders

## 🎓 Project Structure Quick Reference

```
/app                 # All pages & routes
/components          # Reusable UI components
/lib                 # Utilities & types
/public              # Static assets
/scripts             # Database migrations
/styles              # Global styles
```

## 🐛 Common Issues & Solutions

### Issue: Supabase connection error

**Solution**: Check env variables are set correctly

### Issue: Products not appearing

**Solution**: Seed data with `/api/seed/products`

### Issue: Login not working

**Solution**: Check Supabase Auth is enabled

### Issue: Admin features blocked

**Solution**: Ensure logged-in user has admin role

## 📱 Responsive Design

The app works great on:

- **Mobile**: 375px - 767px (smartphones)
- **Tablet**: 768px - 1023px (tablets)
- **Desktop**: 1024px+ (laptops)
- **Wide**: 1280px+ (full width)

## 🎯 Next Steps

1. **Customize Branding**
   - Update logo in header
   - Modify colors in globals.css
   - Add custom images

2. **Add Real Products**
   - Create products via `/admin/products/new`
   - Upload product images
   - Set pricing & inventory

3. **Configure Payment**
   - Set up payment processor (Stripe, etc)
   - Add payment gateway integration
   - Test transactions

4. **Deploy**
   - Push to GitHub
   - Deploy on Vercel
   - Set production env vars

## 📚 Further Learning

- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- ShadCN UI: https://ui.shadcn.com

## 🎉 You're All Set!

Your Hikaru Bouken e-commerce platform is ready to go.

**Happy coding! 光る冒険 (Hikaru Bouken) - Shining Adventure**

---

For detailed documentation, see [README.md](./README.md)
