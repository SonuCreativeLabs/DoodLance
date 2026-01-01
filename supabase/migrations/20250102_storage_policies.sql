-- Enable RLS on storage.objects (if not enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Give users access to their own folders in 'images' bucket
-- OR more simply for this app: Allow any authenticated user to upload to 'images' bucket

-- 1. Allow Public Read (SELECT) for 'images' bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- 2. Allow Authenticated Users to Upload (INSERT)
CREATE POLICY "Authenticated Users Insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'images' );

-- 3. Allow Users to Update their own files (UPDATE)
CREATE POLICY "Users Update Own Files"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'images' AND auth.uid() = owner );

-- 4. Allow Users to Delete their own files (DELETE)
CREATE POLICY "Users Delete Own Files"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'images' AND auth.uid() = owner );
