import { AssistantDashboardClient } from "@/components/assistants/AssistantDashboardClient";
import { DashboardGuestGate } from "@/components/auth/DashboardGuestGate";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { fallbackPreviewTemplates } from "@/lib/assistants/preview";
import {
  listAssistantTemplates,
  listUserAssistants,
} from "@/lib/assistants/repository";
import { getAuthErrorMessage } from "@/lib/supabase/auth";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import {
  createServerSupabaseClient,
  getCurrentUser,
} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const canUseSupabase = hasSupabaseEnv();
  const supabase = canUseSupabase ? await createServerSupabaseClient() : null;
  const user = canUseSupabase ? await getCurrentUser() : null;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const authErrorMessage = getAuthErrorMessage(resolvedSearchParams?.error);

  let templates = fallbackPreviewTemplates;

  if (supabase) {
    const loadedTemplates = await listAssistantTemplates(supabase);

    templates =
      loadedTemplates.length > 0 ? loadedTemplates : fallbackPreviewTemplates;
  }

  if (!user) {
    return (
      <DashboardShell guestMode userEmail={null}>
        <DashboardGuestGate
          authErrorMessage={authErrorMessage}
          loginEnabled={canUseSupabase}
          templates={templates}
        />
      </DashboardShell>
    );
  }

  if (!supabase) {
    return (
      <DashboardShell guestMode userEmail={null}>
        <DashboardGuestGate
          authErrorMessage="Supabase 연결이 아직 준비되지 않아 로그인 대시보드를 열 수 없어요."
          loginEnabled={false}
          templates={templates}
        />
      </DashboardShell>
    );
  }

  const assistants = await listUserAssistants(supabase, user.id);

  return (
    <DashboardShell userEmail={user.email}>
      <AssistantDashboardClient
        assistants={assistants}
        templates={templates}
        userEmail={user.email}
      />
    </DashboardShell>
  );
}
