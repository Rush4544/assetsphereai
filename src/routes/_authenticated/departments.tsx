import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { departmentsConfig } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/departments")({
  head: () => ({
    meta: [
      { title: "Departments — AssetSphere AI" },
      { name: "description", content: "Departments, cost centres and reporting lines." },
      { property: "og:title", content: "Departments — AssetSphere AI" },
      { property: "og:description", content: "Departments, cost centres and reporting lines." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DepartmentsPage,
});

function DepartmentsPage() {
  return <ResourcePage config={departmentsConfig} />;
}
