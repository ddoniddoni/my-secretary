import type {
  AssistantRun,
  AssistantSource,
  AssistantTemplate,
  UserAssistant,
} from "@/types/assistants";
import type {
  AssistantRunRow,
  AssistantSourceRow,
  AssistantTemplateRow,
  UserAssistantRow,
} from "@/types/database";

export function mapAssistantTemplateRow(
  row: AssistantTemplateRow,
): AssistantTemplate {
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    description: row.description,
    avatarKey: row.avatar_key,
    systemPrompt: row.system_prompt,
    defaultConfig: row.default_config as AssistantTemplate["defaultConfig"],
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapUserAssistantRow(row: UserAssistantRow): UserAssistant {
  return {
    id: row.id,
    userId: row.user_id,
    templateId: row.template_id,
    type: row.type,
    name: row.name,
    config: row.config as UserAssistant["config"],
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapAssistantRunRow(row: AssistantRunRow): AssistantRun {
  return {
    id: row.id,
    userId: row.user_id,
    userAssistantId: row.user_assistant_id,
    type: row.type,
    status: row.status,
    input: row.input,
    output: row.output,
    errorMessage: row.error_message,
    providerMeta: row.provider_meta,
    createdAt: row.created_at,
    completedAt: row.completed_at,
  };
}

export function mapAssistantSourceRow(
  row: AssistantSourceRow,
): AssistantSource {
  return {
    id: row.id,
    runId: row.run_id,
    userId: row.user_id,
    type: row.type,
    title: row.title,
    sourceName: row.source_name,
    sourceUrl: row.source_url,
    publishedAt: row.published_at,
    createdAt: row.created_at,
  };
}
