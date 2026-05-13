import { describe, expect, it } from "vitest";

import { getAssistantConfigInputFromFormData } from "../src/lib/assistants/form-payload";
import { parseAssistantConfig } from "../src/lib/assistants/config";

describe("assistant config validation", () => {
  it("parses valid news config", () => {
    const parsed = parseAssistantConfig("news", {
      categories: ["IT", "경제"],
      summaryStyle: "brief",
      maxItems: 5,
      language: "ko",
    });

    expect(parsed.categories).toEqual(["IT", "경제"]);
    expect(parsed.maxItems).toBe(5);
  });

  it("normalizes stock symbols to uppercase and removes duplicates", () => {
    const parsed = parseAssistantConfig("stock", {
      symbols: ["aapl", "NVDA", "aapl"],
      market: "US",
      summaryStyle: "news-focused",
      language: "ko",
    });

    expect(parsed.symbols).toEqual(["AAPL", "NVDA"]);
  });

  it("parses valid baseball config", () => {
    const parsed = parseAssistantConfig("baseball", {
      teams: ["LG", "KIA"],
      summaryStyle: "series-focused",
      includeStandings: true,
      language: "ko",
    });

    expect(parsed.teams).toEqual(["LG", "KIA"]);
    expect(parsed.includeStandings).toBe(true);
  });

  it("deduplicates real estate regions and property types", () => {
    const parsed = parseAssistantConfig("real_estate", {
      regions: ["서울 마포구", "서울 마포구", "경기 성남시 분당구"],
      propertyTypes: ["apartment", "officetel", "apartment"],
      summaryStyle: "balanced",
      language: "ko",
    });

    expect(parsed.regions).toEqual(["서울 마포구", "경기 성남시 분당구"]);
    expect(parsed.propertyTypes).toEqual(["apartment", "officetel"]);
  });

  it("rejects invalid news config", () => {
    expect(() =>
      parseAssistantConfig("news", {
        categories: [],
        summaryStyle: "brief",
        maxItems: 5,
        language: "ko",
      }),
    ).toThrow();
  });

  it("builds news config input from form data", () => {
    const formData = new FormData();

    formData.set("summaryStyle", "balanced");
    formData.set("maxItems", "7");
    formData.append("categories", "IT");
    formData.append("categories", "국제");

    expect(getAssistantConfigInputFromFormData("news", formData)).toEqual({
      categories: ["IT", "국제"],
      summaryStyle: "balanced",
      maxItems: 7,
      language: "ko",
    });
  });

  it("builds stock config input from textarea form data", () => {
    const formData = new FormData();

    formData.set("symbols", "aapl, nvda\nTSLA");
    formData.set("market", "US");
    formData.set("summaryStyle", "risk-focused");

    expect(getAssistantConfigInputFromFormData("stock", formData)).toEqual({
      symbols: ["aapl", "nvda", "TSLA"],
      market: "US",
      summaryStyle: "risk-focused",
      language: "ko",
    });
  });

  it("builds baseball config input from form data", () => {
    const formData = new FormData();

    formData.append("teams", "LG");
    formData.append("teams", "KIA");
    formData.set("summaryStyle", "player-focused");
    formData.set("includeStandings", "true");

    expect(getAssistantConfigInputFromFormData("baseball", formData)).toEqual({
      teams: ["LG", "KIA"],
      summaryStyle: "player-focused",
      includeStandings: true,
      language: "ko",
    });
  });

  it("builds real estate config input from textarea form data", () => {
    const formData = new FormData();

    formData.set("regions", "서울 마포구\n경기 성남시 분당구");
    formData.append("propertyTypes", "apartment");
    formData.append("propertyTypes", "officetel");
    formData.set("summaryStyle", "supply-focused");

    expect(
      getAssistantConfigInputFromFormData("real_estate", formData),
    ).toEqual({
      regions: ["서울 마포구", "경기 성남시 분당구"],
      propertyTypes: ["apartment", "officetel"],
      summaryStyle: "supply-focused",
      language: "ko",
    });
  });
});
