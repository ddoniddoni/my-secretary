import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { AiResponseValidationError } from "../src/lib/ai/errors";
import {
  AssistantExecutionNotFoundError,
  AssistantExecutionRunError,
  executeAssistantRun,
} from "../src/lib/assistants/execution";
import type {
  AssistantRun,
  AssistantTemplate,
  UserAssistant,
} from "../src/types/assistants";

const repositoryMocks = vi.hoisted(() => ({
  createAssistantRun: vi.fn(),
  createAssistantSources: vi.fn(),
  deleteAssistantSourcesForRun: vi.fn(),
  getAssistantTemplateById: vi.fn(),
  getUserAssistantById: vi.fn(),
  updateAssistantRun: vi.fn(),
}));

const runnerMocks = vi.hoisted(() => ({
  runAssistant: vi.fn(),
}));

vi.mock("@/lib/assistants/repository", () => repositoryMocks);
vi.mock("@/lib/assistants/runner", () => runnerMocks);

function createAssistant(): UserAssistant<"news"> {
  return {
    config: {
      categories: ["IT"],
      language: "ko",
      maxItems: 5,
      summaryStyle: "brief",
    },
    createdAt: "2026-05-13T00:00:00.000Z",
    id: "assistant-1",
    name: "Morning News",
    sortOrder: 0,
    templateId: "template-1",
    type: "news",
    updatedAt: "2026-05-13T00:00:00.000Z",
    userId: "user-1",
  };
}

function createTemplate(): AssistantTemplate<"news"> {
  return {
    avatarKey: "pixel-reporter",
    createdAt: "2026-05-13T00:00:00.000Z",
    defaultConfig: {
      categories: ["IT"],
      language: "ko",
      maxItems: 5,
      summaryStyle: "brief",
    },
    description: "News template",
    id: "template-1",
    isActive: false,
    name: "News template",
    systemPrompt: "You are a news assistant.",
    type: "news",
    updatedAt: "2026-05-13T00:00:00.000Z",
  };
}

function createPendingRun(): AssistantRun<"news"> {
  return {
    completedAt: null,
    createdAt: "2026-05-13T00:01:00.000Z",
    errorMessage: null,
    id: "run-1",
    input: {},
    output: null,
    providerMeta: {},
    status: "pending",
    type: "news",
    userAssistantId: "assistant-1",
    userId: "user-1",
  };
}

function createSuccessRun(): AssistantRun<"news"> {
  return {
    ...createPendingRun(),
    completedAt: "2026-05-13T00:02:00.000Z",
    input: {
      assistant: {
        id: "assistant-1",
        name: "Morning News",
        type: "news",
      },
    },
    output: {
      generatedAt: "2026-05-13T00:02:00.000Z",
      highlights: [
        {
          category: "IT",
          source: {
            publishedAt: "2026-05-12T23:55:00.000Z",
            sourceName: "Seoul Tech Wire",
            sourceUrl: "https://example.com/news/ai-demand",
            title: "AI demand stays resilient",
          },
          summary: "Demand stayed resilient.",
          title: "AI demand stays resilient",
          whyItMatters: "It supports infrastructure spending.",
        },
      ],
      overallSummary: "Technology headlines were constructive.",
    },
    providerMeta: {
      itemCount: 1,
      provider: "mock",
    },
    status: "success",
  };
}

