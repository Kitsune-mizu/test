"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

async function sendOTP(
  email: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/auth/otp/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  } catch {
    return { success: false, error: "Failed to send verification code" };
  }
}

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          name,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    } else {
      // Send OTP for email verification
      const otpResult = await sendOTP(email);
      if (!otpResult.success) {
        console.warn("Failed to send OTP:", otpResult.error);
        // Still redirect to verify page - user can resend from there
      }

      // Redirect to verification page
      router.push(`/auth/verify?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-black text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative Japanese Text */}
        <span
          className="absolute -right-10 top-40 text-[250px] font-heading font-bold text-white/[0.03] leading-none select-none pointer-events-none"
          aria-hidden="true"
        >
          旅
        </span>

        <div>
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center bg-white">
              <span className="text-xl font-bold text-black font-heading">
                光
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E10600]" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-tight text-white leading-none">
                HIKARU BOUKEN
              </span>
              <span className="text-[10px] text-neutral-500 tracking-widest">
                光る冒険
              </span>
            </div>
          </Link>
        </div>

        <div className="space-y-6 relative">
          <h1 className="font-heading text-4xl font-bold leading-tight">
            Start Your Journey
            <br />
            <span className="text-neutral-500">冒険を始める</span>
          </h1>
          <p className="text-neutral-400 max-w-md">
            Join our community of explorers and get access to exclusive gear,
            early releases, and adventure inspiration.
          </p>

          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-neutral-800">
            <div>
              <p className="text-2xl font-heading font-bold">50+</p>
              <p className="text-xs text-neutral-500">Premium Brands</p>
            </div>
            <div>
              <p className="text-2xl font-heading font-bold">500+</p>
              <p className="text-xs text-neutral-500">Products</p>
            </div>
            <div>
              <p className="text-2xl font-heading font-bold">10K+</p>
              <p className="text-xs text-neutral-500">Explorers</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-neutral-600">
          &copy; {new Date().getFullYear()} Hikaru Bouken. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Sign Up Form */}
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

          <div className="mb-8">
            <h2 className="font-heading text-2xl font-bold text-black">
              Create Account
            </h2>
            <p className="text-neutral-500 mt-1">
              Join us and start your adventure
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-black">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
                className="h-11 bg-neutral-50 border-neutral-200 focus:bg-white"
              />
            </div>

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
              <Label
                htmlFor="password"
                className="text-sm font-medium text-black"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-11 bg-neutral-50 border-neutral-200 focus:bg-white"
              />
              <p className="text-xs text-neutral-400">
                Must be at least 6 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-black"
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-[#E10600] font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-neutral-400">
            By creating an account, you agree to our Terms of Service and
            Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
