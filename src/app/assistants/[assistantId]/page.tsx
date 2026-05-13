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
                  {assistant.type} assistant
                </p>
                <h1 className="mt-3 text-2xl font-semibold text-[var(--dashboard-text)] sm:text-3xl">
                  {assistant.name}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--dashboard-muted)]">
                  {template?.description ??
                    "A reusable personal AI assistant built from a saved config, a template, and a structured result schema."}
                </p>
              </div>
            </div>

            <AssistantRunButton
              assistantId={assistant.id}
              idleLabel="Run briefing"
              runningLabel="Generating..."
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
                Latest execution
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--dashboard-text)]">
                {latestRun
                  ? formatAssistantRunTimestamp(
                      latestRun.completedAt ?? latestRun.createdAt,
                    )
                  : "No runs yet."}
              </p>
            </div>
            <div className="rounded-[14px] border border-[var(--dashboard-border)] bg-[rgba(255,255,255,0.03)] px-4 py-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--dashboard-muted)]">
                Recent runs
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--dashboard-text)]">
                Showing the latest {runs.length} run
                {runs.length === 1 ? "" : "s"} for this assistant.
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
                <StatePanel
                  description="The assistant still exists, but its backing template could not be loaded for editing."
                  eyebrow="Template missing"
                  title="Settings are unavailable"
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
              Latest result
            </p>
            <h2 className="mt-3 text-xl font-semibold text-[var(--dashboard-text)]">
              Most recent briefing output
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
              Execution timeline
            </h2>
          </div>
          <AssistantRunHistory runs={runs} />
        </div>
      </section>
    </div>
  );
}
