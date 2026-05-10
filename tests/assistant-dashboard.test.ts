import { describe, expect, it } from "vitest";

import {
  filterAssistantsForDashboard,
  getAssistantMetaChips,
  getAssistantTypeLabel,
} from "../src/lib/assistants/dashboard";
import type {
  AssistantTemplate,
  UserAssistant,
} from "../src/types/assistants";

const newsAssistant: UserAssistant<"news"> = {
  config: {
    categories: ["IT", "경제", "국제"],
    language: "ko",
    maxItems: 5,
    summaryStyle: "brief",
  },
  createdAt: "2026-05-10T00:00:00.000Z",
  id: "assistant-news",
  name: "Morning News Desk",
  sortOrder: 0,
  templateId: "template-news",
  type: "news",
  updatedAt: "2026-05-10T00:00:00.000Z",
  userId: "user-1",
};

const stockAssistant: UserAssistant<"stock"> = {
  config: {
    language: "ko",
    market: "US",
    summaryStyle: "news-focused",
    symbols: ["NVDA", "TSLA"],
  },
  createdAt: "2026-05-10T00:00:00.000Z",
  id: "assistant-stock",
  name: "Market Radar",
  sortOrder: 1,
  templateId: "template-stock",
  type: "stock",
  updatedAt: "2026-05-10T00:00:00.000Z",
  userId: "user-1",
};

const templatesById: Record<string, AssistantTemplate | undefined> = {
  "template-news": {
    avatarKey: "pixel-reporter",
    createdAt: "2026-05-10T00:00:00.000Z",
    defaultConfig: newsAssistant.config,
    description: "Daily issue summaries for the categories you follow.",
    id: "template-news",
    isActive: true,
    name: "News Brief",
    systemPrompt: "prompt",
    type: "news",
    updatedAt: "2026-05-10T00:00:00.000Z",
  },
  "template-stock": {
    avatarKey: "pixel-broker",
    createdAt: "2026-05-10T00:00:00.000Z",
    defaultConfig: stockAssistant.config,
    description: "Watchlist tracking with public market context.",
    id: "template-stock",
    isActive: true,
    name: "Stock Watch",
    systemPrompt: "prompt",
    type: "stock",
    updatedAt: "2026-05-10T00:00:00.000Z",
  },
};

describe("assistant dashboard helpers", () => {
  it("returns readable type labels", () => {
    expect(getAssistantTypeLabel("news")).toBe("News AI");
    expect(getAssistantTypeLabel("stock")).toBe("Stock AI");
  });

  it("builds metadata chips for news and stock assistants", () => {
    expect(getAssistantMetaChips(newsAssistant)).toEqual([
      "IT / 경제 / 국제",
      "5 headlines",
    ]);
    expect(getAssistantMetaChips(stockAssistant)).toEqual([
      "NVDA / TSLA",
      "US market",
    ]);
  });

  it("filters assistants by search text across names and config metadata", () => {
    const assistants = [newsAssistant, stockAssistant];

    expect(
      filterAssistantsForDashboard(assistants, "nvda", templatesById),
    ).toEqual([stockAssistant]);
    expect(filterAssistantsForDashboard(assistants, "경제", templatesById)).toEqual([
      newsAssistant,
    ]);
    expect(filterAssistantsForDashboard(assistants, "", templatesById)).toEqual(
      assistants,
    );
  });
});
