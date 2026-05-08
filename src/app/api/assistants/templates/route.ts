import { listAssistantTemplates } from "@/lib/assistants/repository";
import { errorResponse, dataResponse } from "@/lib/utils/api-response";
import { getRouteAuthContext } from "@/lib/supabase/server";

export async function GET() {
  const authContext = await getRouteAuthContext();

  if ("error" in authContext) {
    return errorResponse(authContext.error, authContext.status);
  }

  try {
    const templates = await listAssistantTemplates(authContext.supabase);

    return dataResponse({ templates });
  } catch (error) {
    console.error("Failed to load assistant templates", error);

    return errorResponse("비서 템플릿을 불러오지 못했습니다.", 500);
  }
}
