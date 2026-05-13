import { mockNewsArticles } from "../../mocks/news";
import { z } from "zod";

import type {
  NewsProvider,
  NewsProviderInput,
  NewsProviderResult,
} from "./types";
import {
  fetchProviderJson,
  getProviderSelection,
  getRequiredProviderEnv,
} from "./shared";

const newsApiCategoryMap = {
  IT: "technology",
  경제: "business",
  국제: "general",
  사회: "general",
  문화: "entertainment",
  스포츠: "sports",
} as const satisfies Record<NewsProviderInput["categories"][number], string>;

const newsApiArticleSchema = z.object({
  description: z.string().nullable().optional(),
  publishedAt: z.string().datetime().nullable().optional(),
  source: z
    .object({
      name: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  title: z.string().nullable().optional(),
  url: z.string().url().nullable().optional(),
});

const newsApiResponseSchema = z.object({
  articles: z.array(newsApiArticleSchema),
  code: z.string().optional(),
  message: z.string().optional(),
  status: z.string(),
});

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

class NewsApiProvider implements NewsProvider {
  constructor(private readonly apiKey: string) {}

  async getTopHeadlines(input: NewsProviderInput): Promise<NewsProviderResult> {
    const itemsPerCategory = Math.max(
      1,
      Math.ceil(input.maxItems / input.categories.length),
    );
    const results = await Promise.all(
      input.categories.map(async (category) => {
        const url = new URL("https://newsapi.org/v2/top-headlines");

        url.searchParams.set("category", newsApiCategoryMap[category]);
        url.searchParams.set("country", "kr");
        url.searchParams.set("pageSize", String(itemsPerCategory));

        const response = await fetchProviderJson(url, newsApiResponseSchema, {
          errorContext: `NewsAPI ${category} headlines request`,
          headers: {
            "X-Api-Key": this.apiKey,
          },
        });

        if (response.status !== "ok") {
          throw new Error(
            response.message
              ? `NewsAPI ${category} headlines request failed: ${response.message}`
              : `NewsAPI ${category} headlines request failed.`,
          );
        }

        return response.articles.map((article) => ({
          category,
          publishedAt: article.publishedAt ?? null,
          sourceName: article.source?.name?.trim() || "NewsAPI",
          sourceUrl: article.url ?? "https://newsapi.org/",
          summary:
            article.description?.trim() ||
            article.title?.trim() ||
            `${category} 헤드라인 요약입니다.`,
          title: article.title?.trim() || `${category} 헤드라인`,
        }));
      }),
    );

    const deduped = new Map<string, NewsProviderResult["items"][number]>();

    for (const items of results) {
      for (const item of items) {
        const key = `${item.sourceUrl}::${item.title}`;

        if (!deduped.has(key)) {
          deduped.set(key, item);
        }
      }
    }

    return {
      categories: input.categories,
      generatedAt: new Date().toISOString(),
      isMock: false,
      items: Array.from(deduped.values()).slice(0, input.maxItems),
      provider: "newsapi",
    };
  }
}

export function createNewsProvider(): NewsProvider {
  const provider = getProviderSelection(process.env.NEWS_PROVIDER, "mock");

  if (provider === "mock") {
    return new MockNewsProvider();
  }

  if (provider === "newsapi") {
    return new NewsApiProvider(
      getRequiredProviderEnv(
        process.env.NEWSAPI_API_KEY,
        "NEWSAPI_API_KEY",
        "NEWS_PROVIDER=newsapi",
      ),
    );
  }

  throw new Error(`Unsupported news provider: ${provider}`);
}
