export const DEFAULT_AUTH_REDIRECT_PATH = "/";

const PROTECTED_ROUTE_PREFIXES = ["/assistants", "/dashboard"] as const;

export type AuthErrorCode =
  | "auth_callback_failed"
  | "invalid_email"
  | "magic_link_failed"
  | "missing_code"
  | "supabase_not_configured";

export function isProtectedPath(pathname: string) {
  return PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function getSafeRedirectPath(
  candidate: string | null | undefined,
  fallback = DEFAULT_AUTH_REDIRECT_PATH,
) {
  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) {
    return fallback;
  }

  try {
    const parsed = new URL(candidate, "http://localhost");

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}

export function buildLoginHref(
  nextPath?: string | null,
  errorCode?: AuthErrorCode,
) {
  const searchParams = new URLSearchParams();
  const safeNext = getSafeRedirectPath(nextPath);

  if (safeNext !== DEFAULT_AUTH_REDIRECT_PATH) {
    searchParams.set("next", safeNext);
  }

  if (errorCode) {
    searchParams.set("error", errorCode);
  }

  const query = searchParams.toString();

  return query ? `/?${query}` : "/";
}

export function getAuthErrorMessage(code: string | null | undefined) {
  switch (code) {
    case "auth_callback_failed":
      return "로그인 링크를 확인하지 못했어요. Supabase Redirect URL 설정과 이메일 링크 만료 여부를 확인해주세요.";
    case "invalid_email":
      return "유효한 이메일 주소를 입력해주세요.";
    case "magic_link_failed":
      return "로그인 링크를 보내지 못했어요. 잠시 후 다시 시도해주세요.";
    case "missing_code":
      return "로그인 확인 코드가 없어 세션을 만들지 못했어요. 이메일의 최신 링크로 다시 시도해주세요.";
    case "supabase_not_configured":
      return "Supabase 환경변수가 아직 설정되지 않았어요. `.env.local`에 인증 값을 먼저 채워주세요.";
    default:
      return null;
  }
}
