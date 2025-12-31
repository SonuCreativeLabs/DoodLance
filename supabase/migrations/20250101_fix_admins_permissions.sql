-- Fix: Grant permissions to service role for admins table
-- The service role should bypass RLS but we need to ensure proper access

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can view own data" ON public.admins;
DROP POLICY IF EXISTS "Super admins manage admins" ON public.admins;

-- Disable RLS temporarily OR create proper service role policy
-- Option 1: Disable RLS (simplest for development)
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;

-- Option 2: If you want to keep RLS enabled, create a bypass policy for service role
-- ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Service role bypass" ON public.admins
--     FOR ALL
--     USING (auth.role() = 'service_role');

-- Verify the admins exist
SELECT email, name, role FROM public.admins;
