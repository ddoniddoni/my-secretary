"use client";

import { useRouter } from "next/navigation";
import { useDeferredValue, useState, useTransition } from "react";

import { AssistantCard } from "@/components/assistants/AssistantCard";
import { AssistantCreateDialog } from "@/components/assistants/AssistantCreateDialog";
import { StatePanel } from "@/components/shared/StatePanel";
import { ModalShell } from "@/components/ui/ModalShell";
import {
  buildDashboardOverview,
  filterAssistantsForDashboard,
} from "@/lib/assistants/dashboard";
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
  const overviewCards = buildDashboardOverview(items);

  function handleCreated(assistant: UserAssistant) {
    setItems((current) => [...current, assistant]);
    setFeedback({
      message: "The assistant has been added to your dashboard.",
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
          message: result.error ?? "We could not remove that assistant.",
          tone: "error",
        });
        return;
      }

      setItems((current) =>
        current.filter((assistant) => assistant.id !== deleteTarget.id),
      );
      setDeleteTarget(null);
      setFeedback({
        message: "The assistant has been removed from your dashboard.",
        tone: "success",
      });
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Failed to delete assistant", error);
      setFeedback({
        message: "We could not remove that assistant.",
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
                Save repeatable workflows, rerun structured briefings, and keep
                every assistant in one pixel-style workspace.
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

      <p className="mt-4 text-sm text-[var(--dashboard-muted)]">
        {isRefreshing
          ? "Refreshing the latest dashboard state..."
          : "Search by assistant name, category, symbol, team, or region."}
      </p>

      {items.length > 0 ? (
        <section className="mt-7 grid gap-4 lg:grid-cols-3">
          {overviewCards.map((card) => (
            <article
              key={card.label}
              className="rounded-[18px] border border-[var(--dashboard-border)] bg-[rgba(15,20,36,0.92)] px-5 py-5 shadow-[0_16px_32px_rgba(0,0,0,0.22)]"
            >
              <p
                className={`font-pixel text-[10px] uppercase ${
                  card.tone === "accent"
                    ? "text-[var(--dashboard-accent-strong)]"
                    : card.tone === "success"
                      ? "text-[var(--dashboard-success)]"
                      : "text-[var(--dashboard-info)]"
                }`}
              >
                {card.label}
              </p>
              <p className="mt-4 font-pixel text-[24px] leading-none text-[var(--dashboard-text)]">
                {card.value}
              </p>
              <p className="mt-4 text-sm leading-7 text-[var(--dashboard-muted)]">
                {card.description}
              </p>
            </article>
          ))}
        </section>
      ) : null}

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
        <div className="mt-8">
          <StatePanel
            align="center"
            description="Start with a news, stock, baseball, or housing template and this dashboard will turn into your saved assistant deck."
            eyebrow="Empty deck"
            title="No assistants yet"
            tone="info"
            action={
              <AssistantCreateDialog
                onCreated={handleCreated}
                templates={templates}
                triggerClassName="pixel-button pixel-button-primary pixel-toolbar-button font-pixel text-[11px] uppercase"
                triggerLabel="+ Add"
              />
            }
          />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="mt-8">
          <StatePanel
            align="center"
            description={`Nothing matched "${query.trim()}". Try an assistant name, template name, symbol, team, or region.`}
            eyebrow="No match"
            title="Your search came up empty"
            tone="warning"
            action={
              <button
                type="button"
                onClick={() => setQuery("")}
                className="pixel-button pixel-button-secondary h-[52px] px-6"
              >
                Clear search
              </button>
            }
          />
        </div>
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
          Built with pixels, providers, runners, and structured AI output.
        </p>
      </footer>

      <ModalShell
        open={Boolean(deleteTarget)}
        onClose={() => {
          if (!isDeleting && !isRefreshing) {
            setDeleteTarget(null);
          }
        }}
        title="Remove this assistant?"
        description="The card will disappear from your dashboard. Existing run history stays available if your data store still has those records."
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
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || isRefreshing}
              className="pixel-button h-[48px] bg-[var(--dashboard-danger)] px-5 text-[#1d0910]"
            >
              {isDeleting ? "Removing..." : "Remove"}
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
