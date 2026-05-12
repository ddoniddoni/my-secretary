const enabledValues = new Set(["1", "true", "yes", "on"]);

function normalizeValue(value: string | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

export function isDemoModeEnabled() {
  const configuredValue = normalizeValue(process.env.NEXT_PUBLIC_DEMO_MODE);

  if (configuredValue) {
    return enabledValues.has(configuredValue);
  }

  return process.env.NODE_ENV !== "test" &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
}
