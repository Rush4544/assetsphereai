import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/software")({
  head: () => ({
    meta: [
      { title: "Software Licences — AssetSphere AI" },
      { name: "description", content: "Licence keys, seats, renewals and compliance." },
      { property: "og:title", content: "Software Licences — AssetSphere AI" },
      { property: "og:description", content: "Licence keys, seats, renewals and compliance." },
    ],
  }),
  component: SoftwarePage,
});

function SoftwarePage() {
  return <ComingSoon title="Software Licences" description="Licence keys, seats, renewals and compliance." icon="AppWindow" />;
}
