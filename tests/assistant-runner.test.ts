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

function createBaseballAssistant(): UserAssistant<"baseball"> {
  return {
    config: {
      teams: ["LG", "KIA"],
      summaryStyle: "series-focused",
      includeStandings: true,
      language: "ko",
    },
    createdAt: "2026-05-12T06:00:00.000Z",
    id: "assistant-baseball-1",
    name: "KBO",
    sortOrder: 0,
    templateId: "template-baseball-1",
    type: "baseball",
    updatedAt: "2026-05-12T06:00:00.000Z",
    userId: "user-1",
  };
}

function createBaseballTemplate(): AssistantTemplate<"baseball"> {
  return {
    avatarKey: "pixel-catcher",
    createdAt: "2026-05-12T06:00:00.000Z",
    defaultConfig: {
      teams: ["LG", "KIA"],
      summaryStyle: "series-focused",
      includeStandings: true,
      language: "ko",
    },
    description: "Baseball template",
    id: "template-baseball-1",
    isActive: true,
    name: "Baseball template",
    systemPrompt: "You are a baseball assistant.",
    type: "baseball",
    updatedAt: "2026-05-12T06:00:00.000Z",
  };
}

function createRealEstateAssistant(): UserAssistant<"real_estate"> {
  return {
    config: {
      regions: ["서울 마포구"],
      propertyTypes: ["apartment"],
      summaryStyle: "balanced",
      language: "ko",
    },
    createdAt: "2026-05-12T06:00:00.000Z",
    id: "assistant-real-estate-1",
    name: "Homes",
    sortOrder: 0,
    templateId: "template-real-estate-1",
    type: "real_estate",
    updatedAt: "2026-05-12T06:00:00.000Z",
    userId: "user-1",
  };
}

function createRealEstateTemplate(): AssistantTemplate<"real_estate"> {
  return {
    avatarKey: "pixel-home",
    createdAt: "2026-05-12T06:00:00.000Z",
    defaultConfig: {
      regions: ["서울 마포구"],
      propertyTypes: ["apartment"],
      summaryStyle: "balanced",
      language: "ko",
    },
    description: "Real estate template",
    id: "template-real-estate-1",
    isActive: true,
    name: "Real estate template",
    systemPrompt: "You are a real estate assistant.",
    type: "real_estate",
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

  it("returns structured baseball output and team sources", async () => {
    const generateStructured = vi.fn(
      async () =>
        ({
          generatedAt: "2026-05-12T06:00:00.000Z",
          leagueSummary: "상위권 경쟁이 이어졌습니다.",
          standings: [
            {
              rank: 1,
              team: "LG",
              record: "26승 14패",
              streak: "2연승",
            },
          ],
          teamBriefs: [
            {
              latestResult: "LG가 최근 경기에서 승리했습니다.",
              keyPlayer: "오스틴",
              keyStory: "타선 집중력이 돋보였습니다.",
              nextGame: "내일 18:30 경기 예정",
              recentRecord: "최근 5경기 4승 1패",
              source: {
                publishedAt: "2026-05-12T05:50:00.000Z",
                sourceName: "KBO Daily",
                sourceUrl: "https://example.com/baseball/lg",
                title: "LG 최근 경기 요약",
              },
              team: "LG",
            },
          ],
        }) as never,
    );
    const baseballProvider = {
      getLeagueBrief: vi.fn(async () => ({
        generatedAt: "2026-05-12T06:00:00.000Z",
        includeStandings: true,
        isMock: true,
        items: [
          {
            latestResult: "LG가 최근 경기에서 승리했습니다.",
            keyPlayer: "오스틴",
            keyStory: "타선 집중력이 돋보였습니다.",
            nextGame: "내일 18:30 경기 예정",
            publishedAt: "2026-05-12T05:50:00.000Z",
            recentRecord: "최근 5경기 4승 1패",
            sourceName: "KBO Daily",
            sourceUrl: "https://example.com/baseball/lg",
            team: "LG" as const,
            title: "LG 최근 경기 요약",
          },
        ],
        provider: "mock",
        standings: [
          {
            rank: 1,
            team: "LG" as const,
            record: "26승 14패",
            streak: "2연승",
          },
        ],
        teams: ["LG", "KIA"],
      })),
    };

    const result = (await runAssistant(
      createBaseballAssistant() as UserAssistant,
      createBaseballTemplate() as AssistantTemplate,
      {
        generateStructured,
        baseballProvider,
      } as never,
    )) as {
      output: { teamBriefs: Array<unknown> };
      sources: Array<{ sourceUrl: string }>;
      type: "baseball";
    };

    expect(result.type).toBe("baseball");
    expect(result.output.teamBriefs).toHaveLength(1);
    expect(result.sources[0]?.sourceUrl).toBe("https://example.com/baseball/lg");
  });

  it("returns real estate output with the required notice", async () => {
    const generateStructured = vi.fn(
      async () =>
        ({
          generatedAt: "2026-05-12T06:00:00.000Z",
          marketSummary: "관심 지역은 실거주 선호가 유지됐습니다.",
          notice:
            "이 내용은 법률 자문이나 투자 권유가 아니라 공개 정보 기반 요약입니다.",
          regions: [
            {
              demandSignal: "실거주 수요가 꾸준합니다.",
              keyChanges: ["문의 강도가 유지되고 있습니다."],
              priceTrendSummary: "마포구 아파트는 보합권에서 강세 흐름입니다.",
              propertyType: "apartment",
              region: "서울 마포구",
              source: {
                publishedAt: "2026-05-12T05:50:00.000Z",
                sourceName: "Housing Watch",
                sourceUrl: "https://example.com/real-estate/mapo",
                title: "마포구 아파트 흐름",
              },
              supplySignal: "공급 뉴스는 제한적입니다.",
            },
          ],
        }) as never,
    );
    const realEstateProvider = {
      getMarketPulse: vi.fn(async () => ({
        generatedAt: "2026-05-12T06:00:00.000Z",
        isMock: true,
        items: [
          {
            demandSignal: "실거주 수요가 꾸준합니다.",
            keyChanges: ["문의 강도가 유지되고 있습니다."],
            priceTrendSummary: "마포구 아파트는 보합권에서 강세 흐름입니다.",
            propertyType: "apartment" as const,
            publishedAt: "2026-05-12T05:50:00.000Z",
            region: "서울 마포구",
            sourceName: "Housing Watch",
            sourceUrl: "https://example.com/real-estate/mapo",
            supplySignal: "공급 뉴스는 제한적입니다.",
            title: "마포구 아파트 흐름",
          },
        ],
        propertyTypes: ["apartment" as const],
        provider: "mock",
        regions: ["서울 마포구"],
      })),
    };

    const result = (await runAssistant(
      createRealEstateAssistant() as UserAssistant,
      createRealEstateTemplate() as AssistantTemplate,
      {
        generateStructured,
        realEstateProvider,
      } as never,
    )) as {
      output: { notice: string };
      sources: Array<unknown>;
      type: "real_estate";
    };

    expect(result.type).toBe("real_estate");
    expect(result.output.notice).toContain("공개 정보 기반 요약");
    expect(result.sources).toHaveLength(1);
  });
});
