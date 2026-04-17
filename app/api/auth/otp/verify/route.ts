import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP } from '@/lib/otp'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code } = body

    // Validate input
    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: 'Email and code are required' },
        { status: 400 }
      )
    }

    // Validate code format
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { success: false, error: 'Invalid code format' },
        { status: 400 }
      )
    }

    // Verify the OTP
    const result = await verifyOTP(email, code)

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error,
          attemptsRemaining: result.attemptsRemaining
        },
        { status: 400 }
      )
    }

    // Update user metadata to mark email as verified
    const supabase = createAdminClient()
    
    // Find the user by email in auth.users
    const { data: users, error: findError } = await supabase.auth.admin.listUsers()
    
    if (findError) {
      console.error('Error finding user:', findError)
      // Still return success since OTP was verified
      return NextResponse.json({ success: true })
    }

    const user = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
    
    if (user) {
      // Update user metadata to mark as verified
      await supabase.auth.admin.updateUserById(user.id, {
        user_metadata: {
          ...user.user_metadata,
          email_verified_at: new Date().toISOString(),
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
