import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/network")({
  head: () => ({
    meta: [
      { title: "Network Discovery — AssetSphere AI" },
      { name: "description", content: "Discovered devices, topology and access-point mapping." },
      { property: "og:title", content: "Network Discovery — AssetSphere AI" },
      { property: "og:description", content: "Discovered devices, topology and access-point mapping." },
    ],
  }),
  component: NetworkPage,
});

function NetworkPage() {
  return <ComingSoon title="Network Discovery" description="Discovered devices, topology and access-point mapping." icon="Network" />;
}
