import { describe, expect, it } from "vitest";

import {
  buildDashboardOverview,
  filterAssistantsForDashboard,
  getAssistantMetaChips,
  getAssistantTypeLabel,
  getAssistantTypePreviewLabel,
} from "../src/lib/assistants/dashboard";
import type {
  AssistantTemplate,
  UserAssistant,
} from "../src/types/assistants";

const newsAssistant: UserAssistant<"news"> = {
  config: {
    categories: ["IT"],
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
    regions: ["Mapo", "Bundang"],
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
  it("returns readable type labels and preview labels", () => {
    expect(getAssistantTypeLabel("news")).toBe("News AI");
    expect(getAssistantTypeLabel("stock")).toBe("Stock AI");
    expect(getAssistantTypeLabel("baseball")).toBe("Baseball AI");
    expect(getAssistantTypeLabel("real_estate")).toBe("Real Estate AI");

    expect(getAssistantTypePreviewLabel("news")).toBe("News briefing");
    expect(getAssistantTypePreviewLabel("stock")).toBe("Stock watch");
    expect(getAssistantTypePreviewLabel("baseball")).toBe("KBO brief");
    expect(getAssistantTypePreviewLabel("real_estate")).toBe("Housing pulse");
  });

  it("builds metadata chips for each assistant type", () => {
    expect(getAssistantMetaChips(newsAssistant)).toEqual(["IT", "5 headlines"]);
    expect(getAssistantMetaChips(stockAssistant)).toEqual([
      "NVDA / TSLA",
      "US market",
    ]);
    expect(getAssistantMetaChips(baseballAssistant)).toEqual([
      "LG / KIA",
      "Standings on",
    ]);
    expect(getAssistantMetaChips(realEstateAssistant)).toEqual([
      "Mapo / Bundang",
      "2 types",
    ]);
  });

  it("builds dashboard overview cards from saved assistants", () => {
    expect(buildDashboardOverview([])).toEqual([
      {
        description:
          "Start with one template and build a reusable assistant deck.",
        label: "Assistant deck",
        tone: "accent",
        value: "00",
      },
      {
        description:
          "News briefing / Stock watch / KBO brief / Housing pulse",
        label: "Coverage",
        tone: "info",
        value: "0/4",
      },
      {
        description:
          "Categories, symbols, teams, and regions saved across your assistant configs.",
        label: "Focus items",
        tone: "success",
        value: "00",
      },
    ]);

    expect(
      buildDashboardOverview([
        newsAssistant,
        stockAssistant,
        baseballAssistant,
        realEstateAssistant,
      ]),
    ).toEqual([
      {
        description:
          "4 saved workflows are ready to run from this dashboard.",
        label: "Assistant deck",
        tone: "accent",
        value: "04",
      },
      {
        description:
          "News briefing / Stock watch / KBO brief / Housing pulse",
        label: "Coverage",
        tone: "info",
        value: "4/4",
      },
      {
        description:
          "Categories, symbols, teams, and regions saved across your assistant configs.",
        label: "Focus items",
        tone: "success",
        value: "09",
      },
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
    expect(
      filterAssistantsForDashboard(assistants, "morning news", templatesById),
    ).toEqual([newsAssistant]);
    expect(filterAssistantsForDashboard(assistants, "kia", templatesById)).toEqual(
      [baseballAssistant],
    );
    expect(
      filterAssistantsForDashboard(assistants, "bundang", templatesById),
    ).toEqual([realEstateAssistant]);
    expect(filterAssistantsForDashboard(assistants, "", templatesById)).toEqual(
      assistants,
    );
  });
});
