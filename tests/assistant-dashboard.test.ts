import { describe, expect, it } from "vitest";

import {
  buildDashboardOverview,
  filterAssistantsForDashboard,
  getAssistantMetaChips,
  getAssistantTypeLabel,
  getAssistantTypePreviewLabel,
} from "../src/lib/assistants/dashboard";
import type { AssistantTemplate, UserAssistant } from "../src/types/assistants";

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
    expect(getAssistantTypeLabel("news")).toBe("뉴스 비서");
    expect(getAssistantTypeLabel("stock")).toBe("주식 비서");
    expect(getAssistantTypeLabel("baseball")).toBe("야구 비서");
    expect(getAssistantTypeLabel("real_estate")).toBe("부동산 비서");

    expect(getAssistantTypePreviewLabel("news")).toBe("뉴스 브리핑");
    expect(getAssistantTypePreviewLabel("stock")).toBe("종목 관찰");
    expect(getAssistantTypePreviewLabel("baseball")).toBe("KBO 브리핑");
    expect(getAssistantTypePreviewLabel("real_estate")).toBe("부동산 흐름");
  });

  it("builds metadata chips for each assistant type", () => {
    expect(getAssistantMetaChips(newsAssistant)).toEqual(["IT", "5개 헤드라인"]);
    expect(getAssistantMetaChips(stockAssistant)).toEqual([
      "NVDA / TSLA",
      "US 시장",
    ]);
    expect(getAssistantMetaChips(baseballAssistant)).toEqual([
      "LG / KIA",
      "순위 포함",
    ]);
    expect(getAssistantMetaChips(realEstateAssistant)).toEqual([
      "Mapo / Bundang",
      "2개 유형",
    ]);
  });

  it("builds dashboard overview cards from saved assistants", () => {
    expect(buildDashboardOverview([])).toEqual([
      {
        description:
          "템플릿 하나로 시작해 재사용 가능한 비서 묶음을 만들어보세요.",
        label: "비서 묶음",
        tone: "accent",
        value: "00",
      },
      {
        description: "뉴스 브리핑 / 종목 관찰 / KBO 브리핑 / 부동산 흐름",
        label: "범위",
        tone: "info",
        value: "0/4",
      },
      {
        description:
          "비서 설정에 저장된 카테고리, 종목, 팀, 지역 수를 보여줍니다.",
        label: "집중 항목",
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
          "4개의 저장된 작업 흐름이 이 대시보드에서 바로 실행할 준비가 되어 있습니다.",
        label: "비서 묶음",
        tone: "accent",
        value: "04",
      },
      {
        description: "뉴스 브리핑 / 종목 관찰 / KBO 브리핑 / 부동산 흐름",
        label: "범위",
        tone: "info",
        value: "4/4",
      },
      {
        description:
          "비서 설정에 저장된 카테고리, 종목, 팀, 지역 수를 보여줍니다.",
        label: "집중 항목",
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
