export type AssistantType = "news" | "stock";

export type AssistantPreviewItem = {
  title: string;
  meta: string;
  description: string;
};

export type AssistantPreview = {
  type: AssistantType;
  badge: string;
  name: string;
  summary: string;
  description: string;
  bullets: string[];
  previewItems: AssistantPreviewItem[];
};

export type ProductHighlight = {
  label: string;
  value: string;
};

export type ProductPrinciple = {
  eyebrow: string;
  title: string;
  description: string;
};
