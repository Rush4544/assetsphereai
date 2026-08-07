import { Boxes, Network, Radio, Truck, Wrench, BarChart3 } from "lucide-react";

const orbit = [
  { icon: Boxes, label: "Assets" },
  { icon: Network, label: "Network" },
  { icon: Radio, label: "RFID" },
  { icon: Truck, label: "Fleet" },
  { icon: Wrench, label: "Maintenance" },
  { icon: BarChart3, label: "Reports" },
];

export default function HeroSphere() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div className="absolute inset-8 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute inset-0 rounded-full border border-white/10" />
      <div className="absolute inset-10 rounded-full border border-white/10" />
      <div className="absolute inset-20 rounded-full border border-white/10" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex size-28 flex-col items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-2xl">
          <Radio className="size-7" />
          <span className="mt-1 text-[11px] font-medium">AssetSphere</span>
        </div>
      </div>
      {orbit.map((item, i) => {
        const angle = (i / orbit.length) * Math.PI * 2;
        const r = 42;
        const left = 50 + Math.cos(angle) * r;
        const top = 50 + Math.sin(angle) * r;
        return (
          <div
            key={item.label}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            <span className="flex size-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white backdrop-blur">
              <item.icon className="size-5" />
            </span>
            <span className="text-[10px] text-white/60">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}