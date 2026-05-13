import { describe, expect, it } from "vitest";

import {
  REAL_ESTATE_ASSISTANT_NOTICE,
  STOCK_ASSISTANT_DISCLAIMER,
} from "../src/lib/assistants/output-schemas";
import {
  formatAssistantRunTimestamp,
  getAssistantRunStatusCopy,
  getAssistantRunSummary,
  parseAssistantRunResult,
} from "../src/lib/assistants/results";
import type { AssistantRun } from "../src/types/assistants";

const newsRun: AssistantRun<"news"> = {
  completedAt: "2026-05-13T01:20:00.000Z",
  createdAt: "2026-05-13T01:19:00.000Z",
  errorMessage: null,
  id: "run-news-1",
  input: {},
  output: {
    generatedAt: "2026-05-13T01:20:00.000Z",
    highlights: [
      {
        category: "IT",
        source: {
          publishedAt: "2026-05-13T01:10:00.000Z",
          sourceName: "Seoul Tech Wire",
          sourceUrl: "https://example.com/news/ai-chip-demand",
          title: "AI chip demand stays firm",
        },
        summary: "칩 수요가 견조했습니다.",
        title: "AI chip demand stays firm",
        whyItMatters: "인프라 투자 지속성을 보여줍니다.",
      },
    ],
    overallSummary: "기술 뉴스 흐름이 비교적 견조했습니다.",
  },
  providerMeta: {
    provider: "mock",
  },
  status: "success",
  type: "news",
  userAssistantId: "assistant-1",
  userId: "user-1",
};

const stockRun: AssistantRun<"stock"> = {
  completedAt: "2026-05-13T01:20:00.000Z",
  createdAt: "2026-05-13T01:19:00.000Z",
  errorMessage: null,
  id: "run-stock-1",
  input: {},
  output: {
    disclaimer: STOCK_ASSISTANT_DISCLAIMER,
    generatedAt: "2026-05-13T01:20:00.000Z",
    marketSummary: "대형 기술주의 분위기가 안정적이었습니다.",
    symbols: [
      {
        change: 2.1,
        changePercent: 1.2,
        currency: "USD",
        keyIssues: ["서비스 매출이 안정적이었습니다."],
        price: 190.5,
        relatedNews: [
          {
            publishedAt: "2026-05-13T01:10:00.000Z",
            sentiment: "positive",
            sourceName: "Street Brief",
            sourceUrl: "https://example.com/stocks/aapl-services",
            summary: "반복 매출 흐름이 지지 요인이었습니다.",
            title: "Apple services remain supportive",
          },
        ],
        summary: "수익구조 안정성이 부각됐습니다.",
        symbol: "AAPL",
      },
    ],
  },
  providerMeta: {
    provider: "mock",
  },
  status: "success",
  type: "stock",
  userAssistantId: "assistant-2",
  userId: "user-1",
};

const baseballRun: AssistantRun<"baseball"> = {
  completedAt: "2026-05-13T01:20:00.000Z",
  createdAt: "2026-05-13T01:19:00.000Z",
  errorMessage: null,
  id: "run-baseball-1",
  input: {},
  output: {
    generatedAt: "2026-05-13T01:20:00.000Z",
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
          publishedAt: "2026-05-13T01:10:00.000Z",
          sourceName: "KBO Daily",
          sourceUrl: "https://example.com/baseball/lg",
          title: "LG 최근 경기 요약",
        },
        team: "LG",
      },
    ],
  },
  providerMeta: {
    provider: "mock",
  },
  status: "success",
  type: "baseball",
  userAssistantId: "assistant-3",
  userId: "user-1",
};

const realEstateRun: AssistantRun<"real_estate"> = {
  completedAt: "2026-05-13T01:20:00.000Z",
  createdAt: "2026-05-13T01:19:00.000Z",
  errorMessage: null,
  id: "run-real-estate-1",
  input: {},
  output: {
    generatedAt: "2026-05-13T01:20:00.000Z",
    marketSummary: "선호 입지 중심의 차별화 흐름이 이어졌습니다.",
    notice: REAL_ESTATE_ASSISTANT_NOTICE,
    regions: [
      {
        demandSignal: "실거주 수요가 꾸준합니다.",
        keyChanges: ["문의 강도가 유지되고 있습니다."],
        priceTrendSummary: "마포구 아파트는 보합권에서 강세 흐름입니다.",
        propertyType: "apartment",
        region: "서울 마포구",
        source: {
          publishedAt: "2026-05-13T01:10:00.000Z",
          sourceName: "Housing Watch",
          sourceUrl: "https://example.com/real-estate/mapo",
          title: "마포구 아파트 흐름",
        },
        supplySignal: "공급 뉴스는 제한적입니다.",
      },
    ],
  },
  providerMeta: {
    provider: "mock",
  },
  status: "success",
  type: "real_estate",
  userAssistantId: "assistant-4",
  userId: "user-1",
};

describe("assistant result helpers", () => {
  it("parses valid news and stock run outputs", () => {
    const parsedNews = parseAssistantRunResult(newsRun);
    const parsedStock = parseAssistantRunResult(stockRun);
    const parsedBaseball = parseAssistantRunResult(baseballRun);
    const parsedRealEstate = parseAssistantRunResult(realEstateRun);

    expect(parsedNews?.type).toBe("news");
    expect(parsedStock?.type).toBe("stock");
    expect(parsedBaseball?.type).toBe("baseball");
    expect(parsedRealEstate?.type).toBe("real_estate");
    expect(parsedStock && parsedStock.type === "stock"
      ? parsedStock.output.disclaimer
      : null).toBe(STOCK_ASSISTANT_DISCLAIMER);
  });

  it("returns null for non-success or invalid outputs", () => {
    expect(
      parseAssistantRunResult({
        ...newsRun,
        status: "failed",
      }),
    ).toBeNull();

    expect(
      parseAssistantRunResult({
        ...newsRun,
        output: {
          unexpected: true,
        },
      }),
    ).toBeNull();
  });

  it("builds human-readable run summaries", () => {
    expect(getAssistantRunSummary(newsRun)).toContain("1개의 주요 이슈");
    expect(getAssistantRunSummary(stockRun)).toContain("1개 종목 브리핑");
    expect(getAssistantRunSummary(baseballRun)).toContain("1개 팀 흐름");
    expect(getAssistantRunSummary(realEstateRun)).toContain("1개 지역 브리핑");
    expect(
      getAssistantRunSummary({
        ...newsRun,
        errorMessage: "AI 응답 형식을 검증하지 못했습니다.",
        output: null,
        status: "failed",
      }),
    ).toBe("AI 응답 형식을 검증하지 못했습니다.");
    expect(
      getAssistantRunSummary({
        ...newsRun,
        completedAt: null,
        output: null,
        status: "pending",
      }),
    ).toBe("AI 브리핑을 생성하고 있어요.");
  });

  it("returns readable status labels and timestamp formatting", () => {
    expect(getAssistantRunStatusCopy(newsRun)).toEqual({
      label: "Success",
      tone: "success",
    });
    expect(
      formatAssistantRunTimestamp("2026-05-13T01:20:00.000Z"),
    ).toMatch(/2026/);
    expect(formatAssistantRunTimestamp("invalid")).toBe("시간 정보 없음");
  });
});
