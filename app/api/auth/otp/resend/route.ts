import { NextRequest, NextResponse } from 'next/server'
import { generateOTP } from '@/lib/otp'
import { Resend } from 'resend'

// Initialize Resend if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate input
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Generate new OTP
    const result = await generateOTP(email)

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error,
          cooldownRemaining: result.cooldownRemaining
        },
        { status: 400 }
      )
    }

    // Send email with OTP
    if (resend && result.code) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'noreply@hikarubouken.com',
          to: email,
          subject: 'Your Verification Code - Hikaru Bouken',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
                  <tr>
                    <td align="center">
                      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #ffffff; border: 1px solid #e5e5e5;">
                        <!-- Header -->
                        <tr>
                          <td style="height: 8px; background-color: #000000;"></td>
                        </tr>
                        <tr>
                          <td style="height: 2px; background-color: #E10600;"></td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                          <td style="padding: 48px 40px;">
                            <!-- Logo -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td align="center" style="padding-bottom: 32px;">
                                  <div style="width: 48px; height: 48px; background-color: #000000; display: inline-block; text-align: center; line-height: 48px;">
                                    <span style="color: #ffffff; font-size: 24px; font-weight: bold;">光</span>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            
                            <!-- Title -->
                            <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: bold; color: #000000; text-align: center;">
                              Verification Code
                            </h1>
                            <p style="margin: 0 0 32px; font-size: 14px; color: #737373; text-align: center;">
                              認証コード
                            </p>
                            
                            <!-- Code Box -->
                            <div style="background-color: #f5f5f5; border: 1px solid #e5e5e5; padding: 24px; text-align: center; margin-bottom: 24px;">
                              <p style="margin: 0 0 8px; font-size: 12px; color: #737373; text-transform: uppercase; letter-spacing: 2px;">
                                Your Code
                              </p>
                              <p style="margin: 0; font-size: 32px; font-weight: bold; color: #000000; letter-spacing: 8px; font-family: monospace;">
                                ${result.code}
                              </p>
                            </div>
                            
                            <!-- Instructions -->
                            <p style="margin: 0 0 24px; font-size: 14px; color: #525252; line-height: 1.6; text-align: center;">
                              Enter this code on the verification page to confirm your email address. 
                              This code will expire in <strong>5 minutes</strong>.
                            </p>
                            
                            <!-- Warning -->
                            <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 16px; margin-bottom: 24px;">
                              <p style="margin: 0; font-size: 13px; color: #991b1b;">
                                <strong>Security Notice:</strong> Never share this code with anyone. 
                                We will never ask for your code via phone or email.
                              </p>
                            </div>
                            
                            <p style="margin: 0; font-size: 13px; color: #737373; text-align: center;">
                              If you didn't request this code, you can safely ignore this email.
                            </p>
                          </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                          <td style="background-color: #f5f5f5; border-top: 1px solid #e5e5e5; padding: 24px 40px; text-align: center;">
                            <p style="margin: 0; font-size: 12px; color: #737373;">
                              HIKARU BOUKEN · Secure Email Verification · ${new Date().getFullYear()}
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
          `,
        })
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError)
        // Don't fail the request if email fails - code is still generated
        // In production, you'd want to handle this more gracefully
      }
    } else {
      // Log code for development (remove in production)
      console.log(`[DEV] OTP for ${email}: ${result.code}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('OTP resend error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
