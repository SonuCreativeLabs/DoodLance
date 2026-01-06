-- ============================================
-- CLEAN UP RLS POLICIES - FINAL FIX
-- Date: 2026-01-03
-- Purpose: Remove unnecessary RLS from tables (Prisma handles access)
-- Keep RLS ONLY on storage.objects
-- ============================================

-- Disable RLS on all application tables
-- We use Prisma with service role, which bypasses RLS
-- Authorization is handled in API routes with WHERE clauses

ALTER TABLE "public"."users" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."freelancer_profiles" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."client_profiles" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."categories" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."services" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."bookings" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."jobs" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."applications" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."conversations" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."messages" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."notifications" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."experiences" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."portfolios" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."reviews" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."wallets" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."transactions" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."admins" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."admin_logs" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."promo_codes" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."promo_usages" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."support_tickets" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ticket_messages" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."system_config" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."featured_items" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."platform_analytics" DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing table policies
-- These are no longer needed since we don't query tables via Supabase client
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT schemaname, tablename, policyname
        FROM pg_policies 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I CASCADE', 
            r.policyname, r.schemaname, r.tablename);
        RAISE NOTICE 'Dropped policy %s on table %s', r.policyname, r.tablename;
    END LOOP;
END $$;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check that RLS is disabled on all tables
SELECT schemaname, tablename, 
       CASE WHEN rowsecurity THEN '❌ ENABLED (bad)' ELSE '✅ DISABLED (good)' END as rls_status
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check that no policies exist on public schema tables
SELECT COUNT(*) as remaining_policies,
       CASE WHEN COUNT(*) = 0 THEN '✅ All policies removed' ELSE '❌ Policies still exist' END as status
FROM pg_policies 
WHERE schemaname = 'public';

-- Verify storage policies still exist (SHOULD have policies)
SELECT COUNT(*) as storage_policies,
       CASE WHEN COUNT(*) > 0 THEN '✅ Storage RLS active' ELSE '⚠️ No storage policies' END as status
FROM pg_policies 
WHERE schemaname = 'storage';

-- ============================================
-- ROLLBACK (if needed)
-- ============================================
-- If you need to rollback, enable RLS again:
-- ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;
-- etc.
-- Then recreate policies as needed
