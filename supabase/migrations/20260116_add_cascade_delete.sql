-- Migration: Enable Cascade Delete for Profiles
-- Description: Drops existing foreign key constraints and re-adds them with ON DELETE CASCADE.
-- This allows deleting a User to automatically delete their Profile, Wallet, etc.

BEGIN;

-- 1. Freelancer Profile
ALTER TABLE public.freelancer_profiles
DROP CONSTRAINT IF EXISTS "freelancer_profiles_userId_fkey";

ALTER TABLE public.freelancer_profiles
ADD CONSTRAINT "freelancer_profiles_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES public.users(id)
ON DELETE CASCADE;

-- 2. Client Profile
ALTER TABLE public.client_profiles
DROP CONSTRAINT IF EXISTS "client_profiles_userId_fkey";

ALTER TABLE public.client_profiles
ADD CONSTRAINT "client_profiles_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES public.users(id)
ON DELETE CASCADE;

-- 3. Wallet
ALTER TABLE public.wallets
DROP CONSTRAINT IF EXISTS "wallets_userId_fkey";

ALTER TABLE public.wallets
ADD CONSTRAINT "wallets_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES public.users(id)
ON DELETE CASCADE;

-- 4. Notifications
ALTER TABLE public.notifications
DROP CONSTRAINT IF EXISTS "notifications_userId_fkey";

ALTER TABLE public.notifications
ADD CONSTRAINT "notifications_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES public.users(id)
ON DELETE CASCADE;

-- 5. Support Tickets
ALTER TABLE public.support_tickets
DROP CONSTRAINT IF EXISTS "support_tickets_userId_fkey";

ALTER TABLE public.support_tickets
ADD CONSTRAINT "support_tickets_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES public.users(id)
ON DELETE CASCADE;

COMMIT;
