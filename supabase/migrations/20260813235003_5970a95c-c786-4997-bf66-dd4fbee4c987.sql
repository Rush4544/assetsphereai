revoke execute on function public.current_org_id() from public;
revoke execute on function public.has_role(uuid, public.app_role) from public;
revoke execute on function public.is_operator() from public;
revoke execute on function public.is_org_admin() from public;
revoke execute on function public.is_super_admin() from public;
revoke execute on function public.list_organizations() from public;
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.set_updated_at() from public;

grant execute on function public.current_org_id() to authenticated;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;
grant execute on function public.is_operator() to authenticated;
grant execute on function public.is_org_admin() to authenticated;
grant execute on function public.is_super_admin() to authenticated;