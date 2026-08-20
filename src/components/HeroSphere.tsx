/**
 * Animated orbital asset sphere for the marketing hero.
 * Pure CSS + SVG (no 3D dependency), theme-token driven so it works in
 * light and dark. Deterministic geometry => SSR-safe, no hydration drift.
 */

const NODES = Array.from({ length: 18 }, (_, i) => {
  const angle = (i / 18) * Math.PI * 2;
  const radius = 34 + (i % 3) * 6;
  return {
    top: 50 + Math.sin(angle) * radius * 0.55,
    left: 50 + Math.cos(angle) * radius,
    size: i % 4 === 0 ? 7 : 4,
    delay: (i % 6) * 0.4,
  };
});

export default function HeroSphere({
  className = "relative mx-auto aspect-square w-full max-w-md",
}: {
  className?: string;
}) {
  return (
    <div className={className} aria-hidden="true">
      {/* ambient glow */}
      <div className="absolute inset-[12%] rounded-full bg-primary/20 blur-3xl" />

      {/* rotating rings */}
      <div className="absolute inset-0 animate-[spin_28s_linear_infinite]">
        <div className="absolute inset-[8%] rounded-full border border-primary/30" />
        <div className="absolute inset-[8%] rounded-full border border-primary/20 [transform:rotateX(72deg)]" />
        <div className="absolute inset-[18%] rounded-full border border-chart-3/30 [transform:rotateY(70deg)]" />
      </div>
      <div className="absolute inset-0 animate-[spin_44s_linear_infinite_reverse]">
        <div className="absolute inset-[2%] rounded-full border border-dashed border-foreground/10" />
        <div className="absolute inset-[26%] rounded-full border border-chart-3/25 [transform:rotateX(60deg)_rotateY(28deg)]" />
      </div>

      {/* latitude / longitude wireframe */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-primary/25" />
        {[10, 22, 34].map((ry) => (
          <ellipse key={ry} cx="50" cy="50" rx="42" ry={ry} fill="none" stroke="currentColor" strokeWidth="0.25" className="text-foreground/12" />
        ))}
        {[10, 22, 34].map((rx) => (
          <ellipse key={`v${rx}`} cx="50" cy="50" rx={rx} ry="42" fill="none" stroke="currentColor" strokeWidth="0.25" className="text-foreground/12" />
        ))}
      </svg>

      {/* orbiting asset nodes */}
      {NODES.map((n, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-primary shadow-[0_0_10px_2px_hsl(var(--primary)/0.5)] animate-pulse"
          style={{
            top: `${n.top}%`,
            left: `${n.left}%`,
            width: n.size,
            height: n.size,
            marginLeft: -n.size / 2,
            marginTop: -n.size / 2,
            animationDelay: `${n.delay}s`,
            animationDuration: "3.2s",
          }}
        />
      ))}

      {/* glowing core */}
      <div className="absolute left-1/2 top-1/2 size-[26%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary to-chart-3 opacity-90 blur-[1px]" />
      <div className="absolute left-1/2 top-1/2 size-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15" />
    </div>
  );
}
