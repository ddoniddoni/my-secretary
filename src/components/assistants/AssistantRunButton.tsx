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
  runningLabel = "Running...",
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
          text: result.error ?? "We could not run that assistant.",
          tone: "error",
        });
        return;
      }

      setMessage({
        text: "A fresh briefing has been generated.",
        tone: "success",
      });
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Failed to run assistant", error);
      setMessage({
        text: "We could not run that assistant.",
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
