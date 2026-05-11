import type { NewsCategory } from "../types/assistants";

import { newsCategoryOptions } from "../lib/assistants/config";

export type MockNewsArticle = {
  category: NewsCategory;
  publishedAt: string;
  sourceName: string;
  sourceUrl: string;
  summary: string;
  title: string;
};

export const mockNewsArticles: MockNewsArticle[] = [
  {
    category: newsCategoryOptions[0],
    publishedAt: "2026-05-12T06:00:00.000Z",
    sourceName: "Seoul Tech Wire",
    sourceUrl: "https://example.com/news/semiconductor-demand",
    summary:
      "Chip suppliers reported stronger enterprise orders as AI server demand remained elevated.",
    title: "AI server demand keeps semiconductor orders firm",
  },
  {
    category: newsCategoryOptions[0],
    publishedAt: "2026-05-12T05:30:00.000Z",
    sourceName: "Digital Daily",
    sourceUrl: "https://example.com/news/mobile-os-update",
    summary:
      "A major mobile platform previewed new on-device privacy controls and developer APIs.",
    title: "Mobile platform update focuses on privacy controls",
  },
  {
    category: newsCategoryOptions[1],
    publishedAt: "2026-05-12T04:45:00.000Z",
    sourceName: "Market Ledger",
    sourceUrl: "https://example.com/news/export-data-rebound",
    summary:
      "Fresh export data suggested a modest rebound in manufacturing shipments this month.",
    title: "Export data points to a modest manufacturing rebound",
  },
  {
    category: newsCategoryOptions[2],
    publishedAt: "2026-05-12T04:00:00.000Z",
    sourceName: "Global Desk",
    sourceUrl: "https://example.com/news/energy-talks",
    summary:
      "Regional energy talks centered on supply stability and shipping lane risk management.",
    title: "Regional energy talks focus on supply stability",
  },
  {
    category: newsCategoryOptions[3],
    publishedAt: "2026-05-12T03:20:00.000Z",
    sourceName: "Metro Chronicle",
    sourceUrl: "https://example.com/news/public-transport",
    summary:
      "City officials announced a phased rollout of late-night public transport coverage.",
    title: "Cities expand late-night public transport coverage",
  },
  {
    category: newsCategoryOptions[4],
    publishedAt: "2026-05-12T02:40:00.000Z",
    sourceName: "Culture Note",
    sourceUrl: "https://example.com/news/museum-exhibit",
    summary:
      "A new interactive exhibition drew attention for combining archival media and game design.",
    title: "Interactive museum exhibit draws younger audiences",
  },
];
