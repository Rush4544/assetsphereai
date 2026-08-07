import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { organizationsConfig } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/organizations")({
  head: () => ({
    meta: [
      { title: "Organizations — AssetSphere AI" },
      { name: "description", content: "Every tenant on the platform, their plan and usage limits." },
      { property: "og:title", content: "Organizations — AssetSphere AI" },
      { property: "og:description", content: "Every tenant on the platform, their plan and usage limits." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrganizationsPage,
});

function OrganizationsPage() {
  return <ResourcePage config={organizationsConfig} />;
}
