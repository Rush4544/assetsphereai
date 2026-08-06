-- ============ enums ============
create type public.app_role as enum ('super_admin','admin','technician','user');

-- ============ organizations ============
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text,
  industry text default 'other' check (industry in ('technology','healthcare','education','government','manufacturing','retail','finance','logistics','construction','other')),
  logo_url text,
  primary_color text,
  address text,
  phone text,
  website text,
  business_email text,
  business_phone text,
  country text,
  province_state text,
  city text,
  number_of_employees numeric,
  company_size text check (company_size in ('1-10','11-50','51-200','201-500','501-1000','1000+')),
  gst_hst_number text,
  subscription_plan text not null default 'free' check (subscription_plan in ('free','starter','professional','enterprise')),
  subscription_status text not null default 'trialing' check (subscription_status in ('trialing','active','past_due','cancelled','suspended')),
  billing_cycle text not null default 'monthly' check (billing_cycle in ('monthly','yearly')),
  stripe_customer_id text,
  trial_start_date date,
  trial_end_date date,
  max_assets numeric default 100,
  max_users numeric default 5,
  storage_used_mb numeric default 0,
  storage_limit_mb numeric default 1024,
  status text not null default 'active' check (status in ('active','suspended','cancelled')),
  created_by_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============ profiles ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  department text,
  job_title text,
  organization_id uuid references public.organizations(id) on delete set null,
  organization_name text,
  status text not null default 'pending' check (status in ('active','pending','suspended')),
  page_permissions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

-- ============ helper functions ============
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_super_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'super_admin')
$$;

create or replace function public.is_org_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = auth.uid() and role in ('admin','super_admin'))
$$;

create or replace function public.is_operator()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = auth.uid() and role in ('admin','super_admin','technician'))
$$;

create or replace function public.current_org_id()
returns uuid language sql stable security definer set search_path = public as $$
  select organization_id from public.profiles where id = auth.uid()
$$;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'))
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'user')
  on conflict do nothing;
  return new;
