import { Truck, Shield, RefreshCw, Headphones } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    japanese: "無料配送",
    description: "On orders over $100. Fast delivery worldwide.",
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    japanese: "品質保証",
    description: "All products tested and certified for outdoor use.",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    japanese: "簡単返品",
    description: "30-day hassle-free return policy on all items.",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    japanese: "専門サポート",
    description: "Our outdoor experts are here to help you gear up.",
  },
];

export function ValueProposition() {
  return (
    <section className="py-20 md:py-28 bg-white border-t border-neutral-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div key={feature.title} className="relative">
              {/* Decorative Number */}
              <span className="absolute -top-4 -left-2 text-6xl font-heading font-bold text-neutral-100 select-none pointer-events-none">
                0{index + 1}
              </span>

              <div className="relative">
                {/* Icon */}
                <div className="w-12 h-12 flex items-center justify-center bg-black mb-4">
                  <feature.icon className="h-5 w-5 text-white" />
                </div>

                {/* Content */}
                <h3 className="font-heading font-bold text-black mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-neutral-400 mb-2 font-heading">
                  {feature.japanese}
                </p>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-20 relative overflow-hidden bg-black text-white p-8 md:p-12">
          {/* Decorative Japanese Text */}
          <span
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[120px] font-heading font-bold text-white/5 leading-none pointer-events-none select-none"
            aria-hidden="true"
          >
            旅
          </span>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs tracking-[0.3em] text-neutral-400 uppercase mb-2">
                Join the Adventure
              </p>
              <h3 className="font-heading text-2xl md:text-3xl font-bold">
                Ready to Explore?
              </h3>
              <p className="text-neutral-400 mt-2">
                Subscribe to get exclusive offers and adventure tips.
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-white/40"
              />
              <button className="px-6 py-3 bg-[#E10600] text-white text-sm font-medium hover:bg-[#c10500] transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
