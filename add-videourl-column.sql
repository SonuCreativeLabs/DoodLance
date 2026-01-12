-- Add videoUrl column to services table as an array
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

ALTER TABLE "services" 
ADD COLUMN IF NOT EXISTS "videoUrl" TEXT[] DEFAULT '{}';

-- Add a comment to document the column
COMMENT ON COLUMN "services"."videoUrl" IS 'Array of video URLs (YouTube, Instagram, Facebook, Twitter, TikTok, Google Drive)';
