import type { SupabaseClient } from "@supabase/supabase-js";

import { parseAssistantConfig } from "@/lib/assistants/config";
import {
  mapAssistantRunRow,
  mapAssistantTemplateRow,
  mapUserAssistantRow,
} from "@/lib/supabase/mappers";
import type {
  AssistantRun,
  AssistantTemplate,
  UserAssistant,
} from "@/types/assistants";
import type {
  AssistantRunRow,
  AssistantTemplateRow,
  UserAssistantRow,
} from "@/types/database";

export class AssistantRepositoryError extends Error {}

function assertQueryResult<T>(
  data: T,
  error: { message: string } | null,
  message: string,
) {
  if (error) {
    throw new AssistantRepositoryError(message);
  }

  return data;
}

export async function listAssistantTemplates(
  supabase: SupabaseClient,
): Promise<AssistantTemplate[]> {
  const { data, error } = await supabase
    .from("assistant_templates")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  return assertQueryResult(
    (data ?? []) as AssistantTemplateRow[],
    error,
    "비서 템플릿을 불러오지 못했습니다.",
  ).map((row) => {
    const mapped = mapAssistantTemplateRow(row);

    return {
      ...mapped,
      defaultConfig: parseAssistantConfig(mapped.type, mapped.defaultConfig),
    };
  });
}

export async function getAssistantTemplateById(
  supabase: SupabaseClient,
  templateId: string,
): Promise<AssistantTemplate | null> {
  const { data, error } = await supabase
    .from("assistant_templates")
    .select("*")
    .eq("id", templateId)
    .eq("is_active", true)
    .maybeSingle();

  const row = assertQueryResult(
    data as AssistantTemplateRow | null,
    error,
    "비서 템플릿을 불러오지 못했습니다.",
  );

  if (!row) {
    return null;
  }

  const mapped = mapAssistantTemplateRow(row);

  return {
    ...mapped,
    defaultConfig: parseAssistantConfig(mapped.type, mapped.defaultConfig),
  };
}

export async function listUserAssistants(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserAssistant[]> {
  const { data, error } = await supabase
    .from("user_assistants")
    .select("*")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return assertQueryResult(
    (data ?? []) as UserAssistantRow[],
    error,
    "내 비서 목록을 불러오지 못했습니다.",
  ).map((row) => {
    const mapped = mapUserAssistantRow(row);

    return {
      ...mapped,
      config: parseAssistantConfig(mapped.type, mapped.config),
    };
  });
}

export async function getUserAssistantById(
  supabase: SupabaseClient,
  userId: string,
  assistantId: string,
): Promise<UserAssistant | null> {
  const { data, error } = await supabase
    .from("user_assistants")
    .select("*")
    .eq("id", assistantId)
    .eq("user_id", userId)
    .maybeSingle();

  const row = assertQueryResult(
    data as UserAssistantRow | null,
    error,
    "비서 정보를 불러오지 못했습니다.",
  );

  if (!row) {
    return null;
  }

  const mapped = mapUserAssistantRow(row);

  return {
    ...mapped,
    config: parseAssistantConfig(mapped.type, mapped.config),
  };
}

export async function getNextAssistantSortOrder(
  supabase: SupabaseClient,
  userId: string,
) {
  const { data, error } = await supabase
    .from("user_assistants")
    .select("sort_order")
    .eq("user_id", userId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const row = assertQueryResult(
    data as { sort_order: number } | null,
    error,
    "비서 정렬 순서를 계산하지 못했습니다.",
  );

  return row ? row.sort_order + 1 : 0;
}

export async function createUserAssistant(
  supabase: SupabaseClient,
  input: {
    userId: string;
    templateId: string;
    type: UserAssistant["type"];
    name: string;
    config: UserAssistant["config"];
    sortOrder: number;
  },
) {
  const { data, error } = await supabase
    .from("user_assistants")
    .insert({
      user_id: input.userId,
      template_id: input.templateId,
      type: input.type,
      name: input.name,
      config: input.config,
      sort_order: input.sortOrder,
    })
    .select("*")
    .single();

  const row = assertQueryResult(
    data as UserAssistantRow | null,
    error,
    "비서를 추가하지 못했습니다.",
  );

  if (!row) {
    throw new AssistantRepositoryError("비서를 추가하지 못했습니다.");
  }

  const mapped = mapUserAssistantRow(row);

  return {
    ...mapped,
    config: parseAssistantConfig(mapped.type, mapped.config),
  };
}

export async function updateUserAssistant(
  supabase: SupabaseClient,
  input: {
    userId: string;
    assistantId: string;
    name: string;
    config: UserAssistant["config"];
  },
) {
  const { data, error } = await supabase
    .from("user_assistants")
    .update({
      name: input.name,
      config: input.config,
    })
    .eq("id", input.assistantId)
    .eq("user_id", input.userId)
    .select("*")
    .maybeSingle();

  const row = assertQueryResult(
    data as UserAssistantRow | null,
    error,
    "비서 설정을 저장하지 못했습니다.",
  );

  if (!row) {
    return null;
  }

  const mapped = mapUserAssistantRow(row);

  return {
    ...mapped,
    config: parseAssistantConfig(mapped.type, mapped.config),
  };
}

export async function deleteUserAssistant(
  supabase: SupabaseClient,
  userId: string,
  assistantId: string,
) {
  const { data, error } = await supabase
    .from("user_assistants")
    .delete()
    .eq("id", assistantId)
    .eq("user_id", userId)
    .select("id")
    .maybeSingle();

  const row = assertQueryResult(
    data as { id: string } | null,
    error,
    "비서를 삭제하지 못했습니다.",
  );

  return Boolean(row);
}

export async function listAssistantRunsForUserAssistant(
  supabase: SupabaseClient,
  userId: string,
  assistantId: string,
  limit = 10,
): Promise<AssistantRun[]> {
  const { data, error } = await supabase
    .from("assistant_runs")
    .select("*")
    .eq("user_id", userId)
    .eq("user_assistant_id", assistantId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return assertQueryResult(
    (data ?? []) as AssistantRunRow[],
    error,
    "실행 기록을 불러오지 못했습니다.",
  ).map(mapAssistantRunRow);
}
