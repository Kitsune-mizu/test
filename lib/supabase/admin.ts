import { createClient } from '@supabase/supabase-js'

// ⚠️ HANYA untuk server-side admin operations
// JANGAN pernah digunakan di client components
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // ✅ Ini yang bypass RLS
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}