end; $$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- ============ core org-scoped tables ============
create table public.asset_categories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  name text not null,
  icon text,
  parent_category_id uuid,
  sector text default 'it' check (sector in ('it','healthcare','general','facilities')),
  description text,
  default_lifecycle_years numeric,
  depreciation_method text default 'straight_line' check (depreciation_method in ('straight_line','declining_balance','none')),
  status text not null default 'active' check (status in ('active','inactive')),
  created_by_id uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  name text not null,
  head_name text, head_email text,
  parent_department_id uuid,
  cost_center text,
  status text not null default 'active' check (status in ('active','inactive')),
  created_by_id uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.buildings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  name text not null,
  address text, city text, state text, zip_code text, country text,
  floors numeric,
  status text not null default 'active' check (status in ('active','inactive')),
  created_by_id uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  building_id uuid,
  name text not null,
  floor text, room_number text,
  room_type text default 'office' check (room_type in ('office','server_room','warehouse','lab','conference','classroom','patient_room','utility','other')),
  status text not null default 'active' check (status in ('active','inactive')),
  created_by_id uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.vendors (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  name text not null,
  contact_name text, email text, phone text, website text, address text,
  vendor_type text default 'hardware' check (vendor_type in ('hardware','software','service','other')),
  contract_number text, contract_start date, contract_end date, notes text,
  status text not null default 'active' check (status in ('active','inactive')),
  created_by_id uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  asset_tag text,
  name text not null,
  category_id uuid, category_name text,
  manufacturer text, model text, serial_number text, barcode text,
  purchase_date date, purchase_price numeric, current_value numeric,
  supplier text, purchase_order_number text, invoice_number text,
  warranty_cost numeric, tax_amount numeric, currency text default 'CAD',
  depreciation_method text default 'straight_line' check (depreciation_method in ('straight_line','declining_balance','none')),
  residual_value numeric, useful_life_years numeric, insurance_value numeric, replacement_cost numeric,
  funding_source text, cost_centre text, budget_code text,
  vendor_id uuid, vendor_name text,
  warranty_start date, warranty_end date,
  lifecycle_status text not null default 'new' check (lifecycle_status in ('new','deployed','in_maintenance','retired','disposed','lost','stolen')),
  condition text not null default 'new' check (condition in ('new','good','fair','poor','broken')),
  assigned_user_name text, assigned_user_email text,
  department_id uuid, department_name text,
  building_id uuid, building_name text, room_id uuid, room_name text,
  gps_lat numeric, gps_lng numeric,
  hostname text, ip_address text, mac_address text, os text, cpu text,
  ram_gb numeric, disk_gb numeric, disk_used_pct numeric,
  online_status text default 'unknown' check (online_status in ('online','offline','unknown')),
  last_seen timestamptz, logged_in_user text, installed_software text,
  photo_urls text[] default '{}', document_urls text[] default '{}',
  notes text, custom_fields jsonb not null default '{}'::jsonb,
  next_maintenance_date date, depreciation_value numeric,
  created_by_id uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.asset_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  asset_id uuid, asset_name text,
  assigned_to_name text not null, assigned_to_email text,
  assigned_by_name text, assignment_date date, return_date date,
  previous_owner_name text, reason text,
  status text not null default 'active' check (status in ('active','returned','transferred')),
  notes text,
  created_by_id uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.distribution_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  asset_id uuid, asset_name text not null, asset_category text,
  requested_by_name text, requested_by_email text,
  assigned_to_name text not null, assigned_to_email text,
  department text, request_date date, fulfilled_date date, return_date date,
  item_condition text default 'new' check (item_condition in ('new','good','fair','broken','lost')),
  status text not null default 'pending' check (status in ('pending','approved','distributed','returned','rejected','broken')),
  priority text not null default 'medium' check (priority in ('low','medium','high','urgent')),
  notes text,
  created_by_id uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.maintenance_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  asset_id uuid, asset_name text,
  maintenance_type text not null default 'preventive' check (maintenance_type in ('preventive','corrective','inspection','upgrade')),
  title text not null, description text,
  scheduled_date date, completed_date date,
  technician_name text, vendor_id uuid, vendor_name text,
  cost numeric, parts_used text,
  status text not null default 'scheduled' check (status in ('scheduled','in_progress','completed','cancelled')),
  priority text not null default 'medium' check (priority in ('low','medium','high','critical')),
  notes text,
  created_by_id uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.software_licenses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  software_name text not null, publisher text, version text, license_key text,
  license_type text not null default 'subscription' check (license_type in ('perpetual','subscription','oem','volume','freeware','open_source')),
  total_seats numeric, used_seats numeric,
  purchase_date date, expiration_date date,
  cost_per_seat numeric, total_cost numeric,
  vendor_id uuid, vendor_name text,
  compliance_status text not null default 'unknown' check (compliance_status in ('compliant','non_compliant','over_licensed','unknown')),
  notes text,
  status text not null default 'active' check (status in ('active','expired','cancelled')),
  created_by_id uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.network_devices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  hostname text, ip_address text, mac_address text, manufacturer text,
  device_type text not null default 'Other' check (device_type in ('Laptop','Desktop','Server','Switch','Router','Access Point','Printer','Phone','Tablet','UPS','Other')),
  os text, cpu text, ram_gb numeric, disk_gb numeric, disk_used_pct numeric,
  logged_in_user text, installed_software text,
  antivirus_status text default 'unknown' check (antivirus_status in ('protected','outdated','disabled','unknown')),
  first_seen timestamptz, last_seen timestamptz,
  online_status text default 'unknown' check (online_status in ('online','offline','unknown')),
  discovery_source text default 'manual' check (discovery_source in ('agent','snmp','wmi','ad','intune','unifi','meraki','omada','manual')),
  access_point text, access_point_location text,
  building text, floor text, room text, vlan text,
  connection_type text default 'unknown' check (connection_type in ('wifi','ethernet','unknown')),
  ssid text, signal_strength numeric, ping_time_ms numeric,
  network_name text, switch_port text, linked_asset_id uuid,
  status text not null default 'active' check (status in ('active','inactive')),
  created_by_id uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  name text not null, license_plate text, make text, model text, year numeric, vin text,
  vehicle_type text not null default 'car' check (vehicle_type in ('car','truck','van','suv','motorcycle','heavy_equipment','other')),
  color text, driver_name text, driver_email text, driver_phone text,
  gps_lat numeric, gps_lng numeric, last_gps_update timestamptz,
  current_speed_kmh numeric, heading numeric,
  daily_mileage_km numeric, total_mileage_km numeric, fuel_level_pct numeric,
  geofence_id uuid, geofence_name text, geofence_breach boolean not null default false,
  purchase_date date, purchase_price numeric,
  insurance_expiry date, registration_expiry date,
  next_service_date date, last_service_date date, tire_rotation_date date,
  winter_tires_installed boolean not null default false,
  summer_tires_installed boolean not null default true,
  photo_url text,
  status text not null default 'active' check (status in ('active','in_maintenance','retired','stolen')),
  notes text,
  created_by_id uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.vehicle_service_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  vehicle_id uuid not null, vehicle_name text,
  service_type text not null default 'general' check (service_type in ('oil_change','tire_rotation','tire_swap','inspection','repair','gps_check','general','other')),
  title text not null, description text,
  scheduled_date date, completed_date date, technician_name text, cost numeric,
  tire_season text default 'n/a' check (tire_season in ('winter','summer','all_season','n/a')),
  odometer_km numeric, parts_used text,
  status text not null default 'scheduled' check (status in ('scheduled','in_progress','completed','cancelled')),
  notes text,
  created_by_id uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.geofences (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  name text not null, description text,
  center_lat numeric not null, center_lng numeric not null,
  radius_meters numeric not null default 500,
  alert_on_exit boolean not null default true,
  alert_on_entry boolean not null default false,
  color text default '#3b82f6',
  active boolean not null default true,
  vehicle_ids text[] default '{}',
  speed_limit_kmh numeric, notes text,
  created_by_id uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null, organization_name text,
  invoice_number text not null, stripe_invoice_id text,
  amount numeric, currency text default 'CAD', tax_amount numeric, subtotal numeric, total numeric,
  billing_period_start date, billing_period_end date,
  plan text check (plan in ('free','starter','professional','enterprise')),
  billing_cycle text not null default 'monthly' check (billing_cycle in ('monthly','yearly')),
  status text not null default 'open' check (status in ('draft','open','paid','void','uncollectible')),
  paid_date date, pdf_url text, notes text,
  created_by_id uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  action text not null,
  entity_type text, entity_id text, entity_name text,
  user_name text, user_email text, details text, ip_address text,
  severity text not null default 'info' check (severity in ('info','warning','critical')),
  created_by_id uuid, created_at timestamptz not null default now()
);

-- ============ RFID module ============
create table public.rfid_tags (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  tag_id text not null, asset_id uuid, asset_name text,
  rfid_type text not null default 'passive' check (rfid_type in ('passive','active','uhf','hf','nfc')),
  manufacturer text,
  tag_status text not null default 'active' check (tag_status in ('active','inactive','lost','damaged','battery_low')),
  installation_date date,
  battery_status text default 'n/a' check (battery_status in ('full','medium','low','critical','n/a')),
  battery_level_pct numeric,
  last_detected_zone text, last_detected_reader text, last_detection_time timestamptz,
  notes text,
  status text not null default 'active' check (status in ('active','inactive')),
  created_by_id uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.rfid_readers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  reader_id text, name text not null,
  manufacturer text, model text, firmware_version text, ip_address text, mac_address text,
  reader_status text not null default 'offline' check (reader_status in ('online','offline','maintenance','error')),
  reader_health text not null default 'unknown' check (reader_health in ('healthy','warning','critical','unknown')),
  building_id uuid, building_name text, floor text, room text,
  zone_id uuid, zone_name text, gateway_id uuid, gateway_name text,
  last_heartbeat timestamptz, antenna_count numeric default 1, read_range_meters numeric,
  provider_type text, notes text,
  status text not null default 'active' check (status in ('active','inactive')),
  created_by_id uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.rfid_gateways (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  name text not null, gateway_id text,
  manufacturer text, model text, firmware_version text, ip_address text, mac_address text,
  building_name text, floor text,
  gateway_status text not null default 'offline' check (gateway_status in ('online','offline','maintenance','error')),
  connected_reader_count numeric not null default 0,
  last_heartbeat timestamptz, provider_type text, notes text,
  status text not null default 'active' check (status in ('active','inactive')),
  created_by_id uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.rfid_zones (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  name text not null, description text,
  building_id uuid, building_name text, floor text, room text,
  zone_type text not null default 'normal' check (zone_type in ('normal','restricted','authorized','exit','entrance','storage','loading_dock','emergency_exit')),
  restricted boolean not null default false,
  authorized_only boolean not null default false,
  reader_ids text[] default '{}',
  color text default '#3b82f6', notes text,
  status text not null default 'active' check (status in ('active','inactive')),
  created_by_id uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.rfid_detections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  tag_id text not null, asset_id uuid, asset_name text,
  reader_id text, reader_name text, zone_id uuid, zone_name text,
  building_name text, floor text, detection_time timestamptz default now(),
  direction text not null default 'unknown' check (direction in ('entry','exit','stationary','transit','unknown')),
  signal_strength numeric, previous_zone text, previous_reader text,
  assigned_user text, technician text,
  movement_status text not null default 'unknown' check (movement_status in ('online','offline','in_transit','unknown')),
  created_by_id uuid, created_at timestamptz not null default now()
);

create table public.rfid_alerts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  alert_type text not null check (alert_type in ('unauthorized_exit','restricted_entry','not_detected','reader_offline','unauthorized_movement','duplicate_tag','unknown_tag','battery_low','tag_removed','missing_equipment','reader_comm_lost')),
  severity text not null default 'warning' check (severity in ('info','warning','critical')),
  tag_id text, asset_id uuid, asset_name text,
  reader_id text, reader_name text, zone_name text, building_name text,
  message text not null, detected_at timestamptz default now(),
  acknowledged boolean not null default false, acknowledged_by text, acknowledged_at timestamptz,
  notification_channels text[] default '{}',
  status text not null default 'active' check (status in ('active','acknowledged','resolved')),
  created_by_id uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.rfid_deployment_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  company_name text not null, contact_person text not null, email text not null, phone text,
  number_of_buildings numeric, estimated_assets numeric, industry text,
  preferred_installation_date date, additional_notes text,
  request_status text not null default 'pending' check (request_status in ('pending','contacted','scheduled','in_progress','completed','cancelled')),
  assigned_deployment_manager text, internal_notes text,
  created_by_id uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

-- ============ grants, RLS, policies ============
grant select, insert, update, delete on public.organizations to authenticated;
grant all on public.organizations to service_role;
alter table public.organizations enable row level security;
create policy "orgs readable by members and super admins" on public.organizations for select to authenticated
  using (id = public.current_org_id() or public.is_super_admin());
create policy "orgs creatable by authenticated" on public.organizations for insert to authenticated with check (true);
create policy "orgs updatable by admins" on public.organizations for update to authenticated
  using (public.is_super_admin() or (public.is_org_admin() and id = public.current_org_id()));
create policy "orgs deletable by super admins" on public.organizations for delete to authenticated
  using (public.is_super_admin());

grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles readable in org" on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_super_admin() or (organization_id is not null and organization_id = public.current_org_id()));
create policy "profiles self update" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles admin update" on public.profiles for update to authenticated
  using (public.is_super_admin() or public.is_org_admin());

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "roles readable by self and admins" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.is_org_admin());
create policy "roles managed by admins" on public.user_roles for all to authenticated
  using (public.is_org_admin()) with check (public.is_org_admin());

do $$
declare t text;
  operational text[] := array['assets','asset_assignments','distribution_requests','maintenance_records','software_licenses','network_devices','vehicles','vehicle_service_records','geofences','rfid_tags','rfid_readers','rfid_gateways','rfid_zones','rfid_detections','rfid_alerts','rfid_deployment_requests'];
  adminonly text[] := array['asset_categories','departments','buildings','rooms','vendors','invoices'];
begin
  foreach t in array operational || adminonly loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "read in org" on public.%I for select to authenticated using (public.is_super_admin() or created_by_id = auth.uid() or (organization_id is not null and organization_id = public.current_org_id()))', t);
    execute format('create trigger set_updated_at_%I before update on public.%I for each row execute function public.set_updated_at()', t, t);
  end loop;

  foreach t in array operational loop
    execute format('create policy "write by operators" on public.%I for insert to authenticated with check (public.is_operator() and organization_id = public.current_org_id())', t);
    execute format('create policy "update by operators" on public.%I for update to authenticated using (public.is_super_admin() or (public.is_operator() and organization_id = public.current_org_id()))', t);
    execute format('create policy "delete by admins" on public.%I for delete to authenticated using (public.is_super_admin() or (public.is_org_admin() and organization_id = public.current_org_id()))', t);
  end loop;

  foreach t in array adminonly loop
    execute format('create policy "write by admins" on public.%I for insert to authenticated with check (public.is_super_admin() or (public.is_org_admin() and organization_id = public.current_org_id()))', t);
    execute format('create policy "update by admins" on public.%I for update to authenticated using (public.is_super_admin() or (public.is_org_admin() and organization_id = public.current_org_id()))', t);
    execute format('create policy "delete by admins" on public.%I for delete to authenticated using (public.is_super_admin() or (public.is_org_admin() and organization_id = public.current_org_id()))', t);
  end loop;
end $$;

grant select, insert on public.audit_logs to authenticated;
grant all on public.audit_logs to service_role;
alter table public.audit_logs enable row level security;
create policy "audit readable by admins" on public.audit_logs for select to authenticated
  using (public.is_super_admin() or (public.is_org_admin() and organization_id = public.current_org_id()));
create policy "audit insert by authenticated" on public.audit_logs for insert to authenticated with check (true);

create trigger set_updated_at_organizations before update on public.organizations for each row execute function public.set_updated_at();
create trigger set_updated_at_profiles before update on public.profiles for each row execute function public.set_updated_at();

create index idx_assets_org on public.assets(organization_id);
create index idx_assets_lifecycle on public.assets(lifecycle_status);
create index idx_maint_org on public.maintenance_records(organization_id);
create index idx_profiles_org on public.profiles(organization_id);