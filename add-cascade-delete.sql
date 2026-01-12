-- Add cascading delete for bookings when service is deleted
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- First, drop the existing foreign key constraint
ALTER TABLE "bookings" DROP CONSTRAINT IF EXISTS "bookings_serviceId_fkey";

-- Add it back with ON DELETE CASCADE
ALTER TABLE "bookings" 
ADD CONSTRAINT "bookings_serviceId_fkey" 
FOREIGN KEY ("serviceId") 
REFERENCES "services"("id") 
ON DELETE CASCADE;

-- Add comment
COMMENT ON CONSTRAINT "bookings_serviceId_fkey" ON "bookings" IS 'Cascading delete: when service is deleted, all related bookings are also deleted';
