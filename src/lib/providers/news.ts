import { mockNewsArticles } from "../../mocks/news";

import type {
  NewsProvider,
  NewsProviderInput,
  NewsProviderResult,
} from "./types";

class MockNewsProvider implements NewsProvider {
  async getTopHeadlines(input: NewsProviderInput): Promise<NewsProviderResult> {
    const items = mockNewsArticles
      .filter((article) => input.categories.includes(article.category))
      .slice(0, input.maxItems)
      .map((article) => ({
        category: article.category,
        publishedAt: article.publishedAt,
        sourceName: article.sourceName,
        sourceUrl: article.sourceUrl,
        summary: article.summary,
        title: article.title,
      }));

    return {
      categories: input.categories,
      generatedAt: new Date().toISOString(),
      isMock: true,
      items,
      provider: "mock",
    };
  }
}

export function createNewsProvider(): NewsProvider {
  const provider = process.env.NEWS_PROVIDER?.trim() || "mock";

  if (provider !== "mock") {
    throw new Error(`Unsupported news provider: ${provider}`);
  }

  return new MockNewsProvider();
}
