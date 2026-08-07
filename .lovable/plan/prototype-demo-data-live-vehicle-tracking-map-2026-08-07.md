# Prototype demo data + live vehicle tracking map

## 1. Demo data (Ontario-based)

Seed a rich demo dataset so every page, KPI and chart has something real to show. All rows belong to one demo company ("Northbridge Facilities Group", Ontario), plus a smaller second company so the Super Admin portal shows multiple tenants.

Approximate volumes:
- 4 buildings + 30 rooms across Toronto, Mississauga, Ottawa, Hamilton
- 10 departments, 12 asset categories, 15 vendors
- 40 assets (laptops, servers, printers, industrial/medical equipment) with purchase price, warranty, condition, location and network detail
- 30 maintenance records (completed / scheduled / overdue mix), 25 assignments, 25 distribution requests
- 25 software licences (some expiring, some over-seat), 30 network devices
- 18 vehicles across Ontario with GPS coordinates, drivers, fuel, odometer, service dates
- 25 vehicle service records
- 8 geofences (depots, service yards, city zones) with radius, speed limits and entry/exit alerting
- RFID: 30 tags, 12 readers, 5 gateways, 8 zones, 60 detections, 20 alerts, 6 deployment requests
- 20 invoices and ~40 audit log entries

Your existing account is attached to the main demo company as an admin so the app looks populated when signed in, and owner preview keeps working as-is.

## 2. Live vehicle tracking map

A new map component used on both the **Vehicles** and **Geofences** pages (tabbed: "Table" / "Live map").

- Interactive Ontario map with a marker per vehicle: colour by status, popup showing driver, speed, fuel, odometer, last update and current geofence.
- Geofence circles drawn on the map in their own colour, highlighted when a vehicle sits outside an active fence (breach).
- Side panel listing vehicles, breaches first; clicking one pans and zooms to it.
- **Real-time**: subscribes to database changes on vehicles, so any GPS update moves the pin instantly.
- **Demo motion toggle**: when on, vehicles advance along their heading every few seconds (speed, heading, mileage update, breach recomputed) and write back to the database, so the map visibly moves without hardware. Off by default and clearly labelled as demo.
- KPIs above the map: moving now, idle, breaches, average fuel.

## Technical notes

- Data seeded via a migration containing literal INSERT statements; schema unchanged.
- Map uses Leaflet + react-leaflet with OpenStreetMap tiles (no API key). Loaded client-only via `React.lazy` inside `<ClientOnly>` so SSR never touches browser globals; Leaflet CSS via a `<link>` in the root route head.
- Realtime enabled on `public.vehicles` with `ALTER PUBLICATION supabase_realtime ADD TABLE`; subscription created in `useEffect` with channel teardown on unmount.
- Demo motion runs client-side on an interval and writes position updates through the existing RLS-scoped client; interval cleared on unmount and when toggled off.
- Vehicles/Geofences routes gain a Tabs shell wrapping the existing `ResourcePage` config, so current CRUD behaviour is untouched.