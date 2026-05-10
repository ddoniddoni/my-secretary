import type {
  AssistantTemplate,
  UserAssistant,
} from "@/types/assistants";

const previewUserId = "preview-user";

export const fallbackPreviewTemplates: AssistantTemplate[] = [
  {
    avatarKey: "pixel-reporter",
    createdAt: "2026-05-10T00:00:00.000Z",
    defaultConfig: {
      categories: ["IT", "경제", "국제"],
      language: "ko",
      maxItems: 5,
      summaryStyle: "brief",
    },
    description: "오늘의 주요 뉴스 이슈를 핵심만 정리해주는 비서입니다.",
    id: "preview-template-news",
    isActive: true,
    name: "오늘 뉴스 정리 AI",
    systemPrompt: "preview",
    type: "news",
    updatedAt: "2026-05-10T00:00:00.000Z",
  },
  {
    avatarKey: "pixel-broker",
    createdAt: "2026-05-10T00:00:00.000Z",
    defaultConfig: {
      language: "ko",
      market: "US",
      summaryStyle: "news-focused",
      symbols: ["NVDA", "AAPL", "TSLA"],
    },
    description: "관심 종목의 가격 변동과 관련 이슈를 요약해주는 비서입니다.",
    id: "preview-template-stock",
    isActive: true,
    name: "주식 브리핑 AI",
    systemPrompt: "preview",
    type: "stock",
    updatedAt: "2026-05-10T00:00:00.000Z",
  },
];

export function buildPreviewAssistants(
  templates: AssistantTemplate[],
): UserAssistant[] {
  const newsTemplate =
    templates.find((template) => template.type === "news") ??
    fallbackPreviewTemplates[0];
  const stockTemplate =
    templates.find((template) => template.type === "stock") ??
    fallbackPreviewTemplates[1];

  return [
    {
      config: newsTemplate.defaultConfig,
      createdAt: "2026-05-10T09:00:00.000Z",
      id: "preview-assistant-news",
      name: "News AI",
      sortOrder: 0,
      templateId: newsTemplate.id,
      type: "news",
      updatedAt: "2026-05-10T09:00:00.000Z",
      userId: previewUserId,
    },
    {
      config: stockTemplate.defaultConfig,
      createdAt: "2026-05-10T09:05:00.000Z",
      id: "preview-assistant-stock",
      name: "Stock AI",
      sortOrder: 1,
      templateId: stockTemplate.id,
      type: "stock",
      updatedAt: "2026-05-10T09:05:00.000Z",
      userId: previewUserId,
    },
  ];
}
