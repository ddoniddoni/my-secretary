"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { AssistantCard } from "@/components/assistants/AssistantCard";
import { AssistantCreateDialog } from "@/components/assistants/AssistantCreateDialog";
import { PixelAvatar } from "@/components/assistants/PixelAvatar";
import { ModalShell } from "@/components/ui/ModalShell";
import type { AssistantTemplate, UserAssistant } from "@/types/assistants";

type AssistantDashboardClientProps = {
  assistants: UserAssistant[];
  templates: AssistantTemplate[];
  userEmail: string | null | undefined;
};

type DeleteResponse = {
  data?: {
    deleted: boolean;
  };
  error?: string;
};

export function AssistantDashboardClient({
  assistants,
  templates,
  userEmail,
}: AssistantDashboardClientProps) {
  const router = useRouter();
  const [items, setItems] = useState(assistants);
  const [feedback, setFeedback] = useState<{
    message: string;
    tone: "error" | "success";
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserAssistant | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, startTransition] = useTransition();

  const templateById = Object.fromEntries(
    templates.map((template) => [template.id, template]),
  );

  function handleCreated(assistant: UserAssistant) {
    setItems((current) => [...current, assistant]);
    setFeedback({
      message: "새 비서를 추가했습니다.",
      tone: "success",
    });
  }

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);
    setFeedback(null);

    try {
      const response = await fetch(`/api/assistants/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const result = (await response.json()) as DeleteResponse;

      if (!response.ok || !result.data?.deleted) {
        setFeedback({
          message: result.error ?? "비서를 삭제하지 못했습니다.",
          tone: "error",
        });
        return;
      }

      setItems((current) =>
        current.filter((assistant) => assistant.id !== deleteTarget.id),
      );
      setDeleteTarget(null);
      setFeedback({
        message: "비서를 삭제했습니다.",
        tone: "success",
      });
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Failed to delete assistant", error);
      setFeedback({
        message: "비서를 삭제하지 못했습니다.",
        tone: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="surface-panel rounded-[2rem] border px-6 py-8 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
              Dashboard
            </p>
            <p className="mt-3 text-sm font-medium text-[var(--color-accent)]">
              Signed in as {userEmail ?? "your account"}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
              내 AI 비서를 추가하고 관리하세요.
            </h1>
            <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">
              뉴스와 주식 템플릿을 내 목적에 맞게 저장해두고, 다음 step에서는 실행
              결과까지 이 대시보드에서 이어서 보게 됩니다.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <PixelAvatar variant="helper" size="lg" />
            <AssistantCreateDialog templates={templates} onCreated={handleCreated} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="surface-panel rounded-[1.75rem] border p-5">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
            My Assistants
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
            {items.length}
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
            지금 대시보드에 저장된 비서 수입니다.
          </p>
        </article>
        <article className="surface-panel rounded-[1.75rem] border p-5">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
            Active Templates
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
            {templates.length}
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
            현재 사용할 수 있는 기본 비서 템플릿 수입니다.
          </p>
        </article>
        <article className="surface-panel rounded-[1.75rem] border p-5">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
            Run Status
          </p>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.05em]">
            아직 실행 전
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
            Step 06부터 각 비서의 실행 상태와 결과가 연결됩니다.
          </p>
        </article>
      </section>

      {feedback ? (
        <div
          className={`rounded-[1.5rem] border px-4 py-3 text-sm leading-6 ${
            feedback.tone === "error"
              ? "border-[rgba(181,67,51,0.25)] bg-[rgba(181,67,51,0.08)] text-[#7a2d23]"
              : "border-[rgba(11,114,133,0.2)] bg-[rgba(11,114,133,0.08)] text-[#0b7285]"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      {items.length === 0 ? (
        <section className="surface-panel rounded-[2rem] border px-6 py-10 text-center sm:px-10">
          <div className="mx-auto flex max-w-xl flex-col items-center">
            <PixelAvatar variant="helper" size="lg" />
            <h2 className="mt-6 text-2xl font-semibold tracking-[-0.04em]">
              아직 추가한 AI 비서가 없습니다.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
              위의 `+ 비서 추가` 버튼을 눌러 첫 번째 뉴스 비서나 주식 비서를
              만들어보세요.
            </p>
          </div>
        </section>
      ) : (
        <section className="grid gap-5 xl:grid-cols-2">
          {items.map((assistant) => (
            <AssistantCard
              key={assistant.id}
              assistant={assistant}
              template={templateById[assistant.templateId]}
              onDelete={setDeleteTarget}
            />
          ))}
        </section>
      )}

      <ModalShell
        open={Boolean(deleteTarget)}
        onClose={() => {
          if (!isDeleting && !isRefreshing) {
            setDeleteTarget(null);
          }
        }}
        title="비서를 삭제할까요?"
        description="삭제한 비서는 대시보드에서 사라지며, 연결된 실행 기록도 함께 삭제될 수 있습니다."
      >
        <div className="space-y-5">
          <div className="rounded-[1.5rem] border border-[var(--color-stroke)] bg-white/80 px-4 py-4 text-sm leading-7 text-[var(--color-muted)]">
            {deleteTarget?.name}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting || isRefreshing}
              className="inline-flex items-center justify-center rounded-full border border-[var(--color-stroke)] bg-white px-5 py-3 text-sm font-medium"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || isRefreshing}
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-foreground)] px-5 py-3 text-sm font-medium text-white"
            >
              {isDeleting ? "삭제하고 있어요..." : "삭제하기"}
            </button>
          </div>
        </div>
      </ModalShell>
    </div>
  );
}
