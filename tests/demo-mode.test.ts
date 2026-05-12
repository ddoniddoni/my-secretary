import { afterEach, describe, expect, it } from "vitest";

import { isDemoModeEnabled } from "../src/lib/demo-mode";

const originalDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE;
const originalSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const originalSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

afterEach(() => {
  process.env.NEXT_PUBLIC_DEMO_MODE = originalDemoMode;
  process.env.NEXT_PUBLIC_SUPABASE_URL = originalSupabaseUrl;
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY =
    originalSupabaseKey;
});

describe("demo mode", () => {
  it("enables demo mode when the env flag is true", () => {
    process.env.NEXT_PUBLIC_DEMO_MODE = "true";

    expect(isDemoModeEnabled()).toBe(true);
  });

  it("stays disabled during tests when no explicit flag is present", () => {
    delete process.env.NEXT_PUBLIC_DEMO_MODE;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    expect(isDemoModeEnabled()).toBe(false);
  });
});
