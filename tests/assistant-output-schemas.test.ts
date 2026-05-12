import { describe, expect, it } from "vitest";

import {
  NewsBriefSchema,
  STOCK_ASSISTANT_DISCLAIMER,
  StockBriefSchema,
} from "../src/lib/assistants/output-schemas";

describe("assistant output schemas", () => {
  it("accepts a valid news brief output", () => {
    const parsed = NewsBriefSchema.parse({
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
          summary: "Chip demand stayed strong in enterprise infrastructure.",
          title: "Semiconductor orders stay firm",
          whyItMatters: "It suggests AI infrastructure spending remains resilient.",
        },
      ],
      overallSummary: "Technology and macro headlines stayed constructive overall.",
    });

    expect(parsed.highlights).toHaveLength(1);
  });

  it("requires the stock disclaimer exactly", () => {
    expect(() =>
      StockBriefSchema.parse({
        disclaimer: "Not investment advice",
        generatedAt: "2026-05-12T06:00:00.000Z",
        marketSummary: "Large-cap sentiment was mixed.",
        symbols: [
          {
            change: 1.2,
            changePercent: 0.4,
            currency: "USD",
            keyIssues: ["Cloud demand was steady."],
            price: 100,
            relatedNews: [
              {
                publishedAt: "2026-05-12T05:10:00.000Z",
                sentiment: "neutral",
                sourceName: "Market Wire",
                sourceUrl: "https://example.com/stocks/test",
                summary: "Company updates were limited.",
                title: "Muted session update",
              },
            ],
            summary: "Trading was quiet.",
            symbol: "TEST",
          },
        ],
      }),
    ).toThrow();
  });

  it("accepts a valid stock brief with the required disclaimer", () => {
    const parsed = StockBriefSchema.parse({
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
              sourceUrl: "https://example.com/stocks/apple-services-growth",
              summary: "Recurring revenue trends remained supportive.",
              title: "Apple services growth remains a margin support",
            },
          ],
          summary: "Momentum improved on stable revenue mix.",
          symbol: "AAPL",
        },
      ],
    });

    expect(parsed.disclaimer).toBe(STOCK_ASSISTANT_DISCLAIMER);
  });
});
