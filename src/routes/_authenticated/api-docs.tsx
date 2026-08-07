import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";

const ENTITIES = [
  ["assets", "Assets, financials, location and technical detail"],
  ["asset_categories", "Category tree with lifecycle and depreciation defaults"],
  ["asset_assignments", "Assignment and return history per person"],
  ["distribution_requests", "Requests to issue assets to staff"],
  ["maintenance_records", "Preventive and corrective maintenance jobs"],
  ["software_licenses", "Licence seats, renewals and compliance"],
  ["vehicles", "Fleet records with GPS, mileage and tyres"],
  ["vehicle_service_records", "Fleet service and tyre history"],
  ["geofences", "Fleet geofences and speed limits"],
  ["network_devices", "Discovered network endpoints"],
  ["buildings / rooms / departments", "Location and org structure"],
  ["vendors", "Suppliers and contracts"],
  ["rfid_tags / readers / gateways / zones", "RFID hardware estate"],
  ["rfid_detections / rfid_alerts", "Movement stream and alerting"],
  ["organizations / invoices", "Tenants and billing"],
  ["audit_logs", "Append-only activity trail"],
];

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
  return (
    <div className="space-y-6">
      <PageHeader
        title="API Documentation"
        description="How to integrate external systems, RFID middleware and network scanners with AssetSphere AI."
      />

      <section className="glass-card space-y-3 p-6">
        <h2 className="text-sm font-semibold">Authentication</h2>
        <p className="text-sm text-muted-foreground">
          The data API is served by your Lovable Cloud backend. Every request must carry the
          publishable key in the <code className="rounded bg-secondary px-1">apikey</code> header and a
          user access token in <code className="rounded bg-secondary px-1">Authorization: Bearer &lt;token&gt;</code>.
          Row level security scopes every response to the caller&apos;s organization, so a token from
          one company can never read another company&apos;s rows.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-secondary p-4 text-xs">{`curl "$API_URL/rest/v1/assets?select=*&limit=20" \\
  -H "apikey: $PUBLISHABLE_KEY" \\
  -H "Authorization: Bearer $ACCESS_TOKEN"`}</pre>
      </section>

      <section className="glass-card space-y-3 p-6">
        <h2 className="text-sm font-semibold">Writing data</h2>
        <p className="text-sm text-muted-foreground">
          Inserts and updates use the same collection paths. Only technicians, admins and super
          admins may write; ordinary users have read-only access.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-secondary p-4 text-xs">{`curl -X POST "$API_URL/rest/v1/rfid_detections" \\
  -H "apikey: $PUBLISHABLE_KEY" \\
  -H "Authorization: Bearer $ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"tag_id":"E280-1160-0000","reader_name":"Dock-01","zone_name":"Loading Bay","direction":"entry","movement_status":"normal"}'`}</pre>
      </section>

      <section className="glass-card space-y-3 p-6">
        <h2 className="text-sm font-semibold">Webhooks and middleware</h2>
        <p className="text-sm text-muted-foreground">
          RFID gateways and network scanners should post batches to a signed public endpoint under{" "}
          <code className="rounded bg-secondary px-1">/api/public/…</code> on your published domain.
          Every request is signature-verified server side before anything is written.
        </p>
      </section>

      <section className="glass-card p-6">
        <h2 className="text-sm font-semibold">Collections</h2>
        <div className="mt-4 divide-y divide-border">
          {ENTITIES.map(([name, desc]) => (
            <div key={name} className="flex flex-wrap items-baseline justify-between gap-2 py-2">
              <code className="text-xs font-medium">{name}</code>
              <span className="text-xs text-muted-foreground">{desc}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
