import { describe, expect, it, vi } from "vitest";

import { STOCK_ASSISTANT_DISCLAIMER } from "../src/lib/assistants/output-schemas";
import { runAssistant } from "../src/lib/assistants/runner";
import type {
  AssistantTemplate,
  NewsAssistantConfig,
  UserAssistant,
} from "../src/types/assistants";

function createNewsAssistant(): UserAssistant<"news"> {
  return {
    config: {
      categories: ["IT"],
      language: "ko",
      maxItems: 5,
      summaryStyle: "brief",
    },
    createdAt: "2026-05-12T06:00:00.000Z",
    id: "assistant-news-1",
    name: "Morning News",
    sortOrder: 0,
    templateId: "template-news-1",
    type: "news",
    updatedAt: "2026-05-12T06:00:00.000Z",
    userId: "user-1",
  };
}

function createNewsTemplate(): AssistantTemplate<"news"> {
  return {
    avatarKey: "pixel-reporter",
    createdAt: "2026-05-12T06:00:00.000Z",
    defaultConfig: {
      categories: ["IT"],
      language: "ko",
      maxItems: 5,
      summaryStyle: "brief",
    },
    description: "News template",
    id: "template-news-1",
    isActive: true,
    name: "News template",
    systemPrompt: "You are a news assistant.",
    type: "news",
    updatedAt: "2026-05-12T06:00:00.000Z",
  };
}

function createStockAssistant(): UserAssistant<"stock"> {
  return {
    config: {
      language: "ko",
      market: "US",
      summaryStyle: "news-focused",
      symbols: ["AAPL"],
    },
    createdAt: "2026-05-12T06:00:00.000Z",
    id: "assistant-stock-1",
    name: "Stocks",
    sortOrder: 0,
    templateId: "template-stock-1",
    type: "stock",
    updatedAt: "2026-05-12T06:00:00.000Z",
    userId: "user-1",
  };
}

function createStockTemplate(): AssistantTemplate<"stock"> {
  return {
    avatarKey: "pixel-broker",
    createdAt: "2026-05-12T06:00:00.000Z",
    defaultConfig: {
      language: "ko",
      market: "US",
      summaryStyle: "news-focused",
      symbols: ["AAPL"],
    },
    description: "Stock template",
    id: "template-stock-1",
    isActive: true,
    name: "Stock template",
    systemPrompt: "You are a stock assistant.",
    type: "stock",
    updatedAt: "2026-05-12T06:00:00.000Z",
  };
}

describe("assistant runner", () => {
  it("returns structured news output and source metadata", async () => {
    const generateStructured = vi.fn(
      async () =>
        ({
          generatedAt: "2026-05-12T06:00:00.000Z",
          highlights: [
            {
              category: "IT",
              source: {
                publishedAt: "2026-05-12T05:50:00.000Z",
                sourceName: "Seoul Tech Wire",
                sourceUrl: "https://example.com/news/semiconductor-demand",
                title: "AI server demand keeps semiconductor orders firm",
              },
              summary: "Chip demand stayed strong.",
              title: "Semiconductor orders stay firm",
              whyItMatters: "It reflects resilient AI infrastructure spending.",
            },
          ],
          overallSummary: "Technology headlines stayed constructive.",
        }) as never,
    );
    const newsProvider = {
      getTopHeadlines: vi.fn(async () => ({
        categories: ["IT"] as NewsAssistantConfig["categories"],
        generatedAt: "2026-05-12T06:00:00.000Z",
        isMock: true,
        items: [
          {
            category: "IT" as const,
            publishedAt: "2026-05-12T05:50:00.000Z",
            sourceName: "Seoul Tech Wire",
            sourceUrl: "https://example.com/news/semiconductor-demand",
            summary: "Chip demand stayed strong.",
            title: "AI server demand keeps semiconductor orders firm",
          },
        ],
        provider: "mock",
      })),
    };

    const result = await runAssistant(createNewsAssistant(), createNewsTemplate(), {
      generateStructured,
      newsProvider,
    });

    expect(result.type).toBe("news");
    expect(result.output.highlights).toHaveLength(1);
    expect(result.sources[0]?.sourceUrl).toBe(
      "https://example.com/news/semiconductor-demand",
    );
    expect(newsProvider.getTopHeadlines).toHaveBeenCalledOnce();
  });

  it("returns stock output with the required disclaimer", async () => {
    const generateStructured = vi.fn(
      async () =>
        ({
          disclaimer: STOCK_ASSISTANT_DISCLAIMER,
          generatedAt: "2026-05-12T06:00:00.000Z",
          marketSummary: "Large-cap tech sentiment stayed constructive.",
          symbols: [
            {
              change: 2.15,
              changePercent: 1.14,
              currency: "USD",
              keyIssues: ["Services revenue stayed firm."],
              price: 190.75,
              relatedNews: [
                {
                  publishedAt: "2026-05-12T05:50:00.000Z",
                  sentiment: "positive",
                  sourceName: "Street Brief",
                  sourceUrl:
                    "https://example.com/stocks/apple-services-growth",
                  summary: "Recurring revenue trends remained supportive.",
                  title: "Apple services growth remains a margin support",
                },
              ],
              summary: "Momentum improved on stable revenue mix.",
              symbol: "AAPL",
            },
          ],
        }) as never,
    );
    const stockProvider = {
      getMarketBrief: vi.fn(async () => ({
        generatedAt: "2026-05-12T06:00:00.000Z",
        isMock: true,
        market: "US" as const,
        provider: "mock",
        quotes: [
          {
            asOf: "2026-05-12T06:00:00.000Z",
            change: 2.15,
            changePercent: 1.14,
            currency: "USD",
            market: "US" as const,
            price: 190.75,
            symbol: "AAPL",
          },
        ],
        relatedNews: [
          {
            publishedAt: "2026-05-12T05:50:00.000Z",
            sentiment: "positive" as const,
            sourceName: "Street Brief",
            sourceUrl: "https://example.com/stocks/apple-services-growth",
            summary: "Recurring revenue trends remained supportive.",
            symbol: "AAPL",
            title: "Apple services growth remains a margin support",
          },
        ],
        symbols: ["AAPL"],
      })),
    };

    const result = await runAssistant(
      createStockAssistant(),
      createStockTemplate(),
      {
        generateStructured,
        stockProvider,
      },
    );

    expect(result.type).toBe("stock");
    expect(result.output.disclaimer).toBe(STOCK_ASSISTANT_DISCLAIMER);
    expect(result.sources).toHaveLength(1);
  });

  it("bubbles up generator failures so the caller can mark the run failed", async () => {
    const generateStructured = vi.fn(async () => {
      throw new Error("Schema validation failed");
    });

    await expect(
      runAssistant(createNewsAssistant(), createNewsTemplate(), {
        generateStructured,
        newsProvider: {
          getTopHeadlines: async () => ({
            categories: ["IT"] as NewsAssistantConfig["categories"],
            generatedAt: "2026-05-12T06:00:00.000Z",
            isMock: true,
            items: [],
            provider: "mock",
          }),
        },
      }),
    ).rejects.toThrow("Schema validation failed");
  });
});