function createFailedRun(): AssistantRun<"news"> {
  return {
    ...createPendingRun(),
    completedAt: "2026-05-13T00:02:00.000Z",
    errorMessage: "AI 응답 형식을 검증하지 못했습니다.",
    providerMeta: {},
    status: "failed",
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("executeAssistantRun", () => {
  it("creates a pending run, stores sources, and finalizes success", async () => {
    const assistant = createAssistant();
    const template = createTemplate();
    const pendingRun = createPendingRun();
    const successRun = createSuccessRun();
    const executionResult = {
      input: {
        assistant: {
          id: assistant.id,
          name: assistant.name,
          type: assistant.type,
        },
        config: assistant.config,
        templateId: template.id,
      },
      output: successRun.output!,
      providerMeta: {
        itemCount: 1,
        provider: "mock",
      },
      sources: [
        {
          publishedAt: "2026-05-12T23:55:00.000Z",
          sourceName: "Seoul Tech Wire",
          sourceUrl: "https://example.com/news/ai-demand",
          title: "AI demand stays resilient",
        },
      ],
      type: "news" as const,
    };

    repositoryMocks.getUserAssistantById.mockResolvedValue(assistant);
    repositoryMocks.getAssistantTemplateById.mockResolvedValue(template);
    repositoryMocks.createAssistantRun.mockResolvedValue(pendingRun);
    runnerMocks.runAssistant.mockResolvedValue(executionResult);
    repositoryMocks.createAssistantSources.mockResolvedValue([]);
    repositoryMocks.updateAssistantRun.mockResolvedValue(successRun);

    const result = await executeAssistantRun({} as never, {
      assistantId: assistant.id,
      userId: assistant.userId,
    });

    expect(repositoryMocks.getAssistantTemplateById).toHaveBeenCalledWith(
      expect.anything(),
      template.id,
      { includeInactive: true },
    );
    expect(repositoryMocks.createAssistantRun).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        assistantId: assistant.id,
        status: "pending",
        type: "news",
        userId: assistant.userId,
      }),
    );
    expect(repositoryMocks.createAssistantSources).toHaveBeenCalledWith(
      expect.anything(),
      {
        runId: pendingRun.id,
        sources: executionResult.sources,
        type: "news",
        userId: assistant.userId,
      },
    );
    expect(repositoryMocks.updateAssistantRun).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        output: executionResult.output,
        providerMeta: executionResult.providerMeta,
        runId: pendingRun.id,
        status: "success",
      }),
    );
    expect(result.run.status).toBe("success");
  });

  it("marks the run failed with a safe message when the runner throws", async () => {
    const assistant = createAssistant();
    const template = createTemplate();
    const pendingRun = createPendingRun();
    const failedRun = createFailedRun();

    repositoryMocks.getUserAssistantById.mockResolvedValue(assistant);
    repositoryMocks.getAssistantTemplateById.mockResolvedValue(template);
    repositoryMocks.createAssistantRun.mockResolvedValue(pendingRun);
    runnerMocks.runAssistant.mockRejectedValue(
      new AiResponseValidationError("Invalid output"),
    );
    repositoryMocks.updateAssistantRun.mockResolvedValue(failedRun);

    await expect(
      executeAssistantRun({} as never, {
        assistantId: assistant.id,
        userId: assistant.userId,
      }),
    ).rejects.toMatchObject({
      message: "AI 응답 형식을 검증하지 못했습니다.",
      name: "AssistantExecutionRunError",
    });

    expect(repositoryMocks.createAssistantSources).not.toHaveBeenCalled();
    expect(repositoryMocks.updateAssistantRun).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        errorMessage: "AI 응답 형식을 검증하지 못했습니다.",
        runId: pendingRun.id,
        status: "failed",
      }),
    );
  });

  it("rejects with not found when the user does not own the assistant", async () => {
    repositoryMocks.getUserAssistantById.mockResolvedValue(null);

    await expect(
      executeAssistantRun({} as never, {
        assistantId: "assistant-1",
        userId: "user-1",
      }),
    ).rejects.toBeInstanceOf(AssistantExecutionNotFoundError);

    expect(repositoryMocks.createAssistantRun).not.toHaveBeenCalled();
  });

  it("cleans up sources and records failure if completion fails after insertion", async () => {
    const assistant = createAssistant();
    const template = createTemplate();
    const pendingRun = createPendingRun();
    const failedRun = createFailedRun();
    const executionResult = {
      input: {
        assistant: {
          id: assistant.id,
          name: assistant.name,
          type: assistant.type,
        },
      },
      output: {
        generatedAt: "2026-05-13T00:02:00.000Z",
        highlights: [
          {
            category: "IT",
            source: {
              publishedAt: "2026-05-12T23:55:00.000Z",
              sourceName: "Seoul Tech Wire",
              sourceUrl: "https://example.com/news/ai-demand",
              title: "AI demand stays resilient",
            },
            summary: "Demand stayed resilient.",
            title: "AI demand stays resilient",
            whyItMatters: "It supports infrastructure spending.",
          },
        ],
        overallSummary: "Technology headlines were constructive.",
      },
      providerMeta: {
        itemCount: 1,
        provider: "mock",
      },
      sources: [
        {
          publishedAt: "2026-05-12T23:55:00.000Z",
          sourceName: "Seoul Tech Wire",
          sourceUrl: "https://example.com/news/ai-demand",
          title: "AI demand stays resilient",
        },
      ],
      type: "news" as const,
    };

    repositoryMocks.getUserAssistantById.mockResolvedValue(assistant);
    repositoryMocks.getAssistantTemplateById.mockResolvedValue(template);
    repositoryMocks.createAssistantRun.mockResolvedValue(pendingRun);
    runnerMocks.runAssistant.mockResolvedValue(executionResult);
    repositoryMocks.createAssistantSources.mockResolvedValue([]);
    repositoryMocks.updateAssistantRun
      .mockRejectedValueOnce(new Error("failed to save success"))
      .mockResolvedValueOnce(failedRun);

    await expect(
      executeAssistantRun({} as never, {
        assistantId: assistant.id,
        userId: assistant.userId,
      }),
    ).rejects.toBeInstanceOf(AssistantExecutionRunError);

    expect(repositoryMocks.deleteAssistantSourcesForRun).toHaveBeenCalledWith(
      expect.anything(),
      {
        runId: pendingRun.id,
        userId: assistant.userId,
      },
    );
    expect(repositoryMocks.updateAssistantRun).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({
        errorMessage: "비서 실행에 실패했습니다.",
        status: "failed",
      }),
    );
  });
});
