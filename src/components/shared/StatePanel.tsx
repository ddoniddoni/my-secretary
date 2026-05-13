import type { ReactNode } from "react";

type StatePanelProps = {
  action?: ReactNode;
  align?: "center" | "left";
  children?: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
  tone?: "danger" | "info" | "success" | "warning";
};

const toneStyles = {
  danger: {
    border: "border-[rgba(255,120,140,0.3)]",
    eyebrow: "text-[var(--dashboard-danger)]",
    surface: "bg-[rgba(255,120,140,0.08)]",
  },
  info: {
    border: "border-[rgba(107,220,251,0.28)]",
    eyebrow: "text-[var(--dashboard-info)]",
    surface: "bg-[rgba(107,220,251,0.07)]",
  },
  success: {
    border: "border-[rgba(137,239,116,0.28)]",
    eyebrow: "text-[var(--dashboard-success)]",
    surface: "bg-[rgba(137,239,116,0.07)]",
  },
  warning: {
    border: "border-[rgba(243,194,89,0.28)]",
    eyebrow: "text-[var(--dashboard-warning)]",
    surface: "bg-[rgba(243,194,89,0.08)]",
  },
} as const;

export function StatePanel({
  action,
  align = "left",
  children,
  description,
  eyebrow,
  title,
  tone = "info",
}: StatePanelProps) {
  const palette = toneStyles[tone];
  const alignment = align === "center" ? "items-center text-center" : "";

  return (
    <section
      className={`rounded-[18px] border px-6 py-7 shadow-[0_18px_38px_rgba(0,0,0,0.24)] ${palette.border} ${palette.surface}`}
    >
      <div className={`flex flex-col gap-4 ${alignment}`}>
        <p className={`font-pixel text-[10px] uppercase ${palette.eyebrow}`}>
          {eyebrow}
        </p>
        <div>
          <h2 className="text-xl font-semibold text-[var(--dashboard-text)] sm:text-2xl">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--dashboard-muted)]">
            {description}
          </p>
        </div>
        {children}
        {action ? <div>{action}</div> : null}
      </div>
    </section>
  );
}
