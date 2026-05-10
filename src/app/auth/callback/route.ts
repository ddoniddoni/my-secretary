import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import { buildLoginHref, getSafeRedirectPath } from "@/lib/supabase/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const nextPath = getSafeRedirectPath(request.nextUrl.searchParams.get("next"));

  if (!code) {
    redirect(buildLoginHref(nextPath, "missing_code"));
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Failed to exchange auth code for session", error);
    redirect(buildLoginHref(nextPath, "auth_callback_failed"));
  }

  redirect(nextPath);
}
