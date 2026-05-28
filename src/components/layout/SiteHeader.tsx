import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { signOutAction } from "@/lib/supabase/actions";
import { getCurrentUser } from "@/lib/supabase/server";

const navItems = [
  { href: "#assistant-preview", label: "비서 미리보기" },
  { href: "#why", label: "작동 원리" },
  { href: "/dashboard", label: "대시보드" },
];

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-20">
      <Container className="pt-5">
        <div className="surface-panel flex items-center justify-between rounded-full border px-4 py-3 sm:px-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-foreground)] text-xs font-semibold text-white">
              MS
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--color-muted)]">
                My SECRETARY
              </p>
              <p className="text-sm font-medium text-[var(--color-foreground)]">
                읽기 쉬운 브리핑용 인공지능 비서
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-[var(--color-muted)] md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-[var(--color-foreground)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {user ? (
            <div className="flex items-center gap-3">
              <p className="hidden rounded-full border border-[var(--color-stroke)] bg-white px-3 py-2 text-xs text-[var(--color-muted)] lg:block">
                {user.email ?? "로그인됨"}
              </p>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--color-foreground)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#342011]"
                >
                  로그아웃
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-foreground)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#342011]"
            >
              로그인
            </Link>
          )}
        </div>
      </Container>
    </header>
  );
}
