// app/admin/layout.tsx

import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/admin/admin-header";
import { Footer } from "@/components/layout/footer";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: userProfile } = await supabase
    .from("users")
    .select("id, name, role")
    .eq("id", user.id)
    .single();

  if (userProfile?.role !== "admin") redirect("/");

  return (
    // min-h-screen so the page always fills the viewport
    <div className="flex min-h-screen flex-col">
      <AdminHeader user={userProfile} />

      {/* flex-1 makes this row grow to fill remaining vertical space */}
      <div className="flex flex-1">
        <AdminSidebar />

        {/* main scrolls independently; sidebar stays alongside it */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      <Footer />
    </div>
  );
}
