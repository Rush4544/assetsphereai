import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/rfid/assets")({
  head: () => ({
    meta: [
      { title: "RFID Tagged Assets — AssetSphere AI" },
      { name: "description", content: "Assets linked to RFID tags and their last known zone." },
      { property: "og:title", content: "RFID Tagged Assets — AssetSphere AI" },
      { property: "og:description", content: "Assets linked to RFID tags and their last known zone." },
    ],
  }),
  component: RfidAssetsPage,
});

function RfidAssetsPage() {
  return <ComingSoon title="RFID Tagged Assets" description="Assets linked to RFID tags and their last known zone." icon="Tags" />;
}
