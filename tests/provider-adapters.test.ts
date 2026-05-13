import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createNewsProvider } from "../src/lib/providers/news";
import { createStockProvider } from "../src/lib/providers/stock";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
    },
    status,
  });
}

describe("provider adapters", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("keeps the mock news provider as the default", async () => {
    delete process.env.NEWS_PROVIDER;

    const provider = createNewsProvider();
    const result = await provider.getTopHeadlines({
      categories: ["IT"],
      language: "ko",
      maxItems: 5,
    });

    expect(result.provider).toBe("mock");
    expect(result.isMock).toBe(true);
    expect(result.items.length).toBeGreaterThan(0);
  });

  it("requires NEWSAPI_API_KEY when newsapi is selected", () => {
    process.env.NEWS_PROVIDER = "newsapi";
    delete process.env.NEWSAPI_API_KEY;

    expect(() => createNewsProvider()).toThrow(
      "NEWSAPI_API_KEY is required when NEWS_PROVIDER=newsapi is enabled.",
    );
  });

  it("normalizes NewsAPI responses into the shared news shape", async () => {
    process.env.NEWS_PROVIDER = "newsapi";
    process.env.NEWSAPI_API_KEY = "news-key";

    const fetchMock = vi.fn(async (input: string | URL) => {
      const url = new URL(String(input));
      const category = url.searchParams.get("category");

      if (category === "technology") {
        return jsonResponse({
          articles: [
            {
              description: "반도체 수요가 이어졌습니다.",
              publishedAt: "2026-05-14T09:00:00Z",
              source: { name: "Tech Desk" },
              title: "AI 반도체 수요 유지",
              url: "https://example.com/news/ai-chip-demand",
            },
          ],
          status: "ok",
        });
      }

      return jsonResponse({
        articles: [
          {
            description: "원/달러 흐름이 안정적이었습니다.",
            publishedAt: "2026-05-14T08:30:00Z",
            source: { name: "Market Daily" },
            title: "환율 변동성 완화",
            url: "https://example.com/news/fx-stable",
          },
        ],
        status: "ok",
      });
    });

    vi.stubGlobal("fetch", fetchMock);

    const provider = createNewsProvider();
    const result = await provider.getTopHeadlines({
      categories: ["IT", "경제"],
      language: "ko",
      maxItems: 2,
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.provider).toBe("newsapi");
    expect(result.isMock).toBe(false);
    expect(result.items).toEqual([
      {
        category: "IT",
        publishedAt: "2026-05-14T09:00:00Z",
        sourceName: "Tech Desk",
        sourceUrl: "https://example.com/news/ai-chip-demand",
        summary: "반도체 수요가 이어졌습니다.",
        title: "AI 반도체 수요 유지",
      },
      {
        category: "경제",
        publishedAt: "2026-05-14T08:30:00Z",
        sourceName: "Market Daily",
        sourceUrl: "https://example.com/news/fx-stable",
        summary: "원/달러 흐름이 안정적이었습니다.",
        title: "환율 변동성 완화",
      },
    ]);
  });

  it("requires ALPHA_VANTAGE_API_KEY when alphavantage is selected", () => {
    process.env.STOCK_PROVIDER = "alphavantage";
    delete process.env.ALPHA_VANTAGE_API_KEY;

    expect(() => createStockProvider()).toThrow(
      "ALPHA_VANTAGE_API_KEY is required when STOCK_PROVIDER=alphavantage is enabled.",
    );
  });

  it("normalizes Alpha Vantage quote and news responses", async () => {
    process.env.STOCK_PROVIDER = "alphavantage";
    process.env.ALPHA_VANTAGE_API_KEY = "alpha-key";

    const fetchMock = vi.fn(async (input: string | URL) => {
      const url = new URL(String(input));
      const fnName = url.searchParams.get("function");

      if (fnName === "GLOBAL_QUOTE") {
        return jsonResponse({
          "Global Quote": {
            "05. price": "190.75",
            "07. latest trading day": "2026-05-14",
            "09. change": "2.15",
            "10. change percent": "1.14%",
          },
        });
      }

      return jsonResponse({
        feed: [
          {
            overall_sentiment_label: "Bullish",
            summary: "서비스 매출 비중이 지지력을 보였습니다.",
            ticker_sentiment: [{ ticker: "AAPL" }],
            time_published: "20260514T101500",
            title: "애플 서비스 사업 방어력 유지",
            url: "https://example.com/stocks/aapl-services",
          },
        ],
      });
    });

    vi.stubGlobal("fetch", fetchMock);

    const provider = createStockProvider();
    const result = await provider.getMarketBrief({
      language: "ko",
      market: "US",
      symbols: ["AAPL"],
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.provider).toBe("alphavantage");
    expect(result.isMock).toBe(false);
    expect(result.quotes).toEqual([
      {
        asOf: "2026-05-14T00:00:00.000Z",
        change: 2.15,
        changePercent: 1.14,
        currency: "USD",
        market: "US",
        price: 190.75,
        symbol: "AAPL",
      },
    ]);
    expect(result.relatedNews).toEqual([
      {
        publishedAt: "2026-05-14T10:15:00.000Z",
        sentiment: "positive",
        sourceName: "Alpha Vantage News",
        sourceUrl: "https://example.com/stocks/aapl-services",
        summary: "서비스 매출 비중이 지지력을 보였습니다.",
        symbol: "AAPL",
        title: "애플 서비스 사업 방어력 유지",
      },
    ]);
  });
});
