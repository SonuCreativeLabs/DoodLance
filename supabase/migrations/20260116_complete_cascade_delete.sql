-- Migration: Enable Complete Cascade Delete
-- Description: Adds ON DELETE CASCADE to all tables referencing users.

BEGIN;

-- 1. Services
ALTER TABLE public.services DROP CONSTRAINT IF EXISTS "services_providerId_fkey";
ALTER TABLE public.services ADD CONSTRAINT "services_providerId_fkey" 
FOREIGN KEY ("providerId") REFERENCES public.users(id) ON DELETE CASCADE;

-- 2. Bookings (Client)
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS "bookings_clientId_fkey";
ALTER TABLE public.bookings ADD CONSTRAINT "bookings_clientId_fkey" 
FOREIGN KEY ("clientId") REFERENCES public.users(id) ON DELETE CASCADE;

-- 3. Jobs (Client & Freelancer)
ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS "jobs_clientId_fkey";
ALTER TABLE public.jobs ADD CONSTRAINT "jobs_clientId_fkey" 
FOREIGN KEY ("clientId") REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS "jobs_freelancerId_fkey";
ALTER TABLE public.jobs ADD CONSTRAINT "jobs_freelancerId_fkey" 
FOREIGN KEY ("freelancerId") REFERENCES public.users(id) ON DELETE CASCADE;

-- 4. Applications
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS "applications_freelancerId_fkey";
ALTER TABLE public.applications ADD CONSTRAINT "applications_freelancerId_fkey" 
FOREIGN KEY ("freelancerId") REFERENCES public.users(id) ON DELETE CASCADE;

-- 5. Messages
ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS "messages_senderId_fkey";
ALTER TABLE public.messages ADD CONSTRAINT "messages_senderId_fkey" 
FOREIGN KEY ("senderId") REFERENCES public.users(id) ON DELETE CASCADE;

-- 6. Promo Usages
ALTER TABLE public.promo_usages DROP CONSTRAINT IF EXISTS "promo_usages_userId_fkey";
ALTER TABLE public.promo_usages ADD CONSTRAINT "promo_usages_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;

-- 7. Bank Accounts
ALTER TABLE public.bank_accounts DROP CONSTRAINT IF EXISTS "bank_accounts_userId_fkey";
ALTER TABLE public.bank_accounts ADD CONSTRAINT "bank_accounts_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;

COMMIT;
