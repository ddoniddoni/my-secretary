import { BaseballAssistantResult } from "@/components/assistants/BaseballAssistantResult";
import { NewsAssistantResult } from "@/components/assistants/NewsAssistantResult";
import { RealEstateAssistantResult } from "@/components/assistants/RealEstateAssistantResult";
import { StockAssistantResult } from "@/components/assistants/StockAssistantResult";
import {
  formatAssistantRunTimestamp,
  getAssistantRunStatusCopy,
  parseAssistantRunResult,
} from "@/lib/assistants/results";
import type { AssistantRun } from "@/types/assistants";

type AssistantResultRendererProps = {
  run: AssistantRun | null;
};

export function AssistantResultRenderer({
  run,
}: AssistantResultRendererProps) {
  if (!run) {
    return (
      <div className="pixel-empty-state min-h-[300px] px-6">
        <p className="font-pixel text-[12px] uppercase text-[var(--dashboard-text)]">
          아직 결과가 없어요
        </p>
        <p className="mt-4 max-w-xl text-center text-[15px] leading-8 text-[var(--dashboard-muted)]">
          아직 저장된 실행 결과가 없어요. 비서를 한 번 실행하면 여기에서 뉴스와
          주식 브리핑을 읽기 좋은 형태로 확인할 수 있습니다.
        </p>
      </div>
    );
  }

  const status = getAssistantRunStatusCopy(run);
  const parsed = parseAssistantRunResult(run);

  if (run.status === "pending") {
    return (
      <div className="rounded-[14px] border border-[rgba(107,220,251,0.26)] bg-[rgba(107,220,251,0.08)] px-5 py-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="pixel-status-tag is-info">{status.label}</span>
          <span className="text-sm text-[var(--dashboard-muted)]">
            {formatAssistantRunTimestamp(run.createdAt)}
          </span>
        </div>
        <p className="mt-4 text-sm leading-7 text-[var(--dashboard-text)]">
          인공지능 브리핑을 생성하고 있어요. 잠시 후 최신 결과가 여기에
          표시됩니다.
        </p>
      </div>
    );
  }

  if (run.status === "failed") {
    return (
      <div className="rounded-[14px] border border-[rgba(255,120,140,0.28)] bg-[rgba(255,120,140,0.08)] px-5 py-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-[8px] border border-current px-3 py-1 text-sm text-[var(--dashboard-danger)]">
            {status.label}
          </span>
          <span className="text-sm text-[var(--dashboard-muted)]">
            {formatAssistantRunTimestamp(run.completedAt ?? run.createdAt)}
          </span>
        </div>
        <p className="mt-4 text-sm leading-7 text-[#ffe1e6]">
          {run.errorMessage ?? "비서 실행에 실패했습니다."}
        </p>
      </div>
    );
  }

  if (!parsed) {
    return (
      <div className="rounded-[14px] border border-[rgba(243,194,89,0.28)] bg-[rgba(243,194,89,0.08)] px-5 py-6">
        <p className="font-pixel text-[10px] uppercase text-[var(--dashboard-warning)]">
          결과를 불러올 수 없어요
        </p>
        <p className="mt-4 text-sm leading-7 text-[#ffe8b4]">
          저장된 실행 결과 형식을 해석하지 못했어요. 스키마가 변경됐거나
          오래된 데이터일 수 있습니다.
        </p>
      </div>
    );
  }

  if (parsed.type === "news") {
    return <NewsAssistantResult result={parsed.output} />;
  }

  if (parsed.type === "stock") {
    return <StockAssistantResult result={parsed.output} />;
  }

  if (parsed.type === "baseball") {
    return <BaseballAssistantResult result={parsed.output} />;
  }

  return <RealEstateAssistantResult result={parsed.output} />;
}
