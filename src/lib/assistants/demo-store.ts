import "server-only";

import {
  REAL_ESTATE_ASSISTANT_NOTICE,
  STOCK_ASSISTANT_DISCLAIMER,
} from "@/lib/assistants/output-schemas";
import {
  buildPreviewAssistants,
  fallbackPreviewTemplates,
} from "@/lib/assistants/preview";
import type {
  AssistantRun,
  AssistantTemplate,
  UserAssistant,
} from "@/types/assistants";

const DEMO_USER_ID = "preview-user";
const DEMO_USER_EMAIL = "demo@pixel-agents.local";

type DemoStore = {
  assistants: UserAssistant[];
  runsByAssistantId: Map<string, AssistantRun[]>;
  templates: AssistantTemplate[];
};

declare global {
  var __pixelAgentsDemoStore: DemoStore | undefined;
}

function cloneValue<T>(value: T): T {
  return structuredClone(value);
}

function createDemoNewsRun(assistant: UserAssistant<"news">): AssistantRun<"news"> {
  const now = new Date().toISOString();
  const firstCategory = assistant.config.categories[0] ?? "IT";

  return {
    completedAt: now,
    createdAt: now,
    errorMessage: null,
    id: `demo-run-news-${crypto.randomUUID()}`,
    input: {
      assistant: {
        id: assistant.id,
        name: assistant.name,
        type: assistant.type,
      },
      config: assistant.config,
    },
    output: {
      generatedAt: now,
      highlights: [
        {
          category: firstCategory,
          source: {
            publishedAt: now,
            sourceName: "데모 기술 와이어",
            sourceUrl: "https://example.com/demo/news/ai-infra",
            title: "AI 인프라 수요가 견조한 흐름을 이어가고 있습니다.",
          },
          summary:
            "반도체와 클라우드 인프라 관련 수요가 유지되면서 시장 관심이 이어졌습니다.",
          title: "AI 인프라 관련 수요가 꾸준한 흐름을 유지",
          whyItMatters:
            "사용자가 매일 확인하고 싶은 핵심 흐름을 짧은 카드로 읽을 수 있게 해줍니다.",
        },
        {
          category: assistant.config.categories[1] ?? firstCategory,
          source: {
            publishedAt: now,
            sourceName: "데모 데일리",
            sourceUrl: "https://example.com/demo/news/market-watch",
            title: "거시 변수와 기술 섹터 흐름이 함께 주목받고 있습니다.",
          },
          summary:
            "금리와 기술 업종 뉴스가 함께 움직이며 오늘의 이슈를 만들었습니다.",
          title: "거시 변수와 기술 업종 이슈가 동시 부각",
          whyItMatters:
            "뉴스 비서의 카드형 요약과 중요도 설명 영역을 검토하기 좋은 예시 데이터입니다.",
        },
      ],
      overallSummary:
        "오늘 데모 브리핑에서는 기술과 시장 분위기를 중심으로 핵심 이슈를 정리했습니다.",
    },
    providerMeta: {
      isMock: true,
      itemCount: 2,
      provider: "demo",
    },
    status: "success",
    type: "news",
    userAssistantId: assistant.id,
    userId: assistant.userId,
  };
}

