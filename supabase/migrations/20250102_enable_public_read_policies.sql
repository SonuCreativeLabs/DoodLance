-- Migration: Enable Public Read Access for Marketplace
-- Description: Fixes "Invisible Profile" issues by allowing public read access to profiles, services, etc.
-- Created: 2025-01-02

-- 1. Freelancer Profiles (Public Read, Owner Write)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.freelancer_profiles;
CREATE POLICY "Public profiles are viewable by everyone"
ON public.freelancer_profiles FOR SELECT
USING (true); -- Allows public access

-- Ensure write access is still restricted
-- (Keeping existing write policies or recreating them to be safe)
DROP POLICY IF EXISTS "Users can update their own profile" ON public.freelancer_profiles;
CREATE POLICY "Users can update own profile"
ON public.freelancer_profiles FOR UPDATE
USING (auth.uid()::text = "userId");

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.freelancer_profiles;
CREATE POLICY "Users can insert own profile"
ON public.freelancer_profiles FOR INSERT
WITH CHECK (auth.uid()::text = "userId");


-- 2. Services (Public Read, Owner Write)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are viewable by everyone"
ON public.services FOR SELECT
USING (true);

CREATE POLICY "Users can insert own services"
ON public.services FOR INSERT
WITH CHECK (auth.uid()::text = "providerId");

CREATE POLICY "Users can update own services"
ON public.services FOR UPDATE
USING (auth.uid()::text = "providerId");

CREATE POLICY "Users can delete own services"
ON public.services FOR DELETE
USING (auth.uid()::text = "providerId");


-- 3. Portfolios (Public Read, Owner Write)
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Portfolios are viewable by everyone"
ON public.portfolios FOR SELECT
USING (true);

-- For portfolios, we need to join with freelancer_profiles to check ownership, 
-- OR rely on the application to ensure 'profileId' belongs to the user.
-- A simpler approach for RLS if profileId isn't auth.uid() is to trust the backend 
-- or use a subquery. Since we just added RLS to profiles, we can use that.
-- However, subqueries in RLS can be expensive. 
-- For now, let's allow insert if the user owns the linked profile.

CREATE POLICY "Users can insert own portfolios"
ON public.portfolios FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.freelancer_profiles
    WHERE id = "profileId" AND "userId" = auth.uid()::text
  )
);

CREATE POLICY "Users can update own portfolios"
ON public.portfolios FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.freelancer_profiles
    WHERE id = "profileId" AND "userId" = auth.uid()::text
  )
);

CREATE POLICY "Users can delete own portfolios"
ON public.portfolios FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.freelancer_profiles
    WHERE id = "profileId" AND "userId" = auth.uid()::text
  )
);


-- 4. Clients (Public Read for Reviews/Identity)
DROP POLICY IF EXISTS "Users can view their own client profile" ON public.client_profiles;
CREATE POLICY "Client profiles are viewable by everyone"
ON public.client_profiles FOR SELECT
USING (true);


-- 5. Reviews (Public Read)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
ON public.reviews FOR SELECT
USING (true);

CREATE POLICY "Clients can create reviews"
ON public.reviews FOR INSERT
WITH CHECK (auth.uid()::text = "clientId");

-- 6. Users (Public Read - CAREFUL)
-- We need basic user info (name, avatar) to be public for headers/cards.
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
CREATE POLICY "Public user info is viewable by everyone"
ON public.users FOR SELECT
USING (true);

-- Write access strictly for owner
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
CREATE POLICY "Users can update own data"
ON public.users FOR UPDATE
USING (auth.uid()::text = id);
