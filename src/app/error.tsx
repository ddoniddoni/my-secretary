"use client";

import { StatePanel } from "@/components/shared/StatePanel";

type RootErrorProps = {
  error: Error;
  reset: () => void;
};

export default function RootError({ error, reset }: RootErrorProps) {
  return (
    <div className="pixel-os-theme min-h-screen bg-[var(--dashboard-bg)] p-2 sm:p-3 lg:p-4">
      <div className="pixel-window mx-auto flex min-h-[calc(100vh-1rem)] max-w-[960px] items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
        <div className="w-full max-w-2xl">
          <StatePanel
            align="center"
            description={
              error.message || "로컬 환경을 확인한 뒤 대시보드를 다시 불러와보세요."
            }
            eyebrow="대시보드 오류"
            title="메인 대시보드를 불러오지 못했어요"
            tone="danger"
            action={
              <button
                type="button"
                onClick={reset}
                className="pixel-button pixel-button-primary px-6 text-sm"
              >
                다시 시도
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
}
