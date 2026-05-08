export type AssistantType = "news" | "stock";

export type AssistantRunStatus = "pending" | "success" | "failed";

export type AssistantLanguage = "ko";

export type NewsCategory =
  | "IT"
  | "경제"
  | "국제"
  | "사회"
  | "문화"
  | "스포츠";

export type NewsSummaryStyle = "brief" | "balanced" | "detailed";

export type StockMarket = "KR" | "US";

export type StockSummaryStyle = "news-focused" | "risk-focused" | "short";

export type NewsAssistantConfig = {
  categories: NewsCategory[];
  summaryStyle: NewsSummaryStyle;
  maxItems: 5 | 7 | 10;
  language: AssistantLanguage;
};

export type StockAssistantConfig = {
  symbols: string[];
  market: StockMarket;
  summaryStyle: StockSummaryStyle;
  language: AssistantLanguage;
};

export type AssistantConfigByType = {
  news: NewsAssistantConfig;
  stock: StockAssistantConfig;
};

export type AssistantConfig = AssistantConfigByType[AssistantType];

export type AssistantTemplate<TType extends AssistantType = AssistantType> = {
  id: string;
  type: TType;
  name: string;
  description: string;
  avatarKey: string;
  systemPrompt: string;
  defaultConfig: AssistantConfigByType[TType];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserAssistant<TType extends AssistantType = AssistantType> = {
  id: string;
  userId: string;
  templateId: string;
  type: TType;
  name: string;
  config: AssistantConfigByType[TType];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type AssistantRun<TType extends AssistantType = AssistantType> = {
  id: string;
  userId: string;
  userAssistantId: string;
  type: TType;
  status: AssistantRunStatus;
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  errorMessage: string | null;
  providerMeta: Record<string, unknown>;
  createdAt: string;
  completedAt: string | null;
};

export type AssistantSource<TType extends AssistantType = AssistantType> = {
  id: string;
  runId: string;
  userId: string;
  type: TType;
  title: string;
  sourceName: string | null;
  sourceUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
};

export type AssistantPreviewItem = {
  title: string;
  meta: string;
  description: string;
};

export type AssistantPreview = {
  type: AssistantType;
  badge: string;
  name: string;
  summary: string;
  description: string;
  bullets: string[];
  previewItems: AssistantPreviewItem[];
};

export type ProductHighlight = {
  label: string;
  value: string;
};

export type ProductPrinciple = {
  eyebrow: string;
  title: string;
  description: string;
};
