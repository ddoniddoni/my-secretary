"use client";

import { useRouter } from "next/navigation";
import { useDeferredValue, useState, useTransition } from "react";

import { AssistantCard } from "@/components/assistants/AssistantCard";
import { AssistantCreateDialog } from "@/components/assistants/AssistantCreateDialog";
import { ModalShell } from "@/components/ui/ModalShell";
import { filterAssistantsForDashboard } from "@/lib/assistants/dashboard";
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
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState<{
    message: string;
    tone: "error" | "success";
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserAssistant | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);

  const templateById = Object.fromEntries(
    templates.map((template) => [template.id, template]),
  );
  const filteredItems = filterAssistantsForDashboard(
    items,
    deferredQuery,
    templateById,
  );

  function handleCreated(assistant: UserAssistant) {
    setItems((current) => [...current, assistant]);
    setFeedback({
      message: "새 비서가 대시보드에 추가됐어요.",
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
          message: result.error ?? "비서를 삭제하지 못했어요.",
          tone: "error",
        });
        return;
      }

      setItems((current) =>
        current.filter((assistant) => assistant.id !== deleteTarget.id),
      );
      setDeleteTarget(null);
      setFeedback({
        message: "비서를 목록에서 제거했어요.",
        tone: "success",
      });
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Failed to delete assistant", error);
      setFeedback({
        message: "비서를 삭제하지 못했어요.",
        tone: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <section className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-start gap-3">
            <SparkleMark />
            <div>
              <h1 className="font-pixel text-[28px] leading-[1.3] text-[var(--dashboard-text)] sm:text-[36px]">
                My AI Assistants
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-8 text-[var(--dashboard-muted)]">
                Your custom AI assistants, ready to help you get things done.
                <span className="ml-2 hidden text-[var(--dashboard-text)] sm:inline">
                  {userEmail ?? "Signed in"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full max-w-[560px] flex-col gap-4 md:flex-row">
          <label className="pixel-search-shell relative flex-1">
            <SearchIcon />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search assistants..."
              className="pixel-input h-[68px] pl-14 pr-5 text-[15px]"
              aria-label="Search assistants"
            />
          </label>
          <AssistantCreateDialog
            onCreated={handleCreated}
            templates={templates}
            triggerClassName="pixel-button pixel-button-primary pixel-toolbar-button font-pixel text-[11px] uppercase"
            triggerLabel="+ Add"
          />
        </div>
      </section>

      {feedback ? (
        <div
          className={`mt-6 rounded-[12px] border px-4 py-3 text-sm ${
            feedback.tone === "error"
              ? "border-[rgba(255,125,147,0.4)] bg-[rgba(255,125,147,0.12)] text-[#ffd7df]"
              : "border-[rgba(142,242,127,0.35)] bg-[rgba(142,242,127,0.08)] text-[#d9ffd3]"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      {items.length === 0 ? (
        <section className="pixel-empty-state mt-8">
          <p className="font-pixel text-[12px] uppercase text-[var(--dashboard-text)]">
            No assistants yet
          </p>
          <p className="mt-4 max-w-xl text-center text-[15px] leading-8 text-[var(--dashboard-muted)]">
            Start with a news briefing assistant or a stock watch assistant and
            this grid will fill in like the main OS screen.
          </p>
          <div className="mt-6">
            <AssistantCreateDialog
              onCreated={handleCreated}
              templates={templates}
              triggerClassName="pixel-button pixel-button-primary pixel-toolbar-button font-pixel text-[11px] uppercase"
              triggerLabel="+ Add"
            />
          </div>
        </section>
      ) : filteredItems.length === 0 ? (
        <section className="pixel-empty-state mt-8">
          <p className="font-pixel text-[12px] uppercase text-[var(--dashboard-warning)]">
            No Match
          </p>
          <p className="mt-4 max-w-xl text-center text-[15px] leading-8 text-[var(--dashboard-muted)]">
            Nothing matched <span>&quot;{query.trim()}&quot;</span>. Try an
            assistant name, a stock symbol, or a news category.
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="pixel-button pixel-button-secondary mt-6 h-[52px] px-6"
          >
            Clear search
          </button>
        </section>
      ) : (
        <section className="mt-8 grid gap-5 xl:grid-cols-2 2xl:grid-cols-3">
          {filteredItems.map((assistant) => (
            <AssistantCard
              key={assistant.id}
              assistant={assistant}
              template={templateById[assistant.templateId]}
              onDelete={setDeleteTarget}
            />
          ))}
        </section>
      )}

      <footer className="mt-auto pt-8 text-center">
        <p className="font-mono text-sm text-[var(--dashboard-muted)]">
          Built with pixels, powered by AI
        </p>
      </footer>

      <ModalShell
        open={Boolean(deleteTarget)}
        onClose={() => {
          if (!isDeleting && !isRefreshing) {
            setDeleteTarget(null);
          }
        }}
        title="비서를 삭제할까요?"
        description="대시보드에서 바로 사라지고, 이후 실행 기록이 연결되면 함께 정리될 수 있어요."
      >
        <div className="space-y-5">
          <div className="rounded-[14px] border border-[var(--color-stroke)] bg-[var(--color-surface-strong)] px-4 py-4 text-sm leading-7 text-[var(--color-foreground)]">
            {deleteTarget?.name}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting || isRefreshing}
              className="pixel-button pixel-button-secondary h-[48px] px-5"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || isRefreshing}
              className="pixel-button h-[48px] bg-[var(--dashboard-danger)] px-5 text-[#1d0910]"
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </button>
          </div>
        </div>
      </ModalShell>
    </div>
  );
}

function SparkleMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      className="mt-1 h-7 w-7 shrink-0 text-[var(--dashboard-accent-strong)]"
    >
      <path
        d="M20 4 23.8 16.2 36 20l-12.2 3.8L20 36l-3.8-12.2L4 20l12.2-3.8Z"
        fill="currentColor"
      />
      <path
        d="M30 5.5 31.5 10 36 11.5 31.5 13 30 17.5 28.5 13 24 11.5 28.5 10Z"
        fill="currentColor"
        opacity="0.8"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="pointer-events-none absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-[var(--dashboard-text)]"
    >
      <circle
        cx="11"
        cy="11"
        r="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="m16 16 4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
