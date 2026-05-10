"use client";

type RootErrorProps = {
  error: Error;
  reset: () => void;
};

export default function RootError({ error, reset }: RootErrorProps) {
  return (
    <div className="pixel-os-theme min-h-screen bg-[var(--dashboard-bg)] p-2 sm:p-3 lg:p-4">
      <div className="pixel-window mx-auto flex min-h-[calc(100vh-1rem)] max-w-[960px] items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
        <section className="pixel-panel w-full max-w-2xl px-6 py-10 text-center sm:px-10">
          <p className="font-pixel text-[11px] uppercase text-[var(--dashboard-danger)]">
            Dashboard Error
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[var(--dashboard-text)]">
            We could not load the main dashboard.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[var(--dashboard-muted)]">
            {error.message ||
              "Check your local data setup and try loading the dashboard again."}
          </p>
          <button
            type="button"
            onClick={reset}
            className="pixel-button pixel-button-primary mt-6"
          >
            Try again
          </button>
        </section>
      </div>
    </div>
  );
}
