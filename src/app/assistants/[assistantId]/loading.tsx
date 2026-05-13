import { DashboardShell } from "@/components/layout/DashboardShell";

export default function AssistantDetailLoading() {
  return (
    <DashboardShell demoMode userEmail="loading@pixel.local">
      <div className="space-y-8">
        <div className="h-10 w-56 rounded bg-white/8" />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_380px]">
          <div className="pixel-panel rounded-[18px] px-6 py-6 sm:px-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="h-20 w-20 rounded-[24px] bg-white/8" />
                <div className="space-y-4">
                  <div className="h-4 w-32 rounded bg-white/8" />
                  <div className="h-10 w-64 rounded bg-white/10" />
                  <div className="h-4 w-[420px] max-w-full rounded bg-white/6" />
                  <div className="h-4 w-[320px] max-w-full rounded bg-white/6" />
                </div>
              </div>
              <div className="h-12 w-[180px] rounded bg-white/8" />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`config-skeleton-${index}`}
                  className="h-28 rounded-[14px] border border-[var(--dashboard-border)] bg-white/4"
                />
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="h-24 rounded-[14px] border border-[var(--dashboard-border)] bg-white/4" />
              <div className="h-24 rounded-[14px] border border-[var(--dashboard-border)] bg-white/4" />
            </div>
          </div>

          <div className="pixel-panel rounded-[18px] px-6 py-6">
            <div className="h-4 w-24 rounded bg-white/8" />
            <div className="mt-4 h-72 rounded-[14px] border border-[var(--dashboard-border)] bg-white/4" />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_380px]">
          <div className="space-y-4">
            <div className="h-4 w-28 rounded bg-white/8" />
            <div className="h-12 w-64 rounded bg-white/10" />
            <div className="h-[380px] rounded-[18px] border border-[var(--dashboard-border)] bg-white/4" />
          </div>

          <div className="space-y-4">
            <div className="h-4 w-20 rounded bg-white/8" />
            <div className="h-12 w-56 rounded bg-white/10" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`history-skeleton-${index}`}
                  className="h-24 rounded-[14px] border border-[var(--dashboard-border)] bg-white/4"
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
