import { createBrowserClient } from "@supabase/ssr";

// Client Supabase untuk dipakai di Client Component ("use client").
// Auth (login/register/logout) jalan lewat sini.
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
