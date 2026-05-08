import { describe, expect, it } from "vitest";

import {
  DEFAULT_AUTH_REDIRECT_PATH,
  buildLoginHref,
  getAuthErrorMessage,
  getSafeRedirectPath,
  isProtectedPath,
} from "../src/lib/supabase/auth";

describe("supabase auth helpers", () => {
  it("keeps safe local redirect paths", () => {
    expect(getSafeRedirectPath("/assistants/demo?tab=history")).toBe(
      "/assistants/demo?tab=history",
    );
  });

  it("falls back for unsafe redirect paths", () => {
    expect(getSafeRedirectPath("https://evil.example/steal")).toBe(
      DEFAULT_AUTH_REDIRECT_PATH,
    );
    expect(getSafeRedirectPath("//evil.example/steal")).toBe(
      DEFAULT_AUTH_REDIRECT_PATH,
    );
  });

  it("builds login links with optional next paths and errors", () => {
    expect(buildLoginHref("/assistants/demo", "missing_code")).toBe(
      "/login?next=%2Fassistants%2Fdemo&error=missing_code",
    );
    expect(buildLoginHref(DEFAULT_AUTH_REDIRECT_PATH)).toBe("/login");
  });

  it("detects protected paths", () => {
    expect(isProtectedPath("/dashboard")).toBe(true);
    expect(isProtectedPath("/assistants/demo")).toBe(true);
    expect(isProtectedPath("/login")).toBe(false);
  });

  it("returns readable auth error messages", () => {
    expect(getAuthErrorMessage("missing_code")).toContain("코드");
    expect(getAuthErrorMessage("unknown")).toBeNull();
  });
});
