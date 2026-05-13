import { z } from "zod";

import type {
  AssistantConfig,
  AssistantConfigByType,
  AssistantType,
  BaseballSummaryStyle,
  KboTeam,
  NewsCategory,
  NewsSummaryStyle,
  RealEstatePropertyType,
  RealEstateSummaryStyle,
  StockSummaryStyle,
  UserAssistant,
} from "@/types/assistants";

export const newsCategoryOptions = [
  "IT",
  "경제",
  "국제",
  "사회",
  "문화",
  "스포츠",
] as const satisfies readonly NewsCategory[];

export const newsSummaryStyleOptions = [
  "brief",
  "balanced",
  "detailed",
] as const satisfies readonly NewsSummaryStyle[];

export const stockSummaryStyleOptions = [
  "short",
  "news-focused",
  "risk-focused",
] as const satisfies readonly StockSummaryStyle[];

export const stockMarketOptions = ["US", "KR"] as const;

export const kboTeamOptions = [
  "LG",
  "SSG",
  "두산",
  "롯데",
  "KIA",
  "삼성",
  "한화",
  "KT",
  "NC",
  "키움",
] as const satisfies readonly KboTeam[];

export const baseballSummaryStyleOptions = [
  "brief",
  "series-focused",
  "player-focused",
] as const satisfies readonly BaseballSummaryStyle[];

export const realEstatePropertyTypeOptions = [
  "apartment",
  "officetel",
  "villa",
] as const satisfies readonly RealEstatePropertyType[];

export const realEstateSummaryStyleOptions = [
  "balanced",
  "price-focused",
  "supply-focused",
] as const satisfies readonly RealEstateSummaryStyle[];

export const assistantNameSchema = z
  .string()
  .trim()
  .min(1, "비서 이름을 입력해주세요.")
  .max(50, "비서 이름은 50자 이하로 입력해주세요.");

const newsConfigSchema = z.object({
  categories: z
    .array(z.enum(newsCategoryOptions))
    .min(1, "뉴스 카테고리를 하나 이상 선택해주세요."),
  summaryStyle: z.enum(newsSummaryStyleOptions),
  maxItems: z.union([z.literal(5), z.literal(7), z.literal(10)]),
  language: z.literal("ko"),
});

const stockSymbolSchema = z
  .string()
  .trim()
  .min(1)
  .max(12)
  .regex(/^[A-Za-z0-9.-]+$/, "종목 코드는 영문, 숫자, 점, 하이픈만 사용할 수 있습니다.")
  .transform((value) => value.toUpperCase());

const stockConfigSchema = z
  .object({
    symbols: z
      .array(stockSymbolSchema)
      .min(1, "관심 종목을 하나 이상 입력해주세요.")
      .max(10, "관심 종목은 최대 10개까지 저장할 수 있습니다."),
    market: z.enum(stockMarketOptions),
    summaryStyle: z.enum(stockSummaryStyleOptions),
    language: z.literal("ko"),
  })
  .transform((value) => ({
    ...value,
    symbols: Array.from(new Set(value.symbols)),
  }))
  .refine((value) => value.symbols.length > 0, {
    message: "관심 종목을 하나 이상 입력해주세요.",
    path: ["symbols"],
  });

const baseballConfigSchema = z.object({
  teams: z
    .array(z.enum(kboTeamOptions))
    .min(1, "응원 팀을 하나 이상 선택해주세요.")
    .max(5, "응원 팀은 최대 5개까지 선택할 수 있습니다."),
  summaryStyle: z.enum(baseballSummaryStyleOptions),
  includeStandings: z.boolean(),
  language: z.literal("ko"),
});

const realEstateRegionSchema = z
  .string()
  .trim()
  .min(1)
  .max(30, "지역 이름은 30자 이하로 입력해주세요.");

