import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductsGrid } from "@/components/products/products-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { JapaneseSkeleton } from "@/components/loaders/japanese-loader";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  // Get current user for cart count
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  let cartCount = 0;

  if (authUser) {
    const { count } = await supabase
      .from("cart")
      .select("*", { count: "exact", head: true })
      .eq("user_id", authUser.id);

    cartCount = count || 0;
  }

  // Build query
  let query = supabase.from("products").select("*");

  if (params.category) {
    query = query.eq("category", params.category);
  }

  if (params.brand) {
    query = query.eq("brand", params.brand);
  }

  if (params.search && params.search.trim() !== "") {
    const q = params.search.trim();
    query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
  }

  if (params.minPrice) {
    query = query.gte("price", parseFloat(params.minPrice));
  }

  if (params.maxPrice) {
    query = query.lte("price", parseFloat(params.maxPrice));
  }

  // Sorting
  switch (params.sort) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    case "name":
      query = query.order("name", { ascending: true });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data: products } = await query;

  // Get unique categories and brands for filters
  const { data: allProducts } = await supabase
    .from("products")
    .select("category, brand");

  const categories = [
    ...new Set(allProducts?.map((p) => p.category).filter(Boolean)),
  ];
  const brands = [...new Set(allProducts?.map((p) => p.brand).filter(Boolean))];

  return (
    <div className="flex min-h-screen flex-col">
      <Header cartCount={cartCount} />
      <main className="flex-1">
        <Suspense fallback={<JapaneseSkeleton />}>
          <div className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="font-heading text-3xl font-bold">
                {params.category || "All Products"}
              </h1>
              <p className="mt-2 text-muted-foreground">
                {products?.length || 0} products found
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <aside className="w-full lg:w-64 shrink-0">
                <ProductFilters
                  categories={categories as string[]}
                  brands={brands as string[]}
                  currentCategory={params.category}
                  currentBrand={params.brand}
                  currentSort={params.sort}
                  currentMinPrice={params.minPrice}
                  currentMaxPrice={params.maxPrice}
                />
              </aside>

              {/* Products Grid */}
              <div className="flex-1">
                <ProductsGrid products={products || []} />
              </div>
            </div>
          </div>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
