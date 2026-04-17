import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: getUser() must be called to refresh the auth session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  
  // Define path categories
  const isAdminPath = pathname.startsWith('/admin')
  const isAuthPath = pathname.startsWith('/auth')
  const isVerifyPath = pathname === '/auth/verify'
  const isProtectedCustomerPath = 
    pathname.startsWith('/account') ||
    pathname.startsWith('/cart') ||
    pathname.startsWith('/checkout')

  // ────────────────────────────────────────────────────────────────────────────
  // 1. Redirect unauthenticated users from protected routes
  // ────────────────────────────────────────────────────────────────────────────
  if ((isProtectedCustomerPath || isAdminPath) && !user && !isAuthPath) {
    const url = request.nextUrl.clone()
    
    // Admin paths go to admin login, others to customer login
    url.pathname = isAdminPath ? '/admin/auth/login' : '/auth/login'
    url.searchParams.set('redirectTo', pathname)
    
    return NextResponse.redirect(url)
  }

  // ────────────────────────────────────────────────────────────────────────────
  // 2. Admin role validation (critical security check)
  // ────────────────────────────────────────────────────────────────────────────
  if (isAdminPath && user) {
    // Fetch user role from database
    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    // If not admin or error fetching role, deny access
    if (error || userData?.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      url.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(url)
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // 3. Redirect authenticated users away from auth pages (except verify page)
  // ────────────────────────────────────────────────────────────────────────────
  if (isAuthPath && user && !pathname.includes('/logout') && !isVerifyPath) {
    // Check if admin to redirect appropriately
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const url = request.nextUrl.clone()
    
    // Admins go to dashboard, customers to their account
    url.pathname = userData?.role === 'admin' ? '/admin/dashboard' : '/account'
    
    // If there was a redirectTo param, use it (unless it's an auth page)
    const redirectTo = request.nextUrl.searchParams.get('redirectTo')
    if (redirectTo && !redirectTo.startsWith('/auth')) {
      url.pathname = redirectTo
    }
    
    return NextResponse.redirect(url)
  }

  // ────────────────────────────────────────────────────────────────────────────
  // 4. Return response with refreshed session cookies
  // ────────────────────────────────────────────────────────────────────────────
  return supabaseResponse
}
