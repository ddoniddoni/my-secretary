import Link from "next/link";

import { PixelAvatar } from "@/components/assistants/PixelAvatar";
import type { AssistantTemplate, UserAssistant } from "@/types/assistants";

type AssistantCardProps = {
  assistant: UserAssistant;
  onDelete: (assistant: UserAssistant) => void;
  template: AssistantTemplate | undefined;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function AssistantCard({
  assistant,
  onDelete,
  template,
}: AssistantCardProps) {
  return (
    <article className="surface-panel rounded-[1.75rem] border p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <PixelAvatar variant={assistant.type} size="md" />
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
              {assistant.type}
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
              {assistant.name}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-[var(--color-muted)]">
              {template?.description ??
                "템플릿 정보가 보이지 않지만 저장된 비서 데이터는 유지되고 있습니다."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="rounded-full bg-[var(--color-bg-strong)] px-3 py-1 text-xs text-[var(--color-muted)]">
          생성일 {formatDate(assistant.createdAt)}
        </span>
        <span className="rounded-full bg-[var(--color-bg-strong)] px-3 py-1 text-xs text-[var(--color-muted)]">
          {assistant.type === "news" ? "뉴스 브리핑" : "주식 브리핑"}
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/assistants/${assistant.id}`}
          className="inline-flex items-center justify-center rounded-full bg-[var(--color-foreground)] px-5 py-3 text-sm font-medium text-white"
        >
          상세 보기
        </Link>
        <button
          type="button"
          onClick={() => onDelete(assistant)}
          className="inline-flex items-center justify-center rounded-full border border-[var(--color-stroke)] bg-white px-5 py-3 text-sm font-medium text-[var(--color-foreground)]"
          aria-label={`${assistant.name} 삭제`}
        >
          삭제
        </button>
      </div>
    </article>
  );
}