function createDemoStockRun(
  assistant: UserAssistant<"stock">,
): AssistantRun<"stock"> {
  const now = new Date().toISOString();
  const firstSymbol = assistant.config.symbols[0] ?? "AAPL";
  const secondSymbol = assistant.config.symbols[1] ?? firstSymbol;

  return {
    completedAt: now,
    createdAt: now,
    errorMessage: null,
    id: `demo-run-stock-${crypto.randomUUID()}`,
    input: {
      assistant: {
        id: assistant.id,
        name: assistant.name,
        type: assistant.type,
      },
      config: assistant.config,
    },
    output: {
      disclaimer: STOCK_ASSISTANT_DISCLAIMER,
      generatedAt: now,
      marketSummary:
        "대형 기술주와 관심 종목 흐름을 중심으로 오늘의 시장 분위기를 정리했습니다.",
      symbols: [
        {
          change: 3.25,
          changePercent: 1.42,
          currency: assistant.config.market === "KR" ? "KRW" : "USD",
          keyIssues: [
            "핵심 사업 부문의 수요가 안정적으로 유지됐습니다.",
            "최근 관련 뉴스가 투자 심리 개선 요인으로 작용했습니다.",
          ],
          price: assistant.config.market === "KR" ? 84500 : 192.35,
          relatedNews: [
            {
              publishedAt: now,
              sentiment: "positive",
              sourceName: "데모 마켓 브리프",
              sourceUrl: "https://example.com/demo/stocks/first-symbol",
              summary:
                "공개 데이터 기준으로 수요와 실적 기대가 함께 언급되고 있습니다.",
              title: `${firstSymbol} 관련 최근 이슈 요약`,
            },
          ],
          summary:
            "가격 흐름과 관련 뉴스가 함께 우호적으로 해석되는 구간입니다.",
          symbol: firstSymbol,
        },
        {
          change: -1.1,
          changePercent: -0.58,
          currency: assistant.config.market === "KR" ? "KRW" : "USD",
          keyIssues: [
            "단기 변동성은 있었지만 관련 뉴스 흐름은 여전히 확인할 가치가 있습니다.",
          ],
          price: assistant.config.market === "KR" ? 71200 : 168.1,
          relatedNews: [
            {
              publishedAt: now,
              sentiment: "neutral",
              sourceName: "데모 주식 관찰",
              sourceUrl: "https://example.com/demo/stocks/second-symbol",
              summary: "가격 변동 자체보다 배경 이슈를 함께 보는 데 초점을 둡니다.",
              title: `${secondSymbol} 관련 이슈 체크`,
            },
          ],
          summary:
            "단기 조정 구간이지만 사용자 관심 종목 흐름을 추적하기에는 충분한 데이터입니다.",
          symbol: secondSymbol,
        },
      ],
    },
    providerMeta: {
      isMock: true,
      provider: "demo",
      symbolCount: 2,
    },
    status: "success",
    type: "stock",
    userAssistantId: assistant.id,
    userId: assistant.userId,
  };
}

function createDemoBaseballRun(
  assistant: UserAssistant<"baseball">,
): AssistantRun<"baseball"> {
  const now = new Date().toISOString();

  return {
    completedAt: now,
    createdAt: now,
    errorMessage: null,
    id: `demo-run-baseball-${crypto.randomUUID()}`,
    input: {
      assistant: {
        id: assistant.id,
        name: assistant.name,
        type: assistant.type,
      },
      config: assistant.config,
    },
    output: {
      generatedAt: now,
      leagueSummary:
        "상위권 팀들은 시리즈 초반 흐름을 잡는 경기 운영이 눈에 띄었고, 중위권 경쟁도 계속 치열합니다.",
      standings: assistant.config.includeStandings
        ? assistant.config.teams.slice(0, 3).map((team, index) => ({
            rank: index + 1,
            team,
            record: `${26 - index}승 ${14 + index}패`,
            streak: index === 0 ? "2연승" : "1승 1패",
          }))
        : [],
      teamBriefs: assistant.config.teams.slice(0, 3).map((team, index) => ({
        latestResult: `${team}는 최근 경기에서 타선 집중력과 불펜 운영이 함께 주목됐습니다.`,
        keyPlayer: index === 0 ? "중심 타자" : "선발 투수",
        keyStory:
          "초중반 흐름을 잡은 뒤 후반 수비와 투수 운영으로 분위기를 유지한 점이 핵심입니다.",
        nextGame: `${team}의 다음 경기는 내일 18:30 예정입니다.`,
        recentRecord: `최근 5경기 ${3 - (index % 2)}승 ${2 + (index % 2)}패`,
        source: {
          publishedAt: now,
          sourceName: "데모 KBO 와이어",
          sourceUrl: `https://example.com/demo/baseball/${encodeURIComponent(team)}`,
          title: `${team} 최근 경기 흐름 데모 브리핑`,
        },
        team,
      })),
    },
    providerMeta: {
      includeStandings: assistant.config.includeStandings,
      isMock: true,
      provider: "demo",
      teamCount: assistant.config.teams.length,
    },
    status: "success",
    type: "baseball",
    userAssistantId: assistant.id,
    userId: assistant.userId,
  };
}

