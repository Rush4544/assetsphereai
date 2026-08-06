import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/rfid/settings")({
  head: () => ({
    meta: [
      { title: "RFID Settings — AssetSphere AI" },
      { name: "description", content: "Provider configuration and alert routing." },
      { property: "og:title", content: "RFID Settings — AssetSphere AI" },
      { property: "og:description", content: "Provider configuration and alert routing." },
    ],
  }),
  component: RfidSettingsPage,
});

function RfidSettingsPage() {
  return <ComingSoon title="RFID Settings" description="Provider configuration and alert routing." icon="Settings2" />;
}
