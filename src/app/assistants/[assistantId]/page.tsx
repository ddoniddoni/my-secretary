import Link from "next/link";

import { PixelAvatar } from "@/components/assistants/PixelAvatar";
import { Container } from "@/components/layout/Container";
import { SiteHeader } from "@/components/layout/SiteHeader";

type AssistantDetailPageProps = {
  params: Promise<{
    assistantId: string;
  }>;
};

export default async function AssistantDetailPage({
  params,
}: AssistantDetailPageProps) {
  const { assistantId } = await params;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="py-12">
        <Container className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_320px]">
          <section className="surface-panel rounded-[2rem] border px-6 py-8 sm:px-8">
            <div className="flex items-start justify-between gap-6">
              <div className="max-w-2xl">
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
                  Assistant Detail Scaffold
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
                  비서 상세 페이지 뼈대
                </h1>
                <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">
                  현재 assistant id는 <strong>{assistantId}</strong> 입니다.
                  Step 04 이후부터는 실제 비서 설정, 최근 실행 결과, 실행 기록이
                  이 화면에 연결됩니다.
                </p>
              </div>
              <PixelAvatar variant="news" size="md" />
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border bg-white/80 p-5">
                <h2 className="text-lg font-semibold">설정 요약</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  비서 타입별 config 요약 영역이 들어갈 자리입니다.
                </p>
              </div>
              <div className="rounded-[1.5rem] border bg-white/80 p-5">
                <h2 className="text-lg font-semibold">최근 실행 결과</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  Step 07에서 결과 렌더러와 assistant-specific UI가 연결됩니다.
                </p>
              </div>
            </div>
          </section>

          <aside className="surface-panel rounded-[2rem] border px-6 py-8">
            <h2 className="text-xl font-semibold tracking-[-0.04em]">
              다음 연결 예정
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-muted)]">
              <li>Supabase ownership guard</li>
              <li>assistant_runs 기반 실행 기록</li>
              <li>뉴스 결과 카드 UI</li>
              <li>주식 결과 카드 UI</li>
            </ul>
            <Link
              href="/dashboard"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[var(--color-foreground)] px-5 py-3 text-sm font-medium text-white"
            >
              대시보드로 돌아가기
            </Link>
          </aside>
        </Container>
      </main>
    </div>
  );
}
