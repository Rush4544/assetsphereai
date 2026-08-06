import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/assignments")({
  head: () => ({
    meta: [
      { title: "Assignments — AssetSphere AI" },
      { name: "description", content: "Who holds which asset, and its assignment history." },
      { property: "og:title", content: "Assignments — AssetSphere AI" },
      { property: "og:description", content: "Who holds which asset, and its assignment history." },
    ],
  }),
  component: AssignmentsPage,
});

function AssignmentsPage() {
  return <ComingSoon title="Assignments" description="Who holds which asset, and its assignment history." icon="UserCheck" />;
}
