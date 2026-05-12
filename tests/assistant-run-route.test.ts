import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  AssistantExecutionNotFoundError,
} from "../src/lib/assistants/execution";
import { POST } from "../src/app/api/assistants/[assistantId]/run/route";
import type { AssistantRun } from "../src/types/assistants";

const authMocks = vi.hoisted(() => ({
  getRouteAuthContext: vi.fn(),
}));

const executionMocks = vi.hoisted(() => ({
  executeAssistantRun: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => authMocks);
vi.mock("@/lib/assistants/execution", async () => {
  const actual = await vi.importActual<
    typeof import("../src/lib/assistants/execution")
  >("../src/lib/assistants/execution");

  return {
    ...actual,
    executeAssistantRun: executionMocks.executeAssistantRun,
  };
});

function createRun(status: AssistantRun["status"]): AssistantRun<"news"> {
  return {
    completedAt:
      status === "pending" ? null : "2026-05-13T00:02:00.000Z",
    createdAt: "2026-05-13T00:01:00.000Z",
    errorMessage: status === "failed" ? "비서 실행에 실패했습니다." : null,
    id: "run-1",
    input: {},
    output:
      status === "success"
        ? {
            generatedAt: "2026-05-13T00:02:00.000Z",
          }
        : null,
    providerMeta: {},
    status,
    type: "news",
    userAssistantId: "assistant-1",
    userId: "user-1",
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/assistants/[assistantId]/run", () => {
  it("returns 201 with the stored run on success", async () => {
    authMocks.getRouteAuthContext.mockResolvedValue({
      supabase: {},
      user: {
        id: "user-1",
      },
    });
    executionMocks.executeAssistantRun.mockResolvedValue({
      assistant: {
        id: "assistant-1",
      },
      result: {
        type: "news",
      },
      run: createRun("success"),
      template: {
        id: "template-1",
      },
    });

    const response = await POST(new Request("http://localhost/api/run"), {
      params: Promise.resolve({
        assistantId: "assistant-1",
      }),
    });

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      data: {
        run: createRun("success"),
      },
    });
    expect(executionMocks.executeAssistantRun).toHaveBeenCalledWith(
      {},
      {
        assistantId: "assistant-1",
        userId: "user-1",
      },
    );
  });

  it("returns the auth error when the user is not logged in", async () => {
    authMocks.getRouteAuthContext.mockResolvedValue({
      error: "로그인이 필요합니다.",
      status: 401,
    });

    const response = await POST(new Request("http://localhost/api/run"), {
      params: Promise.resolve({
        assistantId: "assistant-1",
      }),
    });

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "로그인이 필요합니다.",
    });
    expect(executionMocks.executeAssistantRun).not.toHaveBeenCalled();
  });

  it("returns 404 when the assistant cannot be found", async () => {
    authMocks.getRouteAuthContext.mockResolvedValue({
      supabase: {},
      user: {
        id: "user-1",
      },
    });
    executionMocks.executeAssistantRun.mockRejectedValue(
      new AssistantExecutionNotFoundError(),
    );

    const response = await POST(new Request("http://localhost/api/run"), {
      params: Promise.resolve({
        assistantId: "assistant-1",
      }),
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "비서를 찾을 수 없습니다.",
    });
  });
});
