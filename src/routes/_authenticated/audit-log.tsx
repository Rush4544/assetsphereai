import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/audit-log")({
  head: () => ({
    meta: [
      { title: "Audit Log — AssetSphere AI" },
      { name: "description", content: "Immutable record of every change made in your organization." },
      { property: "og:title", content: "Audit Log — AssetSphere AI" },
      { property: "og:description", content: "Immutable record of every change made in your organization." },
    ],
  }),
  component: AuditLogPage,
});

function AuditLogPage() {
  return <ComingSoon title="Audit Log" description="Immutable record of every change made in your organization." icon="ScrollText" />;
}
