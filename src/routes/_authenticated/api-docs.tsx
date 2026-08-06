import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/api-docs")({
  head: () => ({
    meta: [
      { title: "API Documentation — AssetSphere AI" },
      { name: "description", content: "Endpoints for integrating external systems and agents." },
      { property: "og:title", content: "API Documentation — AssetSphere AI" },
      { property: "og:description", content: "Endpoints for integrating external systems and agents." },
    ],
  }),
  component: ApiDocsPage,
});

function ApiDocsPage() {
  return <ComingSoon title="API Documentation" description="Endpoints for integrating external systems and agents." icon="Code2" />;
}
