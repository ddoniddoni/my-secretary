import { Container } from "@/components/layout/Container";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function AssistantDetailLoading() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="py-12">
        <Container className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_320px]">
          <div className="surface-panel h-[32rem] rounded-[2rem] border" />
          <div className="space-y-6">
            <div className="surface-panel h-44 rounded-[2rem] border" />
            <div className="surface-panel h-44 rounded-[2rem] border" />
          </div>
        </Container>
      </main>
    </div>
  );
}
