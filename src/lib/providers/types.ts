import type {
  AssistantLanguage,
  NewsCategory,
  StockMarket,
} from "../../types/assistants";

export type ProviderSource = {
  publishedAt: string | null;
  sourceName: string;
  sourceUrl: string;
  title: string;
};

export type NewsProviderInput = {
  categories: NewsCategory[];
  language: AssistantLanguage;
  maxItems: number;
};

export type NewsProviderItem = ProviderSource & {
  category: NewsCategory;
  summary: string;
};

export type NewsProviderResult = {
  categories: NewsCategory[];
  generatedAt: string;
  isMock: boolean;
  items: NewsProviderItem[];
  provider: string;
};

export type StockProviderInput = {
  language: AssistantLanguage;
  market: StockMarket;
  symbols: string[];
};

export type StockQuote = {
  asOf: string;
  change: number;
  changePercent: number;
  currency: string;
  market: StockMarket;
  price: number;
  symbol: string;
};

export type StockProviderNewsItem = ProviderSource & {
  sentiment: "negative" | "neutral" | "positive";
  summary: string;
  symbol: string;
};

export type StockProviderResult = {
  generatedAt: string;
  isMock: boolean;
  market: StockMarket;
  provider: string;
  quotes: StockQuote[];
  relatedNews: StockProviderNewsItem[];
  symbols: string[];
};

export interface NewsProvider {
  getTopHeadlines(input: NewsProviderInput): Promise<NewsProviderResult>;
}

export interface StockProvider {
  getMarketBrief(input: StockProviderInput): Promise<StockProviderResult>;
}
