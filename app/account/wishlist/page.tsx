import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Empty } from "@/components/ui/empty"
import { ProductCard } from "@/components/products/product-card"
import { Heart } from "lucide-react"

export const metadata = {
  title: "My Wishlist | Hikaru Bouken",
  description: "Your saved products",
}

export default async function WishlistPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: wishlistItems } = await supabase
    .from("wishlist")
    .select(`
      id,
      products (*)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const products = wishlistItems?.map((item: any) => item.products).filter(Boolean) || []

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold mb-2">My Wishlist</h1>
        <p className="text-muted-foreground">
          Items you've saved for later
        </p>
      </div>

      {products.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                isInWishlist={true}
                showActions={false}
              />
            ))}
          </div>
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Ready to explore more adventure gear?</p>
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      ) : (
        <Empty title="Your wishlist is empty">
          <Heart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <div className="text-center text-muted-foreground mt-2">
            Save products you love for later. Start adding items to your wishlist!
          </div>
          <div className="mt-4 flex justify-center">
            <Button asChild>
              <Link href="/products">Explore Products</Link>
            </Button>
          </div>
        </Empty>
      )}
    </div>
  )
}
