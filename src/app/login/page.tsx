import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/LoginForm";
import { Container } from "@/components/layout/Container";
import { SiteHeader } from "@/components/layout/SiteHeader";
import {
  DEFAULT_AUTH_REDIRECT_PATH,
  getAuthErrorMessage,
  getSafeRedirectPath,
} from "@/lib/supabase/auth";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/supabase/server";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const nextPath = getSafeRedirectPath(
    resolvedSearchParams.next,
    DEFAULT_AUTH_REDIRECT_PATH,
  );
  const user = await getCurrentUser();

  if (user) {
    redirect(nextPath);
  }

  const authErrorMessage = getAuthErrorMessage(resolvedSearchParams.error);
  const isConfigured = hasSupabaseEnv();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="py-16">
        <Container className="max-w-3xl">
          <section className="surface-panel rounded-[2rem] border px-6 py-8 sm:px-10 sm:py-12">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
              Supabase Auth
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
              로그인 링크로 내 비서 대시보드에 들어오세요.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--color-muted)]">
              My SECRETARY는 Supabase Auth 기반 세션으로 사용자별 대시보드를
              보호합니다. 이메일로 받은 링크를 열면 브리핑 대시보드로 바로
              돌아옵니다.
            </p>

            {authErrorMessage ? (
              <div className="mt-8 rounded-[1.5rem] border border-[rgba(181,67,51,0.25)] bg-[rgba(181,67,51,0.08)] px-4 py-3 text-sm leading-6 text-[#7a2d23]">
                {authErrorMessage}
              </div>
            ) : null}

            {!isConfigured ? (
              <div className="mt-8 rounded-[1.5rem] border border-[rgba(230,140,78,0.25)] bg-[rgba(230,140,78,0.08)] px-4 py-3 text-sm leading-6 text-[#7d4d21]">
                `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`과
                `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`를 설정하면 로그인 흐름이
                활성화됩니다.
              </div>
            ) : null}

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
              <LoginForm disabled={!isConfigured} nextPath={nextPath} />

              <aside className="rounded-[1.75rem] border border-[var(--color-stroke)] bg-white/80 p-5">
                <h2 className="text-lg font-semibold tracking-[-0.04em]">
                  로그인 후 열리는 것
                </h2>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-muted)]">
                  <li>내 AI 비서 대시보드</li>
                  <li>비서 상세 화면 접근</li>
                  <li>이후 step의 실행 기록과 설정 저장 기반</li>
                </ul>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                  로그인 링크는 Supabase Redirect URL 설정이 맞아야 정상 동작합니다.
                </p>
              </aside>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-[var(--color-stroke)] bg-white px-6 py-3 text-sm font-medium"
              >
                랜딩으로 돌아가기
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-[var(--color-foreground)] px-6 py-3 text-sm font-medium text-white"
              >
                보호된 대시보드 확인
              </Link>
            </div>
          </section>
        </Container>
      </main>
    </div>
  );
}
