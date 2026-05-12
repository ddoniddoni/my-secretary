import { z } from "zod";

const optionalUrlSchema = z.string().trim().url().optional();

const aiEnvSchema = z.object({
  OPENAI_API_KEY: z.string().trim().min(1, "OPENAI_API_KEY is required."),
  OPENAI_BASE_URL: optionalUrlSchema,
  OPENAI_MODEL: z.string().trim().min(1, "OPENAI_MODEL is required."),
});

function normalizeOptionalValue(value: string | undefined) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : undefined;
}

export function hasAiEnv() {
  return Boolean(
    normalizeOptionalValue(process.env.OPENAI_API_KEY) &&
      normalizeOptionalValue(process.env.OPENAI_MODEL),
  );
}

export function getAiEnv() {
  const parsed = aiEnvSchema.safeParse({
    OPENAI_API_KEY: normalizeOptionalValue(process.env.OPENAI_API_KEY),
    OPENAI_BASE_URL: normalizeOptionalValue(process.env.OPENAI_BASE_URL),
    OPENAI_MODEL: normalizeOptionalValue(process.env.OPENAI_MODEL),
  });

  if (!parsed.success) {
    throw new Error(
      `AI environment variables are missing or invalid.\n${parsed.error.message}`,
    );
  }

  return {
    apiKey: parsed.data.OPENAI_API_KEY,
    baseUrl: parsed.data.OPENAI_BASE_URL ?? "https://api.openai.com/v1",
    model: parsed.data.OPENAI_MODEL,
  };
}
