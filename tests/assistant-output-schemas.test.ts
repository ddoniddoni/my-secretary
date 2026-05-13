import { describe, expect, it } from "vitest";

import {
  BaseballBriefSchema,
  NewsBriefSchema,
  REAL_ESTATE_ASSISTANT_NOTICE,
  STOCK_ASSISTANT_DISCLAIMER,
  RealEstateBriefSchema,
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

  it("accepts a valid baseball brief output", () => {
    const parsed = BaseballBriefSchema.parse({
      generatedAt: "2026-05-13T09:00:00.000Z",
      leagueSummary: "상위권 경쟁과 팀별 시리즈 흐름이 이어졌습니다.",
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
            publishedAt: "2026-05-13T08:50:00.000Z",
            sourceName: "KBO Daily",
            sourceUrl: "https://example.com/baseball/lg",
            title: "LG 최근 경기 요약",
          },
          team: "LG",
        },
      ],
    });

    expect(parsed.teamBriefs[0]?.team).toBe("LG");
  });

  it("accepts a valid real estate brief with the required notice", () => {
    const parsed = RealEstateBriefSchema.parse({
      generatedAt: "2026-05-13T09:00:00.000Z",
      marketSummary: "주요 관심 지역은 선호 입지 중심의 차별화 흐름이 이어졌습니다.",
      notice: REAL_ESTATE_ASSISTANT_NOTICE,
      regions: [
        {
          demandSignal: "실거주 수요가 꾸준합니다.",
          keyChanges: ["문의 강도가 유지되고 있습니다."],
          priceTrendSummary: "마포구 아파트는 보합권에서 강세 흐름입니다.",
          propertyType: "apartment",
          region: "서울 마포구",
          source: {
            publishedAt: "2026-05-13T08:50:00.000Z",
            sourceName: "Housing Watch",
            sourceUrl: "https://example.com/real-estate/mapo",
            title: "마포구 아파트 흐름",
          },
          supplySignal: "공급 뉴스는 제한적입니다.",
        },
      ],
    });

    expect(parsed.notice).toBe(REAL_ESTATE_ASSISTANT_NOTICE);
  });
});
