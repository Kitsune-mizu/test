# 🚀 Hikaru Bouken - Setup & Login Guide

## ⚡ Quick Start

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

## 📍 URL Routes

| Route | Purpose | Auth Required |
|-------|---------|---------------|
| `/` | Homepage | No |
| `/auth/login` | Customer login | No |
| `/auth/sign-up` | Customer sign-up | No |
| `/auth/logout` | Logout | Yes |
| `/products` | Product catalog | No |
| `/product/[slug]` | Product detail | No |
| `/cart` | Shopping cart | Yes |
| `/checkout` | Checkout | Yes |
| `/account` | User profile | Yes |
| `/account/orders` | Order history | Yes |
| `/account/wishlist` | Saved items | Yes |
| `/account/settings` | User settings | Yes |
| `/panel/login` | **Admin login (HIDDEN)** | No |
| `/admin/dashboard` | Admin dashboard | Yes + Admin role |
| `/admin/products` | Product management | Yes + Admin role |
| `/admin/orders` | Order management | Yes + Admin role |
| `/admin/customers` | Customer management | Yes + Admin role |
| `/admin/analytics` | Analytics | Yes + Admin role |
| `/admin/settings` | Admin settings | Yes + Admin role |
| `/setup` | Database initialization | No |

---

## 🔐 Admin Access Flow

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

## 📊 Database Schema

### Tables yang Dibuat:
- **users** - User profiles (customers + admins)
- **products** - Product catalog
- **orders** - Customer orders
- **order_items** - Items per order
- **cart** - Shopping cart
- **wishlist** - Saved products
- **reviews** - Product reviews
- **notifications** - System notifications

### Security:
- ✅ Row Level Security (RLS) enabled
- ✅ All queries use parameterized statements
- ✅ Admin-only tables protected
- ✅ User data isolated by user_id

---

## 🆘 Troubleshooting

### ❌ Admin Login Redirects to /auth/login
**Solusi**: Admin login sudah di `/panel/login` (bukan `/admin/login`)
- Jangan type `/admin/login` atau `/admin/auth/login` → gunakan `/panel/login`
- Pastikan sudah melakukan setup di `/setup` page

### ❌ Setup Page Returns Error
**Solusi**:
1. Cek `.env.local` credentials Supabase
2. Pastikan Supabase project sudah aktif
3. Refresh dan coba lagi

### ❌ Can't Access Product Page
**Solusi**: Pastikan produk sudah di-seed via `/setup`

### ❌ Cart/Checkout Tidak Berfungsi
**Solusi**: Login dulu di `/auth/login` sebagai customer

---

## 🧪 Testing

### Test Customer Flow:
```
1. Kunjungi /setup → Run Setup
2. Login ke /auth/login dengan customer credentials
3. Browse /products
4. Click product → view details
5. Add to cart
6. Go to /checkout
7. Complete order
8. View /account/orders
```

### Test Admin Flow:
```
1. Login ke /panel/login dengan admin credentials
2. Dashboard: view analytics
3. Products: create/edit/delete products
4. Orders: view dan update order status
5. Customers: view registered users
```

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

## 📞 Support

Untuk bantuan lebih lanjut:
- Check `/QUICKSTART.md`
- Check `/README.md`
- Lihat docs di `/docs` folder

---

**Happy Testing! 🎉**
