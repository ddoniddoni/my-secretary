"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState, useTransition } from "react";

import { AssistantConfigFields } from "@/components/assistants/AssistantConfigFields";
import { PixelAvatar } from "@/components/assistants/PixelAvatar";
import { ModalShell } from "@/components/ui/ModalShell";
import { getAssistantConfigInputFromFormData } from "@/lib/assistants/form-payload";
import type { AssistantTemplate, UserAssistant } from "@/types/assistants";

type AssistantCreateDialogProps = {
  onCreated: (assistant: UserAssistant) => void;
  templates: AssistantTemplate[];
};

type ApiResponse = {
  data?: {
    assistant: UserAssistant;
  };
  error?: string;
};

export function AssistantCreateDialog({
  onCreated,
  templates,
}: AssistantCreateDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, startTransition] = useTransition();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState("");

  const selectedTemplate =
    templates.find((template) => template.id === selectedTemplateId) ?? null;

  function closeDialog() {
    setIsOpen(false);
    setSelectedTemplateId(null);
    setErrorMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedTemplate) {
      setErrorMessage("먼저 비서 템플릿을 선택해주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/assistants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          name: String(formData.get("name") ?? ""),
          config: getAssistantConfigInputFromFormData(
            selectedTemplate.type,
            formData,
          ),
        }),
      });
      const result = (await response.json()) as ApiResponse;

      if (!response.ok || !result.data) {
        setErrorMessage(result.error ?? "비서를 추가하지 못했습니다.");
        return;
      }

      onCreated(result.data.assistant);
      closeDialog();
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Failed to submit assistant create form", error);
      setErrorMessage("비서를 추가하지 못했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-[var(--color-foreground)]"
      >
        + 비서 추가
      </button>

      <ModalShell
        open={isOpen}
        onClose={closeDialog}
        title="새 AI 비서 추가"
        description="템플릿을 선택하고 내 대시보드에서 사용할 설정을 저장하세요."
      >
        {!selectedTemplate ? (
          <div className="grid gap-4 md:grid-cols-2">
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => setSelectedTemplateId(template.id)}
                className="rounded-[1.75rem] border border-[var(--color-stroke)] bg-white/80 p-5 text-left transition hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-4">
                  <PixelAvatar variant={template.type} size="sm" />
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
                      {template.type}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">{template.name}</h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                  {template.description}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex items-center gap-4 rounded-[1.75rem] border border-[var(--color-stroke)] bg-white/80 p-4">
              <PixelAvatar variant={selectedTemplate.type} size="sm" />
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
                  {selectedTemplate.type}
                </p>
                <h3 className="mt-1 text-lg font-semibold">
                  {selectedTemplate.name}
                </h3>
              </div>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-[var(--color-foreground)]">
                비서 이름
              </span>
              <input
                type="text"
                name="name"
                defaultValue={selectedTemplate.name}
                disabled={isSubmitting || isRefreshing}
                className="w-full rounded-2xl border border-[var(--color-stroke)] bg-white px-4 py-3 text-sm outline-none"
              />
            </label>

            <AssistantConfigFields
              type={selectedTemplate.type}
              config={selectedTemplate.defaultConfig}
              disabled={isSubmitting || isRefreshing}
            />

            {errorMessage ? (
              <div className="rounded-[1.5rem] border border-[rgba(181,67,51,0.25)] bg-[rgba(181,67,51,0.08)] px-4 py-3 text-sm leading-6 text-[#7a2d23]">
                {errorMessage}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setSelectedTemplateId(null)}
                disabled={isSubmitting || isRefreshing}
                className="inline-flex items-center justify-center rounded-full border border-[var(--color-stroke)] bg-white px-5 py-3 text-sm font-medium"
              >
                템플릿 다시 선택
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isRefreshing}
                className="inline-flex items-center justify-center rounded-full bg-[var(--color-foreground)] px-5 py-3 text-sm font-medium text-white"
              >
                {isSubmitting ? "비서를 저장하고 있어요..." : "비서 추가하기"}
              </button>
            </div>
          </form>
        )}
      </ModalShell>
    </>
  );
}
