import { mockStockNews, mockStockQuotes } from "../../mocks/stocks";
import { z } from "zod";

import type {
  StockProvider,
  StockProviderInput,
  StockProviderNewsItem,
  StockProviderResult,
  StockQuote,
} from "./types";
import type { StockMarket } from "../../types/assistants";
import {
  coerceFiniteNumber,
  fetchProviderJson,
  getProviderSelection,
  getRequiredProviderEnv,
} from "./shared";

const alphaVantageQuoteSchema = z.object({
  "Error Message": z.string().optional(),
  Information: z.string().optional(),
  Note: z.string().optional(),
  "Global Quote": z.record(z.string(), z.string()).optional(),
});

const alphaVantageNewsItemSchema = z.object({
  overall_sentiment_label: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  time_published: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  ticker_sentiment: z
    .array(
      z.object({
        ticker: z.string(),
      }),
    )
    .default([]),
  url: z.string().url().nullable().optional(),
});

const alphaVantageNewsSchema = z.object({
  "Error Message": z.string().optional(),
  feed: z.array(alphaVantageNewsItemSchema).default([]),
  Information: z.string().optional(),
  Note: z.string().optional(),
});

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

function getCurrencyForMarket(market: StockMarket) {
  return market === "KR" ? "KRW" : "USD";
}

function mapAlphaSentiment(
  label: string | null | undefined,
): StockProviderNewsItem["sentiment"] {
  const normalized = label?.toLowerCase() ?? "";

  if (normalized.includes("bullish")) {
    return "positive";
  }

  if (normalized.includes("bearish")) {
    return "negative";
  }

  return "neutral";
}

function parseAlphaTimestamp(value: string) {
  const match = value.match(
    /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/,
  );

  if (!match) {
    return null;
  }

  const [, year, month, day, hour, minute, second] = match;

  return new Date(
    `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`,
  ).toISOString();
}

class AlphaVantageStockProvider implements StockProvider {
  constructor(private readonly apiKey: string) {}

  async getMarketBrief(input: StockProviderInput): Promise<StockProviderResult> {
    const symbols = input.symbols.map((symbol) => symbol.toUpperCase());
    const [quotes, relatedNews] = await Promise.all([
      Promise.all(
        symbols.map((symbol) => this.getQuote(symbol, input.market)),
      ),
      Promise.all(symbols.map((symbol) => this.getNews(symbol))),
    ]);

    return {
      generatedAt: new Date().toISOString(),
      isMock: false,
      market: input.market,
      provider: "alphavantage",
      quotes,
      relatedNews: relatedNews.flat(),
      symbols,
    };
  }

  private async getQuote(symbol: string, market: StockMarket) {
    const url = new URL("https://www.alphavantage.co/query");

    url.searchParams.set("function", "GLOBAL_QUOTE");
    url.searchParams.set("symbol", symbol);
    url.searchParams.set("apikey", this.apiKey);

    const response = await fetchProviderJson(url, alphaVantageQuoteSchema, {
      errorContext: `Alpha Vantage quote request for ${symbol}`,
    });
    const providerError =
      response["Error Message"] ?? response.Information ?? response.Note;

    if (providerError) {
      throw new Error(
        `Alpha Vantage quote request for ${symbol} failed: ${providerError}`,
      );
    }

    const quote = response["Global Quote"];

    if (!quote) {
      throw new Error(
        `Alpha Vantage quote response for ${symbol} is missing quote data.`,
      );
    }

    const price = coerceFiniteNumber(quote["05. price"]);
    const change = coerceFiniteNumber(quote["09. change"]);
    const changePercent = coerceFiniteNumber(quote["10. change percent"]);
    const asOfDate = quote["07. latest trading day"]?.trim();

    if (price === null || change === null || changePercent === null || !asOfDate) {
      throw new Error(
        `Alpha Vantage quote response for ${symbol} is missing required fields.`,
      );
    }

    return {
      asOf: new Date(`${asOfDate}T00:00:00.000Z`).toISOString(),
      change,
      changePercent,
      currency: getCurrencyForMarket(market),
      market,
      price,
      symbol,
    };
  }

  private async getNews(symbol: string) {
    const url = new URL("https://www.alphavantage.co/query");

    url.searchParams.set("function", "NEWS_SENTIMENT");
    url.searchParams.set("tickers", symbol);
    url.searchParams.set("apikey", this.apiKey);

    const response = await fetchProviderJson(url, alphaVantageNewsSchema, {
      errorContext: `Alpha Vantage news request for ${symbol}`,
    });
    const providerError =
      response["Error Message"] ?? response.Information ?? response.Note;

    if (providerError) {
      throw new Error(
        `Alpha Vantage news request for ${symbol} failed: ${providerError}`,
      );
    }

    return response.feed
      .filter((item) => {
        if (item.ticker_sentiment.length === 0) {
          return true;
        }

        return item.ticker_sentiment.some(
          (ticker) => ticker.ticker.toUpperCase() === symbol,
        );
      })
      .slice(0, 5)
      .map((item) => ({
        publishedAt: item.time_published
          ? parseAlphaTimestamp(item.time_published)
          : null,
        sentiment: mapAlphaSentiment(item.overall_sentiment_label),
        sourceName: "Alpha Vantage News",
        sourceUrl: item.url ?? "https://www.alphavantage.co/documentation/",
        summary:
          item.summary?.trim() || `${symbol} 관련 시장 뉴스 요약입니다.`,
        symbol,
        title: item.title?.trim() || `${symbol} market update`,
      }));
  }
}

export function createStockProvider(): StockProvider {
  const provider = getProviderSelection(process.env.STOCK_PROVIDER, "mock");

  if (provider === "mock") {
    return new MockStockProvider();
  }

  if (provider === "alphavantage") {
    return new AlphaVantageStockProvider(
      getRequiredProviderEnv(
        process.env.ALPHA_VANTAGE_API_KEY,
        "ALPHA_VANTAGE_API_KEY",
        "STOCK_PROVIDER=alphavantage",
      ),
    );
  }

  throw new Error(`Unsupported stock provider: ${provider}`);
}
