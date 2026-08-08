import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { automationConfig } from "@/lib/resources.universal";

export const Route = createFileRoute("/_authenticated/automation")({
  head: () => ({
    meta: [
      { title: "Automation — AssetSphere AI" },
      { name: "description", content: "No-code IF/THEN rules that create work, notify people and flag risk." },
      { property: "og:title", content: "Automation — AssetSphere AI" },
      { property: "og:description", content: "No-code IF/THEN rules that create work, notify people and flag risk." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AutomationPage,
});

function AutomationPage() {
  return <ResourcePage config={automationConfig} />;
}
