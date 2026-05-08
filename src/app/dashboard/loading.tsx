import { Container } from "@/components/layout/Container";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="py-12">
        <Container className="space-y-6">
          <div className="surface-panel h-52 rounded-[2rem] border" />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="surface-panel h-32 rounded-[1.75rem] border" />
            <div className="surface-panel h-32 rounded-[1.75rem] border" />
            <div className="surface-panel h-32 rounded-[1.75rem] border" />
          </div>
          <div className="surface-panel h-64 rounded-[2rem] border" />
        </Container>
      </main>
    </div>
  );
}
