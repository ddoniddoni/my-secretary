"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

type ModalShellProps = {
  children: ReactNode;
  description?: string;
  onClose: () => void;
  open: boolean;
  title: string;
};

export function ModalShell({
  children,
  description,
  onClose,
  open,
  title,
}: ModalShellProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(6,8,22,0.72)] px-4 py-8"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="surface-panel relative w-full max-w-2xl rounded-[2rem] border px-6 py-6 shadow-[0_32px_80px_rgba(0,0,0,0.32)] sm:px-8"
        onClick={(event) => event.stopPropagation()}
        aria-describedby={description ? "modal-description" : undefined}
        aria-labelledby="modal-title"
        aria-modal="true"
        role="dialog"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-stroke)] bg-[var(--color-surface-strong)] text-lg text-[var(--color-muted)] transition hover:text-[var(--color-foreground)]"
          aria-label="모달 닫기"
        >
          ×
        </button>
        <div className="pr-10">
          <h2 id="modal-title" className="text-2xl font-semibold tracking-[-0.04em]">
            {title}
          </h2>
          {description ? (
            <p
              id="modal-description"
              className="mt-3 text-sm leading-7 text-[var(--color-muted)]"
            >
              {description}
            </p>
          ) : null}
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
