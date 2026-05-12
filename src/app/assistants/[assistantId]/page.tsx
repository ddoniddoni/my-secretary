import Link from "next/link";
import { notFound } from "next/navigation";

import { AssistantDetailEditor } from "@/components/assistants/AssistantDetailEditor";
import { AssistantResultRenderer } from "@/components/assistants/AssistantResultRenderer";
import { AssistantRunButton } from "@/components/assistants/AssistantRunButton";
import { AssistantRunHistory } from "@/components/assistants/AssistantRunHistory";
import { PixelAvatar } from "@/components/assistants/PixelAvatar";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { getAssistantConfigEntries } from "@/lib/assistants/config";
import { formatAssistantRunTimestamp } from "@/lib/assistants/results";
import {
  getAssistantTemplateById,
  getUserAssistantById,
  listAssistantRunsForUserAssistant,
} from "@/lib/assistants/repository";
import { createServerSupabaseClient, requireUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type AssistantDetailPageProps = {
  params: Promise<{
    assistantId: string;
  }>;
};

export default async function AssistantDetailPage({
  params,
}: AssistantDetailPageProps) {
  const { assistantId } = await params;
  const [user, supabase] = await Promise.all([
    requireUser(`/assistants/${assistantId}`),
    createServerSupabaseClient(),
  ]);

  const assistant = await getUserAssistantById(supabase, user.id, assistantId);

  if (!assistant) {
    notFound();
  }

  const [template, runs] = await Promise.all([
    getAssistantTemplateById(supabase, assistant.templateId, {
      includeInactive: true,
    }),
    listAssistantRunsForUserAssistant(supabase, user.id, assistant.id, 10),
  ]);

  const latestRun = runs[0] ?? null;
  const configEntries = getAssistantConfigEntries(assistant);

  return (
    <DashboardShell userEmail={user.email}>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--dashboard-muted)]">
          <Link
            href="/"
            className="rounded-[8px] border border-[var(--dashboard-border)] px-3 py-2 transition hover:border-[var(--dashboard-border-strong)] hover:text-[var(--dashboard-text)]"
          >
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-[var(--dashboard-text)]">{assistant.name}</span>
        </div>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_380px]">
          <div className="pixel-panel rounded-[18px] px-6 py-6 sm:px-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-4">
                <PixelAvatar variant={assistant.type} size="md" />
                <div className="min-w-0">
                  <p className="font-pixel text-[10px] uppercase text-[var(--dashboard-accent-strong)]">
                    {assistant.type} Assistant
                  </p>
                  <h1 className="mt-3 text-2xl font-semibold text-[var(--dashboard-text)] sm:text-3xl">
                    {assistant.name}
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--dashboard-muted)]">
                    {template?.description ??
                      "저장된 설정을 기반으로 반복 실행할 수 있는 개인 AI 비서입니다."}
                  </p>
                </div>
              </div>

              <AssistantRunButton
                assistantId={assistant.id}
                idleLabel="브리핑 실행"
                runningLabel="생성 중..."
                showFeedback
                buttonClassName="pixel-button pixel-button-primary min-w-[180px] text-sm"
              />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {configEntries.map((entry) => (
                <div
                  key={entry.label}
                  className="rounded-[14px] border border-[var(--dashboard-border)] bg-[rgba(255,255,255,0.03)] px-4 py-4"
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--dashboard-muted)]">
                    {entry.label}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--dashboard-text)]">
                    {entry.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[14px] border border-[var(--dashboard-border)] bg-[rgba(255,255,255,0.03)] px-4 py-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--dashboard-muted)]">
                  Latest Execution
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--dashboard-text)]">
                  {latestRun
                    ? formatAssistantRunTimestamp(
                        latestRun.completedAt ?? latestRun.createdAt,
                      )
                    : "아직 실행 기록이 없습니다."}
                </p>
              </div>
              <div className="rounded-[14px] border border-[var(--dashboard-border)] bg-[rgba(255,255,255,0.03)] px-4 py-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--dashboard-muted)]">
                  Recent Runs
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--dashboard-text)]">
                  최근 {runs.length}개의 실행 기록을 보관하고 있습니다.
                </p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <section className="pixel-panel rounded-[18px] px-6 py-6">
              <p className="font-pixel text-[10px] uppercase text-[var(--dashboard-warning)]">
                Settings
              </p>
              <div className="mt-4">
                {template ? (
                  <AssistantDetailEditor assistant={assistant} template={template} />
                ) : (
                  <div className="rounded-[14px] border border-[rgba(255,120,140,0.28)] bg-[rgba(255,120,140,0.08)] px-4 py-4 text-sm leading-7 text-[#ffe1e6]">
                    비서 템플릿 정보를 찾지 못해 설정 편집을 표시할 수 없습니다.
                  </div>
                )}
              </div>
            </section>
          </aside>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_380px]">
          <div className="space-y-4">
            <div>
              <p className="font-pixel text-[10px] uppercase text-[var(--dashboard-info)]">
                Latest Result
              </p>
              <h2 className="mt-3 text-xl font-semibold text-[var(--dashboard-text)]">
                최근 실행 결과
              </h2>
            </div>
            <AssistantResultRenderer run={latestRun} />
          </div>

          <div className="space-y-4">
            <div>
              <p className="font-pixel text-[10px] uppercase text-[var(--dashboard-success)]">
                History
              </p>
              <h2 className="mt-3 text-xl font-semibold text-[var(--dashboard-text)]">
                실행 기록
              </h2>
            </div>
            <AssistantRunHistory runs={runs} />
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
