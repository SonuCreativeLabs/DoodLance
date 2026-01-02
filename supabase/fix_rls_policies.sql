-- ============================================
-- SUPABASE RLS POLICY FIX - COPY & PASTE THIS
-- ============================================
-- Open Supabase Dashboard > SQL Editor
-- Paste this entire script and click "Run"
-- ============================================

-- 1. USERS TABLE
-- ============================================
ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own data" ON "public"."users";
DROP POLICY IF EXISTS "Users can update their own data" ON "public"."users";
DROP POLICY IF EXISTS "Users can insert their own data" ON "public"."users";
DROP POLICY IF EXISTS "Public user info viewable by authenticated users" ON "public"."users";

-- Allow users to view their own data
CREATE POLICY "Users can view their own data"
ON "public"."users"
FOR SELECT
TO authenticated
USING (auth.uid()::text = id);

-- Allow users to update their own data
CREATE POLICY "Users can update their own data"
ON "public"."users"
FOR UPDATE
TO authenticated
USING (auth.uid()::text = id);

-- Allow users to insert their own data
CREATE POLICY "Users can insert their own data"
ON "public"."users"
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = id);

-- Allow authenticated users to view public info of other users
CREATE POLICY "Public user info viewable by authenticated users"
ON "public"."users"
FOR SELECT
TO authenticated
USING (true);


-- 2. FREELANCER_PROFILES TABLE
-- ==========================================
ALTER TABLE "public"."freelancer_profiles" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON "public"."freelancer_profiles";
DROP POLICY IF EXISTS "Users can update their own profile" ON "public"."freelancer_profiles";
DROP POLICY IF EXISTS "Users can insert their own profile" ON "public"."freelancer_profiles";
DROP POLICY IF EXISTS "Users can delete their own profile" ON "public"."freelancer_profiles";

-- Allow everyone to view profiles
CREATE POLICY "Public profiles are viewable by everyone"
ON "public"."freelancer_profiles"
FOR SELECT
TO authenticated
USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON "public"."freelancer_profiles"
FOR UPDATE
TO authenticated
USING (auth.uid()::text = "userId");

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
ON "public"."freelancer_profiles"
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = "userId");

-- Allow users to delete their own profile
CREATE POLICY "Users can delete their own profile"
ON "public"."freelancer_profiles"
FOR DELETE
TO authenticated
USING (auth.uid()::text = "userId");


-- 3. JOBS TABLE
-- ============================================
ALTER TABLE "public"."jobs" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view jobs" ON "public"."jobs";
DROP POLICY IF EXISTS "Users can create jobs" ON "public"."jobs";
DROP POLICY IF EXISTS "Users can update their own jobs" ON "public"."jobs";

-- Allow anyone to view jobs
CREATE POLICY "Anyone can view jobs"
ON "public"."jobs"
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to create jobs
CREATE POLICY "Users can create jobs"
ON "public"."jobs"
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = "clientId");

-- Allow users to update their own jobs
CREATE POLICY "Users can update their own jobs"
ON "public"."jobs"
FOR UPDATE
TO authenticated
USING (auth.uid()::text = "clientId");

-- ============================================
-- VERIFICATION
-- ============================================
-- Run this to verify policies were created:
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('users', 'freelancer_profiles', 'jobs')
ORDER BY tablename, policyname;
