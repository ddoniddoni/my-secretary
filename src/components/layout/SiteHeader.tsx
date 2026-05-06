import Link from "next/link";

import { Container } from "@/components/layout/Container";

const navItems = [
  { href: "#assistant-preview", label: "Assistant Preview" },
  { href: "#why", label: "Why It Works" },
  { href: "/dashboard", label: "Dashboard" },
];

export function SiteHeader() {
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
                AI assistants for readable briefings
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

          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-[var(--color-foreground)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#342011]"
          >
            Login
          </Link>
        </div>
      </Container>
    </header>
  );
}
