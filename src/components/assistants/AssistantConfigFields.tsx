import {
  baseballSummaryStyleOptions,
  getDefaultSymbolsInput,
  getDefaultRegionsInput,
  kboTeamOptions,
  newsCategoryOptions,
  newsSummaryStyleOptions,
  realEstatePropertyTypeOptions,
  realEstateSummaryStyleOptions,
  stockMarketOptions,
  stockSummaryStyleOptions,
} from "@/lib/assistants/config";
import type { AssistantConfig, AssistantType } from "@/types/assistants";

type AssistantConfigFieldsProps = {
  config: AssistantConfig;
  disabled?: boolean;
  type: AssistantType;
};

export function AssistantConfigFields({
  config,
  disabled = false,
  type,
}: AssistantConfigFieldsProps) {
  if (type === "news") {
    const newsConfig = config as Extract<AssistantConfig, { categories: string[] }>;

    return (
      <div className="space-y-5">
        <div>
          <p className="text-sm font-medium text-[var(--color-foreground)]">
            관심 카테고리
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {newsCategoryOptions.map((category) => (
              <label
                key={category}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-stroke)] bg-[var(--color-surface-strong)] px-4 py-2 text-sm text-[var(--color-foreground)]"
              >
                <input
                  type="checkbox"
                  name="categories"
                  value={category}
                  defaultChecked={newsConfig.categories.includes(category)}
                  disabled={disabled}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-foreground)]">
              요약 스타일
            </span>
            <select
              name="summaryStyle"
              defaultValue={newsConfig.summaryStyle}
              disabled={disabled}
              className="w-full rounded-2xl border border-[var(--color-stroke)] bg-[var(--color-surface-strong)] px-4 py-3 text-sm text-[var(--color-foreground)] outline-none"
            >
              {newsSummaryStyleOptions.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-foreground)]">
              뉴스 개수
            </span>
            <select
              name="maxItems"
              defaultValue={String(newsConfig.maxItems)}
              disabled={disabled}
              className="w-full rounded-2xl border border-[var(--color-stroke)] bg-[var(--color-surface-strong)] px-4 py-3 text-sm text-[var(--color-foreground)] outline-none"
            >
              {[5, 7, 10].map((count) => (
                <option key={count} value={count}>
                  {count}개
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    );
  }

  if (type === "stock") {
    const stockConfig = config as Extract<AssistantConfig, { symbols: string[] }>;

    return (
      <div className="space-y-5">
        <label className="space-y-2">
          <span className="text-sm font-medium text-[var(--color-foreground)]">
            관심 종목
          </span>
          <textarea
            name="symbols"
            defaultValue={getDefaultSymbolsInput(stockConfig)}
            disabled={disabled}
            rows={4}
            className="w-full rounded-[1.5rem] border border-[var(--color-stroke)] bg-[var(--color-surface-strong)] px-4 py-3 text-sm text-[var(--color-foreground)] outline-none"
            placeholder="AAPL, NVDA, TSLA"
          />
          <span className="text-xs text-[var(--color-muted)]">
            쉼표 또는 줄바꿈으로 여러 종목을 입력할 수 있습니다.
          </span>
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-foreground)]">
              시장
            </span>
            <select
              name="market"
              defaultValue={stockConfig.market}
              disabled={disabled}
              className="w-full rounded-2xl border border-[var(--color-stroke)] bg-[var(--color-surface-strong)] px-4 py-3 text-sm text-[var(--color-foreground)] outline-none"
            >
              {stockMarketOptions.map((market) => (
                <option key={market} value={market}>
                  {market}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-foreground)]">
              브리핑 스타일
            </span>
            <select
              name="summaryStyle"
              defaultValue={stockConfig.summaryStyle}
              disabled={disabled}
              className="w-full rounded-2xl border border-[var(--color-stroke)] bg-[var(--color-surface-strong)] px-4 py-3 text-sm text-[var(--color-foreground)] outline-none"
            >
              {stockSummaryStyleOptions.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    );
  }

  if (type === "baseball") {
    const baseballConfig = config as Extract<AssistantConfig, { teams: string[] }>;

    return (
      <div className="space-y-5">
        <div>
          <p className="text-sm font-medium text-[var(--color-foreground)]">
            응원 팀
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {kboTeamOptions.map((team) => (
              <label
                key={team}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-stroke)] bg-[var(--color-surface-strong)] px-4 py-2 text-sm text-[var(--color-foreground)]"
              >
                <input
                  type="checkbox"
                  name="teams"
                  value={team}
                  defaultChecked={baseballConfig.teams.includes(team)}
                  disabled={disabled}
                />
                <span>{team}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-foreground)]">
              브리핑 스타일
            </span>
            <select
              name="summaryStyle"
              defaultValue={baseballConfig.summaryStyle}
              disabled={disabled}
              className="w-full rounded-2xl border border-[var(--color-stroke)] bg-[var(--color-surface-strong)] px-4 py-3 text-sm text-[var(--color-foreground)] outline-none"
            >
              {baseballSummaryStyleOptions.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-[var(--color-stroke)] bg-[var(--color-surface-strong)] px-4 py-3 text-sm text-[var(--color-foreground)]">
            <input
              type="checkbox"
              name="includeStandings"
              value="true"
              defaultChecked={baseballConfig.includeStandings}
              disabled={disabled}
            />
            <span>리그 순위 요약 포함</span>
          </label>
        </div>
      </div>
    );
  }

  const realEstateConfig = config as Extract<
    AssistantConfig,
    { regions: string[] }
  >;

  return (
    <div className="space-y-5">
      <label className="space-y-2">
        <span className="text-sm font-medium text-[var(--color-foreground)]">
          관심 지역
        </span>
        <textarea
          name="regions"
          defaultValue={getDefaultRegionsInput(realEstateConfig)}
          disabled={disabled}
          rows={4}
          className="w-full rounded-[1.5rem] border border-[var(--color-stroke)] bg-[var(--color-surface-strong)] px-4 py-3 text-sm text-[var(--color-foreground)] outline-none"
          placeholder="서울 마포구, 경기 성남시 분당구"
        />
        <span className="text-xs text-[var(--color-muted)]">
          쉼표 또는 줄바꿈으로 여러 지역을 입력할 수 있습니다.
        </span>
      </label>

      <div>
        <p className="text-sm font-medium text-[var(--color-foreground)]">
          주택 유형
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {realEstatePropertyTypeOptions.map((propertyType) => (
            <label
              key={propertyType}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-stroke)] bg-[var(--color-surface-strong)] px-4 py-2 text-sm text-[var(--color-foreground)]"
            >
              <input
                type="checkbox"
                name="propertyTypes"
                value={propertyType}
                defaultChecked={realEstateConfig.propertyTypes.includes(propertyType)}
                disabled={disabled}
              />
              <span>{propertyType}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-[var(--color-foreground)]">
            브리핑 스타일
          </span>
          <select
            name="summaryStyle"
            defaultValue={realEstateConfig.summaryStyle}
            disabled={disabled}
            className="w-full rounded-2xl border border-[var(--color-stroke)] bg-[var(--color-surface-strong)] px-4 py-3 text-sm text-[var(--color-foreground)] outline-none"
          >
            {realEstateSummaryStyleOptions.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
