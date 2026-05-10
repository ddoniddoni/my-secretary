export default function RootLoading() {
  return (
    <div className="pixel-os-theme min-h-screen bg-[var(--dashboard-bg)] p-2 sm:p-3 lg:p-4">
      <div className="pixel-window mx-auto flex min-h-[calc(100vh-1rem)] max-w-[1680px] flex-col overflow-hidden">
        <div className="pixel-window-bar h-[72px] border-b border-[var(--dashboard-divider)]" />
        <div className="flex flex-1 flex-col lg:flex-row">
          <aside className="pixel-sidebar border-b border-[var(--dashboard-divider)] p-6 lg:w-[270px] lg:border-b-0 lg:border-r">
            <div className="h-28 rounded-[10px] bg-white/5" />
            <div className="mt-6 grid gap-3">
              <div className="h-14 rounded-[8px] bg-white/6" />
              <div className="h-14 rounded-[8px] bg-white/5" />
              <div className="h-14 rounded-[8px] bg-white/5" />
            </div>
          </aside>
          <main className="pixel-main flex-1 px-5 py-6 sm:px-7 lg:px-9 lg:py-7">
            <div className="h-10 w-72 rounded bg-white/8" />
            <div className="mt-5 h-5 w-[480px] max-w-full rounded bg-white/6" />
            <div className="mt-8 grid gap-5 xl:grid-cols-2 2xl:grid-cols-3">
              <div className="h-80 rounded-[12px] border border-[var(--dashboard-border)] bg-white/4" />
              <div className="h-80 rounded-[12px] border border-[var(--dashboard-border)] bg-white/4" />
              <div className="h-80 rounded-[12px] border border-[var(--dashboard-border)] bg-white/4" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
