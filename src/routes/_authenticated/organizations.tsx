import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/organizations")({
  head: () => ({
    meta: [
      { title: "Organizations — AssetSphere AI" },
      { name: "description", content: "Tenant management across the platform." },
      { property: "og:title", content: "Organizations — AssetSphere AI" },
      { property: "og:description", content: "Tenant management across the platform." },
    ],
  }),
  component: OrganizationsPage,
});

function OrganizationsPage() {
  return <ComingSoon title="Organizations" description="Tenant management across the platform." icon="Landmark" />;
}
