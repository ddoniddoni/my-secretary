import { ZodError } from "zod";

import { updateAssistantRequestSchema, parseAssistantConfig } from "@/lib/assistants/config";
import {
  deleteUserAssistant,
  getAssistantTemplateById,
  getUserAssistantById,
  listAssistantRunsForUserAssistant,
  updateUserAssistant,
} from "@/lib/assistants/repository";
import { getRouteAuthContext } from "@/lib/supabase/server";
import { dataResponse, errorResponse } from "@/lib/utils/api-response";

type RouteContext = {
  params: Promise<{
    assistantId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const authContext = await getRouteAuthContext();

  if ("error" in authContext) {
    return errorResponse(authContext.error, authContext.status);
  }

  const { assistantId } = await context.params;

  try {
    const assistant = await getUserAssistantById(
      authContext.supabase,
      authContext.user.id,
      assistantId,
    );

    if (!assistant) {
      return errorResponse("비서를 찾을 수 없습니다.", 404);
    }

    const [template, runs] = await Promise.all([
      getAssistantTemplateById(authContext.supabase, assistant.templateId, {
        includeInactive: true,
      }),
      listAssistantRunsForUserAssistant(
        authContext.supabase,
        authContext.user.id,
        assistant.id,
        10,
      ),
    ]);

    return dataResponse({
      assistant,
      template,
      latestRun: runs[0] ?? null,
      runs,
    });
  } catch (error) {
    console.error("Failed to load assistant detail", error);

    return errorResponse("비서 정보를 불러오지 못했습니다.", 500);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const authContext = await getRouteAuthContext();

  if ("error" in authContext) {
    return errorResponse(authContext.error, authContext.status);
  }

  const { assistantId } = await context.params;
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return errorResponse("요청 본문을 읽지 못했습니다.", 400);
  }

  const parsed = updateAssistantRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.", 400);
  }

  try {
    const existingAssistant = await getUserAssistantById(
      authContext.supabase,
      authContext.user.id,
      assistantId,
    );

    if (!existingAssistant) {
      return errorResponse("비서를 찾을 수 없습니다.", 404);
    }

    const config = parseAssistantConfig(existingAssistant.type, parsed.data.config);
    const assistant = await updateUserAssistant(authContext.supabase, {
      userId: authContext.user.id,
      assistantId,
      name: parsed.data.name,
      config,
    });

    if (!assistant) {
      return errorResponse("비서를 찾을 수 없습니다.", 404);
    }

    return dataResponse({ assistant });
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse(
        error.issues[0]?.message ?? "입력값이 올바르지 않습니다.",
        400,
      );
    }

    console.error("Failed to update assistant", error);

    return errorResponse("비서 설정을 저장하지 못했습니다.", 500);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const authContext = await getRouteAuthContext();

  if ("error" in authContext) {
    return errorResponse(authContext.error, authContext.status);
  }

  const { assistantId } = await context.params;

  try {
    const deleted = await deleteUserAssistant(
      authContext.supabase,
      authContext.user.id,
      assistantId,
    );

    if (!deleted) {
      return errorResponse("비서를 찾을 수 없습니다.", 404);
    }

    return dataResponse({ deleted: true });
  } catch (error) {
    console.error("Failed to delete assistant", error);

    return errorResponse("비서를 삭제하지 못했습니다.", 500);
  }
}
