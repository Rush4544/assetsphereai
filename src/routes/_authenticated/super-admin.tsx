import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/super-admin")({
  head: () => ({
    meta: [
      { title: "Super Admin Portal — AssetSphere AI" },
      { name: "description", content: "Platform-wide administration and diagnostics." },
      { property: "og:title", content: "Super Admin Portal — AssetSphere AI" },
      { property: "og:description", content: "Platform-wide administration and diagnostics." },
    ],
  }),
  component: SuperAdminPage,
});

function SuperAdminPage() {
  return <ComingSoon title="Super Admin Portal" description="Platform-wide administration and diagnostics." icon="Crown" />;
}
