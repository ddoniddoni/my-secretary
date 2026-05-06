import Link from "next/link";

import { PixelAvatar } from "@/components/assistants/PixelAvatar";
import { Container } from "@/components/layout/Container";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SectionHeading } from "@/components/shared/SectionHeading";
import {
  assistantPreviews,
  productHighlights,
  productPrinciples,
} from "@/lib/landing/content";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top_right,_rgba(232,116,50,0.22),_transparent_40%),radial-gradient(circle_at_top_left,_rgba(11,114,133,0.14),_transparent_30%)]" />
      <SiteHeader />
      <main className="pb-24">
        <section className="pt-8 sm:pt-12">
          <Container className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-stroke)] bg-white/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-[var(--color-muted)]">
                <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                Purpose-built AI dashboard
              </div>
              <div className="space-y-5">
                <h1 className="text-balance max-w-3xl text-5xl font-semibold tracking-[-0.06em] text-[var(--color-foreground)] sm:text-6xl lg:text-7xl">
                  읽기 좋은 AI 비서,
                  <br />
                  채팅창 말고 대시보드로.
                </h1>
                <p className="text-balance max-w-2xl text-lg leading-8 text-[var(--color-muted)] sm:text-xl">
                  My SECRETARY는 뉴스와 주식처럼 자주 확인하는 정보를
                  비서별 결과 화면으로 정리해주는 반응형 AI 비서 앱입니다.
                  설정을 저장해두고, 필요할 때 다시 실행해서 같은 흐름으로
                  확인할 수 있습니다.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--color-foreground)] px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#342011]"
                >
                  로그인하고 시작하기
                </Link>
                <Link
                  href="#assistant-preview"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--color-stroke)] bg-white/70 px-6 py-3 text-sm font-medium text-[var(--color-foreground)] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  비서 프리뷰 보기
                </Link>
              </div>
              <dl className="grid gap-4 sm:grid-cols-3">
                {productHighlights.map((item) => (
                  <div
                    key={item.label}
                    className="surface-panel rounded-3xl border px-5 py-4"
                  >
                    <dt className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
                      {item.label}
                    </dt>
                    <dd className="mt-2 text-sm leading-6 text-[var(--color-foreground)]">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="surface-panel grid-fade relative rounded-[2rem] border p-5 sm:p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
                    Today&apos;s desk
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                    내 AI 비서 미리보기
                  </h2>
                </div>
                <PixelAvatar variant="helper" size="md" />
              </div>
              <div className="space-y-4">
                {assistantPreviews.map((assistant) => (
                  <article
                    key={assistant.name}
                    className="surface-strong rounded-[1.75rem] border p-5"
                  >
                    <div className="flex items-start gap-4">
                      <PixelAvatar variant={assistant.type} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold">
                            {assistant.name}
                          </h3>
                          <span className="rounded-full bg-[var(--color-bg-strong)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                            {assistant.badge}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                          {assistant.summary}
                        </p>
                      </div>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm text-[var(--color-foreground)]">
                      {assistant.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <section id="assistant-preview" className="pt-24">
          <Container className="space-y-10">
            <SectionHeading
              eyebrow="Assistant Preview"
              title="비서별 결과 UI가 다른 것이 핵심입니다"
              description="같은 채팅창에 전부 밀어넣지 않고, 뉴스와 주식을 서로 다른 읽기 방식으로 정리합니다."
            />
            <div className="grid gap-6 lg:grid-cols-2">
              {assistantPreviews.map((assistant) => (
                <article
                  key={assistant.name}
                  className="surface-panel rounded-[2rem] border p-6"
                >
                  <div className="flex items-center gap-4">
                    <PixelAvatar variant={assistant.type} size="md" />
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
                        {assistant.badge}
                      </p>
                      <h3 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
                        {assistant.name}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                    {assistant.description}
                  </p>
                  <div className="mt-6 space-y-3 rounded-[1.5rem] border border-[var(--color-stroke)] bg-white/80 p-4">
                    {assistant.previewItems.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-[var(--color-stroke)] bg-[var(--color-surface-strong)] px-4 py-3"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <h4 className="font-medium">{item.title}</h4>
                          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                            {item.meta}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section id="why" className="pt-24">
          <Container className="space-y-10">
            <SectionHeading
              eyebrow="Product Principles"
              title="MVP부터 실제 사용 흐름을 우선합니다"
              description="반짝이는 데모보다 저장 가능한 비서 설정, 검증된 구조화 응답, 다시 볼 수 있는 실행 기록을 중심에 둡니다."
            />
            <div className="grid gap-5 lg:grid-cols-3">
              {productPrinciples.map((item) => (
                <article
                  key={item.title}
                  className="surface-panel rounded-[1.75rem] border p-6"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
                    {item.eyebrow}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className="pt-24">
          <Container>
            <div className="surface-panel rounded-[2rem] border px-6 py-8 sm:px-10 sm:py-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
                    Step 01 Foundation
                  </p>
                  <h2 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                    다음 단계에서는 인증과 사용자별 비서 흐름을 연결합니다
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[var(--color-muted)] sm:text-base">
                    지금은 랜딩과 구조를 정리한 상태이고, 다음 step에서
                    Supabase Auth, 보호 라우트, 대시보드 접근 제어를 붙일
                    준비를 마쳤습니다.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center rounded-full border border-[var(--color-stroke)] bg-white px-6 py-3 text-sm font-medium text-[var(--color-foreground)] transition hover:-translate-y-0.5"
                  >
                    대시보드 구조 보기
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-[var(--color-foreground)] transition hover:-translate-y-0.5 hover:bg-[#ff9a61]"
                  >
                    로그인 플로우 준비하기
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
}
