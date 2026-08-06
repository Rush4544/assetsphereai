import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/rfid/readers")({
  head: () => ({
    meta: [
      { title: "RFID Readers — AssetSphere AI" },
      { name: "description", content: "Readers, gateways, firmware and heartbeat status." },
      { property: "og:title", content: "RFID Readers — AssetSphere AI" },
      { property: "og:description", content: "Readers, gateways, firmware and heartbeat status." },
    ],
  }),
  component: RfidReadersPage,
});

function RfidReadersPage() {
  return <ComingSoon title="RFID Readers" description="Readers, gateways, firmware and heartbeat status." icon="ScanLine" />;
}
