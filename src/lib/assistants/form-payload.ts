import type { AssistantType } from "@/types/assistants";

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function splitSymbolInput(value: string) {
  return value
    .split(/[\n,]+/)
    .map((symbol) => symbol.trim())
    .filter(Boolean);
}

export function getAssistantConfigInputFromFormData(
  type: AssistantType,
  formData: FormData,
) {
  if (type === "news") {
    return {
      categories: formData
        .getAll("categories")
        .map((value) => String(value).trim())
        .filter(Boolean),
      summaryStyle: getStringValue(formData, "summaryStyle"),
      maxItems: Number(getStringValue(formData, "maxItems")),
      language: "ko",
    };
  }

  return {
    symbols: splitSymbolInput(getStringValue(formData, "symbols")),
    market: getStringValue(formData, "market"),
    summaryStyle: getStringValue(formData, "summaryStyle"),
    language: "ko",
  };
}