function createDemoRealEstateRun(
  assistant: UserAssistant<"real_estate">,
): AssistantRun<"real_estate"> {
  const now = new Date().toISOString();

  return {
    completedAt: now,
    createdAt: now,
    errorMessage: null,
    id: `demo-run-real-estate-${crypto.randomUUID()}`,
    input: {
      assistant: {
        id: assistant.id,
        name: assistant.name,
        type: assistant.type,
      },
      config: assistant.config,
    },
    output: {
      generatedAt: now,
      marketSummary:
        "관심 지역은 실거주 선호 입지와 공급 뉴스의 균형을 함께 봐야 하는 흐름으로 정리됩니다.",
      notice: REAL_ESTATE_ASSISTANT_NOTICE,
      regions: assistant.config.regions.flatMap((region) =>
        assistant.config.propertyTypes.slice(0, 2).map((propertyType) => ({
          demandSignal:
            "실거주 문의와 생활 인프라 선호가 함께 언급되는 흐름입니다.",
          keyChanges: [
            "최근 공개 기사 기준 문의 강도와 입지 선호가 함께 언급됩니다.",
            "단기 급등보다 개별 입지 선호 차이가 더 크게 반영됩니다.",
          ],
          priceTrendSummary:
            `${region} ${propertyType} 시장은 보합권에서 선호 입지 중심의 차별화 흐름으로 정리됩니다.`,
          propertyType,
          region,
          source: {
            publishedAt: now,
            sourceName: "데모 주거 관찰",
            sourceUrl: `https://example.com/demo/real-estate/${encodeURIComponent(region)}-${propertyType}`,
            title: `${region} ${propertyType} 데모 브리핑`,
          },
          supplySignal:
            "신규 공급 뉴스보다는 기존 매물 체결 흐름과 재고 변화가 더 자주 거론됩니다.",
        })),
      ),
    },
    providerMeta: {
      isMock: true,
      provider: "demo",
      regionCount: assistant.config.regions.length,
    },
    status: "success",
    type: "real_estate",
    userAssistantId: assistant.id,
    userId: assistant.userId,
  };
}

function createDemoFailedRun(
  assistant: UserAssistant,
  message: string,
): AssistantRun {
  const now = new Date().toISOString();

  return {
    completedAt: now,
    createdAt: now,
    errorMessage: message,
    id: `demo-run-failed-${crypto.randomUUID()}`,
    input: {
      assistant: {
        id: assistant.id,
        name: assistant.name,
        type: assistant.type,
      },
    },
    output: null,
    providerMeta: {
      provider: "demo",
    },
    status: "failed",
    type: assistant.type,
    userAssistantId: assistant.id,
    userId: assistant.userId,
  };
}

function createInitialRuns(assistants: UserAssistant[]) {
  const runsByAssistantId = new Map<string, AssistantRun[]>();

  for (const assistant of assistants) {
    if (assistant.type === "news") {
      const newsAssistant = assistant as UserAssistant<"news">;

      runsByAssistantId.set(assistant.id, [
        createDemoNewsRun(newsAssistant),
        createDemoFailedRun(
          newsAssistant,
          "이전 데모 실행에서는 응답 형식을 검증하지 못했습니다.",
        ),
      ]);
      continue;
    }

    if (assistant.type === "stock") {
      runsByAssistantId.set(assistant.id, [
        createDemoStockRun(assistant as UserAssistant<"stock">),
      ]);
      continue;
    }

    if (assistant.type === "baseball") {
      runsByAssistantId.set(assistant.id, [
        createDemoBaseballRun(assistant as UserAssistant<"baseball">),
      ]);
      continue;
    }

    runsByAssistantId.set(assistant.id, [
      createDemoRealEstateRun(assistant as UserAssistant<"real_estate">),
    ]);
  }

  return runsByAssistantId;
}

