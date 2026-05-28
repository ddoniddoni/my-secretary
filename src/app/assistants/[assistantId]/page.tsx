import Link from "next/link";
import { notFound } from "next/navigation";

import { AssistantDetailEditor } from "@/components/assistants/AssistantDetailEditor";
import { AssistantResultRenderer } from "@/components/assistants/AssistantResultRenderer";
import { AssistantRunButton } from "@/components/assistants/AssistantRunButton";
import { AssistantRunHistory } from "@/components/assistants/AssistantRunHistory";
import { PixelAvatar } from "@/components/assistants/PixelAvatar";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatePanel } from "@/components/shared/StatePanel";
import { getAssistantConfigEntries } from "@/lib/assistants/config";
import {
  getDemoAssistantTemplateById,
  getDemoUserAssistantById,
  getDemoUserIdentity,
  listDemoAssistantRunsForUserAssistant,
} from "@/lib/assistants/demo-store";
import { formatAssistantRunTimestamp } from "@/lib/assistants/results";
import {
  getAssistantTemplateById,
  getUserAssistantById,
  listAssistantRunsForUserAssistant,
} from "@/lib/assistants/repository";
import { getAssistantTypeLabel } from "@/lib/assistants/dashboard";
import { isDemoModeEnabled } from "@/lib/demo-mode";
import {
  createServerSupabaseClient,
  getCurrentUser,
  requireUser,
} from "@/lib/supabase/server";

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
  const demoModeEnabled = isDemoModeEnabled();
  const currentUser = await getCurrentUser();

  if (!currentUser && demoModeEnabled) {
    const assistant = getDemoUserAssistantById(assistantId);

    if (!assistant) {
      notFound();
    }

    const template = getDemoAssistantTemplateById(assistant.templateId);
    const runs = listDemoAssistantRunsForUserAssistant(assistant.id, 10);
    const latestRun = runs[0] ?? null;
    const configEntries = getAssistantConfigEntries(assistant);
    const demoUser = getDemoUserIdentity();

    return (
      <DashboardShell demoMode userEmail={demoUser.email}>
        <AssistantDetailContent
          assistant={assistant}
          configEntries={configEntries}
          latestRun={latestRun}
          runs={runs}
          template={template}
        />
      </DashboardShell>
    );
  }

  const user = currentUser ?? (await requireUser(`/assistants/${assistantId}`));
  const supabase = await createServerSupabaseClient();

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
      <AssistantDetailContent
        assistant={assistant}
        configEntries={configEntries}
        latestRun={latestRun}
        runs={runs}
        template={template}
      />
    </DashboardShell>
  );
}

type AssistantDetailContentProps = {
  assistant: NonNullable<Awaited<ReturnType<typeof getDemoUserAssistantById>>>;
  configEntries: ReturnType<typeof getAssistantConfigEntries>;
  latestRun: NonNullable<
    Awaited<ReturnType<typeof listDemoAssistantRunsForUserAssistant>>
  >[number] | null;
  runs: Awaited<ReturnType<typeof listDemoAssistantRunsForUserAssistant>>;
  template: Awaited<ReturnType<typeof getDemoAssistantTemplateById>>;
};

function AssistantDetailContent({
  assistant,
  configEntries,
  latestRun,
  runs,
  template,
}: AssistantDetailContentProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--dashboard-muted)]">
        <Link
          href="/"
          className="rounded-[8px] border border-[var(--dashboard-border)] px-3 py-2 transition hover:border-[var(--dashboard-border-strong)] hover:text-[var(--dashboard-text)]"
        >
          대시보드
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
                  {getAssistantTypeLabel(assistant.type)}
                </p>
                <h1 className="mt-3 text-2xl font-semibold text-[var(--dashboard-text)] sm:text-3xl">
                  {assistant.name}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--dashboard-muted)]">
                  {template?.description ??
                    "저장된 설정, 템플릿, 구조화된 결과 스키마를 기반으로 만든 재사용 가능한 개인 인공지능 비서입니다."}
                </p>
              </div>
            </div>

            <AssistantRunButton
              assistantId={assistant.id}
              idleLabel="브리핑 실행"
              runningLabel="생성 중..."
              showFeedback
              buttonClassName="pixel-button pixel-button-primary h-[52px] w-full text-sm lg:w-auto lg:min-w-[180px]"
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
                최근 실행 시각
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--dashboard-text)]">
                {latestRun
                  ? formatAssistantRunTimestamp(
                      latestRun.completedAt ?? latestRun.createdAt,
                    )
                  : "아직 실행 기록이 없어요."}
              </p>
            </div>
            <div className="rounded-[14px] border border-[var(--dashboard-border)] bg-[rgba(255,255,255,0.03)] px-4 py-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--dashboard-muted)]">
                최근 실행 수
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--dashboard-text)]">
                이 비서의 최근 {runs.length}
                {runs.length === 1 ? "건" : "건"} 실행만 보여줍니다.
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <section className="pixel-panel rounded-[18px] px-6 py-6">
            <p className="font-pixel text-[10px] uppercase text-[var(--dashboard-warning)]">
              설정
            </p>
            <div className="mt-4">
              {template ? (
                <AssistantDetailEditor assistant={assistant} template={template} />
              ) : (
                <StatePanel
                  description="비서는 아직 존재하지만, 편집할 수 있는 템플릿을 불러오지 못했습니다."
                  eyebrow="템플릿 없음"
                  title="설정 정보를 사용할 수 없어요"
                  tone="danger"
                />
              )}
            </div>
          </section>
        </aside>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_380px]">
        <div className="space-y-4">
          <div>
            <p className="font-pixel text-[10px] uppercase text-[var(--dashboard-info)]">
              최근 결과
            </p>
            <h2 className="mt-3 text-xl font-semibold text-[var(--dashboard-text)]">
              가장 최근 브리핑 결과
            </h2>
          </div>
          <AssistantResultRenderer run={latestRun} />
        </div>

        <div className="space-y-4">
          <div>
            <p className="font-pixel text-[10px] uppercase text-[var(--dashboard-success)]">
              기록
            </p>
            <h2 className="mt-3 text-xl font-semibold text-[var(--dashboard-text)]">
              실행 타임라인
            </h2>
          </div>
          <AssistantRunHistory runs={runs} />
        </div>
      </section>
    </div>
  );
}
