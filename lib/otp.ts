import { createAdminClient } from '@/lib/supabase/admin'
import { createHash, randomInt } from 'crypto'

// OTP Configuration
const OTP_LENGTH = 6
const OTP_EXPIRY_MINUTES = 5
const RESEND_COOLDOWN_SECONDS = 120
const MAX_ATTEMPTS = 3
const MAX_CODES_PER_HOUR = 3

interface OTPCode {
  id: string
  email: string
  code_hash: string
  created_at: string
  expires_at: string
  verified_at: string | null
  attempts: number
  last_attempt_at: string | null
}

interface GenerateOTPResult {
  success: boolean
  code?: string
  error?: string
  cooldownRemaining?: number
}

interface VerifyOTPResult {
  success: boolean
  error?: string
  attemptsRemaining?: number
}

/**
 * Hash OTP code using SHA-256 for secure storage
 */
function hashCode(code: string): string {
  return createHash('sha256').update(code).digest('hex')
}

/**
 * Generate a random 6-digit OTP code
 */
function generateCode(): string {
  // Generate random number between 100000-999999
  return randomInt(100000, 1000000).toString()
}

/**
 * Generate and store a new OTP code for email verification
 */
export async function generateOTP(email: string): Promise<GenerateOTPResult> {
  const supabase = createAdminClient()
  const normalizedEmail = email.toLowerCase().trim()

  try {
    // Check rate limiting - max codes per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { data: recentCodes, error: countError } = await supabase
      .from('otp_codes')
      .select('id, created_at')
      .eq('email', normalizedEmail)
      .gte('created_at', oneHourAgo)

    if (countError) {
      console.error('Error checking rate limit:', countError)
      return { success: false, error: 'Failed to check rate limit' }
    }

    if (recentCodes && recentCodes.length >= MAX_CODES_PER_HOUR) {
      return { 
        success: false, 
        error: 'Too many verification attempts. Please try again later.' 
      }
    }

    // Check for existing valid code with cooldown
    const { data: existingCode, error: existingError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', normalizedEmail)
      .is('verified_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!existingError && existingCode) {
      const createdAt = new Date(existingCode.created_at).getTime()
      const now = Date.now()
      const cooldownEnd = createdAt + RESEND_COOLDOWN_SECONDS * 1000
      
      if (now < cooldownEnd) {
        const remainingSeconds = Math.ceil((cooldownEnd - now) / 1000)
        return {
          success: false,
          error: 'Please wait before requesting a new code',
          cooldownRemaining: remainingSeconds
        }
      }
    }

    // Generate new code
    const code = generateCode()
    const codeHash = hashCode(code)
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString()

    // Invalidate any existing unverified codes for this email
    await supabase
      .from('otp_codes')
      .delete()
      .eq('email', normalizedEmail)
      .is('verified_at', null)

    // Store new code
    const { error: insertError } = await supabase
      .from('otp_codes')
      .insert({
        email: normalizedEmail,
        code_hash: codeHash,
        expires_at: expiresAt,
        attempts: 0
      })

    if (insertError) {
      console.error('Error storing OTP:', insertError)
      return { success: false, error: 'Failed to generate verification code' }
    }

    return { success: true, code }
  } catch (error) {
    console.error('Unexpected error generating OTP:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Verify an OTP code for a given email
 */
export async function verifyOTP(email: string, code: string): Promise<VerifyOTPResult> {
  const supabase = createAdminClient()
  const normalizedEmail = email.toLowerCase().trim()
  const codeHash = hashCode(code)

  try {
    // Get the latest unverified code for this email
    const { data: otpRecord, error: fetchError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', normalizedEmail)
      .is('verified_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (fetchError || !otpRecord) {
      return { 
        success: false, 
        error: 'No verification code found. Please request a new one.' 
      }
    }

    // Check if code is expired
    if (new Date(otpRecord.expires_at) < new Date()) {
      // Clean up expired code
      await supabase
        .from('otp_codes')
        .delete()
        .eq('id', otpRecord.id)

      return { 
        success: false, 
        error: 'Verification code has expired. Please request a new one.' 
      }
    }

    // Check if max attempts exceeded
    if (otpRecord.attempts >= MAX_ATTEMPTS) {
      // Invalidate the code
      await supabase
        .from('otp_codes')
        .delete()
        .eq('id', otpRecord.id)

      return { 
        success: false, 
        error: 'Too many failed attempts. Please request a new code.' 
      }
    }

    // Verify the code
    if (otpRecord.code_hash !== codeHash) {
      // Increment attempts
      const newAttempts = otpRecord.attempts + 1
      await supabase
        .from('otp_codes')
        .update({ 
          attempts: newAttempts,
          last_attempt_at: new Date().toISOString()
        })
        .eq('id', otpRecord.id)

      return { 
        success: false, 
        error: 'Invalid verification code',
        attemptsRemaining: MAX_ATTEMPTS - newAttempts
      }
    }

    // Code is valid - mark as verified
    await supabase
      .from('otp_codes')
      .update({ verified_at: new Date().toISOString() })
      .eq('id', otpRecord.id)

    return { success: true }
  } catch (error) {
    console.error('Unexpected error verifying OTP:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Check if an email has a pending (unverified) OTP
 */
export async function hasPendingOTP(email: string): Promise<boolean> {
  const supabase = createAdminClient()
  const normalizedEmail = email.toLowerCase().trim()

  const { data, error } = await supabase
    .from('otp_codes')
    .select('id')
    .eq('email', normalizedEmail)
    .is('verified_at', null)
    .gt('expires_at', new Date().toISOString())
    .limit(1)

  return !error && data && data.length > 0
}

/**
 * Get remaining cooldown time in seconds for resending OTP
 */
export async function getResendCooldown(email: string): Promise<number> {
  const supabase = createAdminClient()
  const normalizedEmail = email.toLowerCase().trim()

  const { data, error } = await supabase
    .from('otp_codes')
    .select('created_at')
    .eq('email', normalizedEmail)
    .is('verified_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) return 0

  const createdAt = new Date(data.created_at).getTime()
  const cooldownEnd = createdAt + RESEND_COOLDOWN_SECONDS * 1000
  const remaining = Math.max(0, Math.ceil((cooldownEnd - Date.now()) / 1000))

  return remaining
}

/**
 * Clean up expired OTP codes (can be called periodically)
 */
export async function cleanupExpiredCodes(): Promise<void> {
  const supabase = createAdminClient()

  await supabase
    .from('otp_codes')
    .delete()
    .lt('expires_at', new Date().toISOString())
}