const realEstateConfigSchema = z
  .object({
    regions: z
      .array(realEstateRegionSchema)
      .min(1, "관심 지역을 하나 이상 입력해주세요.")
      .max(5, "관심 지역은 최대 5개까지 저장할 수 있습니다."),
    propertyTypes: z
      .array(z.enum(realEstatePropertyTypeOptions))
      .min(1, "주택 유형을 하나 이상 선택해주세요.")
      .max(3),
    summaryStyle: z.enum(realEstateSummaryStyleOptions),
    language: z.literal("ko"),
  })
  .transform((value) => ({
    ...value,
    propertyTypes: Array.from(new Set(value.propertyTypes)),
    regions: Array.from(new Set(value.regions)),
  }));

export const createAssistantRequestSchema = z.object({
  templateId: z.string().uuid("유효한 비서 템플릿이 필요합니다."),
  name: assistantNameSchema,
  config: z.unknown(),
});

export const updateAssistantRequestSchema = z.object({
  name: assistantNameSchema,
  config: z.unknown(),
});

export function parseAssistantConfig<TType extends AssistantType>(
  type: TType,
  input: unknown,
): AssistantConfigByType[TType] {
  if (type === "news") {
    return newsConfigSchema.parse(input) as AssistantConfigByType[TType];
  }

  if (type === "stock") {
    return stockConfigSchema.parse(input) as AssistantConfigByType[TType];
  }

  if (type === "baseball") {
    return baseballConfigSchema.parse(input) as AssistantConfigByType[TType];
  }

  return realEstateConfigSchema.parse(input) as AssistantConfigByType[TType];
}

export function safeParseAssistantConfig<TType extends AssistantType>(
  type: TType,
  input: unknown,
) {
  if (type === "news") {
    return newsConfigSchema.safeParse(input);
  }

  if (type === "stock") {
    return stockConfigSchema.safeParse(input);
  }

  if (type === "baseball") {
    return baseballConfigSchema.safeParse(input);
  }

  return realEstateConfigSchema.safeParse(input);
}

export function getAssistantConfigEntries(
  assistant: Pick<UserAssistant, "config" | "type">,
) {
  if (assistant.type === "news") {
    const config = assistant.config as Extract<
      AssistantConfig,
      { categories: string[] }
    >;

    return [
      {
        label: "관심 카테고리",
        value: config.categories.join(", "),
      },
      {
        label: "요약 스타일",
        value: config.summaryStyle,
      },
      {
        label: "뉴스 개수",
        value: `${config.maxItems}개`,
      },
      {
        label: "언어",
        value: config.language.toUpperCase(),
      },
    ];
  }

  if (assistant.type === "stock") {
    const config = assistant.config as Extract<
      AssistantConfig,
      { symbols: string[] }
    >;

    return [
      {
        label: "관심 종목",
        value: config.symbols.join(", "),
      },
      {
        label: "시장",
        value: config.market,
      },
      {
        label: "브리핑 스타일",
        value: config.summaryStyle,
      },
      {
        label: "언어",
        value: config.language.toUpperCase(),
      },
    ];
  }

  if (assistant.type === "baseball") {
    const config = assistant.config as Extract<
      AssistantConfig,
      { teams: string[] }
    >;

    return [
      {
        label: "응원 팀",
        value: config.teams.join(", "),
      },
      {
        label: "브리핑 스타일",
        value: config.summaryStyle,
      },
      {
        label: "순위 포함",
        value: config.includeStandings ? "포함" : "제외",
      },
      {
        label: "언어",
        value: config.language.toUpperCase(),
      },
    ];
  }

  const config = assistant.config as Extract<
    AssistantConfig,
    { regions: string[] }
  >;

  return [
    {
      label: "관심 지역",
      value: config.regions.join(", "),
    },
    {
      label: "주택 유형",
      value: config.propertyTypes.join(", "),
    },
    {
      label: "브리핑 스타일",
      value: config.summaryStyle,
    },
    {
      label: "언어",
      value: config.language.toUpperCase(),
    },
  ];
}

export function getDefaultSymbolsInput(config: AssistantConfig) {
  if ("symbols" in config) {
    return config.symbols.join(", ");
  }

  return "";
}

export function getDefaultRegionsInput(config: AssistantConfig) {
  if ("regions" in config) {
    return config.regions.join(", ");
  }

  return "";
}
