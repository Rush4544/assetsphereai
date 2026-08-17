# Plug-in vehicle tracker integration (OBD-II telematics)

Yes — a device plugged into the car's OBD-II port can send location plus real engine data (speed, fuel level, odometer, engine hours, fault codes), and we can show all of it live on your dashboard. You assign a device to a vehicle once, and everything after that is automatic.

## Which device to use

All of these plug into the OBD-II port (under the dash) and can push data to a URL we own, so no dealer or hardware integration work is needed.

- **Teltonika FMC003 / FMC130** (recommended). OBD-II plug-in, reads fuel level, odometer, RPM, coolant temp, fault codes, plus GPS. Sends over cellular to any HTTP/TCP endpoint. Widely available, works on Canadian LTE, roughly $70-120 per unit plus a SIM/data plan (~$5-10/month).
- **Queclink GV500MAP** — similar OBD-II unit, good North American carrier support.
- **Fleet platform route instead of raw devices**: Samsara, Geotab, or Motive give you a plug-in device plus their own API. More expensive per vehicle per month, but no SIM management. We read from their API instead of a direct device feed.

Recommendation: start with Teltonika FMC003 + a data SIM. One device per vehicle, no wiring, driver just plugs it in.

## What the dashboard will show per vehicle

Live from the device, no manual entry:
- Location on the fleet map, heading, current speed, ignition on/off, trip in progress
- Fuel level %, fuel consumed, odometer (total km) and daily km
- Engine hours, battery voltage, coolant temperature
- Diagnostic fault codes (check engine), surfaced as an alert
- Service due status calculated from real odometer/engine hours instead of guessed dates
- Harsh braking / acceleration / speeding and geofence entry/exit events

## How the assignment works

A "Devices" section under Fleet:
1. Add a device: enter its IMEI/serial and pick a make (Teltonika, Queclink, other).
2. Assign it to a vehicle from a dropdown. One device, one vehicle; reassigning moves the feed instantly.
3. Status column shows Online / Last seen / signal so you know a unit stopped reporting.

Once assigned, every incoming message from that IMEI updates that vehicle automatically.

## Ingest endpoint

A single public endpoint devices post to (configured once in the device with your project URL and a shared token):
- Accepts JSON payloads with IMEI, position, speed, heading, and any of the OBD values above.
- Rejects unknown IMEIs and bad tokens; validates ranges (lat/lng, fuel 0-100, non-decreasing odometer) so a glitching unit can't corrupt your data.
- Updates the vehicle row, recomputes geofence breach, and writes fault codes and threshold breaches as alerts.
- Latest position only (no route history/replay), per your earlier choice.

## Fallback: driver phone

Keeps the phone "Driver mode" page as a backup for vehicles without a device — it reports location only (a phone can't read fuel or odometer).

## Technical notes

- New table `public.telematics_devices` (imei unique, provider, vehicle_id, last_seen_at, token hash, org-scoped RLS + grants). New columns on `vehicles` for engine_hours, battery_voltage, coolant_temp, ignition_on, fuel_consumed_l, fault_codes.
- Ingest at `src/routes/api/public/telematics.ts` (TanStack server route, Zod-validated, bearer/shared-token verified in-handler, `supabaseAdmin` imported inside the handler). Devices are pointed at the stable `project--<id>.lovable.app` URL.
- Teltonika/Queclink speak binary Codec8 over TCP natively; we use their HTTP/JSON forwarding mode (or a small vendor cloud "data push" webhook) so the endpoint stays a plain HTTPS POST.
- Vehicles page gains a "Telematics" tab with the device register and live telemetry cards; `FleetMapCanvas` keeps its existing realtime subscription and gains the extra popup fields. Demo motion toggle hidden for vehicles reporting real data.
