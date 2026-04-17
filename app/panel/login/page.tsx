import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock } from "lucide-react";

async function handleAdminLogin(formData: FormData) {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (authError || !authData.user) {
    redirect("/panel/login?error=invalid");
  }

  // Check if user has admin role
  const { data: userProfile } = await supabase
    .from("users")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  const isAdmin =
    userProfile?.role === "admin" ||
    authData.user.user_metadata?.role === "admin";

  if (!isAdmin) {
    await supabase.auth.signOut();
    redirect("/panel/login?error=unauthorized");
  }

  redirect("/admin/dashboard");
}

export default async function AdminPanelLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: userProfile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userProfile?.role === "admin" || user.user_metadata?.role === "admin") {
      redirect("/admin/dashboard");
    }
  }

  const errorMessage =
    params.error === "invalid"
      ? "Invalid email or password"
      : params.error === "unauthorized"
        ? "You are not authorized to access admin panel"
        : null;

  return (
    <div className="flex min-h-screen bg-black">
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
        <span
          className="absolute -right-32 top-1/2 -translate-y-1/2 text-[500px] font-heading font-bold text-white/[0.02] leading-none select-none pointer-events-none"
          aria-hidden="true"
        >
          管
        </span>

        <div className="w-full max-w-md relative z-10">
          <div className="mb-12 flex flex-col items-center text-center">
            <div className="relative flex h-16 w-16 items-center justify-center bg-white mb-4">
              <span className="text-3xl font-bold text-black font-heading">
                光
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E10600]" />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-heading text-xl font-bold tracking-tight text-white leading-none">
                HIKARU BOUKEN
              </span>
              <span className="text-xs text-neutral-500 tracking-widest mt-1">
                Admin Portal
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8 text-neutral-400">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium tracking-wide uppercase">
              Admin Access Only
            </span>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 bg-[#E10600]/10 border border-[#E10600]/20 text-[#E10600] text-sm text-center">
              {errorMessage}
            </div>
          )}

          <form action={handleAdminLogin} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-neutral-300"
              >
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@hikaru.jp"
                required
                className="h-12 bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-neutral-600 focus:bg-neutral-900"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-neutral-300"
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                className="h-12 bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-neutral-600 focus:bg-neutral-900"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-white text-black hover:bg-neutral-200 font-medium"
            >
              <Lock className="h-4 w-4 mr-2" />
              Sign In to Admin
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-neutral-800">
            <p className="text-xs text-neutral-600 text-center leading-relaxed">
              This is a restricted area. All login attempts are monitored.
              Unauthorized access is prohibited.
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-neutral-500 hover:text-white transition-colors"
            >
              Back to Store
            </Link>
          </div>

          <p className="mt-12 text-xs text-neutral-700 text-center">
            {new Date().getFullYear()} Hikaru Bouken. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
