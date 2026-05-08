import { ZodError } from "zod";

import { parseAssistantConfig, createAssistantRequestSchema } from "@/lib/assistants/config";
import {
  createUserAssistant,
  getAssistantTemplateById,
  getNextAssistantSortOrder,
  listUserAssistants,
} from "@/lib/assistants/repository";
import { getRouteAuthContext } from "@/lib/supabase/server";
import { dataResponse, errorResponse } from "@/lib/utils/api-response";

export async function GET() {
  const authContext = await getRouteAuthContext();

  if ("error" in authContext) {
    return errorResponse(authContext.error, authContext.status);
  }

  try {
    const assistants = await listUserAssistants(
      authContext.supabase,
      authContext.user.id,
    );

    return dataResponse({ assistants });
  } catch (error) {
    console.error("Failed to load user assistants", error);

    return errorResponse("내 비서 목록을 불러오지 못했습니다.", 500);
  }
}

export async function POST(request: Request) {
  const authContext = await getRouteAuthContext();

  if ("error" in authContext) {
    return errorResponse(authContext.error, authContext.status);
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return errorResponse("요청 본문을 읽지 못했습니다.", 400);
  }

  const parsed = createAssistantRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.", 400);
  }

  try {
    const template = await getAssistantTemplateById(
      authContext.supabase,
      parsed.data.templateId,
    );

    if (!template) {
      return errorResponse("선택한 비서 템플릿을 찾을 수 없습니다.", 404);
    }

    const config = parseAssistantConfig(template.type, parsed.data.config);
    const sortOrder = await getNextAssistantSortOrder(
      authContext.supabase,
      authContext.user.id,
    );
    const assistant = await createUserAssistant(authContext.supabase, {
      userId: authContext.user.id,
      templateId: template.id,
      type: template.type,
      name: parsed.data.name,
      config,
      sortOrder,
    });

    return dataResponse({ assistant }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse(
        error.issues[0]?.message ?? "입력값이 올바르지 않습니다.",
        400,
      );
    }

    console.error("Failed to create assistant", error);

    return errorResponse("비서를 추가하지 못했습니다.", 500);
  }
}
