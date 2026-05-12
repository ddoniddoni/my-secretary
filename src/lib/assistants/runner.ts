import {
  BaseballBriefSchema,
  NewsBriefSchema,
  REAL_ESTATE_ASSISTANT_NOTICE,
  STOCK_ASSISTANT_DISCLAIMER,
  RealEstateBriefSchema,
  StockBriefSchema,
  type BaseballBrief,
  type NewsBrief,
  type RealEstateBrief,
  type StockBrief,
} from "./output-schemas";
import { generateStructured } from "../ai/structured";
import { createBaseballProvider } from "../providers/baseball";
import { createNewsProvider } from "../providers/news";
import { createRealEstateProvider } from "../providers/real-estate";
import { createStockProvider } from "../providers/stock";
import type {
  BaseballProvider,
  BaseballProviderItem,
  NewsProvider,
  NewsProviderItem,
  RealEstateProvider,
  RealEstateProviderItem,
  StockProvider,
  StockProviderNewsItem,
} from "../providers/types";
import type {
  AssistantTemplate,
  UserAssistant,
} from "../../types/assistants";

export type AssistantExecutionSource = {
  publishedAt: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
  title: string;
};

export type NewsAssistantExecutionResult = {
  input: Record<string, unknown>;
  output: NewsBrief;
  providerMeta: Record<string, unknown>;
  sources: AssistantExecutionSource[];
  type: "news";
};

export type StockAssistantExecutionResult = {
  input: Record<string, unknown>;
  output: StockBrief;
  providerMeta: Record<string, unknown>;
  sources: AssistantExecutionSource[];
  type: "stock";
};

export type BaseballAssistantExecutionResult = {
  input: Record<string, unknown>;
  output: BaseballBrief;
  providerMeta: Record<string, unknown>;
  sources: AssistantExecutionSource[];
  type: "baseball";
};

export type RealEstateAssistantExecutionResult = {
  input: Record<string, unknown>;
  output: RealEstateBrief;
  providerMeta: Record<string, unknown>;
  sources: AssistantExecutionSource[];
  type: "real_estate";
};

export type AssistantExecutionResult =
  | NewsAssistantExecutionResult
  | StockAssistantExecutionResult
  | BaseballAssistantExecutionResult
  | RealEstateAssistantExecutionResult;

type RunAssistantDependencies = {
  baseballProvider?: BaseballProvider;
  generateStructured?: typeof generateStructured;
  newsProvider?: NewsProvider;
  realEstateProvider?: RealEstateProvider;
  stockProvider?: StockProvider;
};

function assertMatchingTemplate(
  assistant: UserAssistant,
  template: AssistantTemplate,
) {
  if (assistant.type !== template.type) {
    throw new Error("Assistant template type does not match the saved assistant.");
  }
}

function mapNewsSources(items: NewsProviderItem[]): AssistantExecutionSource[] {
  return items.map((item) => ({
    publishedAt: item.publishedAt,
    sourceName: item.sourceName,
    sourceUrl: item.sourceUrl,
    title: item.title,
  }));
}

function mapStockSources(
  items: StockProviderNewsItem[],
): AssistantExecutionSource[] {
  const deduped = new Map<string, AssistantExecutionSource>();

  for (const item of items) {
    const key = `${item.sourceUrl}::${item.title}`;

    if (!deduped.has(key)) {
      deduped.set(key, {
        publishedAt: item.publishedAt,
        sourceName: item.sourceName,
        sourceUrl: item.sourceUrl,
        title: item.title,
      });
    }
  }

  return Array.from(deduped.values());
}

function mapProviderSources<
  TItem extends BaseballProviderItem | RealEstateProviderItem,
>(items: TItem[]): AssistantExecutionSource[] {
  return items.map((item) => ({
    publishedAt: item.publishedAt,
    sourceName: item.sourceName,
    sourceUrl: item.sourceUrl,
    title: item.title,
  }));
}

