revoke execute on function public.has_role(uuid, public.app_role) from anon, authenticated;
revoke execute on function public.is_super_admin() from anon, authenticated;
revoke execute on function public.is_org_admin() from anon, authenticated;
revoke execute on function public.is_operator() from anon, authenticated;
revoke execute on function public.current_org_id() from anon, authenticated;
revoke execute on function public.set_updated_at() from anon, authenticated;
revoke execute on function public.handle_new_user() from anon, authenticated;