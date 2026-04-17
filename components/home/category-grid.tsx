import Link from "next/link"
import { ArrowRight } from "lucide-react"

const categories = [
  {
    name: "Sandals",
    japanese: "サンダル",
    href: "/products?category=Sandals",
    image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=500&fit=crop",
  },
  {
    name: "Hiking Shoes",
    japanese: "登山靴",
    href: "/products?category=Hiking+Shoes",
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=500&fit=crop",
  },
  {
    name: "Backpacks",
    japanese: "バックパック",
    href: "/products?category=Backpacks",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop",
  },
  {
    name: "Jackets",
    japanese: "ジャケット",
    href: "/products?category=Jackets",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop",
  },
  {
    name: "Equipment",
    japanese: "装備",
    href: "/products?category=Equipment",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=500&fit=crop",
  },
]

export function CategoryGrid() {
  return (
    <section className="py-20 md:py-28 bg-neutral-50">
      {/* Decorative Background */}
      <div className="absolute right-0 text-[180px] font-heading font-bold text-neutral-100 leading-none pointer-events-none select-none opacity-50" aria-hidden="true">
        道
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-8 bg-[#E10600]" />
          <span className="text-xs tracking-[0.3em] text-neutral-500 uppercase">Categories</span>
        </div>
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-black">Shop by Category</h2>
            <p className="mt-2 text-neutral-500">
              カテゴリー別にショップ
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative aspect-[4/5] overflow-hidden bg-neutral-200"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-heading font-bold text-white text-lg">{category.name}</h3>
                <p className="text-xs text-white/60 mt-0.5">{category.japanese}</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-white/80 group-hover:text-white transition-colors">
                  <span>Shop Now</span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
