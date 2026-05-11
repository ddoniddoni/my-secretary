import type { StockMarket } from "../types/assistants";

export type MockStockQuote = {
  asOf: string;
  change: number;
  changePercent: number;
  currency: string;
  market: StockMarket;
  price: number;
  symbol: string;
};

export type MockStockNewsItem = {
  publishedAt: string;
  sentiment: "negative" | "neutral" | "positive";
  sourceName: string;
  sourceUrl: string;
  summary: string;
  symbol: string;
  title: string;
};

export const mockStockQuotes: Record<string, MockStockQuote> = {
  AAPL: {
    asOf: "2026-05-12T06:00:00.000Z",
    change: 2.15,
    changePercent: 1.14,
    currency: "USD",
    market: "US",
    price: 190.75,
    symbol: "AAPL",
  },
  NVDA: {
    asOf: "2026-05-12T06:00:00.000Z",
    change: 12.1,
    changePercent: 1.36,
    currency: "USD",
    market: "US",
    price: 899.4,
    symbol: "NVDA",
  },
  TSLA: {
    asOf: "2026-05-12T06:00:00.000Z",
    change: -4.85,
    changePercent: -2.74,
    currency: "USD",
    market: "US",
    price: 172.3,
    symbol: "TSLA",
  },
  MSFT: {
    asOf: "2026-05-12T06:00:00.000Z",
    change: 3.45,
    changePercent: 0.84,
    currency: "USD",
    market: "US",
    price: 414.55,
    symbol: "MSFT",
  },
  "005930": {
    asOf: "2026-05-12T06:00:00.000Z",
    change: 900,
    changePercent: 1.18,
    currency: "KRW",
    market: "KR",
    price: 77200,
    symbol: "005930",
  },
  "000660": {
    asOf: "2026-05-12T06:00:00.000Z",
    change: -1200,
    changePercent: -0.64,
    currency: "KRW",
    market: "KR",
    price: 186400,
    symbol: "000660",
  },
};

export const mockStockNews: MockStockNewsItem[] = [
  {
    publishedAt: "2026-05-12T05:50:00.000Z",
    sentiment: "positive",
    sourceName: "Street Brief",
    sourceUrl: "https://example.com/stocks/apple-services-growth",
    summary:
      "Analysts highlighted recurring services revenue as a stabilizing factor for margins.",
    symbol: "AAPL",
    title: "Apple services growth remains a margin support",
  },
  {
    publishedAt: "2026-05-12T05:20:00.000Z",
    sentiment: "positive",
    sourceName: "Chip Journal",
    sourceUrl: "https://example.com/stocks/nvidia-supply-chain",
    summary:
      "Supply chain checks suggested sustained demand for accelerator shipments into cloud clients.",
    symbol: "NVDA",
    title: "NVIDIA supply chain checks remain constructive",
  },
  {
    publishedAt: "2026-05-12T04:55:00.000Z",
    sentiment: "negative",
    sourceName: "Auto Watch",
    sourceUrl: "https://example.com/stocks/tesla-price-competition",
    summary:
      "EV competition and price discounting continued to shape sentiment around near-term margins.",
    symbol: "TSLA",
    title: "Tesla sentiment pressured by price competition",
  },
  {
    publishedAt: "2026-05-12T04:30:00.000Z",
    sentiment: "neutral",
    sourceName: "Enterprise Ledger",
    sourceUrl: "https://example.com/stocks/microsoft-cloud-spend",
    summary:
      "Corporate software spending stayed resilient, though customers remained selective on expansion.",
    symbol: "MSFT",
    title: "Microsoft cloud demand holds while budgets stay selective",
  },
  {
    publishedAt: "2026-05-12T04:10:00.000Z",
    sentiment: "positive",
    sourceName: "Korea Markets",
    sourceUrl: "https://example.com/stocks/samsung-memory-pricing",
    summary:
      "Memory pricing improved again, supporting expectations for stronger semiconductor earnings.",
    symbol: "005930",
    title: "Samsung Electronics benefits from firmer memory pricing",
  },
  {
    publishedAt: "2026-05-12T03:45:00.000Z",
    sentiment: "neutral",
    sourceName: "Semiconductor Post",
    sourceUrl: "https://example.com/stocks/hynix-ai-memory",
    summary:
      "AI memory demand stayed solid, but investors watched capex discipline closely.",
    symbol: "000660",
    title: "SK hynix demand outlook stays tied to AI memory momentum",
  },
];
