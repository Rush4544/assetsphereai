-- 1. Remove all anonymous (public internet) read access to tenant data.
drop policy if exists "demo org public read" on public.assets;
drop policy if exists "demo org public read" on public.asset_assignments;
drop policy if exists "demo org public read" on public.asset_categories;
drop policy if exists "demo org public read" on public.audit_logs;
drop policy if exists "demo org public read" on public.buildings;
drop policy if exists "demo org public read" on public.departments;
drop policy if exists "demo org public read" on public.distribution_requests;
drop policy if exists "demo org public read" on public.geofences;
drop policy if exists "demo org public read" on public.invoices;
drop policy if exists "demo org public read" on public.maintenance_records;
drop policy if exists "demo org public read" on public.network_devices;
drop policy if exists "demo org public read" on public.organizations;
drop policy if exists "demo org public read" on public.rfid_alerts;
drop policy if exists "demo org public read" on public.rfid_deployment_requests;
drop policy if exists "demo org public read" on public.rfid_detections;
drop policy if exists "demo org public read" on public.rfid_gateways;
drop policy if exists "demo org public read" on public.rfid_readers;
drop policy if exists "demo org public read" on public.rfid_tags;
drop policy if exists "demo org public read" on public.rfid_zones;
drop policy if exists "demo org public read" on public.rooms;
drop policy if exists "demo org public read" on public.software_licenses;
drop policy if exists "demo org public read" on public.vehicle_service_records;
drop policy if exists "demo org public read" on public.vehicles;
drop policy if exists "demo org public read" on public.vendors;
drop policy if exists "sites demo read" on public.sites;
drop policy if exists "asset_types demo read" on public.asset_types;
drop policy if exists "sr demo read" on public.service_requests;
drop policy if exists "wo demo read" on public.work_orders;
drop policy if exists "mp demo read" on public.maintenance_plans;
drop policy if exists "inv demo read" on public.inventory_items;
drop policy if exists "invtx demo read" on public.inventory_transactions;
drop policy if exists "iot demo read" on public.iot_devices;
drop policy if exists "iotr demo read" on public.iot_readings;
drop policy if exists "auto demo read" on public.automation_rules;
drop policy if exists "int demo read" on public.integrations;
drop policy if exists "doc demo read" on public.documents;

-- Remove the underlying anon table grants so no future policy can leak data by accident.
do $$
declare t text;
begin
  for t in
    select tablename from pg_tables where schemaname = 'public'
  loop
    execute format('revoke all on public.%I from anon', t);
  end loop;
end $$;

-- 2. Organizations may only be created by the authenticated user as their own record.
drop policy if exists "orgs creatable by authenticated" on public.organizations;
create policy "orgs creatable by owner"
on public.organizations for insert to authenticated
with check (created_by_id = auth.uid() and status = 'active');

-- 3. Storage: files in asset-files are only accessible to their uploader (or super admins).
drop policy if exists "asset files read" on storage.objects;
drop policy if exists "asset files insert" on storage.objects;
drop policy if exists "asset files update" on storage.objects;
drop policy if exists "asset files delete" on storage.objects;

create policy "asset files read own"
on storage.objects for select to authenticated
using (bucket_id = 'asset-files' and (owner = auth.uid() or public.is_super_admin()));

create policy "asset files insert own"
on storage.objects for insert to authenticated
with check (bucket_id = 'asset-files' and owner = auth.uid());

create policy "asset files update own"
on storage.objects for update to authenticated
using (bucket_id = 'asset-files' and (owner = auth.uid() or public.is_super_admin()))
with check (bucket_id = 'asset-files' and (owner = auth.uid() or public.is_super_admin()));

create policy "asset files delete own"
on storage.objects for delete to authenticated
using (bucket_id = 'asset-files' and (owner = auth.uid() or public.is_super_admin()));

-- 4. SECURITY DEFINER functions: no anonymous execution, and trigger-only
--    functions are not callable through the API at all.
revoke all on function public.current_org_id() from anon;
revoke all on function public.has_role(uuid, public.app_role) from anon;
revoke all on function public.is_operator() from anon;
revoke all on function public.is_org_admin() from anon;
revoke all on function public.is_super_admin() from anon;
revoke all on function public.list_organizations() from anon;
revoke all on function public.list_organizations() from authenticated;
revoke all on function public.handle_new_user() from anon, authenticated;
revoke all on function public.set_updated_at() from anon, authenticated;