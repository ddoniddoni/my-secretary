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

const baseballAssistant: UserAssistant<"baseball"> = {
  config: {
    teams: ["LG", "KIA"],
    summaryStyle: "series-focused",
    includeStandings: true,
    language: "ko",
  },
  createdAt: "2026-05-10T00:00:00.000Z",
  id: "assistant-baseball",
  name: "KBO Radar",
  sortOrder: 2,
  templateId: "template-baseball",
  type: "baseball",
  updatedAt: "2026-05-10T00:00:00.000Z",
  userId: "user-1",
};

const realEstateAssistant: UserAssistant<"real_estate"> = {
  config: {
    regions: ["서울 마포구", "경기 성남시 분당구"],
    propertyTypes: ["apartment", "officetel"],
    summaryStyle: "balanced",
    language: "ko",
  },
  createdAt: "2026-05-10T00:00:00.000Z",
  id: "assistant-real-estate",
  name: "Home Pulse",
  sortOrder: 3,
  templateId: "template-real-estate",
  type: "real_estate",
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
  "template-baseball": {
    avatarKey: "pixel-catcher",
    createdAt: "2026-05-10T00:00:00.000Z",
    defaultConfig: baseballAssistant.config,
    description: "KBO game summaries for your teams.",
    id: "template-baseball",
    isActive: true,
    name: "KBO Brief",
    systemPrompt: "prompt",
    type: "baseball",
    updatedAt: "2026-05-10T00:00:00.000Z",
  },
  "template-real-estate": {
    avatarKey: "pixel-home",
    createdAt: "2026-05-10T00:00:00.000Z",
    defaultConfig: realEstateAssistant.config,
    description: "Region-level housing updates with public signals.",
    id: "template-real-estate",
    isActive: true,
    name: "Real Estate Brief",
    systemPrompt: "prompt",
    type: "real_estate",
    updatedAt: "2026-05-10T00:00:00.000Z",
  },
};

describe("assistant dashboard helpers", () => {
  it("returns readable type labels", () => {
    expect(getAssistantTypeLabel("news")).toBe("News AI");
    expect(getAssistantTypeLabel("stock")).toBe("Stock AI");
    expect(getAssistantTypeLabel("baseball")).toBe("Baseball AI");
    expect(getAssistantTypeLabel("real_estate")).toBe("Real Estate AI");
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
    expect(getAssistantMetaChips(baseballAssistant)).toEqual([
      "LG / KIA",
      "순위 포함",
    ]);
    expect(getAssistantMetaChips(realEstateAssistant)).toEqual([
      "서울 마포구 / 경기 성남시 분당구",
      "2 types",
    ]);
  });

  it("filters assistants by search text across names and config metadata", () => {
    const assistants = [
      newsAssistant,
      stockAssistant,
      baseballAssistant,
      realEstateAssistant,
    ];

    expect(
      filterAssistantsForDashboard(assistants, "nvda", templatesById),
    ).toEqual([stockAssistant]);
    expect(filterAssistantsForDashboard(assistants, "경제", templatesById)).toEqual([
      newsAssistant,
    ]);
    expect(filterAssistantsForDashboard(assistants, "kia", templatesById)).toEqual([
      baseballAssistant,
    ]);
    expect(
      filterAssistantsForDashboard(assistants, "마포구", templatesById),
    ).toEqual([realEstateAssistant]);
    expect(filterAssistantsForDashboard(assistants, "", templatesById)).toEqual(
      assistants,
    );
  });
});
