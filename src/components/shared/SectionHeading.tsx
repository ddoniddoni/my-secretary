type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
        {eyebrow}
      </p>
      <h2 className="text-balance mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">
        {description}
      </p>
    </div>
  );
}
