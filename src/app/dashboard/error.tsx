"use client";

import { Container } from "@/components/layout/Container";

type DashboardErrorProps = {
  error: Error;
  reset: () => void;
};

export default function DashboardError({
  error,
  reset,
}: DashboardErrorProps) {
  return (
    <div className="min-h-screen">
      <main className="py-12">
        <Container className="max-w-3xl">
          <section className="surface-panel rounded-[2rem] border px-6 py-10 text-center sm:px-10">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
              Dashboard Error
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em]">
              대시보드를 불러오지 못했습니다.
            </h1>
            <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
              {error.message ||
                "Supabase 스키마가 적용되었는지와 인증 설정이 올바른지 확인해주세요."}
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[var(--color-foreground)] px-6 py-3 text-sm font-medium text-white"
            >
              다시 시도
            </button>
          </section>
        </Container>
      </main>
    </div>
  );
}
