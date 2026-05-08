import Link from "next/link";

import { PixelAvatar } from "@/components/assistants/PixelAvatar";
import { Container } from "@/components/layout/Container";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { requireUser } from "@/lib/supabase/server";

const dashboardPlaceholders = [
  {
    title: "내 AI 비서 목록",
    description:
      "Step 04에서 사용자별 비서 카드 그리드와 빈 상태를 연결합니다.",
  },
  {
    title: "최근 실행 상태",
    description:
      "Step 06과 Step 07에서 실행 결과와 run history를 표시합니다.",
  },
  {
    title: "비서 추가 모달",
    description:
      "템플릿 선택과 설정 입력 플로우는 CRUD 단계에서 붙일 예정입니다.",
  },
];

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="py-12">
        <Container className="space-y-8">
          <section className="surface-panel rounded-[2rem] border px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
                  Dashboard Scaffold
                </p>
                <p className="mt-3 text-sm font-medium text-[var(--color-accent)]">
                  Signed in as {user.email ?? "your account"}
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
                  비서 대시보드 구조를 먼저 준비해두었습니다.
                </h1>
                <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">
                  인증과 세션 연결이 끝난 지금은 보호된 화면으로 접근할 수 있습니다.
                  다음 step에서는 사용자별 데이터와 실제 비서 목록을 붙여서
                  대시보드를 살아 있는 화면으로 바꿉니다.
                </p>
              </div>
              <PixelAvatar variant="helper" size="lg" />
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-3">
            {dashboardPlaceholders.map((item) => (
              <article
                key={item.title}
                className="surface-panel rounded-[1.75rem] border p-6"
              >
                <h2 className="text-xl font-semibold tracking-[-0.04em]">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  {item.description}
                </p>
              </article>
            ))}
          </section>

          <Link
            href="/assistants/demo-assistant"
            className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-[var(--color-foreground)]"
          >
            비서 상세 미리 보기
          </Link>
        </Container>
      </main>
    </div>
  );
}
