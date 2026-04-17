import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedProducts } from "@/components/home/featured-products"
import { CategoryGrid } from "@/components/home/category-grid"
import { ValueProposition } from "@/components/home/value-proposition"
import { AboutDan } from "@/components/home/about-dan"

export default async function HomePage() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  let user = null
  let cartCount = 0
  
  if (authUser) {
    // Get user profile
    const { data: userProfile } = await supabase
      .from("users")
      .select("id, name, role")
      .eq("id", authUser.id)
      .single()
    
    user = userProfile
    
    // Get cart count
    const { count } = await supabase
      .from("cart")
      .select("*", { count: "exact", head: true })
      .eq("user_id", authUser.id)
    
    cartCount = count || 0
  }
  
  // Get featured products (latest 8)
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8)

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} cartCount={cartCount} />
      <main className="flex-1">
        <HeroSection />
        <FeaturedProducts products={products || []} />
        <CategoryGrid />
        <ValueProposition />
        <AboutDan />
      </main>
      <Footer />
    </div>
  )
}
