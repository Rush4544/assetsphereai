import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

const FleetMapCanvas = lazy(() => import("./FleetMapCanvas"));

function MapFallback() {
  return (
    <div className="glass-card flex h-[620px] items-center justify-center">
      <Loader2 className="size-5 animate-spin text-primary" />
    </div>
  );
}

/** Live fleet map. Leaflet is browser-only, so it loads after hydration. */
export function FleetMap({ focusGeofences = false }: { focusGeofences?: boolean }) {
  return (
    <ClientOnly fallback={<MapFallback />}>
      <Suspense fallback={<MapFallback />}>
        <FleetMapCanvas focusGeofences={focusGeofences} />
      </Suspense>
    </ClientOnly>
  );
}