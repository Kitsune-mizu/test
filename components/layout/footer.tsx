import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"
import { HikaruLogo } from "@/components/ui/hikaru-logo"

export function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Decorative Japanese Text */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 right-0 text-[120px] font-heading font-bold text-white/[0.02] leading-none pointer-events-none select-none" aria-hidden="true">
          旅
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-6 lg:col-span-1">
            <Link href="/" className="inline-block">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center bg-white">
                  <span className="text-xl font-bold text-black font-heading">光</span>
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E10600]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading text-lg font-bold tracking-tight text-white leading-none">
                    HIKARU BOUKEN
                  </span>
                  <span className="text-[10px] text-neutral-500 tracking-widest">
                    光る冒険
                  </span>
                </div>
              </div>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-xs">
              Premium outdoor equipment for the modern explorer. Quality gear for hiking, camping, and adventure.
            </p>
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <span className="font-heading">冒険を始めよう</span>
              <span className="text-neutral-600">—</span>
              <span>Start your adventure</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Shop</h3>
            <nav className="flex flex-col gap-3">
              <Link href="/products" className="text-sm text-neutral-400 hover:text-white transition-colors">
                All Products
              </Link>
              <Link href="/products?category=Sandals" className="text-sm text-neutral-400 hover:text-white transition-colors">
                Sandals <span className="text-neutral-600 text-xs ml-1">サンダル</span>
              </Link>
              <Link href="/products?category=Hiking+Shoes" className="text-sm text-neutral-400 hover:text-white transition-colors">
                Hiking Shoes <span className="text-neutral-600 text-xs ml-1">登山靴</span>
              </Link>
              <Link href="/products?category=Backpacks" className="text-sm text-neutral-400 hover:text-white transition-colors">
                Backpacks <span className="text-neutral-600 text-xs ml-1">バックパック</span>
              </Link>
              <Link href="/products?category=Jackets" className="text-sm text-neutral-400 hover:text-white transition-colors">
                Jackets <span className="text-neutral-600 text-xs ml-1">ジャケット</span>
              </Link>
            </nav>
          </div>

          {/* Account */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Account</h3>
            <nav className="flex flex-col gap-3">
              <Link href="/auth/login" className="text-sm text-neutral-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/auth/sign-up" className="text-sm text-neutral-400 hover:text-white transition-colors">
                Create Account
              </Link>
              <Link href="/account/orders" className="text-sm text-neutral-400 hover:text-white transition-colors">
                Order History
              </Link>
              <Link href="/account/wishlist" className="text-sm text-neutral-400 hover:text-white transition-colors">
                Wishlist
              </Link>
              <Link href="/cart" className="text-sm text-neutral-400 hover:text-white transition-colors">
                Shopping Cart
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
            <div className="flex flex-col gap-4 text-sm text-neutral-400">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-neutral-500" />
                <span>support@hikarubouken.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-neutral-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-neutral-500" />
                <span>123 Adventure Way<br />Mountain View, CA 94043</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-500">
              &copy; {new Date().getFullYear()} Hikaru Bouken. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-sm text-neutral-500 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-neutral-500 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <span className="text-neutral-700 font-heading text-xs">道</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
