"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import type { LoginActionState } from "@/lib/supabase/action-state";
import { getSafeRedirectPath } from "@/lib/supabase/auth";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import {
  createServerSupabaseClient,
  getRequestOrigin,
} from "@/lib/supabase/server";

const loginRequestSchema = z.object({
  email: z.string().trim().email(),
  next: z.string().optional(),
});

export async function requestMagicLinkAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  if (!hasSupabaseEnv()) {
    return {
      message:
        "Supabase 환경변수가 아직 설정되지 않았어요. `.env.local`에 URL과 publishable key를 먼저 넣어주세요.",
      status: "error",
    };
  }

  const parsed = loginRequestSchema.safeParse({
    email: formData.get("email"),
    next: formData.get("next"),
  });

  if (!parsed.success) {
    return {
      message: "유효한 이메일 주소를 입력해주세요.",
      status: "error",
    };
  }

  const nextPath = getSafeRedirectPath(parsed.data.next);
  const redirectTo = `${await getRequestOrigin()}/auth/callback?next=${encodeURIComponent(nextPath)}`;
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: redirectTo,
    },
  });

  if (error) {
    console.error("Magic link request failed", error);

    return {
      message:
        "로그인 링크를 보내지 못했어요. Supabase Auth 설정과 Redirect URL을 확인한 뒤 다시 시도해주세요.",
      status: "error",
    };
  }

  return {
    message:
      "로그인 링크를 보냈어요. 이메일에서 링크를 열면 대시보드로 바로 돌아옵니다.",
    status: "success",
  };
}

export async function signOutAction() {
  if (hasSupabaseEnv()) {
    const supabase = await createServerSupabaseClient();

    await supabase.auth.signOut();
  }

  redirect("/");
}
