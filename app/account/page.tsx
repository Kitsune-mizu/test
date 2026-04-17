import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/account/profile-form";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My Profile | Hikaru Bouken",
  description: "Manage your account profile",
};

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  const user = {
    ...profile,
    email: authUser.email,
    last_sign_in_at: authUser.last_sign_in_at, // ✅ Tambahkan ini
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-6">My Profile</h1>
      <ProfileForm user={user} />
    </div>
  );
}
