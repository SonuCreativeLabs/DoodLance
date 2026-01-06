-- EMERGENCY PERMISSION FIX
-- Run this in Supabase SQL Editor

-- 1. Grant usage on public schema
GRANT USAGE ON SCHEMA public TO service_role;
GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 2. Grant access to all tables for service_role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO service_role;

-- 3. Specifically ensure 'admins' table is accessible
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admins TO service_role;

-- 4. Verify settings again
SELECT 
  grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'admins' AND grantee = 'service_role';
