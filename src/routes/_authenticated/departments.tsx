import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/departments")({
  head: () => ({
    meta: [
      { title: "Departments — AssetSphere AI" },
      { name: "description", content: "Departments, cost centres and reporting lines." },
      { property: "og:title", content: "Departments — AssetSphere AI" },
      { property: "og:description", content: "Departments, cost centres and reporting lines." },
    ],
  }),
  component: DepartmentsPage,
});

function DepartmentsPage() {
  return <ComingSoon title="Departments" description="Departments, cost centres and reporting lines." icon="Building2" />;
}
