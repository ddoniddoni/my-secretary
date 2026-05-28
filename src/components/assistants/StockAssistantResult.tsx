import type { StockBrief } from "@/lib/assistants/output-schemas";

type StockAssistantResultProps = {
  result: StockBrief;
};

function formatSignedNumber(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}`;
}

export function StockAssistantResult({ result }: StockAssistantResultProps) {
  return (
    <section className="space-y-5">
      <div className="rounded-[14px] border border-[rgba(137,239,116,0.24)] bg-[rgba(137,239,116,0.08)] px-5 py-5">
        <p className="font-pixel text-[10px] uppercase text-[var(--dashboard-success)]">
          시장 요약
        </p>
        <p className="mt-4 text-sm leading-7 text-[var(--dashboard-text)]">
          {result.marketSummary}
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {result.symbols.map((item) => (
          <article
            key={item.symbol}
            className="rounded-[14px] border border-[var(--dashboard-border)] bg-[rgba(16,21,40,0.96)] px-5 py-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-pixel text-[12px] uppercase text-[var(--dashboard-text)]">
                  {item.symbol}
                </p>
                <p className="mt-2 text-sm text-[var(--dashboard-muted)]">
                  {item.currency} {item.price.toFixed(2)}
                </p>
              </div>
              <div
                className={`rounded-[10px] border px-3 py-2 text-sm font-medium ${
                  item.change >= 0
                    ? "border-[rgba(137,239,116,0.28)] bg-[rgba(137,239,116,0.08)] text-[var(--dashboard-success)]"
                    : "border-[rgba(255,120,140,0.28)] bg-[rgba(255,120,140,0.08)] text-[var(--dashboard-danger)]"
                }`}
              >
                {formatSignedNumber(item.change)} /{" "}
                {formatSignedNumber(item.changePercent)}%
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-[var(--dashboard-text)]">
              {item.summary}
            </p>

            <div className="mt-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--dashboard-muted)]">
                핵심 이슈
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-[var(--dashboard-text)]">
                {item.keyIssues.map((issue) => (
                  <li
                    key={issue}
                    className="rounded-[10px] bg-[rgba(255,255,255,0.03)] px-3 py-2"
                  >
                    {issue}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--dashboard-muted)]">
                관련 뉴스
              </p>
              <div className="mt-3 grid gap-3">
                {item.relatedNews.map((news, index) => (
                  <div
                    key={`${item.symbol}-${news.title}-${index}`}
                    className="rounded-[12px] border border-[rgba(161,143,255,0.18)] bg-[rgba(255,255,255,0.03)] px-4 py-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="pixel-meta-pill">{news.sourceName}</span>
                      <span className="pixel-meta-pill">{news.sentiment}</span>
                    </div>
                    <p className="mt-3 text-sm font-medium text-[var(--dashboard-text)]">
                      {news.title}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[var(--dashboard-muted)]">
                      {news.summary}
                    </p>
                    <a
                      href={news.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex text-xs font-medium text-[var(--dashboard-info)] underline decoration-transparent transition hover:decoration-current"
                    >
                      원문 보기
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="rounded-[14px] border border-[rgba(243,194,89,0.28)] bg-[rgba(243,194,89,0.08)] px-5 py-4 text-sm leading-7 text-[#ffe8b4]">
        {result.disclaimer}
      </div>
    </section>
  );
}
