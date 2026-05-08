import "server-only";

import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { buildLoginHref } from "@/lib/supabase/auth";
import { getOptionalSiteUrl, getSupabaseEnv, hasSupabaseEnv } from "@/lib/supabase/env";

export async function createServerSupabaseClient() {
  const env = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(env.url, env.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, options, value }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies directly.
        }
      },
    },
  });
}

export async function getRequestOrigin() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  if (origin) {
    return origin;
  }

  const host =
    headerStore.get("x-forwarded-host") ?? headerStore.get("host");

  if (host) {
    const protocol =
      headerStore.get("x-forwarded-proto") ??
      (host.includes("localhost") ? "http" : "https");

    return `${protocol}://${host}`;
  }

  return getOptionalSiteUrl() ?? "http://localhost:3000";
}

export const getCurrentUser = cache(async (): Promise<User | null> => {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
});

export async function requireUser(nextPath: string) {
  if (!hasSupabaseEnv()) {
    redirect(buildLoginHref(nextPath, "supabase_not_configured"));
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginHref(nextPath));
  }

  return user;
}

export type RouteAuthContext =
  | {
      error: string;
      status: number;
    }
  | {
      supabase: SupabaseClient;
      user: User;
    };

export async function getRouteAuthContext(): Promise<RouteAuthContext> {
  if (!hasSupabaseEnv()) {
    return {
      error:
        "Supabase 환경변수가 아직 설정되지 않았습니다. `.env.local`과 Supabase 프로젝트 설정을 먼저 확인해주세요.",
      status: 500,
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      error: "로그인이 필요합니다.",
      status: 401,
    };
  }

  return {
    supabase,
    user,
  };
}
