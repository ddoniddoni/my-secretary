import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function LoginPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="py-16">
        <Container className="max-w-3xl">
          <section className="surface-panel rounded-[2rem] border px-6 py-8 sm:px-10 sm:py-12">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
              Step 02 Preview
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
              로그인 페이지는 다음 step에서 Supabase Auth와 연결됩니다
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--color-muted)]">
              현재는 App Router 구조와 public route 흐름만 준비된 상태입니다.
              다음 단계에서 이메일 또는 OAuth 로그인, 세션 복원, 보호 라우트가
              추가됩니다.
            </p>
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
                대시보드 자리 보기
              </Link>
            </div>
          </section>
        </Container>
      </main>
    </div>
  );
}
