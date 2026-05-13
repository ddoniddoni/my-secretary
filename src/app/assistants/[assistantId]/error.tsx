"use client";

import Link from "next/link";

import { StatePanel } from "@/components/shared/StatePanel";

type AssistantDetailErrorProps = {
  error: Error;
  reset: () => void;
};

export default function AssistantDetailError({
  error,
  reset,
}: AssistantDetailErrorProps) {
  return (
    <div className="pixel-os-theme min-h-screen bg-[var(--dashboard-bg)] p-2 sm:p-3 lg:p-4">
      <div className="pixel-window mx-auto flex min-h-[calc(100vh-1rem)] max-w-[1100px] items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
        <div className="w-full max-w-3xl">
          <StatePanel
            align="center"
            description={
              error.message ||
              "Try loading the assistant again after the current request settles."
            }
            eyebrow="Assistant error"
            title="The assistant detail page could not load"
            tone="danger"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={reset}
                className="pixel-button pixel-button-primary px-6 text-sm"
              >
                Try again
              </button>
              <Link
                href="/"
                className="pixel-button pixel-button-secondary px-6 text-sm"
              >
                Back to dashboard
              </Link>
            </div>
          </StatePanel>
        </div>
      </div>
    </div>
  );
}
