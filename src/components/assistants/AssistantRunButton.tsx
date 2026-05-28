"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type AssistantRunButtonProps = {
  assistantId: string;
  buttonClassName: string;
  idleLabel: string;
  runningLabel?: string;
  showFeedback?: boolean;
};

type RunResponse = {
  data?: {
    run: {
      id: string;
      status: "failed" | "pending" | "success";
    };
  };
  error?: string;
};

export function AssistantRunButton({
  assistantId,
  buttonClassName,
  idleLabel,
  runningLabel = "실행 중...",
  showFeedback = false,
}: AssistantRunButtonProps) {
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition();
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    tone: "error" | "success";
  } | null>(null);

  async function handleRun() {
    setIsRunning(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/assistants/${assistantId}/run`, {
        method: "POST",
      });
      const result = (await response.json()) as RunResponse;

      if (!response.ok || !result.data?.run) {
        setMessage({
          text: result.error ?? "비서를 실행하지 못했어요.",
          tone: "error",
        });
        return;
      }

      setMessage({
        text: "새 브리핑을 생성했어요.",
        tone: "success",
      });
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Failed to run assistant", error);
      setMessage({
        text: "비서를 실행하지 못했어요.",
        tone: "error",
      });
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className={showFeedback ? "space-y-3" : undefined}>
      <button
        type="button"
        onClick={handleRun}
        disabled={isRunning || isRefreshing}
        className={buttonClassName}
      >
        {isRunning || isRefreshing ? runningLabel : idleLabel}
      </button>

      {showFeedback && message ? (
        <p
          className={`text-sm ${
            message.tone === "error"
              ? "text-[var(--dashboard-danger)]"
              : "text-[var(--dashboard-success)]"
          }`}
        >
          {message.text}
        </p>
      ) : null}
    </div>
  );
}
