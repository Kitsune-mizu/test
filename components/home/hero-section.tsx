import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Decorative Japanese Text - Background */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <span className="absolute top-20 -right-10 text-[200px] font-heading font-bold text-neutral-50 leading-none">
          冒険
        </span>
        <span className="absolute bottom-10 -left-20 text-[150px] font-heading font-bold text-neutral-50 leading-none">
          山
        </span>
      </div>

      <div className="container relative mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="mx-auto max-w-4xl">
          {/* Japanese Subtitle */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-[#E10600]" />
            <span className="text-sm tracking-[0.3em] text-neutral-500 uppercase">
              光る冒険 — Hikaru Adventure
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-black leading-[1.1] text-balance">
            Gear for the
            <br />
            <span className="relative">
              Modern Explorer
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#E10600]" viewBox="0 0 200 12" preserveAspectRatio="none">
                <path d="M0,8 Q50,0 100,8 T200,8" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </span>
          </h1>

          {/* Description */}
          <p className="mt-8 text-lg md:text-xl text-neutral-600 leading-relaxed max-w-2xl">
            Premium outdoor equipment crafted for those who seek adventure. 
            From mountain trails to urban paths, we outfit your journey.
          </p>

          {/* Japanese Tagline */}
          <p className="mt-4 text-base text-neutral-400 font-heading tracking-wide">
            山と道を歩む — Walk the mountain and path
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
            <Button asChild size="lg" className="bg-black text-white hover:bg-neutral-800 gap-2 px-8 h-12">
              <Link href="/products">
                Shop Collection
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-black text-black hover:bg-black hover:text-white h-12 px-8">
              <Link href="/products?category=featured">
                View Featured
              </Link>
            </Button>
          </div>

          {/* Stats Row */}
          <div className="mt-20 pt-10 border-t border-neutral-200">
            <div className="grid grid-cols-3 gap-8 md:gap-16">
              <div>
                <p className="text-3xl md:text-4xl font-heading font-bold text-black">50+</p>
                <p className="mt-1 text-sm text-neutral-500">Premium Brands</p>
                <p className="text-xs text-neutral-400 font-heading mt-0.5">ブランド</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-heading font-bold text-black">500+</p>
                <p className="mt-1 text-sm text-neutral-500">Products</p>
                <p className="text-xs text-neutral-400 font-heading mt-0.5">製品</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-heading font-bold text-black">10K+</p>
                <p className="mt-1 text-sm text-neutral-500">Happy Explorers</p>
                <p className="text-xs text-neutral-400 font-heading mt-0.5">冒険者</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Decorative Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
    </section>
  )
}
