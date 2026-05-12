import {
  AssistantExecutionNotFoundError,
  AssistantExecutionRunError,
  AssistantExecutionTemplateError,
  executeAssistantRun,
  getAssistantExecutionErrorMessage,
} from "@/lib/assistants/execution";
import { AssistantRepositoryError } from "@/lib/assistants/repository";
import { getRouteAuthContext } from "@/lib/supabase/server";
import { dataResponse, errorResponse } from "@/lib/utils/api-response";

type RouteContext = {
  params: Promise<{
    assistantId: string;
  }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const authContext = await getRouteAuthContext();

  if ("error" in authContext) {
    return errorResponse(authContext.error, authContext.status);
  }

  const { assistantId } = await context.params;

  try {
    const { run } = await executeAssistantRun(authContext.supabase, {
      assistantId,
      userId: authContext.user.id,
    });

    return dataResponse({ run }, { status: 201 });
  } catch (error) {
    if (error instanceof AssistantExecutionNotFoundError) {
      return errorResponse(error.message, 404);
    }

    if (error instanceof AssistantExecutionTemplateError) {
      return errorResponse(error.message, 500);
    }

    if (error instanceof AssistantExecutionRunError) {
      console.error("Assistant execution failed", error.cause);

      return errorResponse(error.message, 500);
    }

    if (error instanceof AssistantRepositoryError) {
      console.error("Failed to persist assistant execution", error);

      return errorResponse("비서 실행 기록을 저장하지 못했습니다.", 500);
    }

    console.error("Unexpected assistant execution error", error);

    return errorResponse(getAssistantExecutionErrorMessage(error), 500);
  }
}
