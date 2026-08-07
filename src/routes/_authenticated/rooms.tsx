import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { roomsConfig } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/rooms")({
  head: () => ({
    meta: [
      { title: "Rooms — AssetSphere AI" },
      { name: "description", content: "Rooms and floors inside each building." },
      { property: "og:title", content: "Rooms — AssetSphere AI" },
      { property: "og:description", content: "Rooms and floors inside each building." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RoomsPage,
});

function RoomsPage() {
  return <ResourcePage config={roomsConfig} />;
}
