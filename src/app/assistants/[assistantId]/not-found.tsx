import Link from "next/link";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatePanel } from "@/components/shared/StatePanel";

export default function AssistantDetailNotFound() {
  return (
    <DashboardShell demoMode userEmail="preview@pixel.local">
      <div className="mx-auto max-w-3xl py-10">
        <StatePanel
          align="center"
          description="비서가 삭제됐거나 현재 사용자가 이 기록에 접근할 수 없어요."
          eyebrow="찾을 수 없음"
          title="해당 비서를 찾지 못했어요"
          tone="warning"
          action={
            <Link
              href="/"
              className="pixel-button pixel-button-primary px-6 text-sm"
            >
              대시보드로 돌아가기
            </Link>
          }
        />
      </div>
    </DashboardShell>
  );
}
