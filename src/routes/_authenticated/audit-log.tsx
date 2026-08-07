import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { auditLogConfig } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/audit-log")({
  head: () => ({
    meta: [
      { title: "Audit Log — AssetSphere AI" },
      { name: "description", content: "Immutable trail of everything that happened in your organization." },
      { property: "og:title", content: "Audit Log — AssetSphere AI" },
      { property: "og:description", content: "Immutable trail of everything that happened in your organization." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuditLogPage,
});

function AuditLogPage() {
  return <ResourcePage config={auditLogConfig} />;
}
