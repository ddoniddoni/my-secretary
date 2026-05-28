import {
  BaseballBriefSchema,
  NewsBriefSchema,
  RealEstateBriefSchema,
  StockBriefSchema,
  type BaseballBrief,
  type NewsBrief,
  type RealEstateBrief,
  type StockBrief,
} from "@/lib/assistants/output-schemas";
import type { AssistantRun } from "@/types/assistants";

export type ParsedAssistantRunResult =
  | {
      output: BaseballBrief;
      type: "baseball";
    }
  | {
      output: NewsBrief;
      type: "news";
    }
  | {
      output: RealEstateBrief;
      type: "real_estate";
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
      label: "완료",
      tone: "success",
    } as const;
  }

  if (run.status === "failed") {
    return {
      label: "실패",
      tone: "danger",
    } as const;
  }

  return {
    label: "실행 중",
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

  if (run.type === "stock") {
    const parsed = StockBriefSchema.safeParse(run.output);

    if (!parsed.success) {
      return null;
    }

    return {
      output: parsed.data,
      type: "stock",
    };
  }

  if (run.type === "baseball") {
    const parsed = BaseballBriefSchema.safeParse(run.output);

    if (!parsed.success) {
      return null;
    }

    return {
      output: parsed.data,
      type: "baseball",
    };
  }

  const parsed = RealEstateBriefSchema.safeParse(run.output);

  if (!parsed.success) {
    return null;
  }

  return {
    output: parsed.data,
    type: "real_estate",
  };
}

export function getAssistantRunSummary(run: AssistantRun) {
  if (run.status === "pending") {
    return "인공지능 브리핑을 생성하고 있어요.";
  }

  if (run.status === "failed") {
    return run.errorMessage ?? "비서 실행에 실패했습니다.";
  }

  const parsed = parseAssistantRunResult(run);

  if (!parsed) {
    return "저장된 실행 결과를 해석하지 못했어요.";
  }

  if (parsed.type === "news") {
    return `${parsed.output.highlights.length}개의 주요 이슈를 정리했어요.`;
  }

  if (parsed.type === "stock") {
    return `${parsed.output.symbols.length}개 종목 브리핑을 저장했어요.`;
  }

  if (parsed.type === "baseball") {
    return `${parsed.output.teamBriefs.length}개 팀 흐름을 정리했어요.`;
  }

  return `${parsed.output.regions.length}개 지역 브리핑을 저장했어요.`;
}
