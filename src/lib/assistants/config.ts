import { z } from "zod";

import type {
  AssistantConfig,
  AssistantConfigByType,
  AssistantType,
  NewsCategory,
  NewsSummaryStyle,
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

  return stockConfigSchema.parse(input) as AssistantConfigByType[TType];
}

export function safeParseAssistantConfig<TType extends AssistantType>(
  type: TType,
  input: unknown,
) {
  if (type === "news") {
    return newsConfigSchema.safeParse(input);
  }

  return stockConfigSchema.safeParse(input);
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

export function getDefaultSymbolsInput(config: AssistantConfig) {
  if ("symbols" in config) {
    return config.symbols.join(", ");
  }

  return "";
}
