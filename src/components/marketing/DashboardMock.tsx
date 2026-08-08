import { ArrowUpRight, Boxes, Truck, Wrench } from "lucide-react";

const bars = [38, 52, 44, 66, 58, 72, 61, 80, 69, 88, 76, 94];

export function DashboardMock() {
  return (
    <div className="hero-card w-full overflow-hidden p-3 shadow-2xl">
      <div className="flex items-center gap-1.5 px-1 pb-3">
        <span className="size-2 rounded-full bg-destructive/70" />
        <span className="size-2 rounded-full bg-warning/70" />
        <span className="size-2 rounded-full bg-success/70" />
        <span className="ml-3 text-[10px] text-hero-muted">app.assetsphere.ai/dashboard</span>
      </div>

      <div className="rounded-lg border border-hero-line p-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Assets tracked", value: "3,647", icon: Boxes },
            { label: "Open work orders", value: "128", icon: Wrench },
            { label: "Vehicles live", value: "31", icon: Truck },
          ].map((k) => (
            <div key={k.label} className="rounded-md border border-hero-line px-2.5 py-2">
              <div className="flex items-center justify-between text-hero-muted">
                <span className="text-[9px] uppercase tracking-wide">{k.label}</span>
                <k.icon className="size-3" />
              </div>
              <p className="mt-1 text-base font-semibold text-hero-foreground">{k.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 flex h-24 items-end gap-1.5">
          {bars.map((b, i) => (
            <span
              key={i}
              className="flex-1 rounded-sm bg-primary/80"
              style={{ height: `${b}%` }}
            />
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-md border border-hero-line px-2.5 py-2">
            <p className="text-[9px] uppercase tracking-wide text-hero-muted">Uptime compliance</p>
            <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-success">
              98.4% <ArrowUpRight className="size-3" />
            </p>
          </div>
          <div className="rounded-md border border-hero-line px-2.5 py-2">
            <p className="text-[9px] uppercase tracking-wide text-hero-muted">Maintenance cost</p>
            <p className="mt-1 text-sm font-semibold text-hero-foreground">$42,180</p>
          </div>
        </div>
      </div>
    </div>
  );
}