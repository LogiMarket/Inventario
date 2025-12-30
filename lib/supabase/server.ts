import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function getSupabaseServerClient() {
  const cookieStore = await cookies()
  const schema = process.env.NEXT_PUBLIC_SUPABASE_DB_SCHEMA || "public"

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    db: { schema },
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // El método `setAll` fue llamado desde un Server Component.
          // Esto puede ser ignorado si tienes middleware refrescando
          // las sesiones de usuario.
        }
      },
    },
  })
}
