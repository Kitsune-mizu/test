import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AccountSidebar } from "@/components/account/account-sidebar"

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) {
    redirect("/auth/login?redirect=/account")
  }

  // Get user profile
  const { data: user } = await supabase
    .from("users")
    .select("id, name, role")
    .eq("id", authUser.id)
    .single()

  // Get cart count
  const { count: cartCount } = await supabase
    .from("cart")
    .select("*", { count: "exact", head: true })
    .eq("user_id", authUser.id)

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} cartCount={cartCount || 0} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-64 shrink-0">
              <AccountSidebar user={user} />
            </aside>
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
