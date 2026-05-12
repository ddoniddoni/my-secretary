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

function splitRegionInput(value: string) {
  return value
    .split(/[\n,]+/)
    .map((region) => region.trim())
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

  if (type === "stock") {
    return {
      symbols: splitSymbolInput(getStringValue(formData, "symbols")),
      market: getStringValue(formData, "market"),
      summaryStyle: getStringValue(formData, "summaryStyle"),
      language: "ko",
    };
  }

  if (type === "baseball") {
    return {
      teams: formData
        .getAll("teams")
        .map((value) => String(value).trim())
        .filter(Boolean),
      summaryStyle: getStringValue(formData, "summaryStyle"),
      includeStandings: getStringValue(formData, "includeStandings") === "true",
      language: "ko",
    };
  }

  return {
    regions: splitRegionInput(getStringValue(formData, "regions")),
    propertyTypes: formData
      .getAll("propertyTypes")
      .map((value) => String(value).trim())
      .filter(Boolean),
    summaryStyle: getStringValue(formData, "summaryStyle"),
    language: "ko",
  };
}