function createInitialStore(): DemoStore {
  const templates = cloneValue(fallbackPreviewTemplates);
  const assistants = buildPreviewAssistants(templates);

  return {
    assistants,
    runsByAssistantId: createInitialRuns(assistants),
    templates,
  };
}

function getDemoStore() {
  if (!globalThis.__pixelAgentsDemoStore) {
    globalThis.__pixelAgentsDemoStore = createInitialStore();
  }

  return globalThis.__pixelAgentsDemoStore;
}

export function getDemoUserIdentity() {
  return {
    email: DEMO_USER_EMAIL,
    id: DEMO_USER_ID,
  };
}

export function listDemoAssistantTemplates() {
  return cloneValue(getDemoStore().templates);
}

export function getDemoAssistantTemplateById(templateId: string) {
  const template = getDemoStore().templates.find((item) => item.id === templateId);

  return template ? cloneValue(template) : null;
}

export function listDemoUserAssistants() {
  const assistants = [...getDemoStore().assistants].sort(
    (left, right) => left.sortOrder - right.sortOrder,
  );

  return cloneValue(assistants);
}

export function getDemoUserAssistantById(assistantId: string) {
  const assistant = getDemoStore().assistants.find((item) => item.id === assistantId);

  return assistant ? cloneValue(assistant) : null;
}

export function createDemoUserAssistant(input: {
  config: UserAssistant["config"];
  name: string;
  templateId: string;
  type: UserAssistant["type"];
}) {
  const store = getDemoStore();
  const nextSortOrder =
    store.assistants.reduce(
      (maxOrder, assistant) => Math.max(maxOrder, assistant.sortOrder),
      -1,
    ) + 1;
  const now = new Date().toISOString();
  const assistant: UserAssistant = {
    config: cloneValue(input.config),
    createdAt: now,
    id: `demo-assistant-${crypto.randomUUID()}`,
    name: input.name,
    sortOrder: nextSortOrder,
    templateId: input.templateId,
    type: input.type,
    updatedAt: now,
    userId: DEMO_USER_ID,
  };

  store.assistants.push(assistant);
  store.runsByAssistantId.set(assistant.id, []);

  return cloneValue(assistant);
}

export function updateDemoUserAssistant(input: {
  assistantId: string;
  config: UserAssistant["config"];
  name: string;
}) {
  const store = getDemoStore();
  const index = store.assistants.findIndex((item) => item.id === input.assistantId);

  if (index === -1) {
    return null;
  }

  const current = store.assistants[index];
  const updated: UserAssistant = {
    ...current,
    config: cloneValue(input.config),
    name: input.name,
    updatedAt: new Date().toISOString(),
  };

  store.assistants[index] = updated;

  return cloneValue(updated);
}

export function deleteDemoUserAssistant(assistantId: string) {
  const store = getDemoStore();
  const index = store.assistants.findIndex((item) => item.id === assistantId);

  if (index === -1) {
    return false;
  }

  store.assistants.splice(index, 1);
  store.runsByAssistantId.delete(assistantId);

  return true;
}

export function listDemoAssistantRunsForUserAssistant(
  assistantId: string,
  limit = 10,
) {
  const runs = getDemoStore().runsByAssistantId.get(assistantId) ?? [];

  return cloneValue(runs.slice(0, limit));
}

export function runDemoAssistant(assistantId: string) {
  const store = getDemoStore();
  const assistant = store.assistants.find((item) => item.id === assistantId);

  if (!assistant) {
    return null;
  }

  const run =
    assistant.type === "news"
      ? createDemoNewsRun(assistant as UserAssistant<"news">)
      : assistant.type === "stock"
        ? createDemoStockRun(assistant as UserAssistant<"stock">)
        : assistant.type === "baseball"
          ? createDemoBaseballRun(assistant as UserAssistant<"baseball">)
          : createDemoRealEstateRun(
              assistant as UserAssistant<"real_estate">,
            );
  const existingRuns = store.runsByAssistantId.get(assistant.id) ?? [];

  store.runsByAssistantId.set(assistant.id, [run, ...existingRuns]);

  return cloneValue(run);
}
