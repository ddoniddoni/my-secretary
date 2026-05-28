"use client";

import { useActionState } from "react";

import { requestMagicLinkAction } from "@/lib/supabase/actions";
import { initialLoginActionState } from "@/lib/supabase/action-state";

type LoginFormProps = {
  disabled?: boolean;
  nextPath: string;
};

export function LoginForm({
  disabled = false,
  nextPath,
}: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(
    requestMagicLinkAction,
    initialLoginActionState,
  );

  const isError = state.status === "error";
  const isSuccess = state.status === "success";

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={nextPath} />

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium text-[var(--color-foreground)]"
        >
          이메일
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="이메일 주소를 입력하세요"
          disabled={disabled || isPending}
          className="w-full rounded-[14px] border border-[var(--color-stroke)] bg-[var(--color-surface-strong)] px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-foreground)] disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {(isError || isSuccess) && (
        <div
          className={`rounded-[1.5rem] border px-4 py-3 text-sm leading-6 ${
            isError
              ? "border-[rgba(181,67,51,0.25)] bg-[rgba(181,67,51,0.08)] text-[#7a2d23]"
              : "border-[rgba(11,114,133,0.2)] bg-[rgba(11,114,133,0.08)] text-[#0b7285]"
          }`}
        >
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={disabled || isPending}
        className="pixel-button pixel-button-primary h-[52px] w-full text-sm disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "링크를 준비하고 있어요..." : "이메일 로그인 링크 받기"}
      </button>

      <p className="text-sm leading-7 text-[var(--color-muted)]">
        처음 로그인하는 이메일이라면 Supabase Auth에서 계정이 함께 생성될 수
        있어요.
      </p>
    </form>
  );
}
