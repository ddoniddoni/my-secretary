import type { RealEstateBrief } from "@/lib/assistants/output-schemas";

type RealEstateAssistantResultProps = {
  result: RealEstateBrief;
};

export function RealEstateAssistantResult({
  result,
}: RealEstateAssistantResultProps) {
  return (
    <section className="space-y-5">
      <div className="rounded-[14px] border border-[rgba(107,220,251,0.26)] bg-[rgba(107,220,251,0.08)] px-5 py-5">
        <p className="font-pixel text-[10px] uppercase text-[var(--dashboard-info)]">
          시장 요약
        </p>
        <p className="mt-4 text-sm leading-7 text-[var(--dashboard-text)]">
          {result.marketSummary}
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {result.regions.map((region, index) => (
          <article
            key={`${region.region}-${region.propertyType}-${index}`}
            className="rounded-[14px] border border-[var(--dashboard-border)] bg-[rgba(16,21,40,0.96)] px-5 py-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="pixel-meta-pill">{region.region}</span>
              <span className="pixel-meta-pill">{region.propertyType}</span>
            </div>
            <p className="mt-4 text-sm leading-7 text-[var(--dashboard-text)]">
              {region.priceTrendSummary}
            </p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-[12px] border border-[rgba(137,239,116,0.22)] bg-[rgba(137,239,116,0.08)] px-4 py-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--dashboard-success)]">
                  수요
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--dashboard-text)]">
                  {region.demandSignal}
                </p>
              </div>
              <div className="rounded-[12px] border border-[rgba(243,194,89,0.22)] bg-[rgba(243,194,89,0.08)] px-4 py-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--dashboard-warning)]">
                  공급
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--dashboard-text)]">
                  {region.supplySignal}
                </p>
              </div>
            </div>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-[var(--dashboard-muted)]">
              {region.keyChanges.map((change) => (
                <li
                  key={change}
                  className="rounded-[10px] bg-[rgba(255,255,255,0.03)] px-3 py-2"
                >
                  {change}
                </li>
              ))}
            </ul>
            <a
              href={region.source.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex text-xs font-medium text-[var(--dashboard-info)] underline decoration-transparent transition hover:decoration-current"
            >
              {region.source.sourceName} 원문 보기
            </a>
          </article>
        ))}
      </div>

      <div className="rounded-[14px] border border-[rgba(243,194,89,0.28)] bg-[rgba(243,194,89,0.08)] px-5 py-4 text-sm leading-7 text-[#ffe8b4]">
        {result.notice}
      </div>
    </section>
  );
}
