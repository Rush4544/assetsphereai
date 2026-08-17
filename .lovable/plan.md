# Real GPS tracking for vehicles

Yes — both hardware trackers and driver phones can feed the live map. The map already redraws whenever a vehicle row's position changes, so all we need is a way for real devices to write those positions.

## 1. Device tokens per vehicle

Each vehicle gets a tracking token you can copy from its row ("Tracking" panel: token, device endpoint URL, and a phone driver link/QR). Tokens can be regenerated if a device is lost or reassigned.

## 2. Hardware tracker ingest endpoint

A public ingest endpoint that GPS/telematics devices (Teltonika, Queclink, Samsara, Geotab, or any tracker that can POST HTTP JSON) call with the token:

- Accepts latitude, longitude, and optionally speed, heading, odometer, fuel level, and timestamp.
- Validates the token, rejects bad coordinates, then updates that vehicle's position, speed, heading, mileage and last-update time.
- Recomputes whether the vehicle is inside its assigned geofence, so breaches light up on the map automatically.
- Rejects anything without a valid token; no user login required, and one token can only ever move one vehicle.

## 3. Phone driver mode

A "Driver mode" page a driver opens on their phone (from the vehicle's tracking link, no app install):

- Big Start/Stop tracking button; shows current position accuracy, speed and last upload time.
- While active, the browser's GPS reports position and it posts to the same ingest endpoint every ~10 seconds (or when the vehicle has moved enough), so the pin moves on the fleet map in real time.
- Handles permission denied, no signal, and backgrounding gracefully with a clear status message, and warns that the screen must stay awake for continuous tracking.

## 4. Map and vehicle page changes

- The existing "Start demo motion" toggle is relabelled as clearly simulated and hidden once a vehicle has reported a real position in the last hour.
- Each vehicle shows its live source (hardware device, phone, or no data) plus the age of its last position; stale positions (over 15 minutes) render dimmed.

Latest position only — no history table or trip replay, per your choice.

## Technical notes

- Migration: add `tracking_token` (unique) and `tracking_source` to `public.vehicles`; token stays admin-visible only through existing org-scoped policies.
- Ingest lives at `src/routes/api/public/vehicle-ping.ts` (TanStack server route) so external devices get a stable URL that bypasses site auth; token verified in-handler against a service-role lookup, Zod-validated body, no PII returned in the response.
- Driver mode is a public route `src/routes/track.$token.tsx` using the browser Geolocation API inside `useEffect`, posting to the ingest endpoint — no Supabase session needed.
- Geofence containment computed server-side with a haversine distance check against the assigned geofence radius.
- `FleetMapCanvas` keeps its existing realtime subscription; only marker styling and the demo toggle change.
