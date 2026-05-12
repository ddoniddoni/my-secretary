import Link from "next/link";

import { AssistantRunButton } from "@/components/assistants/AssistantRunButton";
import {
  getAssistantMetaChips,
  getAssistantStatusCopy,
  getAssistantTypeDescription,
  getAssistantTypeLabel,
} from "@/lib/assistants/dashboard";
import type { AssistantTemplate, UserAssistant } from "@/types/assistants";

type AssistantCardProps = {
  assistant: UserAssistant;
  onDelete: (assistant: UserAssistant) => void;
  template: AssistantTemplate | undefined;
};

export function AssistantCard({
  assistant,
  onDelete,
  template,
}: AssistantCardProps) {
  const status = getAssistantStatusCopy(assistant.type);
  const metaChips = getAssistantMetaChips(assistant);

  return (
    <article className="pixel-assistant-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-5">
          <PixelCardPortrait type={assistant.type} />
          <div className="min-w-0">
            <h2 className="truncate font-pixel text-[17px] leading-[1.55] text-[var(--dashboard-text)] sm:text-[19px]">
              {assistant.name}
            </h2>
            <p className="mt-4 max-w-[280px] text-[15px] leading-8 text-[var(--dashboard-muted)]">
              {template?.description ??
                getAssistantTypeDescription(assistant.type)}
            </p>
          </div>
        </div>
        <div className="pt-1">
          <CardGlyph type={assistant.type} />
        </div>
      </div>

      <div className="mt-6">
        <span
          className={`pixel-status-tag ${
            status.tone === "news" ? "is-success" : "is-info"
          }`}
        >
          {status.label}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="pixel-meta-pill">{getAssistantTypeLabel(assistant.type)}</span>
        {metaChips.map((chip) => (
          <span key={chip} className="pixel-meta-pill">
            {chip}
          </span>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_72px] gap-3">
        <Link
          href={`/assistants/${assistant.id}`}
          className="pixel-card-button pixel-card-button-primary"
        >
          Detail
        </Link>
        <AssistantRunButton
          assistantId={assistant.id}
          idleLabel="Run"
          runningLabel="..."
          buttonClassName="pixel-card-button pixel-card-button-secondary"
        />
        <button
          type="button"
          onClick={() => onDelete(assistant)}
          className="pixel-card-button pixel-card-button-icon"
          aria-label={`${assistant.name} 삭제`}
        >
          <DotsIcon />
        </button>
      </div>
    </article>
  );
}

type PixelCardPortraitProps = {
  type: UserAssistant["type"];
};

function PixelCardPortrait({ type }: PixelCardPortraitProps) {
  const typeClass =
    type === "news"
      ? "is-news"
      : type === "stock"
        ? "is-stock"
        : type === "baseball"
          ? "is-baseball"
          : "is-real-estate";

  return (
    <div
      className={`pixel-card-portrait ${typeClass}`}
      aria-hidden="true"
    >
      <div className="pixel-card-portrait-frame" />
      <div className="pixel-card-portrait-head" />
      <div className="pixel-card-portrait-body" />
      <div className="pixel-card-portrait-accent" />
      <div className="pixel-card-portrait-card" />
    </div>
  );
}

type CardGlyphProps = {
  type: UserAssistant["type"];
};

function CardGlyph({ type }: CardGlyphProps) {
  if (type === "news") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-7 w-7 text-[#a487ff]"
      >
        <path
          d="M7 17V7l8-2v10l-8 2Zm8-8 2 2-6 6-2 .5.5-2L15 9Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (type === "stock") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-7 w-7 text-[#7ee56d]"
      >
        <path
          d="M7 3h2v2h6V3h2v2h3v16H4V5h3V3Zm11 7H6v9h12v-9Zm-4 2h2v2h-2v-2Zm-4 0h2v2h-2v-2Zm0 4h2v2h-2v-2Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (type === "baseball") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-7 w-7 text-[#f3c259]"
      >
        <path
          d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9Zm-3 4.5c1.6 1.2 2.4 2.9 2.4 5S10.6 16.3 9 17.5m6-10c-1.6 1.2-2.4 2.9-2.4 5s.8 3.8 2.4 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7 text-[#8db5ff]"
    >
      <path
        d="M5 10.5 12 4l7 6.5V20h-4v-4h-6v4H5v-9.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <circle cx="6" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="18" cy="12" r="2" />
    </svg>
  );
}
