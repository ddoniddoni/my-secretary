import Link from "next/link";
import { notFound } from "next/navigation";

import { AssistantDetailEditor } from "@/components/assistants/AssistantDetailEditor";
import { PixelAvatar } from "@/components/assistants/PixelAvatar";
import { Container } from "@/components/layout/Container";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getAssistantConfigEntries } from "@/lib/assistants/config";
import {
  getAssistantTemplateById,
  getUserAssistantById,
  listAssistantRunsForUserAssistant,
} from "@/lib/assistants/repository";
import {
  createServerSupabaseClient,
  requireUser,
} from "@/lib/supabase/server";

type AssistantDetailPageProps = {
  params: Promise<{
    assistantId: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function AssistantDetailPage({
  params,
}: AssistantDetailPageProps) {
  const { assistantId } = await params;
  const user = await requireUser(`/assistants/${assistantId}`);
  const supabase = await createServerSupabaseClient();
  const assistant = await getUserAssistantById(supabase, user.id, assistantId);

  if (!assistant) {
    notFound();
  }

  const [template, runs] = await Promise.all([
    getAssistantTemplateById(supabase, assistant.templateId),
    listAssistantRunsForUserAssistant(supabase, user.id, assistant.id, 10),
  ]);

  if (!template) {
    notFound();
  }

  const configEntries = getAssistantConfigEntries(assistant);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="py-12">
        <Container className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_320px]">
          <section className="space-y-6">
            <section className="surface-panel rounded-[2rem] border px-6 py-8 sm:px-8">
              <div className="flex items-start justify-between gap-6">
                <div className="max-w-2xl">
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
                    Assistant Detail
                  </p>
                  <p className="mt-3 text-sm font-medium text-[var(--color-accent)]">
                    Protected for {user.email ?? "signed-in users"}
                  </p>
                  <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
                    {assistant.name}
                  </h1>
                  <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">
                    {template.description}
                  </p>
                </div>
                <PixelAvatar variant={assistant.type} size="md" />
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {configEntries.map((entry) => (
                  <div
                    key={entry.label}
                    className="rounded-[1.5rem] border bg-white/80 p-5"
                  >
                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
                      {entry.label}
                    </p>
                    <p className="mt-3 text-base font-medium leading-7">
                      {entry.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="surface-panel rounded-[2rem] border px-6 py-8 sm:px-8">
              <AssistantDetailEditor
                key={`${assistant.id}:${assistant.updatedAt}`}
                assistant={assistant}
                template={template}
              />
            </section>
          </section>

          <aside className="space-y-6">
            <section className="surface-panel rounded-[2rem] border px-6 py-8">
              <h2 className="text-xl font-semibold tracking-[-0.04em]">
                실행 준비 상태
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                아직 실제 실행 기록은 없습니다. Step 05와 Step 06에서 runner와 run
                저장이 연결되면 이 영역에 최신 상태가 표시됩니다.
              </p>
              <div className="mt-6 rounded-[1.5rem] border border-[var(--color-stroke)] bg-white/80 p-4 text-sm text-[var(--color-muted)]">
                {runs.length === 0
                  ? "아직 실행 기록이 없습니다."
                  : `최근 기록 ${runs.length}건이 준비되어 있습니다.`}
              </div>
            </section>

            <section className="surface-panel rounded-[2rem] border px-6 py-8">
              <h2 className="text-xl font-semibold tracking-[-0.04em]">
                빠른 이동
              </h2>
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--color-foreground)] px-5 py-3 text-sm font-medium text-white"
                >
                  대시보드로 돌아가기
                </Link>
              </div>
            </section>
          </aside>
        </Container>
      </main>
    </div>
  );
}
