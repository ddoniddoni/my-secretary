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
  news: "News AI",
  stock: "Stock AI",
  baseball: "Baseball AI",
  real_estate: "Real Estate AI",
};

const assistantTypeDescriptions: Record<AssistantType, string> = {
  news: "Summarizes key stories into a readable daily briefing.",
  stock: "Tracks watchlist moves and explains the latest market context.",
  baseball: "Summarizes KBO game flow, team updates, and league standings.",
  real_estate: "Tracks region-level housing signals and public market changes.",
};

const assistantTypePreviewLabels: Record<AssistantType, string> = {
  news: "News briefing",
  stock: "Stock watch",
  baseball: "KBO brief",
  real_estate: "Housing pulse",
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
    label: "Active",
    tone: type,
  } as const;
}

export function getAssistantMetaChips(assistant: UserAssistant) {
  if (assistant.type === "news") {
    const config = assistant.config as UserAssistant<"news">["config"];
    const categories = config.categories.slice(0, 3);

    return [categories.join(" / "), `${config.maxItems} headlines`];
  }

  if (assistant.type === "stock") {
    const config = assistant.config as UserAssistant<"stock">["config"];
    const symbols = config.symbols.slice(0, 3);

    return [symbols.join(" / "), `${config.market} market`];
  }

  if (assistant.type === "baseball") {
    const config = assistant.config as UserAssistant<"baseball">["config"];
    const teams = config.teams.slice(0, 3);

    return [
      teams.join(" / "),
      config.includeStandings ? "Standings on" : "Standings off",
    ];
  }

  const config = assistant.config as UserAssistant<"real_estate">["config"];
  const regions = config.regions.slice(0, 2);

  return [regions.join(" / "), `${config.propertyTypes.length} types`];
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
      : "News briefing / Stock watch / KBO brief / Housing pulse";

  return [
    {
      label: "Assistant deck",
      value: assistantCount.toString().padStart(2, "0"),
      description:
        assistantCount > 0
          ? `${assistantCount} saved workflow${assistantCount === 1 ? " is" : "s are"} ready to run from this dashboard.`
          : "Start with one template and build a reusable assistant deck.",
      tone: "accent",
    },
    {
      label: "Coverage",
      value: `${uniqueTypes.length}/4`,
      description: coverageCopy,
      tone: "info",
    },
    {
      label: "Focus items",
      value: focusItemCount.toString().padStart(2, "0"),
      description:
        "Categories, symbols, teams, and regions saved across your assistant configs.",
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
    .toLocaleLowerCase("en-US");
}

export function filterAssistantsForDashboard(
  assistants: UserAssistant[],
  query: string,
  templatesById: Record<string, AssistantTemplate | undefined>,
) {
  const normalizedQuery = query.trim().toLocaleLowerCase("en-US");

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
