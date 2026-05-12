import { z } from "zod";

import { newsCategoryOptions } from "./config";

export const STOCK_ASSISTANT_DISCLAIMER =
  "이 내용은 투자 조언이 아니라 공개 데이터 기반 정보 요약입니다.";

const sourceSchema = z.object({
  publishedAt: z.string().datetime().nullable(),
  sourceName: z.string().trim().min(1),
  sourceUrl: z.string().trim().url(),
  title: z.string().trim().min(1),
});

export const NewsHighlightSchema = z.object({
  category: z.enum(newsCategoryOptions),
  summary: z.string().trim().min(1),
  title: z.string().trim().min(1),
  whyItMatters: z.string().trim().min(1),
  source: sourceSchema,
});

export const NewsBriefSchema = z.object({
  generatedAt: z.string().datetime(),
  highlights: z.array(NewsHighlightSchema).min(1).max(10),
  overallSummary: z.string().trim().min(1),
});

const stockNewsSchema = sourceSchema.extend({
  sentiment: z.enum(["negative", "neutral", "positive"]),
  summary: z.string().trim().min(1),
});

export const StockSymbolBriefSchema = z.object({
  change: z.number(),
  changePercent: z.number(),
  currency: z.string().trim().min(1),
  keyIssues: z.array(z.string().trim().min(1)).min(1).max(4),
  price: z.number().positive(),
  relatedNews: z.array(stockNewsSchema).min(1).max(4),
  summary: z.string().trim().min(1),
  symbol: z.string().trim().min(1),
});

export const StockBriefSchema = z.object({
  disclaimer: z.literal(STOCK_ASSISTANT_DISCLAIMER),
  generatedAt: z.string().datetime(),
  marketSummary: z.string().trim().min(1),
  symbols: z.array(StockSymbolBriefSchema).min(1).max(10),
});

export type NewsBrief = z.infer<typeof NewsBriefSchema>;
export type StockBrief = z.infer<typeof StockBriefSchema>;
