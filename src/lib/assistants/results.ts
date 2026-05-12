import {
  NewsBriefSchema,
  StockBriefSchema,
  type NewsBrief,
  type StockBrief,
} from "@/lib/assistants/output-schemas";
import type { AssistantRun } from "@/types/assistants";

export type ParsedAssistantRunResult =
  | {
      output: NewsBrief;
      type: "news";
    }
  | {
      output: StockBrief;
      type: "stock";
    };

const runDateFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatAssistantRunTimestamp(value: string | null) {
  if (!value) {
    return "시간 정보 없음";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "시간 정보 없음";
  }

  return runDateFormatter.format(parsed);
}

export function getAssistantRunStatusCopy(run: Pick<AssistantRun, "status">) {
  if (run.status === "success") {
    return {
      label: "Success",
      tone: "success",
    } as const;
  }

  if (run.status === "failed") {
    return {
      label: "Failed",
      tone: "danger",
    } as const;
  }

  return {
    label: "Running",
    tone: "info",
  } as const;
}

export function parseAssistantRunResult(
  run: Pick<AssistantRun, "output" | "status" | "type">,
): ParsedAssistantRunResult | null {
  if (run.status !== "success" || !run.output) {
    return null;
  }

  if (run.type === "news") {
    const parsed = NewsBriefSchema.safeParse(run.output);

    if (!parsed.success) {
      return null;
    }

    return {
      output: parsed.data,
      type: "news",
    };
  }

  const parsed = StockBriefSchema.safeParse(run.output);

  if (!parsed.success) {
    return null;
  }

  return {
    output: parsed.data,
    type: "stock",
  };
}

export function getAssistantRunSummary(run: AssistantRun) {
  if (run.status === "pending") {
    return "AI 브리핑을 생성하고 있어요.";
  }

  if (run.status === "failed") {
    return run.errorMessage ?? "비서 실행에 실패했습니다.";
  }

  const parsed = parseAssistantRunResult(run);

  if (!parsed) {
    return "저장된 실행 결과를 해석하지 못했습니다.";
  }

  if (parsed.type === "news") {
    return `${parsed.output.highlights.length}개의 주요 이슈를 정리했습니다.`;
  }

  return `${parsed.output.symbols.length}개 종목 브리핑을 저장했습니다.`;
}
