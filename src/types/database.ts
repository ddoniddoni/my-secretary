import type { AssistantRunStatus, AssistantType } from "@/types/assistants";

export type JsonPrimitive = boolean | null | number | string;

export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

export type JsonObject = {
  [key: string]: JsonValue | undefined;
};

export type AssistantTemplateRow = {
  id: string;
  type: AssistantType;
  name: string;
  description: string;
  avatar_key: string;
  system_prompt: string;
  default_config: JsonObject;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type UserAssistantRow = {
  id: string;
  user_id: string;
  template_id: string;
  type: AssistantType;
  name: string;
  config: JsonObject;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type AssistantRunRow = {
  id: string;
  user_id: string;
  user_assistant_id: string;
  type: AssistantType;
  status: AssistantRunStatus;
  input: JsonObject;
  output: JsonObject | null;
  error_message: string | null;
  provider_meta: JsonObject;
  created_at: string;
  completed_at: string | null;
};

export type AssistantSourceRow = {
  id: string;
  run_id: string;
  user_id: string;
  type: AssistantType;
  title: string;
  source_name: string | null;
  source_url: string | null;
  published_at: string | null;
  created_at: string;
};
