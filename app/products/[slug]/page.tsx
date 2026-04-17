import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductDetails } from "@/components/products/product-details"
import { ProductReviews } from "@/components/products/product-reviews"
import { RelatedProducts } from "@/components/products/related-products"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: product } = await supabase
    .from("products")
    .select("name, description")
    .eq("slug", slug)
    .single()

  if (!product) {
    return { title: "Product Not Found" }
  }

  return {
    title: `${product.name} | Hikaru Bouken`,
    description: product.description || `Shop ${product.name} at Hikaru Bouken`,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Get current user
  const { data: { user: authUser } } = await supabase.auth.getUser()

  let user = null
  let cartCount = 0
  let isInWishlist = false

  if (authUser) {
    const { data: userProfile } = await supabase
      .from("users")
      .select("id, name, role")
      .eq("id", authUser.id)
      .single()

    user = userProfile

    const { count } = await supabase
      .from("cart")
      .select("*", { count: "exact", head: true })
      .eq("user_id", authUser.id)

    cartCount = count || 0
  }

  // Get product
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!product) {
    notFound()
  }

  // Check if in wishlist
  if (authUser) {
    const { data: wishlistItem } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", authUser.id)
      .eq("product_id", product.id)
      .single()

    isInWishlist = !!wishlistItem
  }

  // Get reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      *,
      users:user_id (id, name)
    `)
    .eq("product_id", product.id)
    .order("created_at", { ascending: false })

  // Get related products (same category)
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .neq("id", product.id)
    .limit(4)

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} cartCount={cartCount} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <ProductDetails
            product={product}
            isInWishlist={isInWishlist}
            isLoggedIn={!!authUser}
          />
          
          <div className="mt-16">
            <ProductReviews
              productId={product.id}
              reviews={reviews || []}
              isLoggedIn={!!authUser}
            />
          </div>

          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-16">
              <RelatedProducts products={relatedProducts} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
