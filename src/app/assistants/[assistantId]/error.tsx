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
              "현재 요청이 끝난 뒤 다시 비서 상세 페이지를 불러와보세요."
            }
            eyebrow="비서 오류"
            title="비서 상세 페이지를 불러오지 못했어요"
            tone="danger"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={reset}
                className="pixel-button pixel-button-primary px-6 text-sm"
              >
                다시 시도
              </button>
              <Link
                href="/"
                className="pixel-button pixel-button-secondary px-6 text-sm"
              >
                대시보드로 돌아가기
              </Link>
            </div>
          </StatePanel>
        </div>
      </div>
    </div>
  );
}
