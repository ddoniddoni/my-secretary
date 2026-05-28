import type { BaseballBrief } from "@/lib/assistants/output-schemas";

type BaseballAssistantResultProps = {
  result: BaseballBrief;
};

export function BaseballAssistantResult({
  result,
}: BaseballAssistantResultProps) {
  return (
    <section className="space-y-5">
      <div className="rounded-[14px] border border-[rgba(243,194,89,0.28)] bg-[rgba(243,194,89,0.08)] px-5 py-5">
        <p className="font-pixel text-[10px] uppercase text-[var(--dashboard-warning)]">
          리그 요약
        </p>
        <p className="mt-4 text-sm leading-7 text-[var(--dashboard-text)]">
          {result.leagueSummary}
        </p>
      </div>

      {result.standings.length > 0 ? (
        <div className="rounded-[14px] border border-[var(--dashboard-border)] bg-[rgba(16,21,40,0.96)] px-5 py-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--dashboard-muted)]">
            순위 현황
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {result.standings.map((standing) => (
              <div
                key={standing.team}
                className="rounded-[12px] bg-[rgba(255,255,255,0.03)] px-4 py-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-pixel text-[11px] uppercase text-[var(--dashboard-text)]">
                    {standing.rank}위 {standing.team}
                  </span>
                  <span className="pixel-meta-pill">{standing.streak}</span>
                </div>
                <p className="mt-3 text-sm text-[var(--dashboard-muted)]">
                  {standing.record}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid gap-4">
        {result.teamBriefs.map((team) => (
          <article
            key={team.team}
            className="rounded-[14px] border border-[var(--dashboard-border)] bg-[rgba(16,21,40,0.96)] px-5 py-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="pixel-meta-pill">{team.team}</span>
              <span className="pixel-meta-pill">{team.recentRecord}</span>
            </div>
            <p className="mt-4 text-sm leading-7 text-[var(--dashboard-text)]">
              {team.latestResult}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[12px] border border-[rgba(161,143,255,0.22)] bg-[rgba(113,100,255,0.08)] px-4 py-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--dashboard-accent-strong)]">
                  핵심 이야기
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--dashboard-text)]">
                  {team.keyStory}
                </p>
              </div>
              <div className="rounded-[12px] border border-[rgba(107,220,251,0.22)] bg-[rgba(107,220,251,0.08)] px-4 py-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--dashboard-info)]">
                  확인 포인트
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--dashboard-text)]">
                  주목 선수: {team.keyPlayer}
                  <br />
                  다음 경기: {team.nextGame}
                </p>
              </div>
            </div>
            <a
              href={team.source.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex text-xs font-medium text-[var(--dashboard-info)] underline decoration-transparent transition hover:decoration-current"
            >
              {team.source.sourceName} 원문 보기
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