async function runNewsAssistant(
  assistant: UserAssistant<"news">,
  template: AssistantTemplate<"news">,
  dependencies: RunAssistantDependencies,
): Promise<NewsAssistantExecutionResult> {
  const provider = dependencies.newsProvider ?? createNewsProvider();
  const structuredGenerator =
    dependencies.generateStructured ?? generateStructured;
  const providerData = await provider.getTopHeadlines({
    categories: assistant.config.categories,
    language: assistant.config.language,
    maxItems: assistant.config.maxItems,
  });
  const output = await structuredGenerator({
    schema: NewsBriefSchema,
    schemaName: "news_brief",
    systemPrompt: template.systemPrompt,
    promptSections: [
      {
        label: "assistant",
        data: {
          id: assistant.id,
          name: assistant.name,
          type: assistant.type,
        },
      },
      {
        label: "config",
        data: assistant.config,
      },
      {
        label: "provider_data",
        data: providerData,
      },
    ],
    userInstructions:
      "Write in Korean, stay neutral, explain why each issue matters, and use only the provided sources.",
  });

  return {
    input: {
      assistant: {
        id: assistant.id,
        name: assistant.name,
        type: assistant.type,
      },
      config: assistant.config,
      providerData,
      templateId: template.id,
    },
    output,
    providerMeta: {
      categoryCount: providerData.categories.length,
      generatedAt: providerData.generatedAt,
      isMock: providerData.isMock,
      itemCount: providerData.items.length,
      provider: providerData.provider,
    },
    sources: mapNewsSources(providerData.items),
    type: "news",
  };
}

async function runStockAssistant(
  assistant: UserAssistant<"stock">,
  template: AssistantTemplate<"stock">,
  dependencies: RunAssistantDependencies,
): Promise<StockAssistantExecutionResult> {
  const provider = dependencies.stockProvider ?? createStockProvider();
  const structuredGenerator =
    dependencies.generateStructured ?? generateStructured;
  const providerData = await provider.getMarketBrief({
    language: assistant.config.language,
    market: assistant.config.market,
    symbols: assistant.config.symbols,
  });
  const output = await structuredGenerator({
    schema: StockBriefSchema,
    schemaName: "stock_brief",
    systemPrompt: template.systemPrompt,
    promptSections: [
      {
        label: "assistant",
        data: {
          id: assistant.id,
          name: assistant.name,
          type: assistant.type,
        },
      },
      {
        label: "config",
        data: assistant.config,
      },
      {
        label: "provider_data",
        data: providerData,
      },
    ],
    userInstructions: [
      "Write in Korean.",
      "Do not give investment advice or target prices.",
      `Set disclaimer exactly to: ${STOCK_ASSISTANT_DISCLAIMER}`,
      "Summarize public information only and keep tone informational.",
    ].join(" "),
  });

  return {
    input: {
      assistant: {
        id: assistant.id,
        name: assistant.name,
        type: assistant.type,
      },
      config: assistant.config,
      providerData,
      templateId: template.id,
    },
    output,
    providerMeta: {
      generatedAt: providerData.generatedAt,
      isMock: providerData.isMock,
      market: providerData.market,
      provider: providerData.provider,
      quoteCount: providerData.quotes.length,
      symbolCount: providerData.symbols.length,
    },
    sources: mapStockSources(providerData.relatedNews),
    type: "stock",
  };
}

async function runBaseballAssistant(
  assistant: UserAssistant<"baseball">,
  template: AssistantTemplate<"baseball">,
  dependencies: RunAssistantDependencies,
): Promise<BaseballAssistantExecutionResult> {
  const provider = dependencies.baseballProvider ?? createBaseballProvider();
  const structuredGenerator =
    dependencies.generateStructured ?? generateStructured;
  const providerData = await provider.getLeagueBrief({
    teams: assistant.config.teams,
    language: assistant.config.language,
    includeStandings: assistant.config.includeStandings,
  });
  const output = await structuredGenerator({
    schema: BaseballBriefSchema,
    schemaName: "baseball_brief",
    systemPrompt: template.systemPrompt,
    promptSections: [
      {
        label: "assistant",
        data: {
          id: assistant.id,
          name: assistant.name,
          type: assistant.type,
        },
      },
      {
        label: "config",
        data: assistant.config,
      },
      {
        label: "provider_data",
        data: providerData,
      },
    ],
    userInstructions:
      "Write in Korean. Summarize recent KBO team flow in an informative, fan-friendly tone using only the provided sources.",
  });

  return {
    input: {
      assistant: {
        id: assistant.id,
        name: assistant.name,
        type: assistant.type,
      },
      config: assistant.config,
      providerData,
      templateId: template.id,
    },
    output,
    providerMeta: {
      generatedAt: providerData.generatedAt,
      includeStandings: providerData.includeStandings,
      isMock: providerData.isMock,
      provider: providerData.provider,
      teamCount: providerData.teams.length,
    },
    sources: mapProviderSources(providerData.items),
    type: "baseball",
  };
}

