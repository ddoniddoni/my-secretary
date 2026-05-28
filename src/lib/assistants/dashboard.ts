import type {
  AssistantTemplate,
  AssistantType,
  UserAssistant,
} from "@/types/assistants";

type AssistantSearchContext = {
  assistant: UserAssistant;
  template?: Pick<AssistantTemplate, "description" | "id" | "name">;
};

export type DashboardOverviewCard = {
  description: string;
  label: string;
  tone: "accent" | "info" | "success";
  value: string;
};

const assistantTypeLabels: Record<AssistantType, string> = {
  news: "뉴스 비서",
  stock: "주식 비서",
  baseball: "야구 비서",
  real_estate: "부동산 비서",
};

const assistantTypeDescriptions: Record<AssistantType, string> = {
  news: "주요 뉴스를 읽기 쉬운 일일 브리핑으로 정리합니다.",
  stock: "관심 종목의 변동과 최신 시장 맥락을 함께 보여줍니다.",
  baseball: "KBO 경기 흐름, 팀 소식, 리그 순위를 함께 요약합니다.",
  real_estate: "지역별 주택 신호와 공공 시장 변화를 추적합니다.",
};

const assistantTypePreviewLabels: Record<AssistantType, string> = {
  news: "뉴스 브리핑",
  stock: "종목 관찰",
  baseball: "KBO 브리핑",
  real_estate: "부동산 흐름",
};

export function getAssistantTypeLabel(type: AssistantType) {
  return assistantTypeLabels[type];
}

export function getAssistantTypeDescription(type: AssistantType) {
  return assistantTypeDescriptions[type];
}

export function getAssistantTypePreviewLabel(type: AssistantType) {
  return assistantTypePreviewLabels[type];
}

export function getAssistantStatusCopy(type: AssistantType) {
  return {
    label: "활성",
    tone: type,
  } as const;
}

export function getAssistantMetaChips(assistant: UserAssistant) {
  if (assistant.type === "news") {
    const config = assistant.config as UserAssistant<"news">["config"];
    const categories = config.categories.slice(0, 3);

    return [categories.join(" / "), `${config.maxItems}개 헤드라인`];
  }

  if (assistant.type === "stock") {
    const config = assistant.config as UserAssistant<"stock">["config"];
    const symbols = config.symbols.slice(0, 3);

    return [symbols.join(" / "), `${config.market} 시장`];
  }

  if (assistant.type === "baseball") {
    const config = assistant.config as UserAssistant<"baseball">["config"];
    const teams = config.teams.slice(0, 3);

    return [teams.join(" / "), config.includeStandings ? "순위 포함" : "순위 제외"];
  }

  const config = assistant.config as UserAssistant<"real_estate">["config"];
  const regions = config.regions.slice(0, 2);

  return [regions.join(" / "), `${config.propertyTypes.length}개 유형`];
}

export function buildDashboardOverview(
  assistants: UserAssistant[],
): DashboardOverviewCard[] {
  const assistantCount = assistants.length;
  const uniqueTypes = Array.from(new Set(assistants.map((item) => item.type)));
  const focusItemCount = assistants.reduce(
    (total, assistant) => total + getAssistantFocusItemCount(assistant),
    0,
  );

  const coverageCopy =
    uniqueTypes.length > 0
      ? uniqueTypes.map(getAssistantTypePreviewLabel).join(" / ")
      : "뉴스 브리핑 / 종목 관찰 / KBO 브리핑 / 부동산 흐름";

  return [
    {
      label: "비서 묶음",
      value: assistantCount.toString().padStart(2, "0"),
      description:
        assistantCount > 0
          ? `${assistantCount}개의 저장된 작업 흐름이 이 대시보드에서 바로 실행할 준비가 되어 있습니다.`
          : "템플릿 하나로 시작해 재사용 가능한 비서 묶음을 만들어보세요.",
      tone: "accent",
    },
    {
      label: "범위",
      value: `${uniqueTypes.length}/4`,
      description: coverageCopy,
      tone: "info",
    },
    {
      label: "집중 항목",
      value: focusItemCount.toString().padStart(2, "0"),
      description:
        "비서 설정에 저장된 카테고리, 종목, 팀, 지역 수를 보여줍니다.",
      tone: "success",
    },
  ];
}

export function buildAssistantSearchText({
  assistant,
  template,
}: AssistantSearchContext) {
  return [
    assistant.name,
    assistant.type,
    getAssistantTypeLabel(assistant.type),
    template?.name ?? "",
    template?.description ?? "",
    ...getAssistantMetaChips(assistant),
  ]
    .join(" ")
    .toLocaleLowerCase("ko-KR");
}

export function filterAssistantsForDashboard(
  assistants: UserAssistant[],
  query: string,
  templatesById: Record<string, AssistantTemplate | undefined>,
) {
  const normalizedQuery = query.trim().toLocaleLowerCase("ko-KR");

  if (!normalizedQuery) {
    return assistants;
  }

  return assistants.filter((assistant) =>
    buildAssistantSearchText({
      assistant,
      template: templatesById[assistant.templateId],
    }).includes(normalizedQuery),
  );
}

function getAssistantFocusItemCount(assistant: UserAssistant) {
  if (assistant.type === "news") {
    const config = assistant.config as UserAssistant<"news">["config"];

    return config.categories.length;
  }

  if (assistant.type === "stock") {
    const config = assistant.config as UserAssistant<"stock">["config"];

    return config.symbols.length;
  }

  if (assistant.type === "baseball") {
    const config = assistant.config as UserAssistant<"baseball">["config"];

    return config.teams.length;
  }

  const config = assistant.config as UserAssistant<"real_estate">["config"];

  return config.regions.length + config.propertyTypes.length;
}
