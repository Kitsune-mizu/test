"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, ArrowLeft } from "lucide-react"

function ChangePasswordForm() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)

    const supabase = createClient()

    try {
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success("Password changed successfully!")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        router.push("/account/settings")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
      console.error("[v0] Password change error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-neutral-50 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative Japanese Text */}
        <span className="absolute -left-10 bottom-20 text-[250px] font-heading font-bold text-neutral-100 leading-none select-none pointer-events-none" aria-hidden="true">
          鍵
        </span>
        
        <div>
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center bg-black">
              <span className="text-xl font-bold text-white font-heading">光</span>
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
            Secure Your Account
            <br />
            <span className="text-neutral-400">パスワード変更</span>
          </h1>
          <p className="text-neutral-600 max-w-md">
            Change your password to keep your account safe and secure. Choose a strong password with a mix of characters.
          </p>
        </div>

        <p className="text-xs text-neutral-400">
          &copy; {new Date().getFullYear()} Hikaru Bouken. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center bg-black">
                <span className="text-xl font-bold text-white font-heading">光</span>
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

          {/* Back Button */}
          <Link href="/account/settings" className="inline-flex mb-8">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Settings
            </Button>
          </Link>

          <div className="mb-8">
            <h2 className="font-heading text-2xl font-bold text-black">Change Password</h2>
            <p className="text-neutral-500 mt-1">Update your password to keep your account secure</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="current" className="text-sm font-medium text-black">Current Password</Label>
              <Input
                id="current"
                type="password"
                placeholder="Enter your current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isLoading}
                className="h-11 bg-neutral-50 border-neutral-200 focus:bg-white"
              />
              <p className="text-xs text-neutral-400">
                For security reasons, we&apos;ll verify your current password
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new" className="text-sm font-medium text-black">New Password</Label>
              <Input
                id="new"
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
                className="h-11 bg-neutral-50 border-neutral-200 focus:bg-white"
              />
              <p className="text-xs text-neutral-400">
                Must be at least 8 characters long
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-sm font-medium text-black">Confirm Password</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="h-11 bg-neutral-50 border-neutral-200 focus:bg-white"
              />
            </div>

            {/* Security Tips */}
            <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-lg space-y-2">
              <h4 className="text-sm font-semibold text-black">Strong Password Tips</h4>
              <ul className="text-xs text-neutral-600 space-y-1">
                <li>✓ Use uppercase and lowercase letters</li>
                <li>✓ Include numbers and special characters</li>
                <li>✓ Avoid using personal information</li>
                <li>✓ Do not reuse old passwords</li>
              </ul>
            </div>

            <Button type="submit" className="w-full h-11 bg-black text-white hover:bg-neutral-800" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500">
              Need help?{" "}
              <Link href="/auth/forgot-password" className="text-[#E10600] font-medium hover:underline">
                Reset your password
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    }>
      <ChangePasswordForm />
    </Suspense>
  )
}
