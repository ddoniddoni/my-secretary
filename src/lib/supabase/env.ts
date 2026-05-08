import { z } from "zod";

const optionalUrlSchema = z
  .string()
  .trim()
  .url("NEXT_PUBLIC_SITE_URL must be a valid URL.")
  .optional();

const supabaseEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: optionalUrlSchema,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .trim()
    .min(1, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required."),
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .trim()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL."),
});

function normalizeOptionalValue(value: string | undefined) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : undefined;
}

export function hasSupabaseEnv() {
  return Boolean(
    normalizeOptionalValue(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      normalizeOptionalValue(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
  );
}

export function getOptionalSiteUrl() {
  return normalizeOptionalValue(process.env.NEXT_PUBLIC_SITE_URL);
}

export function getSupabaseEnv() {
  const parsed = supabaseEnvSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: getOptionalSiteUrl(),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: normalizeOptionalValue(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    ),
    NEXT_PUBLIC_SUPABASE_URL: normalizeOptionalValue(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    ),
  });

  if (!parsed.success) {
    throw new Error(
      `Supabase environment variables are missing or invalid.\n${parsed.error.message}`,
    );
  }

  return {
    publishableKey: parsed.data.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    siteUrl: parsed.data.NEXT_PUBLIC_SITE_URL,
    url: parsed.data.NEXT_PUBLIC_SUPABASE_URL,
  };
}
