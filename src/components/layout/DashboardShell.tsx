import Link from "next/link";
import type { ReactNode } from "react";

import { PixelAvatar } from "@/components/assistants/PixelAvatar";
import { signOutAction } from "@/lib/supabase/actions";

type DashboardShellProps = {
  children: ReactNode;
  demoMode?: boolean;
  guestMode?: boolean;
  userEmail: string | null | undefined;
};

type NavItem = {
  href?: string;
  icon: "bot" | "file" | "gear" | "home" | "plug" | "pulse";
  label: string;
  selected?: boolean;
};

const navItems: NavItem[] = [
  { href: "/", icon: "home", label: "Dashboard", selected: true },
  { icon: "bot", label: "Assistants" },
  { icon: "file", label: "Templates" },
  { icon: "pulse", label: "Activity" },
  { icon: "plug", label: "Integrations" },
  { icon: "gear", label: "Settings" },
];

export function DashboardShell({
  children,
  demoMode = false,
  guestMode = false,
  userEmail,
}: DashboardShellProps) {
  const workspaceMode = guestMode
    ? "Guest preview"
    : demoMode
      ? "Demo mode"
      : "Workspace live";

  return (
    <div className="pixel-os-theme min-h-screen bg-[var(--dashboard-bg)] p-2 md:p-3">
      <div className="pixel-window mx-auto flex min-h-[calc(100vh-1rem)] w-full max-w-[1680px] flex-col overflow-hidden">
        <header className="pixel-window-bar">
          <div className="flex items-center justify-between gap-3 px-4 py-3 lg:hidden">
            <div className="flex min-w-0 items-center gap-3">
              <div className="pixel-brand-chip">
                <PixelAvatar variant="helper" size="sm" />
              </div>
              <div className="min-w-0">
                <p className="font-pixel text-[11px] uppercase leading-none text-[var(--dashboard-text)]">
                  AI ASSISTANT OS
                </p>
                <p className="mt-1 text-[11px] text-[var(--dashboard-muted)]">
                  {workspaceMode}
                </p>
              </div>
            </div>

            {!guestMode ? (
              <details className="relative">
                <summary
                  className="pixel-window-control list-none cursor-pointer appearance-none [&::-webkit-details-marker]:hidden"
                  aria-label="Open navigation menu"
                >
                  <MenuIcon />
                </summary>
                <div className="absolute right-0 top-full z-30 mt-3 w-[min(320px,calc(100vw-1.5rem))] overflow-hidden rounded-[18px] border border-[var(--dashboard-border)] bg-[rgba(9,12,22,0.98)] shadow-[0_24px_48px_rgba(0,0,0,0.35)]">
                  <div className="border-b border-[var(--dashboard-divider)] px-4 py-4">
                    <span
                      className={`inline-flex rounded-full border px-3 py-2 font-mono text-xs ${
                        demoMode
                          ? "border-[rgba(161,143,255,0.4)] bg-[rgba(113,100,255,0.14)] text-[#e4ddff]"
                          : "border-[rgba(137,239,116,0.35)] bg-[rgba(137,239,116,0.1)] text-[#d9ffd3]"
                      }`}
                    >
                      {workspaceMode}
                    </span>
                    <div className="mt-4 flex items-center gap-3">
                      <PixelAvatar variant="news" size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[var(--dashboard-text)]">
                          {demoMode
                            ? "Demo User"
                            : userEmail?.split("@")[0] ?? "PixelUser"}
                        </p>
                        <p className="mt-1 font-mono text-xs text-[var(--dashboard-success)]">
                          {demoMode ? "Demo Mode" : "Online"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <nav className="grid gap-1 px-3 py-3" aria-label="Dashboard navigation">
                    {navItems.map((item) =>
                      item.href ? (
                        <Link
                          key={item.label}
                          href={item.href}
                          className={`pixel-nav-item ${item.selected ? "is-active" : ""}`}
                        >
                          <PixelNavIcon name={item.icon} />
                          <span>{item.label}</span>
                        </Link>
                      ) : (
                        <div key={item.label} className="pixel-nav-item is-idle">
                          <PixelNavIcon name={item.icon} />
                          <span>{item.label}</span>
                        </div>
                      ),
                    )}
                  </nav>

                  {!demoMode ? (
                    <form action={signOutAction} className="border-t border-[var(--dashboard-divider)] p-3">
                      <button
                        type="submit"
                        className="pixel-button pixel-button-secondary h-[44px] w-full text-sm"
                      >
                        Logout
                      </button>
                    </form>
                  ) : null}
                </div>
              </details>
            ) : null}
          </div>

          <div className="hidden h-[72px] items-center justify-between px-5 sm:px-7 lg:flex">
            <div className="flex min-w-0 items-center gap-4">
              <div className="pixel-brand-chip">
                <PixelAvatar variant="helper" size="sm" />
              </div>
              <div className="flex min-w-0 items-baseline gap-3">
                <p className="font-pixel text-[12px] uppercase leading-none text-[var(--dashboard-text)]">
                  AI ASSISTANT OS
                </p>
                <p className="font-pixel text-[9px] uppercase text-[var(--dashboard-muted)]">
                  v1.0.0
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`hidden rounded-full border px-3 py-2 font-mono text-xs md:inline-flex ${
                  guestMode
                    ? "border-[rgba(243,194,89,0.35)] bg-[rgba(243,194,89,0.1)] text-[#ffe49d]"
                    : demoMode
                      ? "border-[rgba(161,143,255,0.4)] bg-[rgba(113,100,255,0.14)] text-[#e4ddff]"
                      : "border-[rgba(137,239,116,0.35)] bg-[rgba(137,239,116,0.1)] text-[#d9ffd3]"
                }`}
              >
                {workspaceMode}
              </span>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col lg:flex-row">
          {guestMode ? null : (
            <aside className="pixel-sidebar hidden w-full border-b border-[var(--dashboard-divider)] lg:block lg:w-[270px] lg:border-b-0 lg:border-r">
              <div className="flex h-full flex-col px-6 py-7">
                <div className="flex justify-center py-3">
                  <div className="pixel-sidebar-avatar">
                    <PixelAvatar variant="helper" size="lg" />
                  </div>
                </div>

                <nav className="mt-6 grid gap-3" aria-label="Dashboard navigation">
                  {navItems.map((item) =>
                    item.href ? (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`pixel-nav-item ${item.selected ? "is-active" : ""}`}
                      >
                        <PixelNavIcon name={item.icon} />
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <div key={item.label} className="pixel-nav-item is-idle">
                        <PixelNavIcon name={item.icon} />
                        <span>{item.label}</span>
                      </div>
                    ),
                  )}
                </nav>

                <div className="mt-8 border-t border-[var(--dashboard-divider)] pt-8" />

                <div className="mt-auto rounded-[10px] border border-[var(--dashboard-border-strong)] bg-[rgba(20,24,45,0.92)] p-3 shadow-[0_0_0_2px_rgba(0,0,0,0.35)]">
                  <div className="flex items-center gap-3">
                    <PixelAvatar variant="news" size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[var(--dashboard-text)]">
                        {demoMode
                          ? "Demo User"
                          : userEmail?.split("@")[0] ?? "PixelUser"}
                      </p>
                      <p className="mt-1 font-mono text-xs text-[var(--dashboard-success)]">
                        {demoMode ? "Demo Mode" : "Online"}
                      </p>
                    </div>
                  </div>
                  {demoMode ? (
                    <p className="mt-3 text-sm leading-6 text-[var(--dashboard-muted)]">
                      Explore the full dashboard flow without login while local
                      Supabase keys are still missing.
                    </p>
                  ) : (
                    <form action={signOutAction} className="mt-3">
                      <button
                        type="submit"
                        className="pixel-button pixel-button-secondary h-[40px] w-full text-sm"
                      >
                        Logout
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </aside>
          )}

          <main
            className={`pixel-main min-w-0 flex-1 px-5 py-6 sm:px-7 lg:py-7 ${
              guestMode ? "lg:px-10" : "lg:px-9"
            }`}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px] fill-none stroke-current text-[var(--dashboard-text)]"
    >
      <path d="M4 7h16M4 12h16M4 17h16" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

type PixelNavIconProps = {
  name: NavItem["icon"];
};

function PixelNavIcon({ name }: PixelNavIconProps) {
  if (name === "home") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px] fill-current"
      >
        <path d="M12 4 3.5 10.8v1.9h2V20H10v-4h4v4h4.5v-7.3h2v-1.9Z" />
      </svg>
    );
  }

  if (name === "bot") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px] fill-none stroke-current"
      >
        <rect x="5" y="7" width="14" height="10" rx="2" strokeWidth="2" />
        <path d="M12 4v3M9 11h.01M15 11h.01M8 17v2M16 17v2" strokeWidth="2" />
      </svg>
    );
  }

  if (name === "file") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px] fill-none stroke-current"
      >
        <path d="M7 4h8l3 3v13H7z" strokeWidth="2" />
        <path d="M15 4v4h4M10 11h5M10 15h5" strokeWidth="2" />
      </svg>
    );
  }

  if (name === "pulse") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px] fill-none stroke-current"
      >
        <path d="M3 13h5l2-5 4 10 2-5h5" strokeWidth="2" />
      </svg>
    );
  }

  if (name === "plug") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px] fill-none stroke-current"
      >
        <path
          d="M9 4v6M15 4v6M7 10h10v2a5 5 0 0 1-5 5 5 5 0 0 1-5-5zM12 17v3"
          strokeWidth="2"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px] fill-none stroke-current"
    >
      <path
        d="M12 4v3M12 17v3M4 12h3M17 12h3M6.5 6.5l2.1 2.1M15.4 15.4l2.1 2.1M17.5 6.5l-2.1 2.1M8.6 15.4l-2.1 2.1"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="3.5" strokeWidth="2" />
    </svg>
  );
}
