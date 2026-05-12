import { z, type ZodTypeAny } from "zod";

import {
  createStructuredAiClient,
  type StructuredAiClient,
} from "./client";
import { AiResponseValidationError } from "./errors";

export type StructuredPromptSection = {
  label: string;
  data: unknown;
};

export type GenerateStructuredOptions<TSchema extends ZodTypeAny> = {
  client?: StructuredAiClient;
  schema: TSchema;
  schemaName: string;
  systemPrompt: string;
  promptSections: StructuredPromptSection[];
  userInstructions?: string;
  model?: string;
  temperature?: number;
};

function formatPromptSections(sections: StructuredPromptSection[]) {
  return sections
    .map(
      (section) =>
        `${section.label}:\n${JSON.stringify(section.data, null, 2)}`,
    )
    .join("\n\n");
}

export async function generateStructured<TSchema extends ZodTypeAny>({
  client = createStructuredAiClient(),
  schema,
  schemaName,
  systemPrompt,
  promptSections,
  userInstructions,
  model,
  temperature,
}: GenerateStructuredOptions<TSchema>): Promise<z.infer<TSchema>> {
  const jsonSchema = z.toJSONSchema(schema);
  const prompt = [
    "Return a single JSON object only.",
    `Use this JSON schema exactly for ${schemaName}:`,
    JSON.stringify(jsonSchema, null, 2),
    userInstructions ?? "Do not add markdown, commentary, or extra keys.",
    formatPromptSections(promptSections),
  ].join("\n\n");

  const result = await client.generateJson({
    model,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature,
  });

  const parsed = schema.safeParse(result.output);

  if (!parsed.success) {
    throw new AiResponseValidationError(
      "AI response did not match the expected schema.",
      parsed.error.message,
    );
  }

  return parsed.data;
}
