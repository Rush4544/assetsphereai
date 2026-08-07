-- Live updates for the fleet map
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'vehicles'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicles';
  END IF;
END $$;

ALTER TABLE public.vehicles REPLICA IDENTITY FULL;

-- Demo-org read access for the prototype preview (read-only, single fixed org)
DO $$
DECLARE
  t text;
  demo uuid := '11111111-1111-4111-8111-111111111111';
BEGIN
  FOR t IN
    SELECT c.table_name
    FROM information_schema.columns c
    JOIN information_schema.tables tb
      ON tb.table_schema = c.table_schema AND tb.table_name = c.table_name
    WHERE c.table_schema = 'public'
      AND c.column_name = 'organization_id'
      AND tb.table_type = 'BASE TABLE'
      AND c.table_name <> 'profiles'
  LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
    EXECUTE format('DROP POLICY IF EXISTS "demo org public read" ON public.%I', t);
    EXECUTE format(
      'CREATE POLICY "demo org public read" ON public.%I FOR SELECT TO anon USING (organization_id = %L)',
      t, demo);
  END LOOP;
END $$;

GRANT SELECT ON public.organizations TO anon;
DROP POLICY IF EXISTS "demo org public read" ON public.organizations;
CREATE POLICY "demo org public read" ON public.organizations
  FOR SELECT TO anon USING (id = '11111111-1111-4111-8111-111111111111');
