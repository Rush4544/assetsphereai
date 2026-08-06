import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AssetSphere AI" },
      { name: "description", content: "Organization profile, branding, billing and preferences." },
      { property: "og:title", content: "Settings — AssetSphere AI" },
      { property: "og:description", content: "Organization profile, branding, billing and preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return <ComingSoon title="Settings" description="Organization profile, branding, billing and preferences." icon="Settings" />;
}
