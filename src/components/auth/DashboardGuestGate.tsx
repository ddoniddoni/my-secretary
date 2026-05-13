import { PixelAvatar } from "@/components/assistants/PixelAvatar";
import { LoginForm } from "@/components/auth/LoginForm";
import {
  getAssistantTypePreviewLabel,
  getAssistantTypeDescription,
} from "@/lib/assistants/dashboard";
import {
  assistantPreviews,
  productHighlights,
  productPrinciples,
} from "@/lib/landing/content";
import type { AssistantTemplate, AssistantType } from "@/types/assistants";

type DashboardGuestGateProps = {
  authErrorMessage?: string | null;
  loginEnabled: boolean;
  templates: AssistantTemplate[];
};

export function DashboardGuestGate({
  authErrorMessage,
  loginEnabled,
  templates,
}: DashboardGuestGateProps) {
  const templateByType = Object.fromEntries(
    templates.map((template) => [template.type, template]),
  ) as Partial<Record<AssistantType, AssistantTemplate>>;

  const previewCards = assistantPreviews.map((preview) => ({
    description:
      templateByType[preview.type]?.description ??
      preview.description ??
      getAssistantTypeDescription(preview.type),
    name: templateByType[preview.type]?.name ?? preview.name,
    preview,
  }));

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_420px]">
      <section className="space-y-8">
        <div className="flex items-start gap-3">
          <SparkleMark />
          <div className="min-w-0">
            <h1 className="font-pixel text-[26px] leading-[1.45] text-[var(--dashboard-text)] sm:text-[34px]">
              Build a deck of task-specific AI assistants
            </h1>
            <p className="mt-4 max-w-3xl text-[15px] leading-8 text-[var(--dashboard-muted)]">
              My SECRETARY keeps recurring information chores out of a generic
              chat window. Save assistants for news, markets, KBO, and housing,
              then open clean result UIs from one responsive dashboard.
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {productHighlights.map((highlight) => (
            <article
              key={highlight.label}
              className="pixel-panel rounded-[18px] px-5 py-5"
            >
              <p className="font-pixel text-[10px] uppercase text-[var(--dashboard-accent-strong)]">
                {highlight.label}
              </p>
              <p className="mt-4 text-sm leading-7 text-[var(--dashboard-muted)]">
                {highlight.value}
              </p>
            </article>
          ))}
        </div>

        <div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-pixel text-[10px] uppercase text-[var(--dashboard-warning)]">
                Assistant previews
              </p>
              <h2 className="mt-3 text-xl font-semibold text-[var(--dashboard-text)]">
                Locked cards preview the product before sign-in
              </h2>
            </div>
            <p className="hidden max-w-sm text-right text-sm leading-7 text-[var(--dashboard-muted)] xl:block">
              Each assistant type keeps its own config, provider, runner, and
              result UI.
            </p>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            {previewCards.map(({ description, name, preview }) => (
              <article key={preview.type} className="pixel-locked-card">
                <div className="flex items-start gap-4">
                  <PixelAvatar variant={preview.type} size="md" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="pixel-lock-badge">Locked</span>
                      <span className="pixel-meta-pill">
                        {getAssistantTypePreviewLabel(preview.type)}
                      </span>
                    </div>
                    <h3 className="mt-4 font-pixel text-[15px] leading-[1.7] text-[var(--dashboard-text)]">
                      {name}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-[var(--dashboard-muted)]">
                      {description}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  {preview.previewItems.map((item) => (
                    <div
                      key={`${preview.type}-${item.title}`}
                      className="rounded-[12px] border border-[var(--dashboard-border)] bg-[rgba(255,255,255,0.03)] px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-[var(--dashboard-text)]">
                          {item.title}
                        </p>
                        <span className="pixel-meta-pill">{item.meta}</span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[var(--dashboard-muted)]">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {productPrinciples.map((principle) => (
            <article
              key={principle.title}
              className="rounded-[18px] border border-[var(--dashboard-border)] bg-[rgba(16,21,40,0.86)] px-5 py-5"
            >
              <p className="font-pixel text-[10px] uppercase text-[var(--dashboard-info)]">
                {principle.eyebrow}
              </p>
              <h3 className="mt-4 text-lg font-semibold text-[var(--dashboard-text)]">
                {principle.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--dashboard-muted)]">
                {principle.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <aside className="pixel-login-panel self-start">
        <div className="flex items-center gap-4">
          <div className="pixel-login-avatar">
            <PixelAvatar variant="helper" size="md" />
          </div>
          <div>
            <p className="font-pixel text-[11px] uppercase text-[var(--dashboard-accent-strong)]">
              Access Required
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--dashboard-text)]">
              Open your assistant OS
            </h2>
          </div>
        </div>

        <p className="mt-5 text-sm leading-7 text-[var(--dashboard-muted)]">
          Sign in with a magic link to load your saved assistants, rerun
          briefings, and review structured history from the same dashboard.
        </p>

        <div className="mt-6 grid gap-3">
          <FeatureRow
            label="Saved assistant deck"
            value="User-owned assistant configs and templates"
          />
          <FeatureRow
            label="Structured run history"
            value="Readable result cards instead of raw transcripts"
          />
          <FeatureRow
            label="Server-side execution"
            value="Provider fetches and AI calls stay off the client"
          />
        </div>

        {authErrorMessage ? (
          <div className="mt-5 rounded-[14px] border border-[rgba(255,120,140,0.36)] bg-[rgba(255,120,140,0.12)] px-4 py-3 text-sm leading-6 text-[#ffd8de]">
            {authErrorMessage}
          </div>
        ) : null}

        {!loginEnabled ? (
          <div className="mt-5 rounded-[14px] border border-[rgba(243,194,89,0.34)] bg-[rgba(243,194,89,0.1)] px-4 py-3 text-sm leading-6 text-[#ffe9b3]">
            Supabase is not configured yet, so login is disabled. Keep
            `NEXT_PUBLIC_DEMO_MODE=true` to review the dashboard locally while
            wiring up your real project keys.
          </div>
        ) : null}

        <div className="mt-6">
          <LoginForm disabled={!loginEnabled} nextPath="/" />
        </div>
      </aside>
    </div>
  );
}

type FeatureRowProps = {
  label: string;
  value: string;
};

function FeatureRow({ label, value }: FeatureRowProps) {
  return (
    <div className="rounded-[14px] border border-[var(--dashboard-border)] bg-[rgba(255,255,255,0.03)] px-4 py-3">
      <p className="font-pixel text-[10px] uppercase text-[var(--dashboard-warning)]">
        {label}
      </p>
      <p className="mt-3 text-sm leading-6 text-[var(--dashboard-muted)]">
        {value}
      </p>
    </div>
  );
}

function SparkleMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      className="mt-1 h-7 w-7 shrink-0 text-[var(--dashboard-accent-strong)]"
    >
      <path
        d="M20 4 23.8 16.2 36 20l-12.2 3.8L20 36l-3.8-12.2L4 20l12.2-3.8Z"
        fill="currentColor"
      />
      <path
        d="M30 5.5 31.5 10 36 11.5 31.5 13 30 17.5 28.5 13 24 11.5 28.5 10Z"
        fill="currentColor"
        opacity="0.8"
      />
    </svg>
  );
}
