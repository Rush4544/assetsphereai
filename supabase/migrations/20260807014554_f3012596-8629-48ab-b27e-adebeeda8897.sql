-- Public, minimal company directory for the signup screen (id + name only)
create or replace function public.list_organizations()
returns table (id uuid, name text)
language sql
stable
security definer
set search_path = public
as $$
  select o.id, o.name
  from public.organizations o
  where o.status = 'active'
  order by o.name
$$;

revoke all on function public.list_organizations() from public;
grant execute on function public.list_organizations() to anon, authenticated, service_role;

-- Signup: honour chosen organization, or create a brand-new one
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_org_id uuid;
  v_org_name text;
  v_new_org_name text;
  v_status text := 'pending';
  v_role app_role := 'user';
begin
  v_new_org_name := nullif(btrim(coalesce(new.raw_user_meta_data->>'new_organization_name','')), '');

  if v_new_org_name is not null then
    insert into public.organizations (name, status, created_by_id)
    values (v_new_org_name, 'active', new.id)
    returning id, name into v_org_id, v_org_name;
    v_status := 'active';
    v_role := 'admin';
  elsif nullif(btrim(coalesce(new.raw_user_meta_data->>'organization_id','')), '') is not null then
    select o.id, o.name into v_org_id, v_org_name
    from public.organizations o
    where o.id = (new.raw_user_meta_data->>'organization_id')::uuid;
  end if;

  insert into public.profiles (id, email, full_name, organization_id, organization_name, status)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    v_org_id,
    v_org_name,
    v_status
  )
  on conflict (id) do update
    set organization_id = coalesce(public.profiles.organization_id, excluded.organization_id),
        organization_name = coalesce(public.profiles.organization_name, excluded.organization_name);

  insert into public.user_roles (user_id, role) values (new.id, v_role)
  on conflict do nothing;

  return new;
end; $function$;