import { AssistantDashboardClient } from "@/components/assistants/AssistantDashboardClient";
import { Container } from "@/components/layout/Container";
import { SiteHeader } from "@/components/layout/SiteHeader";
import {
  listAssistantTemplates,
  listUserAssistants,
} from "@/lib/assistants/repository";
import {
  createServerSupabaseClient,
  requireUser,
} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");
  const supabase = await createServerSupabaseClient();
  const [templates, assistants] = await Promise.all([
    listAssistantTemplates(supabase),
    listUserAssistants(supabase, user.id),
  ]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="py-12">
        <Container>
          <AssistantDashboardClient
            assistants={assistants}
            templates={templates}
            userEmail={user.email}
          />
        </Container>
      </main>
    </div>
  );
}
