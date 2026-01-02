-- Add advanceNoticeHours column to freelancer_profiles table
ALTER TABLE "freelancer_profiles" 
ADD COLUMN IF NOT EXISTS "advanceNoticeHours" INTEGER;
