-- Migration: Fix Nested Cascade Deletes
-- Description: Adds ON DELETE CASCADE to secondary tables to prevent blocking.

BEGIN;

-- 1. Wallet Transactions (Blocks Wallet -> User)
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS "transactions_walletId_fkey";
ALTER TABLE public.transactions ADD CONSTRAINT "transactions_walletId_fkey" 
FOREIGN KEY ("walletId") REFERENCES public.wallets(id) ON DELETE CASCADE;

-- 2. Freelancer Profile Items (Blocks Profile -> User)
ALTER TABLE public.achievements DROP CONSTRAINT IF EXISTS "achievements_profileId_fkey";
ALTER TABLE public.achievements ADD CONSTRAINT "achievements_profileId_fkey" 
FOREIGN KEY ("profileId") REFERENCES public.freelancer_profiles(id) ON DELETE CASCADE;

ALTER TABLE public.portfolios DROP CONSTRAINT IF EXISTS "portfolios_profileId_fkey";
ALTER TABLE public.portfolios ADD CONSTRAINT "portfolios_profileId_fkey" 
FOREIGN KEY ("profileId") REFERENCES public.freelancer_profiles(id) ON DELETE CASCADE;

ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS "reviews_profileId_fkey";
ALTER TABLE public.reviews ADD CONSTRAINT "reviews_profileId_fkey" 
FOREIGN KEY ("profileId") REFERENCES public.freelancer_profiles(id) ON DELETE CASCADE;

-- 3. Support Ticket Messages (Blocks Ticket -> User)
ALTER TABLE public.ticket_messages DROP CONSTRAINT IF EXISTS "ticket_messages_ticketId_fkey";
ALTER TABLE public.ticket_messages ADD CONSTRAINT "ticket_messages_ticketId_fkey" 
FOREIGN KEY ("ticketId") REFERENCES public.support_tickets(id) ON DELETE CASCADE;

-- 4. Job Applications (Blocks Job -> User[Client])
-- If Client is deleted -> Job deleted -> Application must be deleted
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS "applications_jobId_fkey";
ALTER TABLE public.applications ADD CONSTRAINT "applications_jobId_fkey" 
FOREIGN KEY ("jobId") REFERENCES public.jobs(id) ON DELETE CASCADE;

-- 5. Service Bookings (Blocks Service -> User[Provider])
-- If Provider deleted -> Service deleted -> Booking must be deleted
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS "bookings_serviceId_fkey";
ALTER TABLE public.bookings ADD CONSTRAINT "bookings_serviceId_fkey" 
FOREIGN KEY ("serviceId") REFERENCES public.services(id) ON DELETE CASCADE;

-- 6. Booking Reviews (If related to bookings?)
-- Not explicitly linked in schema for Reviews -> Booking (just bookingId string?) 
-- Checking schema: Review has bookingId String? no relation. OK.

COMMIT;
