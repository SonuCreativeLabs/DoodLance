-- Fix videoUrl column type mismatch
-- The column is currently TEXT (string) but needs to be TEXT[] (array of strings)

-- 1. Drop the default value first
ALTER TABLE "services" ALTER COLUMN "videoUrl" DROP DEFAULT;

-- 2. Convert the column type to TEXT[]
-- This handles existing data:
-- If it's a JSON string like '["url1"]', it attempts to cast (might fail if not valid json, so we use a simpler approach for safety)
-- We will just convert the existing text content into a single-element array if it exists
-- Or better, if you don't care about preserving the broken data, we can just reset it.

-- Let's try to be smart: if it starts with '[', treat as JSON-ish string we want to parse, otherwise wrap in array.
-- Actually, since we are in dev, let's just FORCE it to be an array.
ALTER TABLE "services" 
ALTER COLUMN "videoUrl" TYPE TEXT[] 
USING (
  CASE 
    WHEN "videoUrl" IS NULL OR "videoUrl" = '' THEN '{}'::text[]
    ELSE ARRAY["videoUrl"]::text[] 
  END
);

-- 3. Set the correct default value
ALTER TABLE "services" ALTER COLUMN "videoUrl" SET DEFAULT '{}';

-- 4. Update comment
COMMENT ON COLUMN "services"."videoUrl" IS 'Array of video URLs (YouTube, Instagram, Facebook, Twitter, TikTok, Google Drive)';
