import Link from "next/link";

import { PixelAvatar } from "@/components/assistants/PixelAvatar";
import { Container } from "@/components/layout/Container";
import { SiteHeader } from "@/components/layout/SiteHeader";

const dashboardPlaceholders = [
  {
    title: "내 AI 비서 목록",
    description: "Step 04에서 사용자별 비서 카드 그리드와 빈 상태를 연결합니다.",
  },
  {
    title: "최근 실행 상태",
    description: "Step 06과 Step 07에서 실행 결과와 run history를 표시합니다.",
  },
  {
    title: "비서 추가 모달",
    description: "템플릿 선택과 설정 입력 플로우는 CRUD 단계에서 붙입니다.",
  },
];

export default function DashboardPage() {
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
                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
                  비서 대시보드 구조를 먼저 준비해두었습니다
                </h1>
                <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">
                  인증과 실제 데이터 연결 전 단계라서 지금은 화면 구조와 시각적
                  방향만 잡아둔 상태입니다. 다음 step에서 보호 라우트와 사용자
                  세션이 붙습니다.
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
            비서 상세 자리 보기
          </Link>
        </Container>
      </main>
    </div>
  );
}
