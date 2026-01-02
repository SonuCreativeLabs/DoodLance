-- ============================================
-- STORAGE POLICIES FIX
-- Date: 2026-01-03
-- Purpose: Create storage bucket and allow uploads
-- ============================================

-- 1. Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Ensure RLS is enabled (This might fail if not owner, but usually enabled by default)
-- skipping ALTER TABLE as it causes permission errors for non-superusers/owners


-- 3. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;

-- 4. Create policies

-- Allow public read access to all images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- Allow authenticated users to upload images
-- We restrict folder structure to match userId for tidiness, but basic auth check is enough for now
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'images' );

-- Allow users to update their own images
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'images' AND auth.uid() = owner );

-- Allow users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'images' AND auth.uid() = owner );

-- Output verification
SELECT '✅ Storage policies applied successfully' as result;
