-- ============ SITES ============
create table public.sites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  site_type text not null default 'site',
  address text, city text, province_state text, country text,
  gps_lat numeric, gps_lng numeric,
  notes text,
  status text not null default 'active',
  created_by_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.sites to authenticated;
grant select on public.sites to anon;
grant all on public.sites to service_role;
alter table public.sites enable row level security;
create policy "sites org read" on public.sites for select to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "sites org insert" on public.sites for insert to authenticated with check (organization_id = public.current_org_id() or public.is_super_admin());
create policy "sites org update" on public.sites for update to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "sites org delete" on public.sites for delete to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "sites demo read" on public.sites for select to anon using (organization_id = '11111111-1111-4111-8111-111111111111'::uuid);
create trigger set_updated_at_sites before update on public.sites for each row execute function public.set_updated_at();

alter table public.buildings add column if not exists site_id uuid references public.sites(id) on delete set null;
alter table public.buildings add column if not exists site_name text;

-- ============ ASSET TYPES (custom type builder) ============
create table public.asset_types (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  icon text,
  module text not null default 'asset_registry',
  description text,
  field_definitions jsonb not null default '[]'::jsonb,
  default_maintenance_interval_days numeric,
  status text not null default 'active',
  created_by_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.asset_types to authenticated;
grant select on public.asset_types to anon;
grant all on public.asset_types to service_role;
alter table public.asset_types enable row level security;
create policy "asset_types org read" on public.asset_types for select to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "asset_types org insert" on public.asset_types for insert to authenticated with check (organization_id = public.current_org_id() or public.is_super_admin());
create policy "asset_types org update" on public.asset_types for update to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "asset_types org delete" on public.asset_types for delete to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "asset_types demo read" on public.asset_types for select to anon using (organization_id = '11111111-1111-4111-8111-111111111111'::uuid);
create trigger set_updated_at_asset_types before update on public.asset_types for each row execute function public.set_updated_at();

-- ============ ASSETS: universal extensions ============
alter table public.assets add column if not exists asset_type_id uuid references public.asset_types(id) on delete set null;
alter table public.assets add column if not exists asset_type_name text;
alter table public.assets add column if not exists parent_asset_id uuid references public.assets(id) on delete set null;
alter table public.assets add column if not exists parent_asset_name text;
alter table public.assets add column if not exists site_id uuid references public.sites(id) on delete set null;
alter table public.assets add column if not exists site_name text;
alter table public.assets add column if not exists installation_date date;
alter table public.assets add column if not exists asset_class text;
alter table public.assets add column if not exists qr_code text;
alter table public.assets add column if not exists receipt_urls text[];
alter table public.assets add column if not exists meter_reading numeric;
alter table public.assets add column if not exists meter_unit text;
alter table public.assets add column if not exists criticality text;

-- ============ SERVICE REQUESTS ============
create table public.service_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  request_number text,
  title text not null,
  description text,
  category text,
  source text not null default 'portal',
  priority text not null default 'medium',
  status text not null default 'new',
  requester_name text, requester_email text, requester_phone text,
  department_id uuid, department_name text,
  site_name text, building_name text, room_name text, location_notes text,
  asset_id uuid references public.assets(id) on delete set null,
  asset_name text,
  assigned_to_name text,
  sla_due_date timestamptz,
  work_order_id uuid,
  photo_urls text[], document_urls text[],
  resolution_notes text,
  submitted_at timestamptz not null default now(),
  closed_at timestamptz,
  created_by_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.service_requests to authenticated;
grant select on public.service_requests to anon;
grant all on public.service_requests to service_role;
alter table public.service_requests enable row level security;
create policy "sr org read" on public.service_requests for select to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "sr org insert" on public.service_requests for insert to authenticated with check (organization_id = public.current_org_id() or public.is_super_admin());
create policy "sr org update" on public.service_requests for update to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "sr org delete" on public.service_requests for delete to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "sr demo read" on public.service_requests for select to anon using (organization_id = '11111111-1111-4111-8111-111111111111'::uuid);
create trigger set_updated_at_service_requests before update on public.service_requests for each row execute function public.set_updated_at();

-- ============ WORK ORDERS ============
create table public.work_orders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  work_order_number text,
  title text not null,
  description text,
  work_type text not null default 'corrective',
  trigger_type text not null default 'manual',
  priority text not null default 'medium',
  status text not null default 'open',
  asset_id uuid references public.assets(id) on delete set null,
  asset_name text,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  vehicle_name text,
  site_name text, building_name text, room_name text,
  department_name text,
  assigned_to_name text, assigned_to_email text,
  crew_name text, contractor_name text,
  vendor_id uuid, vendor_name text,
  service_request_id uuid references public.service_requests(id) on delete set null,
  scheduled_date date, due_date date, completed_date date,
  labour_hours numeric, labour_cost numeric, parts_cost numeric, total_cost numeric,
  mileage_km numeric, meter_reading numeric,
  downtime_hours numeric,
  checklist jsonb not null default '[]'::jsonb,
  parts_used text,
  photo_urls text[], document_urls text[],
  signature_name text, signed_at timestamptz,
  approval_status text not null default 'not_required',
  notes text,
  created_by_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.work_orders to authenticated;
grant select on public.work_orders to anon;
grant all on public.work_orders to service_role;
alter table public.work_orders enable row level security;
create policy "wo org read" on public.work_orders for select to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "wo org insert" on public.work_orders for insert to authenticated with check (organization_id = public.current_org_id() or public.is_super_admin());
create policy "wo org update" on public.work_orders for update to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "wo org delete" on public.work_orders for delete to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "wo demo read" on public.work_orders for select to anon using (organization_id = '11111111-1111-4111-8111-111111111111'::uuid);
create trigger set_updated_at_work_orders before update on public.work_orders for each row execute function public.set_updated_at();

alter table public.service_requests
  add constraint service_requests_work_order_fk foreign key (work_order_id) references public.work_orders(id) on delete set null;

-- ============ MAINTENANCE PLANS ============
create table public.maintenance_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  asset_id uuid references public.assets(id) on delete cascade,
  asset_name text,
  asset_type_name text,
  work_type text not null default 'preventive',
  trigger_type text not null default 'time',
  interval_days numeric,
  interval_km numeric,
  interval_hours numeric,
  interval_cycles numeric,
  meter_threshold numeric,
  sensor_metric text,
  sensor_threshold numeric,
  priority text not null default 'medium',
  assigned_to_name text,
  checklist jsonb not null default '[]'::jsonb,
  last_generated_at timestamptz,
  next_due_date date,
  active boolean not null default true,
  status text not null default 'active',
  created_by_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.maintenance_plans to authenticated;
grant select on public.maintenance_plans to anon;
grant all on public.maintenance_plans to service_role;
alter table public.maintenance_plans enable row level security;
create policy "mp org read" on public.maintenance_plans for select to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "mp org insert" on public.maintenance_plans for insert to authenticated with check (organization_id = public.current_org_id() or public.is_super_admin());
create policy "mp org update" on public.maintenance_plans for update to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "mp org delete" on public.maintenance_plans for delete to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "mp demo read" on public.maintenance_plans for select to anon using (organization_id = '11111111-1111-4111-8111-111111111111'::uuid);
create trigger set_updated_at_maintenance_plans before update on public.maintenance_plans for each row execute function public.set_updated_at();

-- ============ INVENTORY ============
create table public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  sku text,
  name text not null,
  item_type text not null default 'part',
  category text,
  description text,
  manufacturer text, model text,
  unit text default 'each',
  quantity_on_hand numeric not null default 0,
  quantity_reserved numeric not null default 0,
  reorder_point numeric,
  min_stock numeric, max_stock numeric,
  unit_cost numeric, total_value numeric,
  warehouse_name text, storage_location text,
  site_name text, building_name text,
  serial_number text, lot_number text, expiry_date date,
  vendor_id uuid, vendor_name text,
  status text not null default 'active',
  notes text,
  created_by_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.inventory_items to authenticated;
grant select on public.inventory_items to anon;
grant all on public.inventory_items to service_role;
alter table public.inventory_items enable row level security;
create policy "inv org read" on public.inventory_items for select to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "inv org insert" on public.inventory_items for insert to authenticated with check (organization_id = public.current_org_id() or public.is_super_admin());
create policy "inv org update" on public.inventory_items for update to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "inv org delete" on public.inventory_items for delete to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "inv demo read" on public.inventory_items for select to anon using (organization_id = '11111111-1111-4111-8111-111111111111'::uuid);
create trigger set_updated_at_inventory_items before update on public.inventory_items for each row execute function public.set_updated_at();

create table public.inventory_transactions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  item_id uuid references public.inventory_items(id) on delete cascade,
  item_name text,
  transaction_type text not null default 'issue',
  quantity numeric not null default 0,
  unit_cost numeric,
  work_order_id uuid references public.work_orders(id) on delete set null,
  work_order_number text,
  from_location text, to_location text,
  performed_by_name text,
  notes text,
  status text not null default 'posted',
  created_by_id uuid,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.inventory_transactions to authenticated;
grant select on public.inventory_transactions to anon;
grant all on public.inventory_transactions to service_role;
alter table public.inventory_transactions enable row level security;
create policy "invtx org read" on public.inventory_transactions for select to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "invtx org insert" on public.inventory_transactions for insert to authenticated with check (organization_id = public.current_org_id() or public.is_super_admin());
create policy "invtx org update" on public.inventory_transactions for update to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "invtx org delete" on public.inventory_transactions for delete to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "invtx demo read" on public.inventory_transactions for select to anon using (organization_id = '11111111-1111-4111-8111-111111111111'::uuid);

-- ============ IoT ============
create table public.iot_devices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  device_id text,
  device_type text not null default 'sensor',
  metric text not null default 'temperature',
  unit text,
  manufacturer text, model text,
  protocol text default 'mqtt',
  asset_id uuid references public.assets(id) on delete set null,
  asset_name text,
  site_name text, building_name text, room_name text,
  current_value numeric,
  min_threshold numeric, max_threshold numeric,
  device_status text not null default 'not_connected',
  battery_level_pct numeric,
  last_reading_at timestamptz,
  notes text,
  status text not null default 'active',
  created_by_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.iot_devices to authenticated;
grant select on public.iot_devices to anon;
grant all on public.iot_devices to service_role;
alter table public.iot_devices enable row level security;
create policy "iot org read" on public.iot_devices for select to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "iot org insert" on public.iot_devices for insert to authenticated with check (organization_id = public.current_org_id() or public.is_super_admin());
create policy "iot org update" on public.iot_devices for update to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "iot org delete" on public.iot_devices for delete to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "iot demo read" on public.iot_devices for select to anon using (organization_id = '11111111-1111-4111-8111-111111111111'::uuid);
create trigger set_updated_at_iot_devices before update on public.iot_devices for each row execute function public.set_updated_at();

create table public.iot_readings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  device_id uuid references public.iot_devices(id) on delete cascade,
  device_name text,
  metric text,
  value numeric,
  unit text,
  breached boolean not null default false,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.iot_readings to authenticated;
grant select on public.iot_readings to anon;
grant all on public.iot_readings to service_role;
alter table public.iot_readings enable row level security;
create policy "iotr org read" on public.iot_readings for select to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "iotr org insert" on public.iot_readings for insert to authenticated with check (organization_id = public.current_org_id() or public.is_super_admin());
create policy "iotr org delete" on public.iot_readings for delete to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "iotr demo read" on public.iot_readings for select to anon using (organization_id = '11111111-1111-4111-8111-111111111111'::uuid);

-- ============ AUTOMATION RULES ============
create table public.automation_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  trigger_entity text not null default 'asset',
  trigger_event text not null default 'warranty_expiring',
  condition_field text,
  condition_operator text default 'lt',
  condition_value text,
  action_type text not null default 'notify',
  action_config jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  last_run_at timestamptz,
  run_count numeric not null default 0,
  status text not null default 'active',
  created_by_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.automation_rules to authenticated;
grant select on public.automation_rules to anon;
grant all on public.automation_rules to service_role;
alter table public.automation_rules enable row level security;
create policy "auto org read" on public.automation_rules for select to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "auto org insert" on public.automation_rules for insert to authenticated with check (organization_id = public.current_org_id() or public.is_super_admin());
create policy "auto org update" on public.automation_rules for update to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "auto org delete" on public.automation_rules for delete to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "auto demo read" on public.automation_rules for select to anon using (organization_id = '11111111-1111-4111-8111-111111111111'::uuid);
create trigger set_updated_at_automation_rules before update on public.automation_rules for each row execute function public.set_updated_at();

-- ============ INTEGRATIONS ============
create table public.integrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  provider_key text not null,
  provider_name text not null,
  category text not null default 'other',
  connection_status text not null default 'not_connected',
  availability text not null default 'roadmap',
  config jsonb not null default '{}'::jsonb,
  last_sync_at timestamptz,
  last_error text,
  notes text,
  status text not null default 'active',
  created_by_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.integrations to authenticated;
grant select on public.integrations to anon;
grant all on public.integrations to service_role;
alter table public.integrations enable row level security;
create policy "int org read" on public.integrations for select to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "int org insert" on public.integrations for insert to authenticated with check (organization_id = public.current_org_id() or public.is_super_admin());
create policy "int org update" on public.integrations for update to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "int org delete" on public.integrations for delete to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "int demo read" on public.integrations for select to anon using (organization_id = '11111111-1111-4111-8111-111111111111'::uuid);
create trigger set_updated_at_integrations before update on public.integrations for each row execute function public.set_updated_at();

-- ============ DOCUMENTS ============
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  entity_name text,
  doc_type text not null default 'document',
  title text not null,
  file_url text not null,
  file_name text,
  mime_type text,
  size_bytes numeric,
  uploaded_by_name text,
  notes text,
  status text not null default 'active',
  created_by_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.documents to authenticated;
grant select on public.documents to anon;
grant all on public.documents to service_role;
alter table public.documents enable row level security;
create policy "doc org read" on public.documents for select to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "doc org insert" on public.documents for insert to authenticated with check (organization_id = public.current_org_id() or public.is_super_admin());
create policy "doc org update" on public.documents for update to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "doc org delete" on public.documents for delete to authenticated using (organization_id = public.current_org_id() or public.is_super_admin());
create policy "doc demo read" on public.documents for select to anon using (organization_id = '11111111-1111-4111-8111-111111111111'::uuid);
create trigger set_updated_at_documents before update on public.documents for each row execute function public.set_updated_at();

-- ============ MODULES / TEMPLATES ON ORGANIZATIONS ============
alter table public.organizations add column if not exists enabled_modules jsonb not null default '{}'::jsonb;
alter table public.organizations add column if not exists industry_template text;

-- ============ STORAGE POLICIES ============
create policy "asset files read" on storage.objects for select to authenticated using (bucket_id = 'asset-files');
create policy "asset files insert" on storage.objects for insert to authenticated with check (bucket_id = 'asset-files');
create policy "asset files update" on storage.objects for update to authenticated using (bucket_id = 'asset-files');
create policy "asset files delete" on storage.objects for delete to authenticated using (bucket_id = 'asset-files');