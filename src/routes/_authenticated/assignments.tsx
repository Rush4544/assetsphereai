import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { assignmentsConfig } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/assignments")({
  head: () => ({
    meta: [
      { title: "Assignments — AssetSphere AI" },
      { name: "description", content: "Who holds which asset, and its assignment history." },
      { property: "og:title", content: "Assignments — AssetSphere AI" },
      { property: "og:description", content: "Who holds which asset, and its assignment history." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssignmentsPage,
});

function AssignmentsPage() {
  return <ResourcePage config={assignmentsConfig} />;
}
