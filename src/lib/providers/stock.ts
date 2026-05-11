import { mockStockNews, mockStockQuotes } from "../../mocks/stocks";

import type {
  StockProvider,
  StockProviderInput,
  StockProviderNewsItem,
  StockProviderResult,
  StockQuote,
} from "./types";
import type { StockMarket } from "../../types/assistants";

function buildFallbackQuote(symbol: string, market: StockMarket): StockQuote {
  const seed = Array.from(symbol).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );
  const currency = market === "KR" ? "KRW" : "USD";
  const price = market === "KR" ? 50000 + seed * 7 : 100 + seed / 5;
  const change = Number((((seed % 11) - 5) * (market === "KR" ? 120 : 0.8)).toFixed(2));
  const changePercent = Number((((seed % 9) - 4) * 0.45).toFixed(2));

  return {
    asOf: "2026-05-12T06:00:00.000Z",
    change,
    changePercent,
    currency,
    market,
    price: Number(price.toFixed(2)),
    symbol,
  };
}

function buildFallbackNews(
  symbol: string,
  market: StockMarket,
): StockProviderNewsItem {
  return {
    publishedAt: "2026-05-12T05:00:00.000Z",
    sentiment: "neutral",
    sourceName: "Mock Market Feed",
    sourceUrl: `https://example.com/stocks/${symbol.toLowerCase()}-overview`,
    summary: `${symbol} is using fallback mock market context for ${market} testing.`,
    symbol,
    title: `${symbol} mock market update`,
  };
}

class MockStockProvider implements StockProvider {
  async getMarketBrief(input: StockProviderInput): Promise<StockProviderResult> {
    const symbols = input.symbols.map((symbol) => symbol.toUpperCase());
    const quotes = symbols.map(
      (symbol) => mockStockQuotes[symbol] ?? buildFallbackQuote(symbol, input.market),
    );
    const relatedNews = symbols.flatMap((symbol) => {
      const matches = mockStockNews.filter((item) => item.symbol === symbol);

      return matches.length > 0 ? matches : [buildFallbackNews(symbol, input.market)];
    });

    return {
      generatedAt: new Date().toISOString(),
      isMock: true,
      market: input.market,
      provider: "mock",
      quotes,
      relatedNews,
      symbols,
    };
  }
}

export function createStockProvider(): StockProvider {
  const provider = process.env.STOCK_PROVIDER?.trim() || "mock";

  if (provider !== "mock") {
    throw new Error(`Unsupported stock provider: ${provider}`);
  }

  return new MockStockProvider();
}
