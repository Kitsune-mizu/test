"use client"

import { Suspense, useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, Mail, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp"

function VerifyForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch initial cooldown on mount
  useEffect(() => {
    if (email) {
      fetchCooldown()
    }
  }, [email])

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const fetchCooldown = async () => {
    try {
      const res = await fetch(`/api/auth/otp/cooldown?email=${encodeURIComponent(email)}`)
      const data = await res.json()
      if (data.cooldown) {
        setCooldown(data.cooldown)
      }
    } catch {
      // Ignore cooldown fetch errors
    }
  }

  const handleVerify = useCallback(async (code: string) => {
    if (code.length !== 6) return

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      })

      const data = await res.json()

      if (data.success) {
        setIsVerified(true)
        toast.success("Email verified successfully!")
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push("/auth/login?verified=true")
        }, 2000)
      } else {
        setError(data.error || "Verification failed")
        setOtp("")
        if (data.attemptsRemaining !== undefined) {
          toast.error(`${data.error}. ${data.attemptsRemaining} attempts remaining.`)
        } else {
          toast.error(data.error || "Verification failed")
        }
      }
    } catch {
      setError("An error occurred. Please try again.")
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [email, router])

  // Auto-verify when OTP is complete
  useEffect(() => {
    if (otp.length === 6 && !isLoading && !isVerified) {
      handleVerify(otp)
    }
  }, [otp, isLoading, isVerified, handleVerify])

  const handleResend = async () => {
    if (cooldown > 0) return

    setIsResending(true)
    setError(null)

    try {
      const res = await fetch("/api/auth/otp/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success("Verification code sent!")
        setCooldown(120) // 2 minute cooldown
      } else {
        if (data.cooldownRemaining) {
          setCooldown(data.cooldownRemaining)
        }
        toast.error(data.error || "Failed to resend code")
      }
    } catch {
      toast.error("Failed to resend code")
    } finally {
      setIsResending(false)
    }
  }

  // Redirect if no email provided
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-[#E10600] mx-auto mb-4" />
          <h2 className="font-heading text-xl font-bold text-black mb-2">Invalid Request</h2>
          <p className="text-neutral-500 mb-6">No email address provided for verification.</p>
          <Button asChild className="bg-black text-white hover:bg-neutral-800">
            <Link href="/auth/sign-up">Go to Sign Up</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-neutral-50">
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <span className="absolute -right-20 top-1/4 text-[400px] font-heading font-bold text-neutral-100 leading-none select-none" aria-hidden="true">
          認
        </span>
        <span className="absolute -left-20 bottom-1/4 text-[300px] font-heading font-bold text-neutral-100 leading-none select-none" aria-hidden="true">
          証
        </span>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        <div className="w-full max-w-lg">
          {/* Document Card */}
          <div className="bg-white border border-neutral-200 shadow-xl relative">
            {/* Document Header Strip */}
            <div className="h-2 bg-black" />
            <div className="h-[2px] bg-[#E10600]" />

            {/* Document Content */}
            <div className="p-8 md:p-12">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <Link href="/" className="flex items-center gap-3">
                  <div className="relative flex h-12 w-12 items-center justify-center bg-black">
                    <span className="text-2xl font-bold text-white font-heading">光</span>
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E10600]" />
                  </div>
                </Link>
              </div>

              {isVerified ? (
                // Success State
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-50 border-2 border-green-500 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-black mb-2">
                    Verified Successfully
                  </h2>
                  <p className="text-neutral-500 mb-2">確認完了</p>
                  <p className="text-neutral-600 text-sm">
                    Redirecting to login...
                  </p>
                </div>
              ) : (
                // Verification Form
                <>
                  {/* Title Section */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 border border-neutral-200 mb-6">
                      <Mail className="h-8 w-8 text-neutral-600" />
                    </div>
                    <h1 className="font-heading text-2xl font-bold text-black mb-1">
                      Verify Your Email
                    </h1>
                    <p className="text-neutral-400 text-sm font-heading">メール認証</p>
                  </div>

                  {/* Email Display */}
                  <div className="bg-neutral-50 border border-neutral-200 p-4 mb-8">
                    <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">
                      Verification sent to
                    </p>
                    <p className="font-mono text-sm text-black break-all">{email}</p>
                  </div>

                  {/* Instructions */}
                  <p className="text-neutral-600 text-sm text-center mb-8">
                    Enter the 6-digit verification code sent to your email. 
                    The code expires in <span className="font-medium text-black">5 minutes</span>.
                  </p>

                  {/* OTP Input */}
                  <div className="flex justify-center mb-6">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={setOtp}
                      disabled={isLoading}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="w-12 h-14 text-xl font-mono border-neutral-300 bg-neutral-50" />
                        <InputOTPSlot index={1} className="w-12 h-14 text-xl font-mono border-neutral-300 bg-neutral-50" />
                        <InputOTPSlot index={2} className="w-12 h-14 text-xl font-mono border-neutral-300 bg-neutral-50" />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} className="w-12 h-14 text-xl font-mono border-neutral-300 bg-neutral-50" />
                        <InputOTPSlot index={4} className="w-12 h-14 text-xl font-mono border-neutral-300 bg-neutral-50" />
                        <InputOTPSlot index={5} className="w-12 h-14 text-xl font-mono border-neutral-300 bg-neutral-50" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  {/* Error Display */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 p-3 mb-6 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-[#E10600] shrink-0" />
                      <p className="text-sm text-[#E10600]">{error}</p>
                    </div>
                  )}

                  {/* Loading State */}
                  {isLoading && (
                    <div className="flex items-center justify-center gap-2 mb-6 text-neutral-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Verifying...</span>
                    </div>
                  )}

                  {/* Resend Section */}
                  <div className="border-t border-neutral-200 pt-6 mt-6">
                    <div className="text-center">
                      <p className="text-sm text-neutral-500 mb-3">
                        {"Didn't receive the code?"}
                      </p>
                      <Button
                        variant="outline"
                        onClick={handleResend}
                        disabled={cooldown > 0 || isResending}
                        className="border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                      >
                        {isResending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : cooldown > 0 ? (
                          `Resend in ${cooldown}s`
                        ) : (
                          "Resend Code"
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Back Link */}
                  <div className="mt-8 text-center">
                    <Link 
                      href="/auth/sign-up" 
                      className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-black transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Sign Up
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Document Footer */}
            <div className="border-t border-neutral-200 px-8 py-4 bg-neutral-50">
              <p className="text-xs text-neutral-400 text-center">
                HIKARU BOUKEN &middot; Secure Email Verification &middot; {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    }>
      <VerifyForm />
    </Suspense>
  )
}
