import { describe, expect, it } from "vitest";

import {
  mapAssistantRunRow,
  mapAssistantSourceRow,
  mapAssistantTemplateRow,
  mapUserAssistantRow,
} from "../src/lib/supabase/mappers";

describe("supabase row mappers", () => {
  it("maps assistant template rows to camelCase", () => {
    const mapped = mapAssistantTemplateRow({
      id: "template-1",
      type: "news",
      name: "오늘 뉴스 정리 AI",
      description: "뉴스를 요약합니다.",
      avatar_key: "pixel-reporter",
      system_prompt: "system",
      default_config: {
        categories: ["IT", "경제"],
        summaryStyle: "brief",
        maxItems: 5,
        language: "ko",
      },
      is_active: true,
      created_at: "2026-05-09T00:00:00.000Z",
      updated_at: "2026-05-09T00:00:00.000Z",
    });

    expect(mapped.avatarKey).toBe("pixel-reporter");
    expect(mapped.defaultConfig.language).toBe("ko");
    expect(mapped.isActive).toBe(true);
  });

  it("maps user assistants and runs to camelCase", () => {
    const assistant = mapUserAssistantRow({
      id: "assistant-1",
      user_id: "user-1",
      template_id: "template-1",
      type: "stock",
      name: "미국 주식 브리핑",
      config: {
        symbols: ["AAPL"],
        market: "US",
        summaryStyle: "news-focused",
        language: "ko",
      },
      sort_order: 2,
      created_at: "2026-05-09T00:00:00.000Z",
      updated_at: "2026-05-09T00:00:00.000Z",
    });

    const run = mapAssistantRunRow({
      id: "run-1",
      user_id: "user-1",
      user_assistant_id: "assistant-1",
      type: "stock",
      status: "success",
      input: { market: "US" },
      output: { summary: "ok" },
      error_message: null,
      provider_meta: { provider: "mock" },
      created_at: "2026-05-09T00:00:00.000Z",
      completed_at: "2026-05-09T00:05:00.000Z",
    });

    expect(assistant.userId).toBe("user-1");
    expect(assistant.sortOrder).toBe(2);
    expect(run.userAssistantId).toBe("assistant-1");
    expect(run.providerMeta.provider).toBe("mock");
  });

  it("maps assistant sources to camelCase", () => {
    const mapped = mapAssistantSourceRow({
      id: "source-1",
      run_id: "run-1",
      user_id: "user-1",
      type: "news",
      title: "AI 반도체 경쟁 심화",
      source_name: "Mock News",
      source_url: "https://example.com/news/ai-chip",
      published_at: "2026-05-09T00:00:00.000Z",
      created_at: "2026-05-09T00:00:00.000Z",
    });

    expect(mapped.runId).toBe("run-1");
    expect(mapped.sourceName).toBe("Mock News");
    expect(mapped.sourceUrl).toContain("example.com");
  });
});
