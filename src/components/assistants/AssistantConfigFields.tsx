import {
  getDefaultSymbolsInput,
  newsCategoryOptions,
  newsSummaryStyleOptions,
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
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-stroke)] bg-white px-4 py-2 text-sm text-[var(--color-foreground)]"
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
              className="w-full rounded-2xl border border-[var(--color-stroke)] bg-white px-4 py-3 text-sm outline-none"
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
              className="w-full rounded-2xl border border-[var(--color-stroke)] bg-white px-4 py-3 text-sm outline-none"
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
          className="w-full rounded-[1.5rem] border border-[var(--color-stroke)] bg-white px-4 py-3 text-sm outline-none"
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
            className="w-full rounded-2xl border border-[var(--color-stroke)] bg-white px-4 py-3 text-sm outline-none"
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
            className="w-full rounded-2xl border border-[var(--color-stroke)] bg-white px-4 py-3 text-sm outline-none"
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
