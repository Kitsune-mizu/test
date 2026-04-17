import { NextRequest, NextResponse } from 'next/server'
import { getResendCooldown } from '@/lib/otp'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const cooldown = await getResendCooldown(email)

    return NextResponse.json({ cooldown })
  } catch (error) {
    console.error('Cooldown check error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
