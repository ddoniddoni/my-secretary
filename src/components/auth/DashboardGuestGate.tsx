import { PixelAvatar } from "@/components/assistants/PixelAvatar";
import { LoginForm } from "@/components/auth/LoginForm";
import type { AssistantTemplate } from "@/types/assistants";

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
  const previewCards = templates.slice(0, 4);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_420px]">
      <section className="space-y-6">
        <div className="flex items-start gap-3">
          <SparkleMark />
          <div>
            <h1 className="font-pixel text-[26px] leading-[1.4] text-[var(--dashboard-text)] sm:text-[34px]">
              Unlock Your Assistant Deck
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-8 text-[var(--dashboard-muted)]">
              뉴스, 주식, 국내야구, 부동산 비서를 저장하고, 실행 결과를
              채팅창 대신 읽기 좋은 카드 UI로 관리하는 메인 대시보드예요.
              로그인하면 이 아래가 바로 당신만의 assistant OS로 열립니다.
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {previewCards.map((template) => (
            <article key={template.id} className="pixel-locked-card">
              <div className="flex items-start gap-4">
                <PixelAvatar variant={template.type} size="md" />
                <div className="min-w-0">
                  <p className="font-pixel text-[11px] uppercase text-[var(--dashboard-accent-strong)]">
                    Locked
                  </p>
                  <h2 className="mt-3 font-pixel text-[16px] leading-[1.6] text-[var(--dashboard-text)]">
                    {template.name}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[var(--dashboard-muted)]">
                    {template.description}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between gap-3">
                <span className="pixel-meta-pill">
                  {template.type === "news" ? "News briefing" : "Stock watch"}
                </span>
                <span className="pixel-lock-badge">Sign in to unlock</span>
              </div>
            </article>
          ))}
        </div>

        <div className="pixel-guest-note">
          <p className="font-pixel text-[10px] uppercase text-[var(--dashboard-warning)]">
            Why sign in
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--dashboard-muted)]">
            사용자별 비서 목록, 설정 저장, 실행 기록, 구조화된 브리핑 결과는
            로그인된 상태에서만 연결됩니다.
          </p>
        </div>
      </section>

      <aside className="pixel-login-panel">
        <div className="flex items-center gap-4">
          <div className="pixel-login-avatar">
            <PixelAvatar variant="helper" size="md" />
          </div>
          <div>
            <p className="font-pixel text-[11px] uppercase text-[var(--dashboard-accent-strong)]">
              Access Required
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--dashboard-text)]">
              Login to open the dashboard
            </h2>
          </div>
        </div>

        <p className="mt-5 text-sm leading-7 text-[var(--dashboard-muted)]">
          이메일 매직링크로 바로 들어올 수 있게 해둘게요. 로그인하면 지금
          보고 있는 메인 화면이 실제 대시보드로 전환됩니다.
        </p>

        {authErrorMessage ? (
          <div className="mt-5 rounded-[14px] border border-[rgba(255,120,140,0.36)] bg-[rgba(255,120,140,0.12)] px-4 py-3 text-sm leading-6 text-[#ffd8de]">
            {authErrorMessage}
          </div>
        ) : null}

        {!loginEnabled ? (
          <div className="mt-6 rounded-[14px] border border-[rgba(243,194,89,0.34)] bg-[rgba(243,194,89,0.1)] px-4 py-3 text-sm leading-6 text-[#ffe9b3]">
            Supabase 환경변수가 아직 없어 로그인 링크를 보낼 수 없어요.
            `.env.local`을 채우면 이 자리에서 바로 로그인할 수 있습니다.
          </div>
        ) : null}

        <div className="mt-6">
          <LoginForm disabled={!loginEnabled} nextPath="/" />
        </div>
      </aside>
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