async function runRealEstateAssistant(
  assistant: UserAssistant<"real_estate">,
  template: AssistantTemplate<"real_estate">,
  dependencies: RunAssistantDependencies,
): Promise<RealEstateAssistantExecutionResult> {
  const provider =
    dependencies.realEstateProvider ?? createRealEstateProvider();
  const structuredGenerator =
    dependencies.generateStructured ?? generateStructured;
  const providerData = await provider.getMarketPulse({
    language: assistant.config.language,
    propertyTypes: assistant.config.propertyTypes,
    regions: assistant.config.regions,
  });
  const output = await structuredGenerator({
    schema: RealEstateBriefSchema,
    schemaName: "real_estate_brief",
    systemPrompt: template.systemPrompt,
    promptSections: [
      {
        label: "assistant",
        data: {
          id: assistant.id,
          name: assistant.name,
          type: assistant.type,
        },
      },
      {
        label: "config",
        data: assistant.config,
      },
      {
        label: "provider_data",
        data: providerData,
      },
    ],
    userInstructions: [
      "Write in Korean.",
      "Do not provide legal advice or investment recommendations.",
      `Set notice exactly to: ${REAL_ESTATE_ASSISTANT_NOTICE}`,
      "Summarize public information only and keep tone practical.",
    ].join(" "),
  });

  return {
    input: {
      assistant: {
        id: assistant.id,
        name: assistant.name,
        type: assistant.type,
      },
      config: assistant.config,
      providerData,
      templateId: template.id,
    },
    output,
    providerMeta: {
      generatedAt: providerData.generatedAt,
      isMock: providerData.isMock,
      itemCount: providerData.items.length,
      provider: providerData.provider,
      regionCount: providerData.regions.length,
    },
    sources: mapProviderSources(providerData.items),
    type: "real_estate",
  };
}

export async function runAssistant(
  assistant: UserAssistant<"news">,
  template: AssistantTemplate<"news">,
  dependencies?: RunAssistantDependencies,
): Promise<NewsAssistantExecutionResult>;
export async function runAssistant(
  assistant: UserAssistant<"stock">,
  template: AssistantTemplate<"stock">,
  dependencies?: RunAssistantDependencies,
): Promise<StockAssistantExecutionResult>;
export async function runAssistant(
  assistant: UserAssistant<"baseball">,
  template: AssistantTemplate<"baseball">,
  dependencies?: RunAssistantDependencies,
): Promise<BaseballAssistantExecutionResult>;
export async function runAssistant(
  assistant: UserAssistant<"real_estate">,
  template: AssistantTemplate<"real_estate">,
  dependencies?: RunAssistantDependencies,
): Promise<RealEstateAssistantExecutionResult>;
export async function runAssistant(
  assistant: UserAssistant,
  template: AssistantTemplate,
  dependencies?: RunAssistantDependencies,
): Promise<AssistantExecutionResult>;
export async function runAssistant(
  assistant: UserAssistant,
  template: AssistantTemplate,
  dependencies: RunAssistantDependencies = {},
): Promise<AssistantExecutionResult> {
  assertMatchingTemplate(assistant, template);

  if (assistant.type === "news" && template.type === "news") {
    return runNewsAssistant(
      assistant as UserAssistant<"news">,
      template as AssistantTemplate<"news">,
      dependencies,
    );
  }

  if (assistant.type === "stock" && template.type === "stock") {
    return runStockAssistant(
      assistant as UserAssistant<"stock">,
      template as AssistantTemplate<"stock">,
      dependencies,
    );
  }

  if (assistant.type === "baseball" && template.type === "baseball") {
    return runBaseballAssistant(
      assistant as UserAssistant<"baseball">,
      template as AssistantTemplate<"baseball">,
      dependencies,
    );
  }

  return runRealEstateAssistant(
    assistant as UserAssistant<"real_estate">,
    template as AssistantTemplate<"real_estate">,
    dependencies,
  );
}
