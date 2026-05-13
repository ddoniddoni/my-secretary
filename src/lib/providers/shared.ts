import { z } from "zod";

function normalizeOptionalValue(value: string | undefined) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : undefined;
}

export function getProviderSelection(
  envValue: string | undefined,
  fallback: string,
) {
  return normalizeOptionalValue(envValue) ?? fallback;
}

export function getRequiredProviderEnv(
  value: string | undefined,
  envName: string,
  providerName: string,
) {
  const normalized = normalizeOptionalValue(value);

  if (!normalized) {
    throw new Error(
      `${envName} is required when ${providerName} is enabled.`,
    );
  }

  return normalized;
}

export async function fetchProviderJson<TSchema extends z.ZodType>(
  url: URL,
  schema: TSchema,
  options: {
    errorContext: string;
    headers?: HeadersInit;
  },
): Promise<z.infer<TSchema>> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
    next: {
      revalidate: 300,
    },
  });
  const bodyText = await response.text();
  let parsedJson: unknown = null;

  if (bodyText) {
    try {
      parsedJson = JSON.parse(bodyText);
    } catch {
      throw new Error(`${options.errorContext} returned invalid JSON.`);
    }
  }

  if (!response.ok) {
    const detail = extractProviderError(parsedJson);

    throw new Error(
      detail
        ? `${options.errorContext} failed: ${detail}`
        : `${options.errorContext} failed with status ${response.status}.`,
    );
  }

  const parsed = schema.safeParse(parsedJson);

  if (!parsed.success) {
    throw new Error(
      `${options.errorContext} returned an unexpected response shape.`,
    );
  }

  return parsed.data;
}

function extractProviderError(body: unknown) {
  if (!body || typeof body !== "object") {
    return null;
  }

  const record = body as Record<string, unknown>;

  const errorLikeKeys = [
    "message",
    "code",
    "error",
    "Information",
    "Note",
    "Error Message",
  ] as const;

  for (const key of errorLikeKeys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

export function coerceFiniteNumber(value: string | number | undefined | null) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.replace(/[%,$\s]/g, "");
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}
