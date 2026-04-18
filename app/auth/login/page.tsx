"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const verified = searchParams.get("verified") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    } else {
      toast.success("Welcome back!");
      router.push(redirect);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-neutral-50 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative Japanese Text */}
        <span
          className="absolute -left-10 bottom-20 text-[250px] font-heading font-bold text-neutral-100 leading-none select-none pointer-events-none"
          aria-hidden="true"
        >
          冒険
        </span>

        <div>
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center bg-black">
              <span className="text-xl font-bold text-white font-heading">
                光
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E10600]" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-tight text-black leading-none">
                HIKARU BOUKEN
              </span>
              <span className="text-[10px] text-neutral-500 tracking-widest">
                光る冒険
              </span>
            </div>
          </Link>
        </div>

        <div className="space-y-6 relative">
          <h1 className="font-heading text-4xl font-bold leading-tight text-black">
            Welcome Back
            <br />
            <span className="text-neutral-400">おかえりなさい</span>
          </h1>
          <p className="text-neutral-600 max-w-md">
            Sign in to access your account, track orders, and continue your
            adventure with us.
          </p>
        </div>

        <p className="text-xs text-neutral-400">
          &copy; {new Date().getFullYear()} Hikaru Bouken. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center bg-black">
                <span className="text-xl font-bold text-white font-heading">
                  光
                </span>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E10600]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-lg font-bold tracking-tight text-black leading-none">
                  HIKARU BOUKEN
                </span>
                <span className="text-[10px] text-neutral-500 tracking-widest">
                  光る冒険
                </span>
              </div>
            </Link>
          </div>

          {verified && (
            <div className="mb-6 bg-green-50 border border-green-200 p-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">
                  Email Verified Successfully
                </p>
                <p className="text-xs text-green-600">
                  You can now sign in to your account
                </p>
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="font-heading text-2xl font-bold text-black">
              Sign In
            </h2>
            <p className="text-neutral-500 mt-1">
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-black">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-11 bg-neutral-50 border-neutral-200 focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-black"
                >
                  Password
                </Label>
                <div className="flex gap-2">
                  <Link
                    href="/auth/change-password"
                    className="text-xs text-neutral-500 hover:text-[#E10600] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-11 bg-neutral-50 border-neutral-200 focus:bg-white"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-black text-white hover:bg-neutral-800"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="text-[#E10600] font-medium hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
