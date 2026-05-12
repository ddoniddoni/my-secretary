import { describe, expect, it } from "vitest";

import { STOCK_ASSISTANT_DISCLAIMER } from "../src/lib/assistants/output-schemas";
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

describe("assistant result helpers", () => {
  it("parses valid news and stock run outputs", () => {
    const parsedNews = parseAssistantRunResult(newsRun);
    const parsedStock = parseAssistantRunResult(stockRun);

    expect(parsedNews?.type).toBe("news");
    expect(parsedStock?.type).toBe("stock");
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
