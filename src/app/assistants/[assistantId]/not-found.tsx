import Link from "next/link";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatePanel } from "@/components/shared/StatePanel";

export default function AssistantDetailNotFound() {
  return (
    <DashboardShell demoMode userEmail="preview@pixel.local">
      <div className="mx-auto max-w-3xl py-10">
        <StatePanel
          align="center"
          description="The assistant may have been deleted, or the current user does not have access to this record."
          eyebrow="Not found"
          title="We could not find that assistant"
          tone="warning"
          action={
            <Link
              href="/"
              className="pixel-button pixel-button-primary px-6 text-sm"
            >
              Back to dashboard
            </Link>
          }
        />
      </div>
    </DashboardShell>
  );
}
