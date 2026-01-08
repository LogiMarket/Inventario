import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowserClient() {
  const schema = process.env.NEXT_PUBLIC_SUPABASE_DB_SCHEMA || "public"
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = 
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      `Missing Supabase env vars (client): url=${Boolean(url)} key=${Boolean(key)}`
    );
  }

  if (!client) {
    client = createBrowserClient(url, key, {
      db: { schema },
    })
  }
  return client
}
