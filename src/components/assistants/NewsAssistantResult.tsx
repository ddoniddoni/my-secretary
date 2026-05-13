import type { NewsBrief } from "@/lib/assistants/output-schemas";

type NewsAssistantResultProps = {
  result: NewsBrief;
};

export function NewsAssistantResult({ result }: NewsAssistantResultProps) {
  return (
    <section className="space-y-5">
      <div className="rounded-[14px] border border-[rgba(107,220,251,0.26)] bg-[rgba(107,220,251,0.08)] px-5 py-5">
        <p className="font-pixel text-[10px] uppercase text-[var(--dashboard-info)]">
          Overall Summary
        </p>
        <p className="mt-4 text-sm leading-7 text-[var(--dashboard-text)]">
          {result.overallSummary}
        </p>
      </div>

      <div className="grid gap-4">
        {result.highlights.map((item, index) => (
          <article
            key={`${item.title}-${index}`}
            className="rounded-[14px] border border-[var(--dashboard-border)] bg-[rgba(16,21,40,0.96)] px-5 py-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="pixel-meta-pill">{item.category}</span>
              <span className="pixel-meta-pill">{item.source.sourceName}</span>
            </div>
            <h3 className="mt-4 text-base font-semibold text-[var(--dashboard-text)]">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[var(--dashboard-muted)]">
              {item.summary}
            </p>
            <div className="mt-4 rounded-[12px] border border-[rgba(161,143,255,0.24)] bg-[rgba(113,100,255,0.08)] px-4 py-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--dashboard-accent-strong)]">
                Why it matters
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--dashboard-text)]">
                {item.whyItMatters}
              </p>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-[var(--dashboard-muted)]">
              <span>{item.source.publishedAt ?? "발행 시각 없음"}</span>
              <a
                href={item.source.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[var(--dashboard-info)] underline decoration-transparent transition hover:decoration-current"
              >
                {item.source.sourceName} 원문 보기
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
