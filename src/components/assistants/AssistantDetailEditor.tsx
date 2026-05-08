"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState, useTransition } from "react";

import { AssistantConfigFields } from "@/components/assistants/AssistantConfigFields";
import { getAssistantConfigInputFromFormData } from "@/lib/assistants/form-payload";
import type { AssistantTemplate, UserAssistant } from "@/types/assistants";

type AssistantDetailEditorProps = {
  assistant: UserAssistant;
  template: AssistantTemplate;
};

type UpdateResponse = {
  data?: {
    assistant: UserAssistant;
  };
  error?: string;
};

export function AssistantDetailEditor({
  assistant,
  template,
}: AssistantDetailEditorProps) {
  const router = useRouter();
  const [message, setMessage] = useState<{
    text: string;
    tone: "error" | "success";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, startTransition] = useTransition();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(`/api/assistants/${assistant.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: String(formData.get("name") ?? ""),
          config: getAssistantConfigInputFromFormData(assistant.type, formData),
        }),
      });
      const result = (await response.json()) as UpdateResponse;

      if (!response.ok || !result.data?.assistant) {
        setMessage({
          text: result.error ?? "비서 설정을 저장하지 못했습니다.",
          tone: "error",
        });
        return;
      }

      setMessage({
        text: "비서 설정을 저장했습니다.",
        tone: "success",
      });
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Failed to update assistant", error);
      setMessage({
        text: "비서 설정을 저장하지 못했습니다.",
        tone: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-[1.5rem] border border-[var(--color-stroke)] bg-white/80 p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
          {template.type}
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
          비서 설정 편집
        </h2>
        <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
          이름과 설정을 저장해두면 나중에 같은 브리핑 흐름을 반복해서 실행할 수
          있습니다.
        </p>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-[var(--color-foreground)]">
          비서 이름
        </span>
        <input
          type="text"
          name="name"
          defaultValue={assistant.name}
          disabled={isSubmitting || isRefreshing}
          className="w-full rounded-2xl border border-[var(--color-stroke)] bg-white px-4 py-3 text-sm outline-none"
        />
      </label>

      <AssistantConfigFields
        type={assistant.type}
        config={assistant.config}
        disabled={isSubmitting || isRefreshing}
      />

      {message ? (
        <div
          className={`rounded-[1.5rem] border px-4 py-3 text-sm leading-6 ${
            message.tone === "error"
              ? "border-[rgba(181,67,51,0.25)] bg-[rgba(181,67,51,0.08)] text-[#7a2d23]"
              : "border-[rgba(11,114,133,0.2)] bg-[rgba(11,114,133,0.08)] text-[#0b7285]"
          }`}
        >
          {message.text}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting || isRefreshing}
        className="inline-flex items-center justify-center rounded-full bg-[var(--color-foreground)] px-6 py-3 text-sm font-medium text-white"
      >
        {isSubmitting ? "저장하고 있어요..." : "설정 저장"}
      </button>
    </form>
  );
}
