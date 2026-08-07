import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { softwareConfig } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/software")({
  head: () => ({
    meta: [
      { title: "Software Licences — AssetSphere AI" },
      { name: "description", content: "Licence inventory, seat usage, renewals and compliance posture." },
      { property: "og:title", content: "Software Licences — AssetSphere AI" },
      { property: "og:description", content: "Licence inventory, seat usage, renewals and compliance posture." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SoftwarePage,
});

function SoftwarePage() {
  return <ResourcePage config={softwareConfig} />;
}
