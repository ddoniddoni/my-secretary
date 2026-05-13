import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import {
  AiConfigurationError,
  AiRequestError,
  AiResponseValidationError,
} from "@/lib/ai/errors";
import {
  createAssistantRun,
  createAssistantSources,
  deleteAssistantSourcesForRun,
  getAssistantTemplateById,
  getUserAssistantById,
  updateAssistantRun,
} from "@/lib/assistants/repository";
import {
  runAssistant,
  type AssistantExecutionResult,
} from "@/lib/assistants/runner";
import type { AssistantRun, AssistantTemplate, UserAssistant } from "@/types/assistants";
import type { JsonObject } from "@/types/database";

export class AssistantExecutionNotFoundError extends Error {
  constructor(message = "비서를 찾을 수 없습니다.") {
    super(message);
    this.name = "AssistantExecutionNotFoundError";
  }
}

export class AssistantExecutionTemplateError extends Error {
  constructor(message = "비서 템플릿을 불러오지 못했습니다.") {
    super(message);
    this.name = "AssistantExecutionTemplateError";
  }
}

export class AssistantExecutionRunError extends Error {
  cause: unknown;
  run: AssistantRun | null;

  constructor(message: string, cause: unknown, run: AssistantRun | null = null) {
    super(message);
    this.name = "AssistantExecutionRunError";
    this.cause = cause;
    this.run = run;
  }
}

type ExecuteAssistantRunDependencies = {
  runAssistant?: (
    assistant: UserAssistant,
    template: AssistantTemplate,
  ) => Promise<AssistantExecutionResult>;
};

type ExecuteAssistantRunResult = {
  assistant: UserAssistant;
  result: AssistantExecutionResult;
  run: AssistantRun;
  template: AssistantTemplate;
};

function toJsonObject(value: object): JsonObject {
  return value as JsonObject;
}

function createPendingRunInput(
  assistant: UserAssistant,
  template: AssistantTemplate,
): JsonObject {
  return {
    assistant: {
      id: assistant.id,
      name: assistant.name,
      type: assistant.type,
    },
    config: assistant.config as JsonObject,
    templateId: template.id,
  } as JsonObject;
}

export function getAssistantExecutionErrorMessage(error: unknown) {
  if (error instanceof AiConfigurationError) {
    return "AI 실행 설정이 올바르지 않습니다.";
  }

  if (error instanceof AiResponseValidationError) {
    return "AI 응답 형식을 검증하지 못했습니다.";
  }

  if (error instanceof AiRequestError) {
    return "AI 브리핑 생성 요청이 실패했습니다.";
  }

  return "비서 실행에 실패했습니다.";
}

export async function executeAssistantRun(
  supabase: SupabaseClient,
  input: {
    assistantId: string;
    userId: string;
  },
  dependencies: ExecuteAssistantRunDependencies = {},
): Promise<ExecuteAssistantRunResult> {
  const assistant = await getUserAssistantById(
    supabase,
    input.userId,
    input.assistantId,
  );

  if (!assistant) {
    throw new AssistantExecutionNotFoundError();
  }

  const template = await getAssistantTemplateById(
    supabase,
    assistant.templateId,
    {
      includeInactive: true,
    },
  );

  if (!template) {
    throw new AssistantExecutionTemplateError();
  }

  const pendingInput = createPendingRunInput(assistant, template);
  const pendingRun = await createAssistantRun(supabase, {
    assistantId: assistant.id,
    input: pendingInput,
    providerMeta: {},
    status: "pending",
    type: assistant.type,
    userId: input.userId,
  });

  let result: AssistantExecutionResult | null = null;
  let failedRun: AssistantRun | null = null;

  try {
    const executionResult = dependencies.runAssistant
      ? await dependencies.runAssistant(assistant, template)
      : assistant.type === "news" && template.type === "news"
        ? await runAssistant(
            assistant as UserAssistant<"news">,
            template as AssistantTemplate<"news">,
          )
        : assistant.type === "stock" && template.type === "stock"
          ? await runAssistant(
            assistant as UserAssistant<"stock">,
            template as AssistantTemplate<"stock">,
          )
          : assistant.type === "baseball" && template.type === "baseball"
            ? await runAssistant(
                assistant as UserAssistant<"baseball">,
                template as AssistantTemplate<"baseball">,
              )
            : await runAssistant(
                assistant as UserAssistant<"real_estate">,
                template as AssistantTemplate<"real_estate">,
              );

    result = executionResult;

    await createAssistantSources(supabase, {
      runId: pendingRun.id,
      sources: executionResult.sources,
      type: assistant.type,
      userId: input.userId,
    });

    const completedRun = await updateAssistantRun(supabase, {
      completedAt: new Date().toISOString(),
      errorMessage: null,
      input: toJsonObject(executionResult.input),
      output: toJsonObject(executionResult.output),
      providerMeta: toJsonObject(executionResult.providerMeta),
      runId: pendingRun.id,
      status: "success",
      userId: input.userId,
    });

    return {
      assistant,
      result: executionResult,
      run: completedRun,
      template,
    };
  } catch (error) {
    if (result) {
      try {
        await deleteAssistantSourcesForRun(supabase, {
          runId: pendingRun.id,
          userId: input.userId,
        });
      } catch (cleanupError) {
        console.error("Failed to cleanup assistant sources after execution error", cleanupError);
      }
    }

    const errorMessage = getAssistantExecutionErrorMessage(error);

    try {
      failedRun = await updateAssistantRun(supabase, {
        completedAt: new Date().toISOString(),
        errorMessage,
        input: result ? toJsonObject(result.input) : pendingInput,
        output: null,
        providerMeta: result ? toJsonObject(result.providerMeta) : {},
        runId: pendingRun.id,
        status: "failed",
        userId: input.userId,
      });
    } catch (persistError) {
      console.error("Failed to persist assistant execution failure", persistError);
    }

    throw new AssistantExecutionRunError(errorMessage, error, failedRun);
  }
}
