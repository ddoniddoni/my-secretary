import { getAssistantTypeLabel } from "@/lib/assistants/dashboard";
import {
  formatAssistantRunTimestamp,
  getAssistantRunStatusCopy,
  getAssistantRunSummary,
} from "@/lib/assistants/results";
import type { AssistantRun } from "@/types/assistants";

type AssistantRunHistoryProps = {
  runs: AssistantRun[];
};

export function AssistantRunHistory({ runs }: AssistantRunHistoryProps) {
  if (runs.length === 0) {
    return (
      <div className="rounded-[14px] border border-dashed border-[var(--dashboard-border)] px-5 py-8 text-center">
        <p className="font-pixel text-[10px] uppercase text-[var(--dashboard-muted)]">
          기록 없음
        </p>
        <p className="mt-4 text-sm leading-7 text-[var(--dashboard-muted)]">
          아직 이 비서를 실행한 기록이 없어요. 첫 브리핑을 실행하면 최근
          실행 타임라인이 여기에 표시됩니다.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {runs.map((run) => {
        const status = getAssistantRunStatusCopy(run);

        return (
          <article
            key={run.id}
            className="rounded-[14px] border border-[var(--dashboard-border)] bg-[rgba(16,21,40,0.94)] px-4 py-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-[8px] border px-3 py-1 text-sm ${
                    status.tone === "success"
                      ? "border-[rgba(137,239,116,0.28)] text-[var(--dashboard-success)]"
                      : status.tone === "danger"
                        ? "border-[rgba(255,120,140,0.28)] text-[var(--dashboard-danger)]"
                        : "border-[rgba(107,220,251,0.28)] text-[var(--dashboard-info)]"
                  }`}
                >
                  {status.label}
                </span>
                <span className="text-xs text-[var(--dashboard-muted)]">
                  {formatAssistantRunTimestamp(run.completedAt ?? run.createdAt)}
                </span>
              </div>
              <span className="pixel-meta-pill">
                {getAssistantTypeLabel(run.type)}
              </span>
            </div>
            <p className="mt-3 text-sm leading-7 text-[var(--dashboard-text)]">
              {getAssistantRunSummary(run)}
            </p>
          </article>
        );
      })}
    </div>
  );
}
