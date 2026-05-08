import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnv } from "@/lib/supabase/env";

let browserClient: ReturnType<typeof createBrowserClient> | undefined;

export function createBrowserSupabaseClient() {
  if (!browserClient) {
    const env = getSupabaseEnv();

    browserClient = createBrowserClient(env.url, env.publishableKey);
  }

  return browserClient;
}
